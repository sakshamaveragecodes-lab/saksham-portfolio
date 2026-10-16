'use client';
import {useState,useRef,useLayoutEffect} from 'react';
import {flushSync} from 'react-dom';
import {useEffectsAllowed} from '@/lib/effects';
import {Search,SlidersHorizontal,Box,LayoutGrid} from 'lucide-react';
import {projects} from '@/lib/projects';
import {ProjectCard} from './project-card';
type Filters={query:string;category:string;tech:string;depth:boolean};
const initialFilters:Filters={query:'',category:'All work',tech:'All technologies',depth:false};
const categories=['All work',...new Set(projects.map(p=>p.category))];
export function Explorer(){const[query,setQuery]=useState('');const[category,setCategory]=useState('All work');const[tech,setTech]=useState('All technologies');const[depth,setDepth]=useState(false);
 const allowed=useEffectsAllowed(),grid=useRef<HTMLDivElement>(null),previous=useRef(new Map<string,DOMRect>()),intent=useRef<Filters>(initialFilters);
 const[visible,setVisible]=useState<Filters>(initialFilters);
 const change=(patch:Partial<Filters>)=>{const next={...intent.current,...patch};intent.current=next;
  // Form values are urgent. Snapshot callbacks may be cancelled or arrive out of order.
  setQuery(next.query);setCategory(next.category);setTech(next.tech);setDepth(next.depth);
  previous.current=new Map(Array.from(grid.current?.querySelectorAll<HTMLElement>('[data-project]')||[]).map(e=>[e.dataset.project!,e.getBoundingClientRect()]));
  const commit=()=>{if(intent.current===next)flushSync(()=>setVisible(next))};
  if(allowed&&'startViewTransition' in document){const transition=document.startViewTransition(commit);void transition.ready.catch(error=>{if(!(error instanceof DOMException&&error.name==='AbortError'))console.error('Project layout transition failed',error)});}else setVisible(next);
 };
 useLayoutEffect(()=>{if(!allowed||'startViewTransition' in document)return;grid.current?.querySelectorAll<HTMLElement>('[data-project]').forEach(el=>{const old=previous.current.get(el.dataset.project!),rect=el.getBoundingClientRect();el.animate(old?[{translate:`${old.x-rect.x}px ${old.y-rect.y}px`},{translate:'0 0'}]:[{transform:'perspective(900px) rotateY(-8deg) scale(.97)'},{transform:'none'}],{duration:350,easing:'cubic-bezier(.2,.8,.3,1)'});});},[visible,allowed]);
 const filtered=projects.filter(p=>(visible.category==='All work'||p.category===visible.category)&&(visible.tech==='All technologies'||p.stack.includes(visible.tech))&&`${p.name} ${p.description} ${p.stack.join(' ')}`.toLowerCase().includes(visible.query.toLowerCase()));
 return <><div className="lab-toolbar"><label className="search"><Search size={18}/><span className="sr-only">Search projects</span><input value={query} onChange={e=>{const value=e.target.value;change({query:value})}} placeholder="Search ideas, projects, technologies…"/></label><label className="tech-select"><SlidersHorizontal size={16}/><span className="sr-only">Filter by technology</span><select value={tech} onChange={e=>{const value=e.target.value;change({tech:value})}}><option>All technologies</option>{[...new Set(projects.flatMap(p=>p.stack))].sort().map(s=><option key={s}>{s}</option>)}</select></label><button className="view-toggle" aria-pressed={depth} onClick={()=>change({depth:!intent.current.depth})}>{depth?<LayoutGrid size={18}/>:<Box size={18}/>} {depth?'Grid view':'Depth view'}</button></div><div className="filter-row" role="group" aria-label="Project categories">{categories.map(c=><button aria-pressed={category===c} className={category===c?'selected':''} key={c} onClick={()=>change({category:c})}>{c}</button>)}<span className="mono" aria-live="polite">{filtered.length} PROJECTS</span></div><div ref={grid} aria-busy={query!==visible.query||category!==visible.category||tech!==visible.tech||depth!==visible.depth} className={`projects-grid ${visible.depth?'depth-view':''}`}>{filtered.map((p,i)=><ProjectCard project={p} key={p.slug} index={i}/>)}</div>{!filtered.length&&<div className="empty-state"><h2>No matching projects.</h2><p>Try another technology or a broader search.</p><button className="button" onClick={()=>change({query:'',category:'All work',tech:'All technologies'})}>Reset filters</button></div>}</>
}
