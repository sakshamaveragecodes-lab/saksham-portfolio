'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useEffectsAllowed} from '@/lib/effects';

/** Progressive enhancement only: core content is always visible without JavaScript. */
export function SiteMotion(){
 const path=usePathname();const allowed=useEffectsAllowed();
 useEffect(()=>{
  const root=document.documentElement;
  const route=path.startsWith('/projects/')?'project':path==='/projects'?'laboratory':path.split('/')[1]||'home';
  document.body.dataset.route=route;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const hover=window.matchMedia('(hover: hover) and (pointer: fine)');
  const elements=Array.from(document.querySelectorAll<HTMLElement>('main .page-heading, main .section-heading, main .project-card, main .info-card, main .skill-panel, main .case-section, main .identity-panel, main .source-note, main .principles > div, main .interest-grid > *, main .credential-card, main .education-card, main .program-panel, main .resume-preview, main .timeline article'));
  const observed=new Set<HTMLElement>();
  let observer:IntersectionObserver|undefined;
  if(allowed&&!reduced.matches&&typeof IntersectionObserver!=='undefined'){
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries){if(!entry.isIntersecting)continue;const el=entry.target as HTMLElement;observer?.unobserve(el);observed.delete(el);el.animate([{transform:'translate3d(0,20px,0)'},{transform:'translate3d(0,0,0)'}],{duration:680,easing:'cubic-bezier(.2,.7,.25,1)',fill:'none'});}
   },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
   for(const el of elements){if(el.getBoundingClientRect().top>window.innerHeight*.82){observer.observe(el);observed.add(el)}}
  }
  let raf=0;let tilted:HTMLElement|null=null;
  const point=(e:PointerEvent)=>{if(!allowed||!hover.matches||reduced.matches)return;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{root.style.setProperty('--pointer-x',e.clientX+'px');root.style.setProperty('--pointer-y',e.clientY+'px');const card=e.target instanceof Element?e.target.closest<HTMLElement>('.project-image,.credential-card,.info-card,.contact-card,.identity-panel'):null;if(tilted&&tilted!==card){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y')}tilted=card;if(card){const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-3}deg`);card.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*4}deg`)}})};
  const scroll=()=>{const d=document.documentElement;const max=Math.max(1,d.scrollHeight-d.clientHeight);root.style.setProperty('--scroll-progress',String(Math.max(0,Math.min(1,d.scrollTop/max))))};
  document.addEventListener('pointermove',point,{passive:true});
  window.addEventListener('scroll',scroll,{passive:true});scroll();
  return()=>{observer?.disconnect();observed.clear();if(tilted){tilted.style.removeProperty('--tilt-x');tilted.style.removeProperty('--tilt-y')}document.removeEventListener('pointermove',point);window.removeEventListener('scroll',scroll);cancelAnimationFrame(raf);root.style.removeProperty('--scroll-progress');root.style.removeProperty('--pointer-x');root.style.removeProperty('--pointer-y');delete document.body.dataset.route};
 },[path,allowed]);
 return <div className="reading-progress" aria-hidden="true"/>;
}
