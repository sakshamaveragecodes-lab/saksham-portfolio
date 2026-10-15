'use client';
import dynamic from 'next/dynamic';
import {Component, type ReactNode,useEffect,useState} from 'react';
const Scene=dynamic(()=>import('./scene'),{ssr:false,loading:()=>null});
class GraphicsBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?null:this.props.children}}
export function HeroArt(){const[active,setActive]=useState(false);const[capable,setCapable]=useState(false);
 useEffect(()=>{const canvas=document.createElement('canvas');let ok=false;try{const context=canvas.getContext('webgl2');ok=!!context;context?.getExtension('WEBGL_lose_context')?.loseContext()}catch{ok=false}const media=matchMedia('(min-width: 850px) and (prefers-reduced-motion: no-preference)');const update=()=>{setCapable(ok&&media.matches);setActive(ok&&media.matches)};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 return <div className="hero-art"><div className="art-grid"/><div className="orb-fallback" aria-hidden="true"><div/><div/><div/><span>∴</span></div>{active&&<div className="canvas-wrap"><GraphicsBoundary><Scene/></GraphicsBoundary></div>}<div className="art-coordinate mono">SYS.01 / NEURAL TOPOLOGY</div><div className="art-status mono"><i/> {active?'REALTIME GEOMETRY':'COMPUTATIONAL STRUCTURE'}</div><div className="art-scale mono">X 0.47&nbsp; Y 0.82&nbsp; Z 0.31</div>{capable&&<button className="art-toggle" onClick={()=>setActive(!active)}>{active?'Pause 3D':'Enable 3D'}</button>}<span className="art-note mono">CONNECTED BY DESIGN</span></div>
}
