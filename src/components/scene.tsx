'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import * as THREE from 'three';
function Structure(){
 const group=useRef<THREE.Group>(null);
 const {positions,lines}=useMemo(()=>{const pts:number[]=[];const links:number[]=[];const count=190;const points:THREE.Vector3[]=[];
 for(let i=0;i<count;i++){const t=i/count;const phi=Math.acos(1-2*t);const theta=i*Math.PI*(3-Math.sqrt(5));const r=1.75+0.17*Math.sin(i*1.7);const p=new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi)*1.05,r*Math.sin(phi)*Math.sin(theta));points.push(p);pts.push(...p.toArray())}
 for(let i=0;i<count;i++)for(let j=i+1;j<count;j++)if(points[i].distanceTo(points[j])<0.62){links.push(...points[i].toArray(),...points[j].toArray())}
 return {positions:new Float32Array(pts),lines:new Float32Array(links)}},[]);
 useFrame((state,delta)=>{if(!group.current)return;group.current.rotation.y+=Math.min(delta,0.05)*0.09;group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,state.pointer.y*0.15,0.03);group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,state.pointer.x*0.1-0.2,0.03)});
 return <group ref={group}><lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[lines,3]}/></bufferGeometry><lineBasicMaterial color="#638bd0" transparent opacity={0.42}/></lineSegments><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#c7dcff" size={0.035} sizeAttenuation/></points><mesh rotation={[Math.PI/3,0.3,0]}><torusGeometry args={[2.15,0.007,6,180]}/><meshBasicMaterial color="#4174c5" transparent opacity={0.6}/></mesh><mesh rotation={[0.4,Math.PI/3,0.1]}><torusGeometry args={[2.35,0.004,6,180]}/><meshBasicMaterial color="#7186a8" transparent opacity={0.35}/></mesh><mesh><icosahedronGeometry args={[0.67,1]}/><meshBasicMaterial color="#7c9ed8" wireframe transparent opacity={0.45}/></mesh></group>
}
export default function Scene(){return <Canvas dpr={[1,1.5]} camera={{position:[0,0,6.6],fov:44}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} aria-hidden="true"><Structure/></Canvas>}
