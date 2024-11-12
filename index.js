// A 16x16x32x4 (wxhxdxc with c being rgba) model would be 32k
// It would generate 8k particles worst case. Big deal? When prerendered it's just an animation so, no.




function paintModel(canvas, w, h, d, arr, angleY, angleX, zoom) {
    const gl = canvas.getContext('webgl', { antialias: false });

    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Adjust canvas size and viewport
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader
    const vsSource = `
        attribute vec3 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying lowp vec4 vColor;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            vColor = aVertexColor;
        }
    `;

    // Fragment shader
    const fsSource = `
        varying lowp vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }
    `;

    // Create shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    // Collect all the info needed to use the shader program
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // Create buffers
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    // Prepare position, color, and index data
    const positions = [];
    const colors = [];
    const indices = [];
    let vertexCount = 0;

    // Calculate the scale factor to make voxels cubic
    const maxDim = Math.max(w, h, d);
    const scaleX = w / maxDim;
    const scaleY = h / maxDim;
    const scaleZ = d / maxDim;

    // Helper function to check if a voxel exists at given coordinates
    function voxelExists(x, y, z) {
        if (x < 0 || x >= w || y < 0 || y >= h || z < 0 || z >= d) return false;
        const index = (z * w * h + y * w + x) * 4;
        return arr[index + 3] > 0;
    }

    for (let z = 0; z < d; z++) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const index = (z * w * h + y * w + x) * 4;
                if (arr[index + 3] > 0) { // Only add non-transparent voxels
                    const r = arr[index] / 255;
                    const g = arr[index + 1] / 255;
                    const b = arr[index + 2] / 255;
                    const a = arr[index + 3] / 255;

                    const x0 = (x / w - 0.5) * scaleX;
                    const x1 = ((x + 1) / w - 0.5) * scaleX;
                    const y0 = (y / h - 0.5) * scaleY;
                    const y1 = ((y + 1) / h - 0.5) * scaleY;
                    const z0 = (z / d - 0.5) * scaleZ;
                    const z1 = ((z + 1) / d - 0.5) * scaleZ;

                    // Only add faces that are exposed
                    if (!voxelExists(x, y, z + 1)) { // Front face
                        positions.push(x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                    if (!voxelExists(x, y, z - 1)) { // Back face
                        positions.push(x0, y0, z0, x0, y1, z0, x1, y1, z0, x1, y0, z0);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                    if (!voxelExists(x, y + 1, z)) { // Top face
                        positions.push(x0, y1, z0, x0, y1, z1, x1, y1, z1, x1, y1, z0);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                    if (!voxelExists(x, y - 1, z)) { // Bottom face
                        positions.push(x0, y0, z0, x1, y0, z0, x1, y0, z1, x0, y0, z1);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                    if (!voxelExists(x + 1, y, z)) { // Right face
                        positions.push(x1, y0, z0, x1, y1, z0, x1, y1, z1, x1, y0, z1);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                    if (!voxelExists(x - 1, y, z)) { // Left face
                        positions.push(x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0);
                        for (let i = 0; i < 4; i++) colors.push(r, g, b, a);
                        indices.push(vertexCount, vertexCount + 1, vertexCount + 2, vertexCount, vertexCount + 2, vertexCount + 3);
                        vertexCount += 4;
                    }
                }
            }
        }
    }

    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Bind index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Render
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = gl.canvas.width / gl.canvas.height;
    const projectionMatrix = mat4.create();

    // Adjust the orthographic projection
    const orthoSize = 0.8 / zoom; // Reduced from 1 to 0.8 to bring the model closer
    mat4.ortho(projectionMatrix, -orthoSize * aspect, orthoSize * aspect, -orthoSize, orthoSize, -100, 100);

    const modelViewMatrix = mat4.create();

    // Adjust the model's position
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -0.1, 0]); // Move slightly down
    mat4.rotate(modelViewMatrix, modelViewMatrix, angleX, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, angleY, [0, 1, 0]);

    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Bind color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    // Bind index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Use shader program
    gl.useProgram(programInfo.program);

    // Set uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    // Draw
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// WebGL utility functions
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}









