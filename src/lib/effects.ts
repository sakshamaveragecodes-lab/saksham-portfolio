'use client';
import {useEffect,useState,type RefObject} from 'react';
export const effectsKey='saksham-effects';
export const effectsEvent='saksham:effects';
let transientReduced=false;
export function setEffectsPreference(reduced:boolean){transientReduced=reduced;try{localStorage.setItem(effectsKey,reduced?'reduced':'immersive')}catch{/* Preferences also work without persistent storage. */}window.dispatchEvent(new Event(effectsEvent))}
export function useEffectsAllowed(){
 const[allowed,setAllowed]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{let reduced=transientReduced;try{reduced=localStorage.getItem(effectsKey)==='reduced'}catch{/* Use the semantic fallback when the browser denies access. */}const value=!media.matches&&!reduced;setAllowed(value);document.documentElement.dataset.effects=value?'immersive':'reduced'};update();media.addEventListener('change',update);window.addEventListener(effectsEvent,update);window.addEventListener('storage',update);return()=>{media.removeEventListener('change',update);window.removeEventListener(effectsEvent,update);window.removeEventListener('storage',update)}},[]);
 return allowed;
}
export function useSceneActivity(ref:RefObject<HTMLElement|null>,key:unknown=false){
 const allowed=useEffectsAllowed();const[visible,setVisible]=useState(false);const[ready,setReady]=useState(false);const[shown,setShown]=useState(true);const[compact,setCompact]=useState(true);
 useEffect(()=>{const element=ref.current;if(!element)return;const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);if(entry.isIntersecting)setReady(true)},{threshold:0,rootMargin:'0px'});observer.observe(element);const visibility=()=>setShown(document.visibilityState!=='hidden');const media=matchMedia('(max-width: 850px)');const quality=()=>{const device=navigator as Navigator&{deviceMemory?:number};setCompact(media.matches||(device.deviceMemory!==undefined&&device.deviceMemory<=4)||(navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=4))};visibility();quality();document.addEventListener('visibilitychange',visibility);media.addEventListener('change',quality);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',quality)}},[ref,key]);
 return {allowed,visible:visible&&shown,ready,compact};
}
