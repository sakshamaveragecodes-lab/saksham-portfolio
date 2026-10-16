'use client';
import dynamic from 'next/dynamic';
import {Component,useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {useEffectsAllowed} from '@/lib/effects';
import {cinemaState,smooth} from './timeline';
import './cinema.css';
const UniverseScene=dynamic(()=>import('./universe-scene'),{ssr:false});
class Boundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}componentDidCatch(){this.props.onFailure()}render(){return this.state.failed?null:this.props.children}}
export function EngineeringUniverse(){
 const path=usePathname().replace(/\/$/,'')||'/';const eligible=path==='/'||path==='/projects/sourcelens';const allowed=useEffectsAllowed();const[failed,setFailed]=useState(false);const[ready,setReady]=useState(false);const[active,setActive]=useState(true);const[compact,setCompact]=useState(false);const surface=useRef<HTMLDivElement>(null);
 const failure=useCallback(()=>{setFailed(true);setReady(false)},[]);const created=useCallback(()=>setReady(true),[]);
 useEffect(()=>{
  const root=document.documentElement;const running=eligible&&allowed&&ready&&!failed;
  if(!running){delete root.dataset.cinemaReady;cinemaState.active=false;return}
  root.dataset.cinemaReady='true';const story=document.querySelector<HTMLElement>('[data-cinematic-story]');if(!story)return;
  const chapters=Array.from(story.querySelectorAll<HTMLElement>('[data-cinema-chapter]'));cinemaState.source=story.dataset.cinematicStory==='source';let raf=0;
  const update=()=>{const rect=story.getBoundingClientRect(),height=innerHeight;const progress=Math.max(0,Math.min(1,-(rect.top-(innerWidth<=850?72:87))/Math.max(1,rect.height-height)));cinemaState.progress=progress;const visible=rect.top<height&&rect.bottom>height*.25&&document.visibilityState!=='hidden';cinemaState.active=visible;setActive(visible);
   const device=navigator as Navigator&{deviceMemory?:number};cinemaState.compact=innerWidth<=850||(device.deviceMemory??8)<=4;setCompact(cinemaState.compact);
   if(surface.current)surface.current.style.opacity=visible?String(Math.min(1,Math.max(0,(rect.bottom-height*.15)/(height*.6)))):'0';
   for(let i=0;i<chapters.length;i++){const d=progress*3-i;const opacity=1-smooth((Math.abs(d)-.22)/.52);const c=chapters[i];c.style.setProperty('--chapter-opacity',String(opacity));c.style.translate=`${-d*24}px ${-d*13}px`;c.dataset.current=String(Math.round(progress*3)===i);c.inert=Math.round(progress*3)!==i}
  };
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(update)};
  const pointer=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;cinemaState.pointer=[(e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2]};
  const resize=new ResizeObserver(schedule);resize.observe(story);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);window.addEventListener('pointermove',pointer,{passive:true});update();
  return()=>{delete root.dataset.cinemaReady;window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);window.removeEventListener('pointermove',pointer);resize.disconnect();cancelAnimationFrame(raf);for(const c of chapters){c.inert=false;c.style.removeProperty('--chapter-opacity');c.style.removeProperty('translate');delete c.dataset.current}cinemaState.active=false};
 },[eligible,allowed,ready,failed,path]);
 if(!eligible||!allowed||failed)return null;
 return <div className="cinema-surface" ref={surface} data-cinema-renderer data-active={active} aria-hidden="true"><Boundary onFailure={failure}><UniverseScene source={path==='/projects/sourcelens'} active={active} compact={compact} onReady={created} onFailure={failure}/></Boundary></div>
}
