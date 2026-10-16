/** Original procedural meshes shared by the desktop and compact renderers. */
export type MeshData = {
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;
    indices: Uint16Array;
};
export function gridData(width: number, height: number, nx: number, ny: number, curved = false): MeshData {
    const positions = new Float32Array((nx + 1) * (ny + 1) * 3), normals = new Float32Array(positions.length), uvs = new Float32Array((nx + 1) * (ny + 1) * 2), indices: number[] = [];
    for (let y = 0; y <= ny; y++)
        for (let x = 0; x <= nx; x++) {
            const i = y * (nx + 1) + x, px = (x / nx - .5) * width, py = (y / ny - .5) * height;
            positions.set([curved ? px * (.5 + .5 * Math.cos(py * .8)) : px, py, curved ? Math.sin(px * 1.7) * .35 + Math.sin(py * .9) * .22 : 0], i * 3);
            uvs.set([x / nx, y / ny], i * 2);
            if (x < nx && y < ny) {
                const a = i, b = i + 1, c = i + nx + 1, d = c + 1;
                indices.push(a, b, d, a, d, c);
            }
        }
    return withNormals(positions, uvs, new Uint16Array(indices), normals);
}
export function withNormals(positions: Float32Array, uvs: Float32Array, indices: Uint16Array, normals = new Float32Array(positions.length)): MeshData {
    for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
        const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2], vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        for (const v of [a, b, c]) {
            normals[v] += nx;
            normals[v + 1] += ny;
            normals[v + 2] += nz;
        }
    }
    for (let i = 0; i < normals.length; i += 3) {
        const n = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
        normals[i] /= n;
        normals[i + 1] /= n;
        normals[i + 2] /= n;
    }
    return { positions, normals, uvs, indices };
}
export const lamellaData = (economy: boolean) => gridData(1.45, 2.6, economy ? 4 : 8, economy ? 12 : 24, true);
export function cubeData(): MeshData {
    const faces = [[-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1], [1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1], [1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1], [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1], [-1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1], [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1]];
    const positions = new Float32Array(faces.flat().map(v => v * .5));
    const indices = new Uint16Array(faces.flatMap((_, i) => [i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3]));
    return withNormals(positions, new Float32Array(positions.length / 3 * 2), indices);
}
export function octaData(): MeshData {
    const p = [[0, 1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, -1, 0]], faces = [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]];
    const positions = new Float32Array(faces.flatMap(f => f.flatMap(i => p[i])));
    return withNormals(positions, new Float32Array(48), new Uint16Array(Array.from({ length: 24 }, (_, i) => i)));
}
