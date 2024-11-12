function getRookModel(width, height, depth, rgbaArray) {
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
    const topColor = [240, 220, 180, 255]; // Beige
    const battlementColor = [200, 160, 120, 255]; // Light brown for battlements

    // Base
    for (let y = 0; y < 4; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                const shadeFactor = 0.8 + (y / 4) * 0.4;
                setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
            }
        }
    }

    // Body (slightly tapered)
    for (let y = 4; y < 24; y++) {
        const radius = 4.5 - (y - 4) * 0.05;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
                }
            }
        }
    }

    // Top base
    for (let y = 24; y < 26; y++) {
        for (let x = 3; x < 13; x++) {
            for (let z = 3; z < 13; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                const shadeFactor = 0.8 + (1 - distance / 5) * 0.4;
                setVoxel(x, y, z, ...shadeColor(topColor, shadeFactor));
            }
        }
    }

    // Battlements with more natural shading
    const battlements = [
        [3,3], [3,7], [3,11],
        [7,3], [7,11],
        [11,3], [11,7], [11,11]
    ];
    for (let [bx, bz] of battlements) {
        for (let y = 26; y < 32; y++) {
            for (let x = bx; x < bx + 2; x++) {
                for (let z = bz; z < bz + 2; z++) {
                    const dx = x - 8, dz = z - 8;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    const heightFactor = (y - 26) / 6;
                    const shadeFactor = 0.8 + (1 - distance / 7) * 0.3 + heightFactor * 0.2;
                    setVoxel(x, y, z, ...shadeColor(battlementColor, shadeFactor));
                }
            }
        }
    }

    // Inner top (to create the characteristic rook shape)
    for (let y = 26; y < 28; y++) {
        for (let x = 5; x < 11; x++) {
            for (let z = 5; z < 11; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                const shadeFactor = 0.8 + (1 - distance / 3) * 0.4;
                setVoxel(x, y, z, ...shadeColor(topColor, shadeFactor));
            }
        }
    }

    // Decorative band
    for (let y = 14; y < 16; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                if (x === 4 || x === 11 || z === 4 || z === 11) {
                    const shadeFactor = 0.8 + ((y - 14) / 2) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
                }
            }
        }
    }

    // Eyes (blue, moved two voxels lower)
    const eyeColor = [0, 0, 255, 255]; // Blue
    setVoxel(5, 21, 5, ...eyeColor);
    setVoxel(5, 21, 10, ...eyeColor);
}
