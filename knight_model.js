function getKnightModel(width, height, depth, rgbaArray) {
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
    const baseColor = [180, 140, 100, 255]; // Brown
    const bodyColor = [220, 180, 140, 255]; // Light brown
    const maneColor = [160, 100, 60, 255]; // Dark brown
    const eyeColor = [0, 0, 255, 255]; // Blue
    const noseColor = [200, 160, 120, 255]; // Light brown for nose
    const saddleColor = [120, 60, 20, 255]; // Dark brown for saddle
    const hoofColor = [80, 40, 20, 255]; // Dark brown for hooves
    const nostrilColor = [160, 100, 80, 255]; // Darker nose color for nostrils

    // Base
    for (let y = 0; y < 4; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                const shadeFactor = 0.8 + (y / 4) * 0.4;
                setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
            }
        }
    }

    // Body
    for (let y = 4; y < 20; y++) {
        const radius = 4 + Math.sin((y - 4) / 16 * Math.PI) * 1.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                if ((x - 8) * (x - 8) + (z - 8) * (z - 8) <= radius * radius) {
                    const dx = x - 8, dz = z - 8;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
                }
            }
        }
    }

    // Legs
    const legPositions = [[5, 5], [5, 11], [11, 5], [11, 11]];
    for (let [legX, legZ] of legPositions) {
        for (let y = 4; y < 12; y++) {
            for (let x = legX - 1; x <= legX + 1; x++) {
                for (let z = legZ - 1; z <= legZ + 1; z++) {
                    const shadeFactor = 0.8 + (y - 4) / 8 * 0.4;
                    setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
                }
            }
        }
        // Hooves
        for (let y = 0; y < 4; y++) {
            for (let x = legX - 1; x <= legX + 1; x++) {
                for (let z = legZ - 1; z <= legZ + 1; z++) {
                    const shadeFactor = 0.8 + y / 4 * 0.4;
                    setVoxel(x, y, z, ...shadeColor(hoofColor, shadeFactor));
                }
            }
        }
    }

    // Neck (corrected to avoid gaps)
    for (let y = 20; y < 28; y++) {
        const offsetX = Math.sin((y - 20) / 8 * Math.PI) * 2;
        for (let x = 4 + Math.floor(offsetX); x < 12 + Math.floor(offsetX); x++) {
            for (let z = 5; z < 11; z++) {
                const shadeFactor = 0.8 + (x - 4 - Math.floor(offsetX)) / 8 * 0.4;
                setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
            }
        }
    }

    // Head (corrected horse-like shape with no empty layers)
    for (let y = 24; y < 32; y++) {
        const offsetX = Math.sin((y - 24) / 8 * Math.PI) * 2;
        const headWidth = 6;
        const headDepth = 6;
        for (let x = 2 + Math.floor(offsetX); x < 2 + Math.floor(offsetX) + headWidth; x++) {
            for (let z = 8 - headDepth / 2; z < 8 + headDepth / 2; z++) {
                const dx = x - (2 + Math.floor(offsetX) + headWidth / 2);
                const dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                const shadeFactor = 0.8 + (1 - distance / (headWidth / 2)) * 0.4;
                setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
            }
        }
    }

    // Snout (moved below the head)
    for (let y = 24; y < 28; y++) {
        for (let x = 0; x < 4; x++) {
            for (let z = 6; z < 10; z++) {
                const shadeFactor = 0.8 + x / 4 * 0.4;
                setVoxel(x, y, z, ...shadeColor(noseColor, shadeFactor));
            }
        }
    }

    // Nostrils (adjusted position)
    setVoxel(0, 25, 7, ...nostrilColor);
    setVoxel(0, 25, 8, ...nostrilColor);

    // Eyes (adjusted position)
    setVoxel(3, 29, 6, ...eyeColor);
    setVoxel(3, 29, 9, ...eyeColor);

    // Mane (more detailed)
    for (let y = 20; y < 30; y++) {
        const offsetX = Math.sin((y - 20) / 10 * Math.PI) * 2;
        for (let x = 8 + Math.floor(offsetX); x < 14 + Math.floor(offsetX); x++) {
            for (let z = 5; z < 11; z++) {
                if (Math.random() > 0.3) { // Add some randomness to the mane
                    const shadeFactor = 0.8 + (x - 8 - Math.floor(offsetX)) / 6 * 0.4;
                    setVoxel(x, y, z, ...shadeColor(maneColor, shadeFactor));
                }
            }
        }
    }

    // Saddle (more detailed)
    for (let y = 16; y < 20; y++) {
        for (let x = 5; x < 11; x++) {
            for (let z = 5; z < 11; z++) {
                if (x === 5 || x === 10 || z === 5 || z === 10 || y === 16 || y === 19) {
                    const shadeFactor = 0.8 + (y - 16) / 4 * 0.4;
                    setVoxel(x, y, z, ...shadeColor(saddleColor, shadeFactor));
                }
            }
        }
    }
    // Saddle horn
    for (let y = 20; y < 22; y++) {
        for (let x = 5; x < 7; x++) {
            for (let z = 7; z < 9; z++) {
                const shadeFactor = 0.8 + (y - 20) / 2 * 0.4;
                setVoxel(x, y, z, ...shadeColor(saddleColor, shadeFactor));
            }
        }
    }

    // Ears
    for (let y = 30; y < 32; y++) {
        const shadeFactor = 0.8 + (y - 30) / 2 * 0.4;
        setVoxel(7, y, 5, ...shadeColor(bodyColor, shadeFactor));
        setVoxel(7, y, 10, ...shadeColor(bodyColor, shadeFactor));
        setVoxel(8, y, 5, ...shadeColor(bodyColor, shadeFactor));
        setVoxel(8, y, 10, ...shadeColor(bodyColor, shadeFactor));
    }

    // Tail
    for (let y = 12; y < 20; y++) {
        const tailX = 14;
        const tailZ = 8 + Math.sin((y - 12) / 8 * Math.PI) * 2;
        const shadeFactor = 0.8 + (y - 12) / 8 * 0.4;
        setVoxel(tailX, y, Math.floor(tailZ), ...shadeColor(maneColor, shadeFactor));
        setVoxel(tailX, y, Math.ceil(tailZ), ...shadeColor(maneColor, shadeFactor));
    }
}
