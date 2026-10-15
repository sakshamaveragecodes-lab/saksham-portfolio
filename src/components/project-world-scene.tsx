'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import * as THREE from 'three';

type Slug='sourcelens'|'careerlens'|'form'|'studybuddy'|'pymentor'|'airbnb'|'logistic-diabetes'|'random-forest-diabetes';
type Point=[number,number,number];

const themes:Record<Slug,string>={
 sourcelens:'#81bcff',careerlens:'#c8a5ff',form:'#8be6be',
 studybuddy:'#f2c68e',pymentor:'#72e3e6',airbnb:'#ffbf8a',
 'logistic-diabetes':'#f0a8ba','random-forest-diabetes':'#a8d69b'
};
function coords(kind:Slug,index:number,count:number):Point{
 const t=index/Math.max(1,count-1),a=t*Math.PI*2;
 if(kind==='sourcelens')return [(t-.5)*5.8,Math.sin(t*Math.PI*3)*.58,Math.cos(t*Math.PI*3)*.48];
 if(kind==='careerlens')return [Math.cos(a)*2.7,Math.sin(a)*1.42,Math.sin(a*2)*.5];
 if(kind==='form')return [(t-.5)*5.35,(index%2?-.72:.7),Math.sin(a)*.45];
 if(kind==='studybuddy')return [Math.cos(a)*2.5,Math.sin(a)*1.15,Math.cos(a*2)*.78];
 if(kind==='pymentor')return [Math.sin(index*Math.PI*.85)*.65,(count-1)/2*0.8-index*.8,Math.cos(index*.9)*.36];
 if(kind==='airbnb')return [(t-.5)*5.4,Math.sin(a)*.5,Math.cos(a)*.7];
 if(kind==='logistic-diabetes')return [(t-.5)*5.4,1.8/(1+Math.exp(-10*(t-.5)))-.9,Math.sin(a)*.45];
 return [Math.cos(a)*2.45,Math.sin(a)*1.1,((index%3)-1)*.72];
}
function LinkLines({positions,color}:{positions:Point[];color:string}){
 const line=useMemo(()=>{const a:number[]=[];for(let i=1;i<positions.length;i++){a.push(...positions[i-1],...positions[i]);}return new Float32Array(a)},[positions]);
 return <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[line,3]}/></bufferGeometry><lineBasicMaterial color={color} transparent opacity={.43}/></lineSegments>;
}
function Node({p,index,active,color,kind,onSelect}:{p:Point;index:number;active:boolean;color:string;kind:Slug;onSelect:(i:number)=>void}){
 const outer=useRef<THREE.Group>(null);
 useFrame(({clock},delta)=>{if(!outer.current)return;const scale=active?1.2:0.86;outer.current.scale.lerp(new THREE.Vector3(scale,scale,scale),Math.min(1,delta*7));outer.current.rotation.y+=Math.min(delta,.05)*(active?.55:.13);outer.current.position.y=p[1]+Math.sin(clock.elapsedTime*.63+index)*.055});
 const radius=kind==='careerlens'?.27:kind==='form'?.2:.24;
 return <group ref={outer} position={p} onClick={e=>{e.stopPropagation();onSelect(index)}}><mesh><icosahedronGeometry args={[radius,kind==='form'?0:1]}/><meshStandardMaterial color={active?'#ecf6ff':color} emissive={color} emissiveIntensity={active?1.15:.35} metalness={.48} roughness={.27}/></mesh><mesh rotation={[Math.PI/3,0,Math.PI/7]}><torusGeometry args={[radius*1.75,.009,4,42]}/><meshBasicMaterial color={color} transparent opacity={active?.95:.3}/></mesh>{active&&<pointLight color={color} intensity={1.1} distance={2.4}/>}</group>;
}
function Atmosphere({color}:{color:string}){
 const points=useMemo(()=>{const arr:number[]=[];for(let i=0;i<90;i++){const u=(i*0.61803398875)%1,v=(i*.754877666)%1,w=(i*.56984029)%1;arr.push((u-.5)*11,(v-.5)*6,(w-.5)*4)}return new Float32Array(arr)},[]);
 return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color={color} size={.019} sizeAttenuation transparent opacity={.55}/></points>;
}
function Figure({color}:{color:string}){
 const bones:[Point,Point][]=[
 [[0,1.25,0],[0,.6,0]],[[0,.6,0],[0,-.45,0]],
 [[0,.95,0],[-.63,.5,0]],[[-.63,.5,0],[-.83,-.08,.15]],
 [[0,.95,0],[.63,.5,0]],[[.63,.5,0],[.83,-.08,-.15]],
 [[0,-.45,0],[-.46,-1.15,.16]],[[-.46,-1.15,.16],[-.56,-1.73,.4]],
 [[0,-.45,0],[.46,-1.15,-.16]],[[.46,-1.15,-.16],[.55,-1.73,-.4]]
 ];
 const line=useMemo(()=>new Float32Array(bones.flatMap(([a,b])=>[...a,...b])),[]);
 return <group scale={.86}><lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[line,3]}/></bufferGeometry><lineBasicMaterial color={color} transparent opacity={.42}/></lineSegments><mesh position={[0,1.55,0]}><sphereGeometry args={[.22,14,12]}/><meshBasicMaterial color={color} wireframe transparent opacity={.55}/></mesh>{bones.slice(0,7).map(([a],i)=><mesh key={i} position={a}><sphereGeometry args={[.06,9,9]}/><meshBasicMaterial color="#d2fff0"/></mesh>)}</group>;
}
function Forest({color}:{color:string}){
 const lines=useMemo(()=>{const a:number[]=[];for(let i=0;i<5;i++){const x=-2+i, z=-1.1+(i%2)*.55;const branch=(x:number,y:number,z:number,d:number,depth:number)=>{if(depth===0)return;const next:[number,number,number]=[x+d,y+.57,z+d*.36];a.push(x,y,z,...next);branch(...next,d*.63,depth-1);const other:[number,number,number]=[x-d,y+.55,z-d*.25];a.push(x,y,z,...other);branch(...other,-d*.58,depth-1)};branch(x,-1.65,z,.4,4)}return new Float32Array(a)},[]);
 return <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[lines,3]}/></bufferGeometry><lineBasicMaterial color={color} opacity={.3} transparent/></lineSegments>;
}
function DataSurface({kind,color}:{kind:Slug;color:string}){
 if(kind==='form')return <Figure color={color}/>;
 if(kind==='random-forest-diabetes')return <Forest color={color}/>;
 if(kind==='airbnb')return <group rotation={[0,0,-.08]}>{Array.from({length:28},(_,i)=>{const x=((i*17)%29)/29*4-2;const z=((i*11)%31)/31*2-1;return <mesh key={i} position={[x,.45*x+.25*z+Math.sin(i*2.1)*.38,z]}><sphereGeometry args={[.036,7,7]}/><meshBasicMaterial color={color} transparent opacity={.8}/></mesh>})}<mesh rotation={[-Math.PI/2,.2,0]} position={[0,0,-.6]}><planeGeometry args={[5.4,2.7]}/><meshBasicMaterial color={color} transparent opacity={.05} side={THREE.DoubleSide}/></mesh></group>;
 if(kind==='logistic-diabetes')return <group>{Array.from({length:34},(_,i)=>{const x=(i/33-.5)*5,y=1.9/(1+Math.exp(-1.7*x))-.95;return <mesh key={i} position={[x,y,-.8]}><sphereGeometry args={[.041,7,7]}/><meshBasicMaterial color={color} transparent opacity={.75}/></mesh>})}</group>;
 if(kind==='sourcelens')return <group rotation={[.5,.18,0]}>{[1.1,1.7,2.3].map((r,i)=><mesh key={i} rotation={[Math.PI/2.7,i*.6,0]}><torusGeometry args={[r,.008,3,100]}/><meshBasicMaterial color={color} transparent opacity={.2-i*.04}/></mesh>)}</group>;
 if(kind==='careerlens')return <group>{[1.55,2.2].map((r,i)=><mesh rotation={[.55,0,i*.6]} key={i}><torusGeometry args={[r,.009,3,110]}/><meshBasicMaterial color={color} opacity={.15} transparent/></mesh>)}</group>;
 if(kind==='studybuddy')return <group>{[1.25,1.9].map((r,i)=><mesh key={i} rotation={[.65+i*.4,.4+i*.3,0]}><torusGeometry args={[r,.014,4,90]}/><meshBasicMaterial color={color} transparent opacity={.25}/></mesh>)}</group>;
 return <group>{[0,1,2].map(i=><mesh key={i} position={[0,(i-1)*1.03,-.8]} rotation={[Math.PI/2,0,.2]}><torusGeometry args={[1.1,.01,5,90]}/><meshBasicMaterial color={color} opacity={.22} transparent/></mesh>)}</group>;
}
function WorldContent({slug,stageCount,active,onSelect,playing}:{slug:string;stageCount:number;active:number;onSelect:(i:number)=>void;playing:boolean}){
 const kind=(slug in themes?slug:'sourcelens') as Slug;
 const color=themes[kind];
 const positions=useMemo(()=>Array.from({length:stageCount},(_,i)=>coords(kind,i,stageCount)),[kind,stageCount]);
 const group=useRef<THREE.Group>(null);
 useFrame(({pointer},delta)=>{if(!group.current)return;group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,pointer.x*.12+Math.sin(performance.now()*.00013)*.07,Math.min(1,delta*1.5));group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,pointer.y*.055,Math.min(1,delta*1.5));});
 return <><color attach="background" args={['#090f1a']}/><fog attach="fog" args={['#090f1a',7.2,13]}/><ambientLight intensity={.8}/><directionalLight position={[4,4,5]} intensity={1.65} color={color}/><group ref={group}><Atmosphere color={color}/><DataSurface kind={kind} color={color}/><LinkLines positions={positions} color={color}/>{positions.map((p,i)=><Node key={i} p={p} index={i} active={i===active} color={color} kind={kind} onSelect={onSelect}/>)}</group>{playing&&<pointLight position={[0,0,3]} color={color} intensity={.7} distance={10}/>}</>;
}

export default function ProjectWorldScene(props:{slug:string;stageCount:number;active:number;onSelect:(i:number)=>void;playing:boolean;visible?:boolean}){return <Canvas dpr={[1,1.35]} frameloop={props.visible===false?'never':'always'} camera={{position:[0,0,8.7],fov:48}} gl={{antialias:true,alpha:false,powerPreference:'low-power'}} aria-label="Interactive three-dimensional data flow"><WorldContent {...props}/></Canvas>}
