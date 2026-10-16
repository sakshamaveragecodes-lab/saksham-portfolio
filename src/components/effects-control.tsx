'use client';
import {useEffect,useState} from 'react';
import {Orbit,Feather} from 'lucide-react';
import {setEffectsPreference,useEffectsAllowed} from '@/lib/effects';
export function EffectsControl(){const allowed=useEffectsAllowed();const[systemReduced,setSystemReduced]=useState(false);useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setSystemReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);return <div className="effects-control"><button type="button" aria-pressed={!allowed} onClick={()=>setEffectsPreference(allowed)} disabled={systemReduced}>{allowed?<Orbit size={15}/>:<Feather size={15}/>} {systemReduced?'System reduced motion':allowed?'Reduce effects':'Enable immersive effects'}</button><span>Visual preference only · saved on this device</span></div>}
