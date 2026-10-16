'use client';
import { useEffect, useRef } from 'react';
// Math-only imports: compact devices do not download Three's renderer or Fiber.
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Matrix3 } from 'three/src/math/Matrix3.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Euler } from 'three/src/math/Euler.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { cinemaState, cameraPose, sheetPose, smooth, type Vec3 } from './timeline';
import { lamellaData, gridData, cubeData, octaData } from './geometry';
import { waterVertex, waterFragment, silverVertex, silverFragment } from './materials';
import {program,mesh,type Program,type Mesh} from './native-gl';
/** Compact scene: same narrative and geometry, a small instanced WebGL2 backend. */
export default function LeanScene({ active, onReady, onFailure }: {
    active: boolean;
    compact: boolean;
    source: boolean;
    onReady: () => void;
    onFailure: () => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null), activeRef = useRef(active), start = useRef<() => void>(() => { });
    useEffect(() => { activeRef.current = active; if (active)
        start.current(); }, [active]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
        if (!gl) {
            onFailure();
            return;
        }
        let raf = 0, disposed = false, last = 0, time = 0, p = 0, slow = 0, quality = 1;
        const debug = gl.getExtension('WEBGL_debug_renderer_info');
        const software = /swiftshader|llvmpipe|software/i.test(debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '');
        quality = software ? .65 : Math.min(devicePixelRatio, 1.25);
        const stats = { frames: 0, frameMs: [] as number[], calls: 0, triangles: 0, geometries: 4, textures: 0, quality };
        window.__sakshamCinema = stats;
        const programs: Program[] = [], meshes: Mesh[] = [];
        const pos = new Vector3(), scale = new Vector3(), rotation = new Euler(), quat = new Quaternion(), matrix = new Matrix4(), root = new Matrix4(), floor = new Matrix4(), view = new Matrix4(), projection = new Matrix4(), mv = new Matrix4(), normal = new Matrix3(), eye = new Vector3(8, 2, 11), focus = new Vector3(), up = new Vector3(0, 1, 0), desired = new Vector3();
        const count = 24, instances = new Float32Array(count * 16), boxes = new Float32Array(64 * 16), nodes = new Float32Array(32 * 16), one = new Float32Array(16), lifts = [0, 0, 0];
        const write = (output: Float32Array, index: number, position: Vec3, angles: Vec3, size: Vec3) => { pos.set(...position); scale.set(...size); quat.setFromEuler(rotation.set(...angles)); matrix.compose(pos, quat, scale); output.set(matrix.elements, index * 16); };
        let metal: Program, water: Program, pages: Mesh, plane: Mesh, cube: Mesh, octa: Mesh;
        const cleanup = () => { if (disposed)
            return; disposed = true; cancelAnimationFrame(raf); resize.disconnect(); canvas.removeEventListener('webglcontextlost', lost); for (const m of meshes) {
            m.buffers.forEach(b => gl.deleteBuffer(b));
            gl.deleteVertexArray(m.vao);
        } programs.forEach(p => gl.deleteProgram(p.program)); delete window.__sakshamCinema; gl.getExtension('WEBGL_lose_context')?.loseContext(); };
        const lost = (event: Event) => { event.preventDefault(); onFailure(); };
        canvas.addEventListener('webglcontextlost', lost);
        const sizeCanvas = () => { const w = Math.max(1, Math.round(canvas.clientWidth * quality)), h = Math.max(1, Math.round(canvas.clientHeight * quality)); if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        } gl.viewport(0, 0, w, h); const y = .1 * Math.tan(42 * Math.PI / 360), x = y * w / h; projection.makePerspective(-x, x, y, -y, .1, 100); };
        const resize = new ResizeObserver(sizeCanvas);
        resize.observe(canvas);
        sizeCanvas();
        cinemaState.quality = quality;
        try {
            metal = program(gl, silverVertex, silverFragment);
            programs.push(metal);
            water = program(gl, waterVertex, waterFragment);
            programs.push(water);
            for (const d of [lamellaData(true), gridData(70, 70, 16, 16), cubeData(), octaData()])
                meshes.push(mesh(gl, d));
            [pages, plane, cube, octa] = meshes;
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearColor(8 / 255, 13 / 255, 19 / 255, 1);
        }
        catch {
            cleanup();
            onFailure();
            return;
        }
        const uniforms = (program: Program, model: Matrix4) => { gl.useProgram(program.program); mv.multiplyMatrices(view, model); normal.getNormalMatrix(mv); const u = program.uniforms; gl.uniformMatrix4fv(u.modelMatrix, false, model.elements); gl.uniformMatrix4fv(u.modelViewMatrix, false, mv.elements); gl.uniformMatrix4fv(u.viewMatrix, false, view.elements); gl.uniformMatrix4fv(u.projectionMatrix, false, projection.elements); gl.uniformMatrix3fv(u.normalMatrix, false, normal.elements); gl.uniform1f(u.uTime, time); gl.uniform1f(u.uProgress, p); gl.uniform2f(u.uPointer, ...cinemaState.pointer); gl.uniform3f(u.uTint, 1, 1, 1); gl.uniform1f(u.uOpacity, 1); };
        const draw = (m: Mesh, data: Float32Array, n: number) => { if (!n)
            return; gl.bindVertexArray(m.vao); gl.bindBuffer(gl.ARRAY_BUFFER, m.matrices); gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, n * 16)); gl.drawElementsInstanced(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0, n); stats.calls++; stats.triangles += m.count / 3 * n; };
        const frame = (now: number) => {
            raf = 0;
            if (disposed || !activeRef.current)
                return;
            raf = requestAnimationFrame(frame);
            if (!cinemaState.active) {
                last = now;
                return;
            }
            const delta = last ? (now - last) / 1000 : 1 / 60;
            last = now;
            const dt = Math.min(delta, .05), blend = 1 - Math.exp(-dt * 8);
            if (!cinemaState.paused)
                time += dt;
            p += (cinemaState.progress - p) * blend;
            const source = cinemaState.source, mobile = cinemaState.compact, pose = cameraPose(p, source, mobile, cinemaState.pointer);
            eye.lerp(desired.set(...pose.camera), blend);
            focus.set(...pose.focus);
            view.lookAt(eye, focus, up).setPosition(eye).invert();
            root.compose(pos.set(pose.offset, mobile ? -.5 : 0, 0), quat.setFromEuler(rotation.set(0, Math.sin(time * .16) * .025, 0)), scale.setScalar(.82));
            floor.compose(pos.set(0, -3, 0), quat.setFromEuler(rotation.set(-Math.PI / 2, 0, 0)), scale.setScalar(1));
            for (let a = 0; a < 3; a++)
                lifts[a] += (Number(cinemaState.selection === a) * .35 - lifts[a]) * blend;
            for (let i = 0; i < count; i++) {
                const s = sheetPose(i, count, p, source);
                s.position[1] += Math.sin(time * .35 + i * .16) * .025 + lifts[Math.floor(i / count * 3)] * smooth((p - .4) / .2);
                if (!source && i % 3 !== 0) {
                    const k = 1 - smooth((p - .42) / .2) * .98;
                    s.scale = s.scale.map(v => v * k) as Vec3;
                }
                write(instances, i, s.position, s.rotation, s.scale);
            }
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            stats.calls = 0;
            stats.triangles = 0;
            uniforms(water, floor);
            write(one, 0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
            draw(plane, one, 1);
            uniforms(metal, root);
            draw(pages, instances, count);
            write(one, 0, [0, .15, -.3], [.2, .5, .15], [.65, .65, .65]);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.uniform3f(metal.uniforms.uTint, .72, 1, 1.05);
            gl.uniform1f(metal.uniforms.uOpacity, .7);
            draw(octa, one, 1);
            gl.disable(gl.BLEND);
            gl.uniform3f(metal.uniforms.uTint, 1, 1, 1);
            gl.uniform1f(metal.uniforms.uOpacity, 1);
            const amount = smooth((p - .48) / .25);
            if (amount > .001) {
                let boxCount = 0, nodeCount = 0;
                const box = (position: Vec3, size: Vec3, angle = 0) => write(boxes, boxCount++, position.map((v, i) => v * amount + (i === 1 ? (1 - amount) * -2 : 0)) as Vec3, [0, 0, angle], size.map(v => v * amount) as Vec3);
                const node = (position: Vec3, size: number) => write(nodes, nodeCount++, position.map((v, i) => v * amount + (i === 1 ? (1 - amount) * -2 : 0)) as Vec3, [0, 0, 0], [size * amount, size * amount, size * amount]);
                const origin = source ? 0 : -4.6;
                box([origin, -1.7, 0], [2.5, .1, 2.4]);
                for (let i = 0; i < 3; i++)
                    box([origin + .95 - i * .95, -.1, 0], [.03, 3.1, 2]);
                if (source) {
                    for (const side of [-1, 1]) {
                        box([side * 1.6, 0, .8], [.04, 4.1, .07]);
                        box([0, side * 2.05, .8], [3.2, .04, .07]);
                    }
                }
                else {
                    for (let i = 0; i < 5; i++)
                        box([(i - 2) * .4, -1.1 + (i % 3) * .3, .5], [.16, .8 + (i % 3) * .6, .3]);
                    box([0, -1.75, 0], [2.5, .06, 2.4]);
                    for (const [x, y] of [[0, 1.15], [.55, .6], [-.55, .6], [.1, -.15], [.7, -.8], [-.5, -.8]])
                        node([x + 4.6, y - .1, .4], .11);
                    for (const [x, y, x2, y2] of [[-.55, .6, 0, 1.15], [0, 1.15, .55, .6], [0, 1.15, .1, -.15], [.1, -.15, .7, -.8], [.1, -.15, -.5, -.8]])
                        box([(x + x2) / 2 + 4.6, (y + y2) / 2 - .1, .4], [.05, Math.hypot(x2 - x, y2 - y), .05], -Math.atan2(x2 - x, y2 - y));
                }
                draw(cube, boxes, boxCount);
                draw(octa, nodes, nodeCount);
            }
            stats.frames++;
            if (stats.frames > 30) {
                stats.frameMs.push(delta * 1000);
                if (stats.frameMs.length > 720)
                    stats.frameMs.shift();
            }
            if (delta > .035)
                slow++;
            if (stats.frames === 60 && slow > 20 && software) {
                quality = .45;
                stats.quality = quality;
                cinemaState.quality = quality;
                const w = Math.round(canvas.clientWidth * quality), h = Math.round(canvas.clientHeight * quality);
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
            gl.bindVertexArray(null);
        };
        start.current = () => { if (!raf && !disposed) {
            last = 0;
            raf = requestAnimationFrame(frame);
        } };
        onReady();
        start.current();
        return cleanup;
    }, [onReady, onFailure]);
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} data-compact-engine="webgl2"/>;
}
