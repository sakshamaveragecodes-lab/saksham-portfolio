'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useEffectsAllowed} from '@/lib/effects';
import {contentSections,sectionFrame,sectionKind} from './cinema/reading';
/** Reversible scroll choreography. No essential content depends on an entrance completing. */
export function SiteMotion(){const path=usePathname(),allowed=useEffectsAllowed();
 useEffect(()=>{
  const root=document.documentElement;document.body.dataset.route=path.startsWith('/projects/')?'project':path.split('/')[1]||'home';
  if(!allowed)return()=>{delete document.body.dataset.route};
  const hover=matchMedia('(hover:hover) and (pointer:fine)');let raf=0,pointRaf=0,measure=true,tilted:HTMLElement|null=null;
  let sections:{el:HTMLElement;top:number;height:number;kind:string}[]=[],cards:{el:HTMLElement;top:number;height:number;index:number}[]=[];
  const update=()=>{raf=0;const y=scrollY,h=innerHeight;
   if(measure){sections=contentSections().map(el=>{const r=el.getBoundingClientRect();return{el,top:r.top+y,height:r.height,kind:sectionKind(el)}});cards=Array.from(document.querySelectorAll<HTMLElement>('.project-card')).map((el,index)=>{const r=el.getBoundingClientRect();return{el,top:r.top+y,height:r.height,index}});measure=false;}
   for(const {el,top,height,kind} of sections){const f=sectionFrame({top:top-y,height},h);el.dataset.spatialSection=kind;if(f.visible){el.style.setProperty('--section-phase',String(f.phase));el.style.setProperty('--arrival',String(f.arrival));el.dataset.inView='true'}else el.dataset.inView='false';}
   for(const {el,top,height,index} of cards){const f=sectionFrame({top:top-y+Math.min(index%3,2)*28,height},h);el.style.setProperty('--card-arrival',String(f.arrival));el.style.setProperty('--card-phase',String(f.phase));}
   root.style.setProperty('--scroll-progress',String(Math.max(0,Math.min(1,y/Math.max(1,root.scrollHeight-h)))));
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)},resize=()=>{measure=true;schedule()};
  const ro=new ResizeObserver(resize);ro.observe(document.querySelector('main')!);ro.observe(document.body);
  const pointer=(e:PointerEvent)=>{if(!hover.matches||e.pointerType!=='mouse')return;cancelAnimationFrame(pointRaf);pointRaf=requestAnimationFrame(()=>{const card=e.target instanceof Element?e.target.closest<HTMLElement>('.project-card,.credential-card,.info-card,.contact-card,.identity-panel'):null;if(tilted&&tilted!==card){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');tilted.style.removeProperty('--light-x');tilted.style.removeProperty('--light-y')}tilted=card;if(card){const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-5}deg`);card.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*7}deg`);card.style.setProperty('--light-x',`${(e.clientX-r.left)/r.width*100}%`);card.style.setProperty('--light-y',`${(e.clientY-r.top)/r.height*100}%`)}})};
  const exit=()=>{if(tilted){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y');tilted=null}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',exit);root.dataset.sectionMotion='true';update();
  return()=>{ro.disconnect();cancelAnimationFrame(raf);cancelAnimationFrame(pointRaf);exit();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',exit);delete root.dataset.sectionMotion;delete document.body.dataset.route;root.style.removeProperty('--scroll-progress');for(const {el}of sections){delete el.dataset.spatialSection;delete el.dataset.inView;el.style.removeProperty('--section-phase');el.style.removeProperty('--arrival')}for(const {el}of cards){el.style.removeProperty('--card-arrival');el.style.removeProperty('--card-phase')}};
 },[path,allowed]);return <div className="reading-progress" aria-hidden="true"/>;
}
