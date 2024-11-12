function getRainbowModel(width, height, depth, rgbaArray) {
    function setVoxel(x, y, z, r, g, b, a) {
        const index = (z * width * height + y * width + x) * 4;
        rgbaArray[index] = r;
        rgbaArray[index + 1] = g;
        rgbaArray[index + 2] = b;
        rgbaArray[index + 3] = a;
    }

    for (let z = 0; z < depth; z++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate hue based on position
                const hue = ((x + y + z) / (width + height + depth)) * 360;

                // Convert HSV to RGB
                const s = 1; // Saturation
                const v = 1; // Value
                const c = v * s;
                const x1 = c * (1 - Math.abs(((hue / 60) % 2) - 1));
                const m = v - c;

                let r, g, b;
                if (hue < 60) { [r, g, b] = [c, x1, 0]; }
                else if (hue < 120) { [r, g, b] = [x1, c, 0]; }
                else if (hue < 180) { [r, g, b] = [0, c, x1]; }
                else if (hue < 240) { [r, g, b] = [0, x1, c]; }
                else if (hue < 300) { [r, g, b] = [x1, 0, c]; }
                else { [r, g, b] = [c, 0, x1]; }

                setVoxel(x, y, z,
                    Math.round((r + m) * 255),
                    Math.round((g + m) * 255),
                    Math.round((b + m) * 255),
                    255
                );
            }
        }
    }
}
