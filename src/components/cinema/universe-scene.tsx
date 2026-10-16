'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { cinemaState, cameraPose, sheetPose, smooth } from './timeline';
import { lamellaData } from './geometry';
import { waterVertex, waterFragment, silverVertex, silverFragment } from './materials';
declare global {
    interface Window {
        __sakshamCinema?: {
            frames: number;
            frameMs: number[];
            calls: number;
            triangles: number;
            geometries: number;
            textures: number;
            quality: number;
        };
    }
}
function isSoftware(gl: THREE.WebGLRenderer) { const ctx = gl.getContext(); const debug = ctx.getExtension('WEBGL_debug_renderer_info'); return /swiftshader|llvmpipe|software/i.test(debug ? String(ctx.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : ''); }
function lamellaGeometry(economy: boolean) { const data = lamellaData(economy); const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3)); geometry.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3)); geometry.setAttribute('uv', new THREE.BufferAttribute(data.uvs, 2)); geometry.setIndex(new THREE.BufferAttribute(data.indices, 1)); return geometry; }
function Instrument({ variant }: {
    variant: 0 | 1 | 2;
}) {
    return <group position={[(variant - 1) * 4.6, -.1, 0]}>
 {variant === 0 ? <><mesh position={[0, -1.6, 0]}><boxGeometry args={[2.5, .1, 2.4]}/><meshStandardMaterial color="#577387" metalness={.9} roughness={.28}/></mesh>{[0, 1, 2].map(i => <mesh key={i} position={[.95 - i * .95, 0, 0]}><boxGeometry args={[.03, 3.1, 2]}/><meshStandardMaterial color="#b4c5cf" metalness={.8} roughness={.25}/></mesh>)}</> : variant === 1 ? <>{[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[(i - 2) * .4, -1 + (i % 3) * .3, .5]}><boxGeometry args={[.16, .8 + (i % 3) * .6, .3]}/><meshStandardMaterial color={i % 2 ? '#b8becd' : '#7095ac'} metalness={.8} roughness={.24}/></mesh>)}<mesh position={[0, -1.65, 0]}><boxGeometry args={[2.5, .06, 2.4]}/><meshStandardMaterial color="#718696" metalness={.9} roughness={.3}/></mesh></> : <group>{[[0, 1.15], [.55, .6], [-.55, .6], [.1, -.15], [.7, -.8], [-.5, -.8]].map(([x, y], i) => <mesh key={i} position={[x, y, .4]}><sphereGeometry args={[.11, 12, 12]}/><meshStandardMaterial color="#bae2e6" emissive="#295e70" emissiveIntensity={.6} metalness={.5} roughness={.2}/></mesh>)}{[[-.55, .6, 0, 1.15], [0, 1.15, .55, .6], [0, 1.15, .1, -.15], [.1, -.15, .7, -.8], [.1, -.15, -.5, -.8]].map(([x, y, x2, y2], i) => { const length = Math.hypot(x2 - x, y2 - y); return <mesh key={i} position={[(x + x2) / 2, (y + y2) / 2, .4]} rotation={[0, 0, -Math.atan2(x2 - x, y2 - y)]}><cylinderGeometry args={[.025, .025, length, 6]}/><meshStandardMaterial color="#b5c2cf" metalness={.7} roughness={.25}/></mesh>; })}</group>}
 </group>;
}
function StudioEnvironment() {
    const { gl } = useThree();
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    useEffect(() => {
        const studio = new THREE.Scene();
        studio.background = new THREE.Color('#334858');
        const resources: THREE.Mesh[] = [];
        for (const [x, y, z, w, h, v] of [[-4, 3, 1, 2, 7, 5], [4, 2, -2, 3, 5, 3], [0, 5, 0, 8, 2, 4], [0, 0, 6, 2, 6, 3]]) {
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(v) }));
            mesh.position.set(x, y, z);
            mesh.lookAt(0, 0, 0);
            resources.push(mesh);
            studio.add(mesh);
        }
        const pmrem = new THREE.PMREMGenerator(gl);
        const target = pmrem.fromScene(studio, .08, .1, 40);
        const id = requestAnimationFrame(() => setTexture(target.texture));
        return () => { cancelAnimationFrame(id); target.dispose(); pmrem.dispose(); resources.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }); };
    }, [gl]);
    return texture ? <primitive object={texture} attach="environment"/> : null;
}
function World({ compact, source: sourceMode, onReady, onFailure }: {
    compact: boolean;
    source: boolean;
    onReady: () => void;
    onFailure: () => void;
}) {
    const { gl, setDpr } = useThree();
    const software = useMemo(() => isSoftware(gl), [gl]);
    const sheets = useRef<THREE.InstancedMesh>(null), root = useRef<THREE.Group>(null), instruments = useRef<THREE.Group>(null), water = useRef<THREE.ShaderMaterial>(null), light = useRef<THREE.PointLight>(null);
    const count = compact || software ? 24 : 54;
    const geometry = useMemo(() => lamellaGeometry(compact || software), [compact, software]);
    const object = useRef(new THREE.Object3D());
    const diagnostics = useRef({ frames: 0, frameMs: [] as number[], calls: 0, triangles: 0, geometries: 0, textures: 0, quality: 1 });
    const lifts = useRef([0, 0, 0]);
    const pointer = useRef(new THREE.Vector2());
    const clock = useRef(0), progress = useRef(0), frame = useRef(0), slow = useRef(0);
    const target = useRef(new THREE.Vector3()), look = useRef(new THREE.Vector3());
    const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uProgress: { value: 0 } }), []);
    useEffect(() => {
        window.__sakshamCinema = diagnostics.current;
        const canvas = gl.domElement;
        const qualityFrame = requestAnimationFrame(() => {
            if (software) {
                setDpr(.65);
                cinemaState.quality = .65;
            }
        });
        const loss = (e: Event) => { e.preventDefault(); onFailure(); };
        canvas.addEventListener('webglcontextlost', loss);
        onReady();
        return () => { canvas.removeEventListener('webglcontextlost', loss); cancelAnimationFrame(qualityFrame); delete window.__sakshamCinema; geometry.dispose(); };
    }, [gl, onReady, onFailure, geometry, setDpr, software]);
    useFrame((state, delta) => {
        if (!cinemaState.active)
            return;
        const dt = Math.min(delta, .05);
        if (!cinemaState.paused)
            clock.current += dt;
        const t = clock.current;
        const blend = 1 - Math.exp(-dt * 8);
        progress.current = THREE.MathUtils.lerp(progress.current, cinemaState.progress, blend);
        const p = progress.current;
        const mobile = cinemaState.compact;
        const source = cinemaState.source;
        const { camera, focus, offset } = cameraPose(p, source, mobile, cinemaState.pointer);
        target.current.set(...camera);
        state.camera.position.lerp(target.current, blend);
        look.current.set(...focus);
        state.camera.lookAt(look.current);
        if (root.current) {
            root.current.position.set(offset, mobile ? -.5 : 0, 0);
            root.current.scale.setScalar(.82);
            root.current.rotation.y = Math.sin(t * .16) * .025;
        }
        for (let a = 0; a < 3; a++)
            lifts.current[a] = THREE.MathUtils.lerp(lifts.current[a], cinemaState.selection === a ? .35 : 0, blend);
        if (sheets.current) {
            for (let i = 0; i < count; i++) {
                const pose = sheetPose(i, count, p, source);
                object.current.position.set(...pose.position);
                object.current.rotation.set(...pose.rotation);
                object.current.scale.set(...pose.scale);
                if (!source && i % 3 !== 0)
                    object.current.scale.multiplyScalar(1 - smooth((p - .42) / .2) * .98);
                object.current.position.y += lifts.current[Math.floor(i / count * 3)] * smooth((p - .4) / .2);
                const drift = Math.sin(t * .35 + i * .16) * .025;
                object.current.position.y += drift;
                object.current.updateMatrix();
                sheets.current.setMatrixAt(i, object.current.matrix);
            }
            sheets.current.instanceMatrix.needsUpdate = true;
        }
        if (instruments.current) {
            const amount = smooth((p - .48) / .25);
            instruments.current.visible = amount > .001;
            instruments.current.scale.setScalar(Math.max(.001, amount));
            instruments.current.position.y = (1 - amount) * -2;
        }
        if (water.current) {
            water.current.uniforms.uTime.value = t;
            water.current.uniforms.uProgress.value = p;
            water.current.uniforms.uPointer.value.lerp(pointer.current.set(...cinemaState.pointer), .035);
        }
        if (light.current) {
            light.current.position.set(Math.sin(t * .18) * 3, 3, 2);
            light.current.intensity = 18 + Math.sin(t * .3) * 3;
        }
        const stats = diagnostics.current;
        stats.frames++;
        if (stats.frames > 30) {
            stats.frameMs.push(delta * 1000);
            if (stats.frameMs.length > 720)
                stats.frameMs.shift();
        }
        stats.calls = gl.info.render.calls;
        stats.triangles = gl.info.render.triangles;
        stats.geometries = gl.info.memory.geometries;
        stats.textures = gl.info.memory.textures;
        stats.quality = cinemaState.quality;
        frame.current++;
        if (frame.current > 20 && delta > .035)
            slow.current++;
        if (frame.current === 60 && slow.current > 15) {
            const quality = software ? .45 : .85;
            setDpr(quality);
            cinemaState.quality = quality;
        }
    });
    return <><color attach="background" args={['#080d13']}/><fog attach="fog" args={['#080d13', 16, 42]}/>{!software && <StudioEnvironment />}<ambientLight intensity={.8}/><directionalLight position={[-3, 8, 5]} intensity={3} color="#dceaf4"/><pointLight ref={light} position={[2, 4, 3]} intensity={22} color="#7ccef0" distance={25}/><pointLight position={[-6, 0, -4]} intensity={35} color="#3c668b" distance={20}/><group ref={root}><instancedMesh ref={sheets} args={[geometry, undefined, count]} frustumCulled={false}>{software ? <shaderMaterial vertexShader={silverVertex} fragmentShader={silverFragment} side={THREE.DoubleSide}/> : compact ? <meshStandardMaterial color="#b7c9d2" metalness={.8} envMapIntensity={1.4} roughness={.3} side={THREE.DoubleSide}/> : <meshPhysicalMaterial color="#b7c9d2" metalness={.88} envMapIntensity={1.5} roughness={.28} side={THREE.DoubleSide} clearcoat={.65} clearcoatRoughness={.2}/>}</instancedMesh><group ref={instruments}>{sourceMode ? <><group position={[4.6, 0, 0]}><Instrument variant={0}/></group>{[-1, 1].map(side => <mesh key={side} position={[side * 1.6, 0, .8]}><boxGeometry args={[.04, 4.1, .07]}/><meshStandardMaterial color="#d2e4ee" emissive="#5dacc9" emissiveIntensity={.6} metalness={.65} roughness={.22}/></mesh>)}{[-1, 1].map(side => <mesh key={side} position={[0, side * 2.05, .8]}><boxGeometry args={[3.2, .04, .07]}/><meshStandardMaterial color="#c2d8e8" emissive="#3f8aaa" emissiveIntensity={.5} metalness={.65} roughness={.22}/></mesh>)}</> : <><Instrument variant={0}/><Instrument variant={1}/><Instrument variant={2}/></>}</group><mesh position={[0, .15, -.3]} rotation={[.2, .5, .15]}><octahedronGeometry args={[.65, 0]}/>{software ? <meshBasicMaterial color="#9bc7d7" transparent opacity={.7}/> : <meshPhysicalMaterial color="#9bdded" metalness={.05} roughness={.12} transmission={compact ? 0 : .75} thickness={.7} ior={1.35} transparent opacity={.8} envMapIntensity={1.5}/>}</mesh></group><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}><planeGeometry args={[70, 70, 24, 24]}/><shaderMaterial ref={water} vertexShader={waterVertex} fragmentShader={waterFragment} uniforms={uniforms} side={THREE.DoubleSide}/></mesh></>;
}
export default function UniverseScene({ active, compact, source, onReady, onFailure }: {
    active: boolean;
    compact: boolean;
    source: boolean;
    onReady: () => void;
    onFailure: () => void;
}) {
    return <Canvas dpr={compact ? 1 : 1.5} frameloop={active ? 'always' : 'never'} camera={{ position: [8, 2, 11], fov: 42, near: .1, far: 100 }} gl={{ antialias: !compact, alpha: false, powerPreference: 'low-power' }} onCreated={({ gl, setDpr }) => {
            if (isSoftware(gl))
                setDpr(.65);
        }}><World source={source} compact={compact} onReady={onReady} onFailure={onFailure}/></Canvas>;
}
