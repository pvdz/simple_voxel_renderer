function getQueenModel(width, height, depth, rgbaArray) {
    function setVoxel(x, y, z, r, g, b, a) {
        const index = (z * width * height + y * width + x) * 4;
        rgbaArray[index] = r;
        rgbaArray[index + 1] = g;
        rgbaArray[index + 2] = b;
        rgbaArray[index + 3] = a;
    }

    // Colors
    const baseColor = [180, 140, 100, 255]; // Brown
    const bodyColor = [240, 220, 180, 255]; // Light beige
    const crownColor = [255, 215, 0, 255]; // Gold
    const gemColor = [255, 0, 0, 255]; // Red
    const detailColor = [200, 160, 120, 255]; // Light brown for details

    // Base
    for (let y = 0; y < 4; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                setVoxel(x, y, z, ...baseColor);
            }
        }
    }

    // Body (more curved and detailed)
    for (let y = 4; y < 24; y++) {
        const radius = 3 + Math.sin((y - 4) / 20 * Math.PI) * 2.5;
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
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                if (x === 4 || x === 11 || z === 4 || z === 11) {
                    setVoxel(x, y, z, ...detailColor);
                }
            }
        }
    }

    // Crown base with slight color variation
    for (let y = 24; y < 28; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
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

    // Crown points (taller and more elaborate)
    const crownPoints = [[4,4], [8,4], [12,4], [4,8], [12,8], [4,12], [8,12], [12,12]];
    for (let point of crownPoints) {
        for (let y = 28; y < 32; y++) {
            setVoxel(point[0], y, point[1], ...crownColor);
        }
    }

    // Additional smaller points
    const smallerPoints = [[6,4], [10,4], [4,6], [12,6], [4,10], [12,10], [6,12], [10,12]];
    for (let point of smallerPoints) {
        for (let y = 28; y < 30; y++) {
            setVoxel(point[0], y, point[1], ...crownColor);
        }
    }

    // Gems on crown
    const gemPositions = [[6,4], [10,4], [4,6], [12,6], [4,10], [12,10], [6,12], [10,12]];
    for (let pos of gemPositions) {
        setVoxel(pos[0], 29, pos[1], ...gemColor);
    }

    // Central gem (larger)
    setVoxel(8, 30, 8, ...gemColor);
    setVoxel(7, 30, 8, ...gemColor);
    setVoxel(9, 30, 8, ...gemColor);
    setVoxel(8, 30, 7, ...gemColor);
    setVoxel(8, 30, 9, ...gemColor);

    // Eyes (blue, both moved further out)
    const eyeColor = [0, 0, 255, 255]; // Blue
    setVoxel(4, 21, 5, ...eyeColor);
    setVoxel(4, 21, 10, ...eyeColor);
}
