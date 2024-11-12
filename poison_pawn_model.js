function getPoisonPawnModel(width, height, depth, rgbaArray) {
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
    const baseColor = [20, 60, 20, 255]; // Dark green
    const bodyColor = [40, 140, 40, 255]; // Vibrant green
    const poisonColor = [150, 255, 0, 200]; // Bright lime green, slightly transparent
    const skullColor = [220, 220, 200, 255]; // Off-white for skull
    const eyeColor = [0, 0, 0, 255]; // Black for eye sockets

    // Base
    for (let y = 0; y < 3; y++) {
        for (let x = 4; x < 12; x++) {
            for (let z = 4; z < 12; z++) {
                const shadeFactor = 0.8 + (y / 3) * 0.4;
                setVoxel(x, y, z, ...shadeColor(baseColor, shadeFactor));
            }
        }
    }

    // Stem (slightly curved)
    for (let y = 3; y < 16; y++) {
        const radius = 2 + Math.sin((y - 3) / 13 * Math.PI) * 0.5;
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

    // Skull
    for (let y = 16; y < 28; y++) {
        const radius = 3 + Math.sin((y - 16) / 12 * Math.PI) * 1.5;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4;
                    setVoxel(x, y, z, ...shadeColor(skullColor, shadeFactor));
                }
            }
        }
    }

    // Eye sockets (2x2 voxels, deeper with shading)
    const eyePositions = [[6, 22], [9, 22]];
    for (let [eyeX, eyeY] of eyePositions) {
        for (let x = eyeX; x < eyeX + 2; x++) {
            for (let y = eyeY; y < eyeY + 2; y++) {
                for (let z = 4; z <= 6; z++) {
                    const depth = 6 - z;
                    const shadeFactor = 0.5 + (depth / 2) * 0.5;
                    setVoxel(x, y, z, ...shadeColor(eyeColor, shadeFactor));
                }
            }
        }
    }

    // Nasal cavity (1x1 voxel, deeper with shading, 4 voxels lower)
    for (let z = 4; z <= 6; z++) {
        const depth = 6 - z;
        const shadeFactor = 0.5 + (depth / 2) * 0.5;
        setVoxel(8, 19, z, ...shadeColor(eyeColor, shadeFactor));
    }

    // Cheekbones (with subtle shading)
    for (let x of [5, 11]) {
        for (let y = 22; y < 24; y++) {
            for (let z = 5; z < 8; z++) {
                const shadeFactor = 1.1 - (z - 5) * 0.05;
                setVoxel(x, y, z, ...shadeColor(skullColor, shadeFactor));
            }
        }
    }

    // Jaw (with subtle shading)
    for (let x = 5; x <= 11; x++) {
        for (let z = 4; z < 8; z++) {
            const shadeFactor = 0.9 - (z - 4) * 0.05;
            setVoxel(x, 21, z, ...shadeColor(skullColor, shadeFactor));
        }
    }

    // Teeth (with subtle shading)
    for (let x = 6; x <= 10; x++) {
        if (x % 2 === 0) {
            for (let z = 4; z <= 5; z++) {
                const shadeFactor = 1 - (z - 4) * 0.1;
                setVoxel(x, 20, z, ...shadeColor(skullColor, shadeFactor));
            }
        }
    }

    // Poison effect on skull (slightly reduced for better visibility of skull features)
    for (let y = 16; y < 28; y++) {
        for (let x = 5; x <= 11; x++) {
            for (let z = 4; z <= 11; z++) {
                if (Math.random() < 0.12) {
                    setVoxel(x, y, z, ...shadeColor(poisonColor, 0.6 + Math.random() * 0.4));
                }
            }
        }
    }

    // Top (with poison effect)
    for (let y = 25; y < 28; y++) {
        const radius = 2.5 - (y - 25) * 0.3;
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const dx = x - 8, dz = z - 8;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance <= radius) {
                    const shadeFactor = 0.8 + (1 - distance / radius) * 0.4 + (y - 25) / 3 * 0.2;
                    setVoxel(x, y, z, ...shadeColor(bodyColor, shadeFactor));
                }
            }
        }
    }

    // Poison drips
    for (let x = 5; x <= 11; x += 6) {
        for (let z = 5; z <= 11; z += 6) {
            const dripLength = Math.floor(Math.random() * 3) + 2;
            for (let y = 15; y > 15 - dripLength; y--) {
                setVoxel(x, y, z, ...shadeColor(poisonColor, 1 - (15 - y) * 0.2));
            }
        }
    }

    // Poison cloud around the head
    for (let y = 23; y < 26; y++) {
        for (let x = 5; x < 11; x++) {
            for (let z = 4; z < 7; z++) {
                if (Math.random() < 0.5) {
                    setVoxel(x, y, z, ...shadeColor(poisonColor, 0.6 + Math.random() * 0.4));
                }
            }
        }
    }
}
