'use client';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef,useState} from 'react';
import {CONNECTIONS,syntheticPose} from '@/lib/pose';
import * as THREE from 'three';

type Slug='sourcelens'|'careerlens'|'form'|'studybuddy'|'pymentor'|'airbnb'|'logistic-diabetes'|'random-forest-diabetes';
type Point=[number,number,number];
function posePoint(p:{x:number;y:number;z?:number}):Point{return [(p.x-.5)*4,(.5-p.y)*4,(p.z??0)*4]}

const themes:Record<Slug,string>={
 sourcelens:'#81bcff',careerlens:'#c8a5ff',form:'#8be6be',
 studybuddy:'#f2c68e',pymentor:'#72e3e6',airbnb:'#ffbf8a',
 'logistic-diabetes':'#f0a8ba','random-forest-diabetes':'#a8d69b'
};
function coords(kind:Slug,index:number,count:number):Point{
 const t=index/Math.max(1,count-1),a=index/Math.max(1,count)*Math.PI*2;
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
 useEffect(()=>{if(outer.current)outer.current.scale.setScalar(active?1.2:.86)},[active]);
 const radius=kind==='careerlens'?.27:kind==='form'?.2:.24;
 return <group ref={outer} position={p} onClick={e=>{e.stopPropagation();onSelect(index)}}><mesh><icosahedronGeometry args={[radius,kind==='form'?0:1]}/><meshStandardMaterial color={active?'#ecf6ff':color} emissive={color} emissiveIntensity={active?1.15:.35} metalness={.48} roughness={.27}/></mesh><mesh rotation={[Math.PI/3,0,Math.PI/7]}><torusGeometry args={[radius*1.75,.009,4,42]}/><meshBasicMaterial color={color} transparent opacity={active?.95:.3}/></mesh>{active&&<pointLight color={color} intensity={1.1} distance={2.4}/>}</group>;
}
function Atmosphere({color}:{color:string}){
 const points=useMemo(()=>{const arr:number[]=[];for(let i=0;i<90;i++){const u=(i*0.61803398875)%1,v=(i*.754877666)%1,w=(i*.56984029)%1;arr.push((u-.5)*11,(v-.5)*6,(w-.5)*4)}return new Float32Array(arr)},[]);
 return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color={color} size={.019} sizeAttenuation transparent opacity={.55}/></points>;
}
function Figure({color,animate}:{color:string;animate:boolean}){
 const geometry=useRef<THREE.BufferGeometry>(null);
 const elapsed=useRef(0);
 // Use the same source-adapted replay as the functioning FORM demo. Cache samples;
 // no landmark allocation or inference occurs in the render loop.
 const frames=useMemo(()=>Array.from({length:61},(_,i)=>{
  const pose=syntheticPose('squat',i/15);
  return new Float32Array(CONNECTIONS.flatMap(([a,b])=>[...posePoint(pose[a]),...posePoint(pose[b])]));
 }),[]);
 const initial=useMemo(()=>frames[0].slice(),[frames]);
 useFrame((_,delta)=>{if(!animate||!geometry.current)return;elapsed.current=(elapsed.current+Math.min(delta,.06))%4;const frame=elapsed.current*15,index=Math.floor(frame),fraction=frame-index;const attr=geometry.current.attributes.position as THREE.BufferAttribute;const a=frames[index],b=frames[index+1];for(let i=0;i<a.length;i++)attr.array[i]=a[i]+(b[i]-a[i])*fraction;attr.needsUpdate=true});
 return <group><lineSegments><bufferGeometry ref={geometry}><bufferAttribute attach="attributes-position" args={[initial,3]}/></bufferGeometry><lineBasicMaterial color={color}/></lineSegments><mesh position={[-.28,1.5,0]}><sphereGeometry args={[.19,12,10]}/><meshBasicMaterial color={color} wireframe/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.65,0]}><ringGeometry args={[.8,1,40]}/><meshBasicMaterial color={color} opacity={.15} transparent side={THREE.DoubleSide}/></mesh></group>;
}
function Forest({color}:{color:string}){
 const lines=useMemo(()=>{const a:number[]=[];for(let i=0;i<5;i++){const x=-2+i, z=-1.1+(i%2)*.55;const branch=(x:number,y:number,z:number,d:number,depth:number)=>{if(depth===0)return;const next:[number,number,number]=[x+d,y+.57,z+d*.36];a.push(x,y,z,...next);branch(...next,d*.63,depth-1);const other:[number,number,number]=[x-d,y+.55,z-d*.25];a.push(x,y,z,...other);branch(...other,-d*.58,depth-1)};branch(x,-1.65,z,.4,4)}return new Float32Array(a)},[]);
 return <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[lines,3]}/></bufferGeometry><lineBasicMaterial color={color} opacity={.3} transparent/></lineSegments>;
}
function DataSurface({kind,color,animate}:{kind:Slug;color:string;animate:boolean}){
 if(kind==='form')return <Figure color={color} animate={animate}/>;
 if(kind==='random-forest-diabetes')return <Forest color={color}/>;
 if(kind==='airbnb')return <group rotation={[0,0,-.08]}>{Array.from({length:28},(_,i)=>{const x=((i*17)%29)/29*4-2;const z=((i*11)%31)/31*2-1;return <mesh key={i} position={[x,.45*x+.25*z+Math.sin(i*2.1)*.38,z]}><sphereGeometry args={[.036,7,7]}/><meshBasicMaterial color={color} transparent opacity={.8}/></mesh>})}<mesh rotation={[-Math.PI/2,.2,0]} position={[0,0,-.6]}><planeGeometry args={[5.4,2.7]}/><meshBasicMaterial color={color} transparent opacity={.05} side={THREE.DoubleSide}/></mesh></group>;
 if(kind==='logistic-diabetes')return <group>{Array.from({length:34},(_,i)=>{const x=(i/33-.5)*5,y=1.9/(1+Math.exp(-1.7*x))-.95;return <mesh key={i} position={[x,y,-.8]}><sphereGeometry args={[.041,7,7]}/><meshBasicMaterial color={color} transparent opacity={.75}/></mesh>})}</group>;
 if(kind==='sourcelens')return <group>{Array.from({length:9},(_,i)=><mesh key={i} position={[-2.6+(i%3)*.23,-.45+Math.floor(i/3)*.36,-.6]} rotation={[0,.25,-.1]}><boxGeometry args={[.42,.55,.035]}/><meshStandardMaterial color={color} transparent opacity={.16+i*.035} metalness={.5} roughness={.5}/></mesh>)}{Array.from({length:35},(_,i)=><mesh key={`v${i}`} position={[.6+Math.sin(i*2.4)*.8,Math.cos(i*1.7)*.7,-.6+Math.sin(i*3)*.6]}><sphereGeometry args={[i%7===0?.075:.026,6,6]}/><meshBasicMaterial color={color} opacity={i%7===0?.85:.32} transparent/></mesh>)}</group>;
 if(kind==='careerlens')return <group position={[0,0,-.65]}>{Array.from({length:13},(_,i)=><mesh key={i} position={[(i-6)*.29,-.8+((i*7)%11)/14,0]}><boxGeometry args={[.14,.3+((i*7)%11)/7,.08]}/><meshStandardMaterial color={color} transparent opacity={.25+(i%3)*.15}/></mesh>)}{[0,1,2].map(i=><mesh key={`rail${i}`} position={[0,-.7+i*.65,-.3]}><boxGeometry args={[4.3,.012,.015]}/><meshBasicMaterial color={color} opacity={.25} transparent/></mesh>)}</group>;
 if(kind==='studybuddy')return <group>{Array.from({length:6},(_,i)=><mesh key={i} position={[(i%2?1:-1)*1.3,(i%3-1)*.62,-.8]}><boxGeometry args={[.82,.35,.08]}/><meshStandardMaterial color={color} transparent opacity={.2+i*.045}/></mesh>)}<mesh rotation={[.55,.45,.2]}><octahedronGeometry args={[.65,0]}/><meshStandardMaterial color={color} wireframe/></mesh></group>;
 return <group>{[0,1,2].map(i=><group key={i} position={[0,(i-1)*1.03,-.8]}><mesh><boxGeometry args={[2,.55,.35]}/><meshStandardMaterial color={color} transparent opacity={.12+i*.05}/></mesh>{Array.from({length:6},(_,j)=><mesh key={j} position={[(j-2.5)*.23,0,.2]}><boxGeometry args={[.12,.02,.02]}/><meshBasicMaterial color={color}/></mesh>)}</group>)}</group>;
}
function Flow({positions,color,animate,compact}:{positions:Point[];color:string;animate:boolean;compact:boolean}){
 const geometry=useRef<THREE.BufferGeometry>(null),time=useRef(0);
 const count=compact?18:42;
 const array=useMemo(()=>new Float32Array(count*3),[count]);
 useFrame((_,delta)=>{if(!animate||!geometry.current||positions.length<2)return;time.current+=Math.min(delta,.06)*.3;const a=geometry.current.attributes.position as THREE.BufferAttribute;for(let i=0;i<count;i++){const progress=(i/count*(positions.length-1)+time.current)%(positions.length-1),index=Math.floor(progress),t=progress-index;const from=positions[index],to=positions[index+1];for(let axis=0;axis<3;axis++)a.array[i*3+axis]=from[axis]+(to[axis]-from[axis])*t;}a.needsUpdate=true});
 return <points><bufferGeometry ref={geometry}><bufferAttribute attach="attributes-position" args={[array,3]}/></bufferGeometry><pointsMaterial color={color} size={.05} transparent opacity={.85}/></points>;
}

