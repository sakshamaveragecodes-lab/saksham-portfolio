/** Authored spatial keyframes. No model outputs or learned coordinates. */
export type Vec3 = [
    number,
    number,
    number
];
export const cinemaState = { present: undefined as undefined | ((progress:number)=>void), progress: 0, source: false, compact: false, active: false, paused: false, pointer: [0, 0] as [
        number,
        number
    ], content: false, section: 0, sectionProgress: 0, sectionKind: 'overview', quality: 1, selection: -1, spread: 0 };
export const smooth = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
export function segment(progress: number, stops: Vec3[]): Vec3 {
    const p = Math.max(0, Math.min(stops.length - 1, progress * (stops.length - 1)));
    const a = Math.min(stops.length - 2, Math.floor(p));
    const t = smooth(p - a);
    return stops[a].map((v, i) => v + (stops[a + 1][i] - v) * t) as Vec3;
}
export function sheetPose(index: number, count: number, p: number, source: boolean): {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
} {
    const t = index / (count - 1), a = t * Math.PI * 2.4;
    const emergence: Vec3 = [Math.cos(a) * 1.25, (t - .5) * 4.6, Math.sin(a) * 1.25];
    const corridor: Vec3 = [(index % 2 ? 1 : -1) * 2.5, Math.sin(t * Math.PI) * .3, (t - .5) * 17];
    const assembly = Math.floor(t * 2.99), local = (t * 3) % 1;
    const archive: Vec3 = [(assembly - 1) * 4.6, (local - .5) * 3.3, Math.sin(local * Math.PI) * .7];
    const grounded: Vec3 = [(index % 2 ? 1 : -1) * (1.15 + t * .6), (t - .5) * 4.5, Math.sin(t * 9) * .25];
    const pages: Vec3 = [Math.sin(t * 3.14) * .35, (t - .5) * 4.6, Math.cos(t * 3.14) * .25];
    const retrieval: Vec3 = [(index % 6 - 2.5) * .68, (Math.floor(index / 6) - Math.floor(count / 12)) * .68, Math.sin(index * .9) * .65];
    const positions = source ? [pages, corridor, retrieval, grounded] : [emergence, corridor, archive, archive];
    const rotations: Vec3[] = source ? [[.05, .3 + Math.sin(t * 3.14) * .15, -.12], [0, index % 2 ? Math.PI / 2 + .08 : -Math.PI / 2 - .08, 0], [0, .2, 0], [0, index % 2 ? -.18 : .18, 0]] : [[.16, a + .2, .08], [0, index % 2 ? Math.PI / 2 + .08 : -Math.PI / 2 - .08, 0], [Math.PI / 2, 0, 0], [Math.PI / 2, 0, 0]];
    const scales: Vec3[] = [[1, 1, 1], [.75, 1.3, .8], [.65, .55, .7], source ? [.48, .3, .7] : [.65, .55, .7]];
    if (source)
        scales[2] = [.18, .18, .3];
    return { position: segment(p, positions), rotation: segment(p, rotations), scale: segment(p, scales) };
}
/** One authored camera language across both rendering backends. */
export function cameraPose(p: number, source: boolean, mobile: boolean, pointer: [
    number,
    number
]) { const camera = segment(p, source ? [[6, 2.1, 13.5], [.2, .4, 5], [7, 2, 10], [1, 1.2, 8]] : [[6, 2, 13.5], [.2, .35, 4], [8, 3.2, 12], [9, 4, 16]]); const focus = segment(p, [[0, 0, 0], [4.7, .2, -5], [0, 0, 0], [0, 0, 0]]); const offset = mobile ? 0 : 2.3; camera[0] += offset + pointer[0] * .22; camera[1] += (mobile ? 1.2 : 0) - pointer[1] * .16; camera[2] += mobile ? 6 : 0; focus[0] -= mobile ? 0 : 2.4 - 1.4 * smooth((p - .4) / .6); focus[1] += mobile ? 1.5 : 0; if(cinemaState.content){const t=cinemaState.sectionProgress,turn=cinemaState.section%4;camera[0]+=Math.sin(t*Math.PI)*2.2*(turn%2?-1:1);camera[1]+=turn*.35;camera[2]+=3;focus[0]+=1.5;focus[1]-=.8;}return { camera, focus, offset }; }
