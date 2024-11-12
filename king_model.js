function getKingModel(width, height, depth, rgbaArray) {
    function setVoxel(x, y, z, r, g, b, a) {
        const index = (z * width * height + y * width + x) * 4;
        rgbaArray[index] = r;
        rgbaArray[index + 1] = g;
        rgbaArray[index + 2] = b;
        rgbaArray[index + 3] = a;
    }

    // Colors
    const baseColor = [180, 140, 100, 255]; // Brown
    const bodyColor = [220, 180, 140, 255]; // Light brown
    const crownColor = [255, 215, 0, 255]; // Gold
    const crossColor = [255, 255, 255, 255]; // White
    const detailColor = [160, 100, 60, 255]; // Dark brown for details

    // Base
    for (let y = 0; y < 4; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                setVoxel(x, y, z, ...baseColor);
            }
        }
    }

    // Body (more robust)
    for (let y = 4; y < 22; y++) {
        const radius = 4.5 + Math.sin((y - 4) / 18 * Math.PI) * 1.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                if ((x - 8) * (x - 8) + (z - 8) * (z - 8) <= radius * radius) {
                    setVoxel(x, y, z, ...bodyColor);
                }
            }
        }
    }

    // Decorative bands
    for (let y of [8, 16]) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                if (x === 3 || x === 12 || z === 3 || z === 12) {
                    setVoxel(x, y, z, ...detailColor);
                }
            }
        }
    }

    // Crown base with slight color variation
    for (let y = 22; y < 26; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                const variation = Math.random() * 20 - 10;
                const color = [
                    Math.min(255, Math.max(0, crownColor[0] + variation)),
                    Math.min(255, Math.max(0, crownColor[1] + variation)),
                    Math.min(255, Math.max(0, crownColor[2] + variation)),
                    255
                ];
                setVoxel(x, y, z, ...color);
            }
        }
    }

    // Crown points (shorter than queen's)
    const crownPoints = [[3,3], [8,3], [13,3], [3,8], [13,8], [3,13], [8,13], [13,13]];
    for (let point of crownPoints) {
        for (let y = 26; y < 29; y++) {
            setVoxel(point[0], y, point[1], ...crownColor);
        }
    }

    // 3D Cross with more shading and extended arms, moved down one voxel
    function setCrossVoxel(x, y, z) {
        const variation = Math.random() * 50 - 25; // Increased variation range
        const shadedCrossColor = [
            Math.min(255, Math.max(0, crossColor[0] + variation)),
            Math.min(255, Math.max(0, crossColor[1] + variation)),
            Math.min(255, Math.max(0, crossColor[2] + variation)),
            255
        ];
        setVoxel(x, y, z, ...shadedCrossColor);
    }

    // Center of the cross (moved down one voxel)
    for (let y = 28; y < 30; y++) {
        for (let x = 7; x < 9; x++) {
            for (let z = 7; z < 9; z++) {
                setCrossVoxel(x, y, z);
            }
        }
    }

    // Up direction (now includes the top layer)
    for (let y = 30; y < 33; y++) {
        setCrossVoxel(7, y, 7);
        setCrossVoxel(8, y, 7);
        setCrossVoxel(7, y, 8);
        setCrossVoxel(8, y, 8);
    }

    // Down direction (moved down one voxel)
    for (let y = 26; y < 28; y++) {
        setCrossVoxel(7, y, 7);
        setCrossVoxel(8, y, 7);
        setCrossVoxel(7, y, 8);
        setCrossVoxel(8, y, 8);
    }

    // Left direction (moved down one voxel)
    for (let x = 5; x < 7; x++) {
        setCrossVoxel(x, 28, 7);
        setCrossVoxel(x, 29, 7);
        setCrossVoxel(x, 28, 8);
        setCrossVoxel(x, 29, 8);
    }

    // Right direction (moved down one voxel)
    for (let x = 9; x < 11; x++) {
        setCrossVoxel(x, 28, 7);
        setCrossVoxel(x, 29, 7);
        setCrossVoxel(x, 28, 8);
        setCrossVoxel(x, 29, 8);
    }

    // Front direction (moved down one voxel)
    for (let z = 5; z < 7; z++) {
        setCrossVoxel(7, 28, z);
        setCrossVoxel(8, 28, z);
        setCrossVoxel(7, 29, z);
        setCrossVoxel(8, 29, z);
    }

    // Back direction (moved down one voxel)
    for (let z = 9; z < 11; z++) {
        setCrossVoxel(7, 28, z);
        setCrossVoxel(8, 28, z);
        setCrossVoxel(7, 29, z);
        setCrossVoxel(8, 29, z);
    }

    // Eyes (blue, moved further out)
    const eyeColor = [0, 0, 255, 255]; // Blue
    setVoxel(4, 19, 5, ...eyeColor);
    setVoxel(4, 19, 10, ...eyeColor);
}
