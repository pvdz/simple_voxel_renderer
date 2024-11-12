function getZombiePawnModel(width, height, depth, rgbaArray) {
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
    const skinColor = [50, 100, 50, 255]; // Dark green skin
    const eyeColor = [255, 0, 0, 255]; // Red eyes
    const clothColor = [100, 100, 100, 255]; // Tattered grey clothes

    // Base
    for (let y = 0; y < 3; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + (y / 3) * 0.4;
                setVoxel(x, y, z, ...shadeColor(skinColor, shadeFactor));
            }
        }
    }

    // Body
    for (let y = 3; y < 18; y++) {
        const radius = 2.5 + Math.sin((y - 3) / 15 * Math.PI) * 0.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    const color = y % 4 === 0 ? clothColor : skinColor; // Tattered clothes effect
                    setVoxel(x, y, z, ...shadeColor(color, shadeFactor));
                }
            }
        }
    }

    // Head
    for (let y = 18; y < 26; y++) {
        const radius = 3 + Math.sin((y - 18) / 8 * Math.PI) * 0.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(skinColor, shadeFactor));
                }
            }
        }
    }

    // Exposed brain
    for (let y = 26; y < 28; y++) {
        for (let x = 6; x < 10; x++) {
            for (let z = 6; z < 10; z++) {
                const brainColor = [200, 100, 100, 255];
                setVoxel(x, y, z, ...shadeColor(brainColor, 0.8 + (y - 26) * 0.2));
            }
        }
    }

    // Eyes (glowing red)
    setVoxel(6, 22, 4, ...eyeColor);
    setVoxel(10, 22, 4, ...eyeColor);
    // Glow effect
    setVoxel(6, 23, 4, ...shadeColor(eyeColor, 0.5));
    setVoxel(10, 23, 4, ...shadeColor(eyeColor, 0.5));

    // Mouth (jagged)
    for (let x = 6; x < 11; x += 2) {
        setVoxel(x, 20, 4, ...shadeColor(skinColor, 0.6));
    }

    // Arms (closer to body and stretched forward)
    for (let y = 12; y < 18; y++) {
        // Left arm
        setVoxel(6, y, 5, ...shadeColor(skinColor, 0.9));
        setVoxel(6, y, 4, ...shadeColor(skinColor, 0.9));
        // Right arm
        setVoxel(10, y, 5, ...shadeColor(skinColor, 0.9));
        setVoxel(10, y, 4, ...shadeColor(skinColor, 0.9));
    }
    // Hands
    for (let x of [5, 6, 10, 11]) {
        for (let z = 0; z <= 4; z++) {
            setVoxel(x, 17, z, ...shadeColor(skinColor, 0.9));
        }
    }
}