type SceneProps={slug:string;stageCount:number;active:number;onSelect:(i:number)=>void;playing:boolean;visible?:boolean;animate?:boolean;compact?:boolean};
function WorldContent({slug,stageCount,active,onSelect,playing,animate=false,compact=false}:SceneProps){
 const kind=(slug in themes?slug:'sourcelens') as Slug,color=themes[kind];
 const positions=useMemo(()=>Array.from({length:stageCount},(_,i)=>coords(kind,i,stageCount)),[kind,stageCount]);
 const group=useRef<THREE.Group>(null),phase=useRef(0);
 const {camera,invalidate}=useThree();
 // Selection remains available during pause; an explicit change requests one frame.
 useEffect(()=>{camera.position.set(positions[active]?.[0]*.09||0,positions[active]?.[1]*.06||0,compact?10.3:8.7);camera.lookAt(0,0,0);invalidate()},[active,camera,positions,invalidate,compact]);
 useFrame(({pointer},delta)=>{if(!animate||!group.current)return;phase.current+=Math.min(delta,.06);group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,pointer.x*.12+Math.sin(phase.current*.13)*.07,Math.min(1,delta*1.5));group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,pointer.y*.055,Math.min(1,delta*1.5));});
 return <><color attach="background" args={['#090f1a']}/><fog attach="fog" args={['#090f1a',7.2,16]}/><ambientLight intensity={.8}/><directionalLight position={[4,4,5]} intensity={1.65} color={color}/><group ref={group}>{!compact&&<Atmosphere color={color}/>}<DataSurface kind={kind} color={color} animate={animate}/><LinkLines positions={positions} color={color}/><Flow positions={positions} color={color} animate={animate} compact={compact}/>{positions.map((p,i)=><Node key={i} p={p} index={i} active={i===active} color={color} kind={kind} onSelect={onSelect}/>)}</group>{playing&&<pointLight position={[0,0,3]} color={color} intensity={.7} distance={10}/>}</>;
}
export default function ProjectWorldScene(props:SceneProps){
 const [lost,setLost]=useState(false);
 const host=useRef<HTMLDivElement>(null);
 if(lost)return <p role="status" className="world-error">3D rendering stopped safely. Use the stage controls below to continue the complete walkthrough.</p>;
 return <div ref={host} data-scene-quality={props.compact?'economy':'standard'} data-scene-loop={props.visible===false?'never':props.animate?'always':'demand'} style={{height:'100%'}}><Canvas dpr={props.compact?1:[1,1.35]} frameloop={props.visible===false?'never':props.animate?'always':'demand'} camera={{position:[0,0,8.7],fov:48}} gl={{antialias:!props.compact,alpha:false,powerPreference:'low-power'}} onCreated={({gl})=>{const canvas=gl.domElement;canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();setLost(true)},{once:true})}} aria-label="Interactive three-dimensional data flow"><WorldContent {...props}/></Canvas></div>
}
