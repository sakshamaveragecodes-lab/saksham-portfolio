'use client';
import Link from 'next/link';
import {useState,useEffect} from 'react';
import {cinemaState} from './timeline';
import {worlds,type WorldKey} from './worlds';
import {useEffectsAllowed} from '@/lib/effects';
const slugs=['sourcelens','careerlens','form','studybuddy','pymentor','airbnb','logistic-diabetes','random-forest-diabetes'];
const names=['SourceLens','CareerLens','FORM','StudyBuddy','PyMentor','Airbnb','Logistic','Random Forest'];
export function SpatialIndex(){return <nav className="spatial-index" aria-label="Spatial project index">{slugs.map((s,i)=><Link key={s} href={`/projects/${s}/`} onPointerEnter={()=>{cinemaState.selection=i;}} onPointerLeave={()=>{cinemaState.selection=-1;}} onFocus={()=>{cinemaState.selection=i;}} onBlur={()=>{cinemaState.selection=-1;}}><span>0{i+1}</span>{names[i]} ↗</Link>)}</nav>;}
export function WorldControls({world}:{world:WorldKey}){
 const allowed=useEffectsAllowed(),[separated,setSeparated]=useState(false);
 useEffect(()=>{cinemaState.spread=0;},[world]);
 const chapter=(i:number)=>{const el=document.querySelector<HTMLElement>('[data-cinematic-story]');if(!el)return;const top=el.getBoundingClientRect().top+scrollY,header=innerWidth<=850?72:87;window.scrollTo({top:top-header+(el.offsetHeight-innerHeight)*i/3,behavior:'auto'});};
 return <div className="world-controls" aria-label={`${worlds[world].name} scene controls`}><div className="world-chapter-controls" role="group" aria-label="Travel to a chapter">{worlds[world].chapters.map((c,i)=><button key={c.label} type="button" disabled={!allowed} onClick={()=>chapter(i)} aria-label={`Travel to ${c.label}`}>0{i+1}</button>)}</div><button className="world-separate" disabled={!allowed} type="button" aria-pressed={separated} onClick={()=>{setSeparated(!separated);cinemaState.spread=separated?0:1;}}>{separated?'Restore composition':worlds[world].interaction} <span aria-hidden="true">{separated?'−':'+'}</span></button></div>;
}
