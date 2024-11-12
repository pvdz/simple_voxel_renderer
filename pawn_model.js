function getPawnModel(width, height, depth, rgbaArray) {
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
    const stemColor = [220, 180, 140, 255]; // Light brown
    const headColor = [240, 220, 180, 255]; // Beige
    const topColor = [200, 160, 120, 255]; // Light brown for top
    const eyeColor = [0, 0, 255, 255]; // Blue

    // Base (slightly smaller)
    for (let y = 0; y < 3; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + (y / 3) * 0.4;
                setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
            }
        }
    }

    // Stem (slightly curved and smaller)
    for (let y = 3; y < 16; y++) {
        const radius = 2 + Math.sin((y - 3) / 13 * Math.PI) * 0.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(stemColor, shadeFactor));
                }
            }
        }
    }

    // Head (more rounded and slightly smaller)
    for (let y = 16; y < 25; y++) {
        const radius = 3 + Math.sin((y - 16) / 9 * Math.PI) * 1.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(headColor, shadeFactor));
                }
            }
        }
    }

    // Top (slightly rounded and smaller)
    for (let y = 25; y < 28; y++) {
        const radius = 2.5 - (y - 25) * 0.3;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4 + (y - 25) / 3 * 0.2;
                    setVoxel(x, y, z, ...shadeColor(topColor, shadeFactor));
                }
            }
        }
    }

    // Eyes (blue, positioned further to the outside on the surface of the head)
    setVoxel(4, 21, 5, ...eyeColor);
    setVoxel(4, 21, 10, ...eyeColor);
}
