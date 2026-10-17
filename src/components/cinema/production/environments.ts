import * as T from 'three';
import { Model, skin, bevel, type V3 } from './model';
import { ease } from '../../foundry/choreography';
import { membrane } from '../../foundry/membrane';
import type { StageKey } from './direction';
export type Palette = {
    silver: T.Material;
    dark: T.Material;
    paper: T.Material;
    warm: T.Material;
    light: T.Material;
    glass: T.Material;
    water: T.Material;
};
const TAU = Math.PI * 2;
function morph(model: Model, geometry: T.BufferGeometry, material: T.Material, delay = 0) { const mesh = model.mesh(geometry, material, [0, 0, 0], [0, 0, 0], true); mesh.frustumCulled = false; const weights = mesh.morphTargetInfluences!; model.motions.push((p, _t, spread) => { const split = Math.max(ease(.12 + delay, .58 + delay, p), spread * .95), finish = ease(.58, .96, p); weights[0] = split * (1 - finish); weights[1] = finish; }); return mesh; }
function rib(model: Model, m: T.Material, z: number, w = 7, h = 6) { model.line([[-w, -2, z], [-w, h * .5, z], [-w * .65, h, z], [w * .65, h, z], [w, h * .5, z], [w, -2, z]], m, .11); }
function pool(model: Model, p: Palette, w: number, d: number, z: number, compact: boolean) { model.root.userData.liquid = { width: w, depth: d, z, y: -2.08 }; const mesh = model.mesh(new T.PlaneGeometry(w, d, compact ? 12 : 24, compact ? 20 : 36), p.water, [0, -2.08, z], [-Math.PI / 2, 0, 0]); model.box([w + .4, .22, d + .3], p.dark, [0, -2.3, z]); return mesh; }
function terraces(model: Model, p: Palette, count: number, width: number, depth: number, z: number) { for (let i = 0; i < count; i++) {
    model.box([width, .12, depth], i % 3 === 0 ? p.silver : p.dark, [0, -2.4 - i * .19, z], [0, i * .005, 0]);
} }
function bladePaths(i: number, count: number): V3[][] {
    const a = i / count * TAU;
    return [
        [[Math.cos(a) * 2, -1.6, 3], [Math.cos(a + .7) * 2.5, 0, -1], [Math.cos(a + 1.4) * 2.2, 2, -5], [Math.cos(a + 2) * 1.8, 3, -9]],
        [[Math.cos(a) * 4, -1.6, 2], [Math.cos(a) * 4, 1, -2], [Math.cos(a) * 4, 3, -5], [Math.cos(a) * 4, 4, -8]],
        [[(i - (count - 1) / 2) * .62, -1.4, -5], [(i - (count - 1) / 2) * .62, 0, -5.5], [(i - (count - 1) / 2) * .62, 2, -6], [(i - (count - 1) / 2) * .62, 3, -6.5]]
    ];
}
function* source(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    pool(model, p, 9.8, 18, -3.2, compact).position.y = -1.8;
    yield;
    model.root.userData.liquid.y = -1.8;
    yield;
    for (let i = 0; i < 6; i++) {
        morph(model, membrane(i, compact), p.silver, i * .008);
        yield;
    }
    // Retained page-like backing uses its own modeled edge and inset face, never real document text.
    const bodies = new T.InstancedMesh(bevel(1.28, 2.15, .08, .07), p.silver, 18), faces = new T.InstancedMesh(new T.PlaneGeometry(1.16, 2), p.paper, 18);
    yield;
    bodies.frustumCulled = faces.frustumCulled = false;
    yield;
    bodies.castShadow = true;
    yield;
    faces.receiveShadow = true;
    yield;
    bodies.instanceMatrix.setUsage(T.DynamicDrawUsage);
    yield;
    faces.instanceMatrix.setUsage(T.DynamicDrawUsage);
    yield;
    model.root.add(bodies, faces);
    yield;
    const offset = new T.Matrix4().makeTranslation(0, 0, .075), faceMatrix = new T.Matrix4();
    yield;
    for (let i = 0; i < 18; i++) {
        const col = i % 6, row = Math.floor(i / 6), leaf = new T.Object3D();
        yield;
        model.motions.push((x, _t, s) => { const a = ease(.48 + i * .004, .8 + i * .004, x), chosen = col === 2 || col === 3; leaf.position.set((col - 2.5) * (1.55 + s * .3), -.7 + row * 1.4, -25 - row * 1.2 + (chosen ? ease(.8, 1, x) * 2.7 : 0)); leaf.scale.setScalar(.02 + a * .98); leaf.rotation.y = (col - 2.5) * -.08; leaf.updateMatrix(); bodies.setMatrixAt(i, leaf.matrix); faces.setMatrixAt(i, faceMatrix.copy(leaf.matrix).multiply(offset)); });
        yield;
    }
    model.motions.push(() => { bodies.instanceMatrix.needsUpdate = faces.instanceMatrix.needsUpdate = true; });
    yield;
    const lens = model.box([4.5, 3.7, .28], p.glass, [0, 1.3, -13], [0, 0, 0], true);
    yield;
    model.motions.push(x => { lens.scale.setScalar(1 - ease(.54, .7, x) * .999); lens.visible = x > .14 && x < .7; });
    yield;
}
function* loom(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    pool(model, p, 12, 26, -7, compact);
    yield;
    for (let z = 3; z >= -22; z -= 5) {
        rib(model, p.dark, z, 7, 5.7);
        yield;
    }
    for (let i = 0; i < 8; i++) {
        const angle = i / 8 * TAU, x = (i % 4 - 1.5) * 2.6, y = Math.floor(i / 4) * 2.6;
        yield;
        const paths: V3[][] = [[[Math.cos(angle) * 1.5, -1, 4], [Math.cos(angle + .8) * 2, 1, 0], [Math.cos(angle + 1.3) * 2, 2, -7], [0, 1, -13]], [[Math.cos(angle) * 4, -1, 3], [Math.cos(angle) * 5, 1, -3], [x, y, -9], [x, y, -16]], [[x - .5, -1.5, -16], [x - .5, y - .7, -17], [x + .5, y - .7, -18], [x + .5, y, -19]]];
        yield;
        morph(model, skin(paths, .36, .085, compact), p.silver, i * .009);
        yield;
        yield* instrument(model, p, i, [x, y, -18], compact);
        yield;
    }
    for (let i = 0; i < 12; i++) {
        model.box([.045, .045, 25], p.light, [(i - 5.5) * 1.1, 5.5, -8]);
        yield;
    }
}
function* career(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    terraces(model, p, 6, 13, 12, -4);
    yield;
    for (let i = 0; i < 13; i++) {
        morph(model, skin(bladePaths(i, 13), .35, .055, compact), i % 4 ? p.silver : p.warm, i * .004);
        yield;
    }
    const markers = new T.InstancedMesh(bevel(.48, .14, .7), p.paper, 39);
    yield;
    markers.frustumCulled = false;
    yield;
    markers.castShadow = markers.receiveShadow = true;
    yield;
    markers.instanceMatrix.setUsage(T.DynamicDrawUsage);
    yield;
    model.root.add(markers);
    yield;
    const marker = new T.Object3D();
    yield;
    for (let lane = 0; lane < 3; lane++) {
        const z = -3 - lane * 2;
        yield;
        model.line([[-6, -1.7, z], [-5, .3, z], [-3, 2.6, z], [0, 3.5, z], [3, 2.6, z], [5, .3, z], [6, -1.7, z]], p.dark, .2);
        yield;
    }
    model.motions.push((x, _t, s) => { for (let lane = 0; lane < 3; lane++)
        for (let i = 0; i < 13; i++) {
            const a = i / 12 * Math.PI;
            marker.position.set(Math.cos(a) * 5.4, Math.sin(a) * 3 - 1, -3 - lane * 2 + s * (lane - 1) + ease(.5, .95, x) * lane * .3);
            marker.rotation.set(0, 0, a - Math.PI / 2);
            marker.updateMatrix();
            markers.setMatrixAt(lane * 13 + i, marker.matrix);
        } markers.instanceMatrix.needsUpdate = true; });
    yield;
    model.box([4, 2.5, .18], p.glass, [0, .6, -2]);
    yield;
}
const posePoints = (phase: number): V3[] => { const bend = ease(.15, .65, phase) * .7; return [[0, 2.6, -4], [0, 1.7, -4], [0, .3, -4], [-.6, -.2, -3.9], [-.8, -1.2, -3.9 + Math.sin(bend)], [-.8, -2, -4], [.6, -.2, -4], [.8, -1.2, -4 + Math.sin(bend)], [.8, -2, -4], [-1.1, 1.6, -4], [-1.6, .8, -4 + Math.sin(bend) * 1.7], [-1.1, .1, -4 + Math.sin(bend) * 2.3], [1.1, 1.6, -4], [1.6, .8, -4 + Math.sin(bend) * 1.7], [1.1, .1, -4 + Math.sin(bend) * 2.3]]; };
function* form(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    terraces(model, p, 4, 12, 15, -4);
    yield;
    [-9, -6, -1, 2].forEach(z => rib(model, p.dark, z, 5.5, 5));
    yield;
    const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [1, 9], [9, 10], [10, 11], [1, 12], [12, 13], [13, 14]];
    yield;
    const joints: T.Mesh[] = [], limbs: T.Mesh[] = [];
    yield;
    for (let i = 0; i < 15; i++) {
        joints.push(model.mesh(new T.SphereGeometry(i === 0 ? .38 : .18, compact ? 10 : 18, compact ? 8 : 12), p.silver, [0, 0, 0], [0, 0, 0], true));
        yield;
    }
    for (let i = 0; i < links.length; i++) {
        limbs.push(model.mesh(new T.CylinderGeometry(.10, .15, 1, 8), i % 3 ? p.dark : p.warm, [0, 0, 0], [0, 0, 0], true));
        yield;
    }
    const up = new T.Vector3(0, 1, 0), a = new T.Vector3(), b = new T.Vector3();
    yield;
    model.motions.push((x, t, s) => { const nodes = posePoints(x), breath = Math.sin(t * .8) * .012; nodes.forEach((at, i) => joints[i].position.set(at[0], at[1] + breath, at[2] + s * (i < 3 ? 0 : .2))); links.forEach(([from, to], i) => { a.copy(joints[from].position); b.copy(joints[to].position); const mesh = limbs[i]; mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(up, b.sub(a).normalize()); mesh.scale.y = joints[from].position.distanceTo(joints[to].position); }); });
    yield;
    for (let side = -1; side <= 1; side += 2) {
        const shield = model.box([.2, 6, 8], p.glass, [side * 3.1, .7, -4], [0, 0, 0], true);
        yield;
        model.motions.push(x => { shield.position.x = side * (3.1 + ease(.12, .8, x) * 2.5); });
        yield;
        model.line([[side * 2, -1.9, 2], [side * 2, -1.9, -2], [side * 2, -1.9, -7], [side * 2, -1.9, -10]], p.light, .045);
        yield;
    }
    for (let i = 0; i < 6; i++) {
        model.box([6, .025, .035], p.light, [0, -1.98, -1 - i * 1.3]);
        yield;
    }
}
function* readingRoom(model: Model, p: Palette, compact: boolean, resume = false): Generator<void, void, unknown> {
    terraces(model, p, 5, 12, 12, -5);
    yield;
    for (let i = 0; i < 9; i++) {
        const z = 1 - i * 1.6;
        yield;
        rib(model, i % 3 ? p.dark : p.warm, z, 6, 6.5);
        yield;
    }
    const desk = model.box([7, .3, 4.2], p.dark, [0, -.8, -4]);
    yield;
    desk.receiveShadow = true;
    yield;
    for (let i = 0; i < 12; i++) {
        const z = -5 + i * .12, paths: V3[][] = [[[0, -.55, z], [-1, -.45, z], [-2, -.4, z], [-3, -.35, z]], [[0, -.55, z], [-.4, 1.8, z], [-.8, 3.1, z], [-1.8, 3.3, z]], [[0, -.55, z], [1, -.45, z], [2, -.4, z], [3, -.35, z]]];
        yield;
        const page = morph(model, skin(paths, 1.35, .022, compact), i % 3 ? p.paper : p.warm, i * .008);
        yield;
        model.motions.push((_x, _t, s) => { page.position.z = (i - 5.5) * s * .07; });
        yield;
    }
    const chip = new T.Group();
    yield;
    model.root.add(chip);
    yield;
    for (let i = 0; i < 15; i++) {
        const fin = new T.Mesh(beveledFin(), p.silver);
        yield;
        fin.position.set((i - 7) * .22, .1, -10);
        yield;
        chip.add(fin);
        yield;
    }
    model.box([4.7, .24, 3.4], p.dark, [0, -.9, -10]);
    yield;
    model.box([3, .14, 2.3], p.warm, [0, -.65, -10]);
    yield;
    for (let i = 0; i < 8; i++) {
        for (const side of [-1, 1]) {
            model.box([.12, .14, .55], p.warm, [(i - 3.5) * .5, -.5, -10 + side * 1.4]);
            yield;
        }
    }
    model.line([[-2, -.7, -5], [-3, -.7, -6], [-3, -.7, -8], [0, -.7, -10]], p.warm, .07, compact);
    yield;
    const cover = model.box([4.5, 2.5, .18], p.glass, [0, .4, -8], [0, 0, 0], true);
    yield;
    model.motions.push((x, _t, s) => { cover.position.y = .4 + ease(.4, .85, x) * 3 + s * 1.2; chip.position.z = -s * 1.2; });
    yield;
    if (resume) {
        chip.visible = false;
        yield;
        model.box([3.4, .15, 4.8], p.silver, [0, -.55, -5], [0, .12, 0]);
        yield;
    }
}
function beveledFin() { return new T.BoxGeometry(.07, 1.6, 2); }
function* folio(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { terraces(model, p, 7, 11, 14, -5); yield; for (let side = -1; side <= 1; side += 2) {
    model.line([[side * 5, -2, 1], [side * 5, 1, -1], [side * 4, 4, -5], [side * 2, 5, -9]], p.dark, .28, compact);
    yield;
    model.line([[side * 5, -2, 1], [side * 5, 1, -1], [side * 4, 4, -5], [side * 2, 5, -9]], p.warm, .045, compact);
    yield;
} const pivot = new T.Group(); yield; pivot.position.set(-2.1, -.7, -4); yield; model.root.add(pivot); yield; const cover = new T.Mesh(new T.BoxGeometry(4.2, .16, 5.6), p.silver); yield; cover.position.x = 2.1; yield; pivot.add(cover); yield; model.motions.push((x, _t, s) => { pivot.rotation.z = ease(.08, .72, x) * 1.8 + s * .25; }); yield; for (let i = 0; i < 4; i++) {
    const page = model.box([4, .045, 5.3], p.paper, [0, -.5 + i * .08, -4], [0, 0, 0], true);
    yield;
    model.motions.push(x => { page.position.y = -.5 + i * .08 + ease(.3, .85, x) * i * .2; page.rotation.y = ease(.3, .85, x) * (i - 1.5) * .045; });
    yield;
} model.box([4.8, .2, 6.2], p.dark, [0, -.9, -4]); yield; const reader = model.box([4.5, 5.8, .12], p.glass, [0, 1.6, -7], [0, .08, 0], true); yield; model.motions.push(x => { reader.position.y = 1.6 + ease(.6, 1, x) * .4; }); yield; }
function* passage(model: Model, p: Palette): Generator<void, void, unknown> {
    terraces(model, p, 5, 11, 30, -10);
    yield;
    for (let gate = 0; gate < 3; gate++) {
        const z = -gate * 7 - 2;
        yield;
        rib(model, p.dark, z, 5.5, 5.5);
        yield;
        for (let j = 0; j < 4; j++) {
            const pivot = new T.Group();
            yield;
            pivot.position.set((j % 2 ? 1 : -1) * 3, Math.floor(j / 2) * 3 - 1, z);
            yield;
            model.root.add(pivot);
            yield;
            const panel = new T.Mesh(new T.BoxGeometry(2.6, 2.5, .25), p.silver);
            yield;
            panel.position.x = j % 2 ? -1.3 : 1.3;
            yield;
            pivot.add(panel);
            yield;
            const band = new T.Mesh(new T.BoxGeometry(2.3, .05, .32), p.light);
            yield;
            band.position.set(panel.position.x, .7, 0);
            yield;
            pivot.add(band);
            yield;
            model.motions.push((x, _t, s) => { pivot.rotation.y = (j % 2 ? 1 : -1) * ease(gate * .2, .4 + gate * .2, x) * (2.45 + s * .3); });
            yield;
        }
        model.box([6, .07, .08], p.light, [0, -1.95, z + 1]);
        yield;
    }
    // A real visible boundary branch, separate from the straight template/model/parser passage.
    model.line([[2, -1.7, -9], [5, -1.7, -9], [7, -1, -7], [7, 1, -6]], p.warm, .17);
    yield;
    model.box([1.8, 3, .3], p.dark, [7, .6, -6], [0, .3, 0]);
    yield;
}
function* city(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    const count = compact ? 6 : 9;
    yield;
    for (let side = 0; side < 2; side++) {
        const x = (side ? 1 : -1) * 3.5;
        yield;
        model.box([6, .5, 14], p.dark, [x, -2.35, -5]);
        yield;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < 5; j++) {
                const h = .45 + ((i * 7 + j * 13 + side * 11) % 23) * .14, z = -10 + i * 1.5;
                yield;
                model.box([.72, h, .85], j % 4 ? p.silver : p.warm, [x + (j - 2) * 1.03, h / 2 - 2, z]);
                yield;
                if (j % 2 === 0)
                    model.box([.76, .035, .88], p.light, [x + (j - 2) * 1.03, h - 1.97, z]);
            }
        }
    }
    const canopyGeometry = new T.PlaneGeometry(12, 14, compact ? 12 : 24, compact ? 12 : 24);
    yield;
    canopyGeometry.rotateX(-Math.PI / 2);
    yield;
    canopyGeometry.translate(0, 0, -5);
    yield;
    const positions = canopyGeometry.getAttribute('position');
    yield;
    const base = positions.clone(), raised = positions.clone();
    yield;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i), z = positions.getZ(i);
        yield;
        base.setY(i, -1.5);
        yield;
        raised.setY(i, 1.8 + x * .12 - z * .035);
        yield;
    }
    canopyGeometry.setAttribute('position', base);
    yield;
    canopyGeometry.morphAttributes.position = [raised, raised.clone()];
    yield;
    canopyGeometry.computeVertexNormals();
    yield;
    const canopyMaterial = new T.MeshLambertMaterial({ color: 0x8fbac5, transparent: true, opacity: .28, side: T.DoubleSide, depthWrite: false });
    yield;
    const canopy = model.mesh(canopyGeometry, canopyMaterial, [0, 0, 0], [0, 0, 0], true);
    yield;
    canopy.frustumCulled = false;
    yield;
    const canopyWeights = canopy.morphTargetInfluences!;
    yield;
    model.motions.push((x, _t, spread) => { canopyWeights[0] = Math.max(ease(.2, .75, x), spread * .8); canopy.position.y = spread * .3; });
    yield;
    for (let i = 0; i < 7; i++) {
        const x = (i - 3) * 1.7;
        yield;
        for (let j = 0; j < 4; j++) {
            const rod = model.box([.035, 1, .035], p.warm, [x, 0, -j * 3], [0, 0, 0], true);
            yield;
            model.motions.push(xp => { const h = ease(.25, .8, xp) * (2.8 + i * .19); rod.scale.y = Math.max(.01, h); rod.position.y = -1.6 + h / 2; });
            yield;
        }
    }
    for (const side of [-1, 1]) {
        model.line([[side * 6, 1.2, 2], [side * 6, 1.5, -3], [side * 6, 1.8, -7], [side * 6, 2, -12]], p.silver, .06, compact);
        yield;
    }
}
function* decision(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> {
    terraces(model, p, 6, 13, 13, -4);
    yield;
    for (let i = 0; i < 11; i++) {
        const z = -1 - i * .55, points: V3[] = Array.from({ length: 7 }, (_, j) => { const x = (j - 3) * 1.6; return [x, 4 / (1 + Math.exp(-x * .8)) - 2, z] as V3; });
        yield;
        const separated = points.map(([x, y, z]) => [x, y + (x < 0 ? -1.2 : 1.2), z] as V3), aligned = points.map(([x, y, z]) => [x, y * 1.4, z - .4] as V3);
        yield;
        morph(model, skin([points, separated, aligned], .24, .07, compact), i % 3 ? p.silver : p.glass, i * .003);
        yield;
    }
    const threshold = model.box([.09, 7, 7], p.warm, [0, 0, -4], [0, 0, 0], true);
    yield;
    model.motions.push((x, _t, s) => { threshold.position.x = (ease(.15, .72, x) - .5) * 2.2 + s * .8; });
    yield;
    for (let side = -1; side <= 1; side += 2) {
        model.line([[side * 6, -2, 1], [side * 6, 1, -2], [side * 5, 4, -5], [side * 2, 4, -8]], p.dark, .24);
        yield;
        for (let i = 0; i < 9; i++) {
            model.box([.18, .18, .18], p.paper, [side * (1 + (i % 3) * 1.3), (Math.floor(i / 3) - 1) * .9, -4]);
            yield;
        }
    }
}
function* branch(model: Model, p: Palette, origin: V3, depth: number, size: number, seed: number, compact: boolean): Generator<void, void, unknown> { if (depth === 0)
    return; const [x, y, z] = origin, end: V3 = [x + Math.cos(seed) * size * .13, y + size, z - Math.sin(seed) * size * .13]; yield; model.line([origin, [x, y + size * .45, z], end], depth > 2 ? p.dark : p.silver, .035 + depth * .035, compact); yield; if (depth === 1) {
    model.box([.22, .35, .16], p.warm, end);
    yield;
    return;
} for (const side of [-1, 1]) {
    const next: V3 = [end[0] + side * size * .55, end[1] + size * .25, end[2] + side * Math.cos(seed) * size * .33];
    yield;
    model.line([end, next], p.silver, .03 + depth * .025, compact);
    yield;
    yield* branch(model, p, next, depth - 1, size * .62, seed + side * .8, compact);
    yield;
} }
function* forest(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { terraces(model, p, 4, 15, 16, -5); yield; for (let tree = 0; tree < 5; tree++) {
    const sub = new Model(), base: V3 = [(tree - 2) * 2.5, -2, -4 - Math.abs(tree - 2) * 1.2];
    yield;
    yield* branch(sub, p, [0, 0, 0], compact ? 3 : 4, 1.7, tree * .9, compact);
    yield;
    sub.batch();
    yield;
    sub.root.position.set(...base);
    yield;
    model.root.add(sub.root);
    yield;
    model.motions.push((x, _t, s) => { sub.root.position.x = base[0] * (.6 + ease(.12, .7, x) * .4 + s * .2); sub.root.position.y = -2 + ease(.6, 1, x) * .2; });
    yield;
    model.line([base, [base[0] * .8, -2.03, -1], [base[0] * .4, -2.03, 2], [0, -1, 3]], p.glass, .12, compact);
    yield;
} model.box([2, 1.2, .3], p.glass, [0, -.6, 3]); yield; }
/** Eight small dissimilar instruments repeat the silhouettes, not one recolored solid. */
function* instrument(model: Model, p: Palette, index: number, at: V3, compact: boolean): Generator<void, void, unknown> {
    const g = new T.Group();
    yield;
    g.position.set(...at);
    yield;
    model.root.add(g);
    yield;
    const sub = new Model();
    yield;
    g.add(sub.root);
    yield;
    const s = .6;
    yield;
    if (index === 0) {
        for (let i = 0; i < 5; i++) {
            sub.box([.9, 1.3, .06], p.silver, [(i - 2) * .15, 0, -i * .12], [0, i * .11, 0]);
            yield;
        }
    }
    else if (index === 1) {
        for (let i = 0; i < 6; i++) {
            const a = i / 6 * TAU;
            yield;
            sub.line([[Math.cos(a), -1, 0], [Math.cos(a + .5) * 1.1, 0, 0], [Math.cos(a + 1), 1, 0]], p.warm, .09, compact);
            yield;
        }
    }
    else if (index === 2) {
        sub.line([[0, 1, 0], [0, -.1, 0], [-.6, -1, 0]], p.silver, .13, compact);
        yield;
        sub.line([[0, -.1, 0], [.6, -1, 0]], p.silver, .13, compact);
        yield;
        sub.line([[-.8, .4, 0], [0, .6, 0], [.8, .4, 0]], p.silver, .1, compact);
        yield;
    }
    else if (index === 3) {
        for (let i = 0; i < 5; i++) {
            sub.box([1.6, .06, 1], p.paper, [0, i * .12, 0], [0, 0, i * .1]);
            yield;
        }
    }
    else if (index === 4) {
        for (let i = 0; i < 3; i++) {
            sub.box([.1, 1.6, 1.4], p.silver, [(i - 1) * .8, 0, 0]);
            yield;
        }
    }
    else if (index === 5) {
        for (let i = 0; i < 9; i++) {
            sub.box([.4, .3 + (i % 4) * .3, .45], p.silver, [(i % 3 - 1) * .65, -.4, Math.floor(i / 3) * .6]);
            yield;
        }
    }
    else if (index === 6) {
        sub.line([[-1, -.8, 0], [-.4, -.7, 0], [.4, .7, 0], [1, .8, 0]], p.silver, .18, compact);
        yield;
    }
    else
        yield* branch(sub, p, [0, -1, 0], 3, .8, 1, compact);
    sub.batch();
    yield;
    sub.root.scale.setScalar(s);
    yield;
    const plinth = model.box([2, .18, 2], p.dark, [at[0], at[1] - .9, at[2]]);
    yield;
    plinth.name = `instrument-${index}`;
    yield;
    model.motions.push((x, _t, spread, selection) => { const lift = ease(index * .015, .5 + index * .015, x); g.position.y = at[1] + lift * .22 + (selection === index ? .8 : 0); g.position.x = at[0] + (at[0] > 0 ? 1 : -1) * spread * .65; });
    yield;
}
function* archipelago(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { pool(model, p, 19, 21, -5, compact); yield; for (let i = 0; i < 8; i++) {
    const at: V3 = [(i % 4 - 1.5) * 4, 0, -Math.floor(i / 4) * 7 - 2];
    yield;
    yield* instrument(model, p, i, at, compact);
    yield;
    model.line([[at[0], -1.7, at[2]], [at[0], -1.7, 2], [0, -1.7, 4]], p.silver, .07, compact);
    yield;
} for (let i = 0; i < 3; i++) {
    rib(model, p.dark, -i * 7, 10, 7);
    yield;
} }
function* formation(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { for (let i = 0; i < 9; i++) {
    const z = -2 - i * .55, y = -1.5 + i * .32;
    yield;
    const a: V3[] = [[-6, y, z], [-3, y + .3, z], [0, y + 1.1, z], [3, y + .5, z], [6, y - .2, z]], b = a.map(([x, yy, zz]) => [x, yy + i * .25, zz - i * .18] as V3), c = a.map(([x, yy, zz]) => [x, yy + Math.abs(x) * .35, zz - i * .4] as V3);
    yield;
    const layer = morph(model, skin([a, b, c], .35, .12, compact), i % 3 ? p.silver : p.warm);
    yield;
    model.motions.push((_x, _t, s) => { layer.position.y = s * i * .13; layer.position.z = -s * i * .12; });
    yield;
} terraces(model, p, 6, 14, 14, -4); yield; }
function* exchange(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { terraces(model, p, 5, 14, 14, -5); yield; for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2, r = 4;
    yield;
    const paths: V3[][] = [[[Math.cos(a) * r, -2, 0], [Math.cos(a) * r, 0, -2], [Math.sin(a) * 2, 2, -5], [0, 1, -7]], [[Math.cos(a) * 6, -2, 0], [Math.cos(a) * 5, 0, -2], [Math.sin(a) * 3, 3, -5], [0, 1, -7]], [[Math.cos(a) * 5, -2, 0], [Math.cos(a) * 4, 1, -3], [Math.sin(a) * 2, 4, -6], [0, 1, -7]]];
    yield;
    const bridge = morph(model, skin(paths, .42, .11, compact), p.silver, i * .015);
    yield;
    model.motions.push((_x, _t, s) => { bridge.position.x = Math.cos(a) * s * .7; bridge.position.z = Math.sin(a) * s * .7; });
    yield;
    for (let j = 0; j < 6; j++) {
        model.box([.9, .08, .5], p.warm, [Math.cos(a) * (2 + j * .55), -1.2 + j * .3, -4 + Math.sin(a) * j * .45], [0, a, 0]);
        yield;
    }
} const core = model.box([2.4, 3, 2.4], p.glass, [0, .5, -6], [0, .7, 0], true); yield; model.motions.push((_x, _t, s) => { core.position.y = .5 + s * .8; }); yield; }
function* promenade(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { terraces(model, p, 4, 14, 18, -5); yield; for (let i = 0; i < 24; i++) {
    const a = i / 23 * Math.PI * 1.6, r = 4.8, step = model.box([2, .16, 1.3], i % 6 === 0 ? p.warm : p.silver, [Math.cos(a) * r, -1.7 + i * .17, -5 + Math.sin(a) * r], [0, -a, 0], true);
    yield;
    model.motions.push((x, _t, s) => { step.position.y = -1.7 + i * .17 + ease(.2, .85, x) * i * .018; step.position.x = Math.cos(a) * (r + s * .8); });
    yield;
} model.line(Array.from({ length: 25 }, (_, i) => { const a = i / 24 * Math.PI * 1.6; return [Math.cos(a) * 5.7, -.6 + i * .17, -5 + Math.sin(a) * 5.7] as V3; }), p.silver, .055, compact); yield; for (let i = 0; i < 3; i++) {
    model.box([2.7, 4, .22], p.glass, [(i - 1) * 3, 1, -10], [0, (i - 1) * -.15, 0]);
    yield;
} }
function* repository(model: Model, p: Palette): Generator<void, void, unknown> { terraces(model, p, 6, 13, 14, -4); yield; for (let vault = 0; vault < 3; vault++) {
    const z = -2 - vault * 3.7;
    yield;
    for (let edge = 0; edge < 6; edge++) {
        const a = edge / 6 * TAU, leaf = model.box([2.3, .28, 1.3], vault % 2 ? p.silver : p.warm, [Math.cos(a) * 2.8, Math.sin(a) * 2.8 + .8, z], [0, 0, a + Math.PI / 2], true);
        yield;
        model.motions.push((x, _t, s) => { const r = 2.8 + ease(vault * .12, .55 + vault * .12, x) * 1.5 + s * .3; leaf.position.set(Math.cos(a) * r, Math.sin(a) * r + .8, z); leaf.rotation.z = a + Math.PI / 2 + ease(.2, .9, x) * .22; });
        yield;
    }
    model.box([2.6, 3.3, .09], p.paper, [0, .8, z - .4]);
    yield;
} }
function* confluence(model: Model, p: Palette, compact: boolean): Generator<void, void, unknown> { pool(model, p, 14, 20, -7, compact); yield; for (let i = 0; i < 2; i++) {
    const side = i ? 1 : -1, paths: V3[][] = [[[side * 6, -1, 4], [side * 4, .3, 0], [side * 2, 1, -5], [0, 1, -10]], [[side * 7, -1, 4], [side * 5, 1, 0], [side * 2, 2, -5], [0, 1, -10]], [[side * 6, -1, 4], [side * 3, 1, -1], [side, 2, -6], [0, 1, -10]]];
    yield;
    const duct = morph(model, skin(paths, .6, .17, compact), p.silver, i * .02);
    yield;
    model.motions.push((_x, _t, s) => { duct.position.x = side * s * .8; duct.rotation.z = side * s * .055; });
    yield;
} for (let i = 0; i < 6; i++) {
    rib(model, i % 2 ? p.dark : p.warm, -i * 3, 7 - i * .3, 5);
    yield;
} model.box([4, 3, .22], p.glass, [0, 1, -12]); yield; }
function* environmentSteps(key: StageKey, p: Palette, compact: boolean): Generator<void, Model, unknown> {
    const model = new Model();
    yield;
    model.root.name = key;
    yield;
    switch (key) {
        case 'home':
            yield* loom(model, p, compact);
            break;
        case 'sourcelens':
            yield* source(model, p, compact);
            break;
        case 'careerlens':
            yield* career(model, p, compact);
            break;
        case 'form':
            yield* form(model, p, compact);
            break;
        case 'studybuddy':
            yield* readingRoom(model, p, compact);
            break;
        case 'pymentor':
            yield* passage(model, p);
            break;
        case 'airbnb':
            yield* city(model, p, compact);
            break;
        case 'logistic-diabetes':
            yield* decision(model, p, compact);
            break;
        case 'random-forest-diabetes':
            yield* forest(model, p, compact);
            break;
        case 'projects':
            yield* archipelago(model, p, compact);
            break;
        case 'about':
            yield* formation(model, p, compact);
            break;
        case 'skills':
            yield* exchange(model, p, compact);
            break;
        case 'experience':
            yield* promenade(model, p, compact);
            break;
        case 'certifications':
            yield* repository(model, p);
            break;
        case 'resume':
            yield* folio(model, p, compact);
            break;
        case 'contact':
            yield* confluence(model, p, compact);
            break;
    }
    model.batch();
    yield;
    return model;
}

/** Synchronous authoring/test path and cooperative browser path share identical instructions. */
export function environment(key:StageKey,p:Palette,compact:boolean){const steps=environmentSteps(key,p,compact);for(;;){const next=steps.next();if(next.done)return next.value;}}
export async function environmentAsync(key:StageKey,p:Palette,compact:boolean,cancelled:()=>boolean=()=>false){const steps=environmentSteps(key,p,compact);let budget=performance.now();for(;;){if(cancelled())return null;const next=steps.next();if(next.done)return next.value;if(performance.now()-budget>6){await new Promise<void>(resolve=>setTimeout(resolve,0));budget=performance.now();}}}
