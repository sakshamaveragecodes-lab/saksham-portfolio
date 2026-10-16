import type {MeshData} from './geometry';
export type Program = {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null>;
};
export type Mesh = {
    vao: WebGLVertexArrayObject;
    buffers: WebGLBuffer[];
    matrices: WebGLBuffer;
    count: number;
};
export function program(gl: WebGL2RenderingContext, vertex: string, fragment: string): Program {
    const prefix = '#version 300 es\nprecision highp float;\n';
    const headers = 'in vec3 position;in vec3 normal;in vec2 uv;in mat4 instanceMatrix;uniform mat4 modelMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat4 viewMatrix;uniform mat3 normalMatrix;\n';
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || 'Spatial shader compilation failed';
        gl.deleteShader(shader);
        throw Error(message);
    } return shader; };
    const vs = compile(gl.VERTEX_SHADER, prefix + headers + vertex.replaceAll('varying', 'out'));
    const fs = compile(gl.FRAGMENT_SHADER, prefix + 'out vec4 outColor;uniform vec3 uTint;uniform float uOpacity;\n' + fragment.replaceAll('varying', 'in').replaceAll('gl_FragColor', 'outColor').replace('vec4(c,1.)', 'vec4(c*uTint,uOpacity)'));
    const linked = gl.createProgram()!;
    gl.attachShader(linked, vs);
    gl.attachShader(linked, fs);
    for (const [name, index] of Object.entries({ position: 0, normal: 1, instanceMatrix: 2, uv: 6 }))
        gl.bindAttribLocation(linked, index, name);
    gl.linkProgram(linked);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(linked, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(linked) || 'Spatial program linking failed';
        gl.deleteProgram(linked);
        throw Error(message);
    }
    return { program: linked, uniforms: Object.fromEntries(['modelMatrix', 'modelViewMatrix', 'projectionMatrix', 'viewMatrix', 'normalMatrix', 'uTime', 'uProgress', 'uPointer', 'uTint', 'uOpacity', 'uFinish', 'uSurface'].map(name => [name, gl.getUniformLocation(linked, name)])) };
}
export function mesh(gl: WebGL2RenderingContext, data: MeshData): Mesh {
    const vao = gl.createVertexArray()!, vertex = gl.createBuffer()!, index = gl.createBuffer()!, matrices = gl.createBuffer()!;
    gl.bindVertexArray(vao);
    const packed = new Float32Array(data.positions.length / 3 * 8);
    for (let i = 0; i < data.positions.length / 3; i++) {
        packed.set(data.positions.subarray(i * 3, i * 3 + 3), i * 8);
        packed.set(data.normals.subarray(i * 3, i * 3 + 3), i * 8 + 3);
        packed.set(data.uvs.subarray(i * 2, i * 2 + 2), i * 8 + 6);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
    gl.bufferData(gl.ARRAY_BUFFER, packed, gl.STATIC_DRAW);
    for (const [location, size, offset] of [[0, 3, 0], [1, 3, 12], [6, 2, 24]]) {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, matrices);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * 4 * 64, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 4; i++) {
        gl.enableVertexAttribArray(2 + i);
        gl.vertexAttribPointer(2 + i, 4, gl.FLOAT, false, 64, i * 16);
        gl.vertexAttribDivisor(2 + i, 1);
    }
    gl.bindVertexArray(null);
    return { vao, buffers: [vertex, index, matrices], matrices, count: data.indices.length };
}
