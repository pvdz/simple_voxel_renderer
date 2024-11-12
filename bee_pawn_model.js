function getBeePawnModel(width, height, depth, rgbaArray) {
    function setVoxel(x, y, z, r, g, b, a) {
        const index = (z * width * height + y * width + x) * 4;
        rgbaArray[index] = r;
        rgbaArray[index + 1] = g;
        rgbaArray[index + 2] = b;
        rgbaArray[index + 3] = a;
    }

    function shadeColor(color, factor) {
        return color.map(c => Math.min(255, Math.max(0, Math.round(c * factor))));
    }

    // Colors
    const blackColor = [30, 30, 30, 255]; // Black
    const yellowColor = [255, 220, 0, 255]; // Yellow
    const whiteColor = [255, 255, 255, 200]; // White for wings (slightly transparent)
    const eyeColor = [0, 0, 0, 255]; // Black for eyes

    // Base (black)
    for (let y = 0; y < 3; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + (y / 3) * 0.4;
                setVoxel(x, y, z, ...shadeColor(blackColor, shadeFactor));
            }
        }
    }

    // Body (alternating black and yellow stripes with curved shape)
    for (let y = 3; y < 22; y++) {
        const radius = 3 + Math.sin((y - 3) / 19 * Math.PI) * 1.5;
        const color = y % 4 < 2 ? blackColor : yellowColor;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(color, shadeFactor));
                }
            }
        }
    }

    // Head (yellow)
    for (let y = 22; y < 28; y++) {
        const radius = 3.5 - (y - 22) * 0.2;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(yellowColor, shadeFactor));
                }
            }
        }
    }

    // Eyes (black, now facing forward)
    setVoxel(6, 24, 4, ...eyeColor);
    setVoxel(10, 24, 4, ...eyeColor);

    // Wings (white, slightly transparent, now on the sides)
    for (let y = 14; y < 22; y++) {
        const wingWidth = Math.sin((y - 14) / 8 * Math.PI) * 2 + 1;
        for (let z = 6; z < 10; z++) {
            for (let x = 3; x < 3 + wingWidth; x++) {
                const shadeFactor = 0.8 + (x - 3) / wingWidth * 0.4;
                setVoxel(x, y, z, ...shadeColor(whiteColor, shadeFactor));
            }
            for (let x = 13; x > 13 - wingWidth; x--) {
                const shadeFactor = 0.8 + (13 - x) / wingWidth * 0.4;
                setVoxel(x, y, z, ...shadeColor(whiteColor, shadeFactor));
            }
        }
    }

    // Stinger (black, now at the back)
    for (let y = 12; y < 16; y++) {
        setVoxel(8, y, 13, ...shadeColor(blackColor, 1 - (y - 12) / 4 * 0.2));
    }

    // Antennae (black, now at the front)
    for (let y = 28; y < 30; y++) {
        setVoxel(6, y, 5, ...blackColor);
        setVoxel(10, y, 5, ...blackColor);
    }
    setVoxel(5, 29, 4, ...blackColor);
    setVoxel(11, 29, 4, ...blackColor);
}
