'use client';
import dynamic from 'next/dynamic';
import {Component,type ReactNode,useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play,RotateCcw,Maximize2,Box} from 'lucide-react';
const WorldScene=dynamic(()=>import('./project-world-scene'),{ssr:false,loading:()=>null});
class WorldBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<p role="status" className="world-error">3D rendering is unavailable. The complete interactive walkthrough remains below.</p>:this.props.children}}

export function ProjectWorld({slug,name,steps,descriptions}:{slug:string;name:string;steps:string[];descriptions:string[]}){
 const [active,setActive]=useState(0);
 const [ready,setReady]=useState(false);
 const [capable,setCapable]=useState(false);
 const [playing,setPlaying]=useState(false);
 const [visible,setVisible]=useState(false);
 const [reduced,setReduced]=useState(false);
 const stageRef=useRef<HTMLDivElement>(null);
 const windowRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{setReduced(media.matches);if(media.matches)setPlaying(false)};
  media.addEventListener('change',update);
  let ok=false;try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');ok=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{ok=false}
  const scheduled=window.requestAnimationFrame(()=>{update();setCapable(ok)});
  return()=>{window.cancelAnimationFrame(scheduled);media.removeEventListener('change',update)};
 },[]);
 useEffect(()=>{
  if(!stageRef.current)return;
  const observer=new IntersectionObserver(([entry])=>{const onscreen=entry.isIntersecting;setVisible(onscreen);if(onscreen)setReady(true)},{rootMargin:'130px',threshold:0});
  observer.observe(stageRef.current);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{if(!playing||!visible||reduced||steps.length<2)return;const timer=window.setInterval(()=>setActive(i=>(i+1)%steps.length),4900);return()=>window.clearInterval(timer)},[playing,visible,reduced,steps.length]);
 const jump=(n:number)=>{setActive((n+steps.length)%steps.length);setPlaying(false)};
 return <section className={`project-world world-${slug}`} aria-label={`${name} interactive architecture visualization`}>
  <div className="world-intro"><div><span className="mono">INTERACTIVE ENGINEERING VISUALIZATION / 3D</span><h3>Explore the system in motion.</h3><p>Follow how each stage contributes to the real documented implementation. Select a node or a numbered step to investigate.</p></div><div className="world-legend"><Box size={16}/> Unique procedural model · no hosted inference</div></div>
  <div className="world-viewport" ref={stageRef}>
   <div className="world-hud world-hud-top"><span className="mono">SYSTEM / {slug.toUpperCase().replaceAll('-','_')}</span><span className="mono">STAGE {String(active+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}</span></div>
   <div className="world-sky" aria-hidden="true"/>
   {ready&&capable&&!reduced?<WorldBoundary><div className="world-canvas"><WorldScene slug={slug} stageCount={steps.length} active={active} onSelect={jump} playing={playing} visible={visible}/></div></WorldBoundary>:<div className="world-css-fallback" aria-hidden="true"><i/><i/><i/><span>3D / ENGINEERING</span></div>}
   <div className="world-hud world-hud-bottom"><span>ROTATE WITH POINTER · SELECT GLOWING NODES</span><span>{reduced?'STATIC MODE':capable?'WEBGL RENDERING':'ACCESSIBLE FALLBACK'}</span></div>
  </div>
  <div className="world-console">
   <div className="world-stage-list" role="group" aria-label="Explore architecture stages">{steps.map((s,i)=><button type="button" key={i} onClick={()=>jump(i)} aria-pressed={active===i} aria-label={`Stage ${i+1}: ${s}`}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong></button>)}</div>
   <div className="world-readout" aria-live="polite" aria-atomic="true"><span className="eyebrow">INSIDE THE SYSTEM · {String(active+1).padStart(2,'0')}</span><h3>{steps[active]}</h3><p>{descriptions[active]||'This stage connects documented inputs with the next processing step.'}</p><div className="world-actions"><button aria-label="Previous stage" type="button" onClick={()=>jump(active-1)}><ArrowLeft size={17}/></button><button aria-label="Next stage" type="button" onClick={()=>jump(active+1)}><ArrowRight size={17}/></button><button type="button" disabled={reduced} onClick={()=>setPlaying(v=>!v)}>{playing?<><Pause size={15}/> Pause tour</>:<><Play size={15}/> Auto tour</>}</button><button aria-label="Reset walkthrough" type="button" onClick={()=>{jump(0);setPlaying(false)}}><RotateCcw size={15}/></button><button aria-label="Toggle visualization fullscreen" type="button" onClick={()=>{const e=windowRef.current||stageRef.current;if(!e)return;if(document.fullscreenElement)void document.exitFullscreen();else void e.requestFullscreen?.().catch(()=>{})}}><Maximize2 size={15}/></button></div></div>
  </div>
  <p className="world-disclosure">Conceptual visualization of source-backed architecture, not a running model or a claim that individual 3D objects exist inside the original system. All stages remain readable without WebGL.</p>
 </section>;
}
