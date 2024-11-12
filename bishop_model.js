function getBishopModel(width, height, depth, rgbaArray) {
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
    const mitreColor = [240, 220, 180, 255]; // Beige
    const detailColor = [160, 100, 60, 255]; // Dark brown

    // Base
    for (let y = 0; y < 4; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + (y / 4) * 0.4;
                setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
            }
        }
    }

    // Body (more curved)
    for (let y = 4; y < 22; y++) {
        const radius = 3 + Math.sin((y - 4) / 18 * Math.PI) * 1.5;
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

    // Mitre (bishop's hat)
    for (let y = 22; y < 32; y++) {
        const radius = 4 - (y - 22) * 0.3;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const heightFactor = (y - 22) / 10;
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.3 + heightFactor * 0.2;
                    setVoxel(x, y, z, ...shadeColor(mitreColor, shadeFactor));
                }
            }
        }
    }

    // Detail on mitre
    for (let y = 24; y < 30; y += 2) {
        for (let x = 7; x < 9; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + ((y - 24) / 6) * 0.4;
                setVoxel(x, y, z, ...shadeColor(detailColor, shadeFactor));
            }
        }
    }

    // Top cross
    for (let y = 30; y < 32; y++) {
        setVoxel(7, y, 8, ...shadeColor(detailColor, 1));
        setVoxel(8, y, 8, ...shadeColor(detailColor, 1));
    }
    setVoxel(7, 31, 7, ...shadeColor(detailColor, 0.9));
    setVoxel(8, 31, 7, ...shadeColor(detailColor, 0.9));
    setVoxel(7, 31, 9, ...shadeColor(detailColor, 0.9));
    setVoxel(8, 31, 9, ...shadeColor(detailColor, 0.9));

    // Eyes (blue, moved two voxels lower)
    const eyeColor = [0, 0, 255, 255]; // Blue
    setVoxel(5, 19, 5, ...eyeColor);
    setVoxel(5, 19, 10, ...eyeColor);
}
