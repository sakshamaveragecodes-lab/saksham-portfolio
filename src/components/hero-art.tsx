'use client';
import dynamic from 'next/dynamic';
import {Component,type ReactNode,useEffect,useRef,useState} from 'react';
import {useSceneActivity} from '@/lib/effects';
const Scene=dynamic(()=>import('./scene'),{ssr:false,loading:()=>null});
class GraphicsBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<span className="sr-only">Graphics unavailable. Decorative structure shown instead.</span>:this.props.children}}
export function HeroArt(){
 const art=useRef<HTMLDivElement>(null);const activity=useSceneActivity(art);const[enabled,setEnabled]=useState(true);const[capable,setCapable]=useState(false);const[desktop,setDesktop]=useState(false);const[lost,setLost]=useState(false);
 useEffect(()=>{let ok=false;try{const context=document.createElement('canvas').getContext('webgl2');ok=!!context;context?.getExtension('WEBGL_lose_context')?.loseContext()}catch{/* Use the semantic fallback when the browser denies access. */}const media=matchMedia('(min-width: 850px)');const update=()=>setDesktop(media.matches);const id=requestAnimationFrame(()=>{setCapable(ok);update()});media.addEventListener('change',update);return()=>{cancelAnimationFrame(id);media.removeEventListener('change',update)}},[]);
 const active=capable&&desktop&&activity.allowed&&enabled&&!lost;
 return <div className="hero-art" ref={art} data-rendering={active&&activity.visible?'active':'paused'}><div className="art-grid"/><div className="orb-fallback" aria-hidden="true"><div/><div/><div/><span>∴</span></div>{active&&activity.ready&&<div className="canvas-wrap"><GraphicsBoundary><Scene visible={activity.visible} compact={activity.compact} onContextLost={()=>setLost(true)}/></GraphicsBoundary></div>}<div className="art-coordinate mono">SYS.01 / NEURAL TOPOLOGY</div><div className="art-status mono"><i/> {active?'REALTIME GEOMETRY':'COMPUTATIONAL STRUCTURE'}</div><div className="art-scale mono">PROCEDURAL / CONNECTED / RESPONSIVE</div>{capable&&desktop&&activity.allowed&&!lost&&<button className="art-toggle" onClick={()=>setEnabled(!enabled)}>{enabled?'Pause 3D':'Enable 3D'}</button>}<span className="art-note mono">CONNECTED BY DESIGN</span></div>
}
