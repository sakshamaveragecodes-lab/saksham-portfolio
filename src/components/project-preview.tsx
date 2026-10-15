'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight,ChevronLeft,ChevronRight,Expand,Monitor,Smartphone,X,ImageOff} from 'lucide-react';
import type {Project} from '@/lib/projects';
import {sourceFile} from '@/lib/projects';
import type {ProjectDetails} from '@/lib/project-details';
import {asset} from '@/lib/site';

function PreviewImage({src,width,height,alt}:{src:string;width:number;height:number;alt:string}){
 const imageRef=useRef<HTMLImageElement>(null);
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 useEffect(()=>{const img=imageRef.current;if(img?.complete)setState(img.naturalWidth?'ready':'error')},[]);
 return <div className={`preview-image is-${state}`} aria-busy={state==='loading'}>{state==='loading'&&<span className="preview-loading" role="status">Loading source capture…</span>}{state==='error'?<div className="preview-unavailable"><ImageOff size={25}/><p>Capture could not load.</p><a href={asset(src)} target="_blank" rel="noreferrer">Open image directly</a></div>:<img ref={imageRef} src={asset(src)} width={width} height={height} alt={alt} loading="lazy" decoding="async" onLoad={()=>setState('ready')} onError={()=>setState('error')}/>}</div>;
}
export function ProjectPreview({project:p,details:d}:{project:Project;details:ProjectDetails}){
 const [detail,setDetail]=useState(false);const [selected,setSelected]=useState(0);const [narrow,setNarrow]=useState(false);const [expanded,setExpanded]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);const expandButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!expanded)return;const el=dialog.current;if(!el)return;const opener=expandButton.current;el.showModal();el.querySelector<HTMLButtonElement>('button')?.focus();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=overflow;opener?.focus()}},[expanded]);
 const slide=d.slides[selected];const mobileCapture=narrow&&d.narrow;const image=mobileCapture?d.narrow:slide.image;
 const source=mobileCapture?d.narrowSource:slide.source;
 const frame=(fullscreen=false)=><div className={`preview-window ${narrow?'preview-narrow':''} ${detail?'preview-detail':''}`}>
  <div className="preview-browser"><span className="preview-dots" aria-hidden="true"><i/><i/><i/></span><span className="mono">{p.name} <span>/ {image?'SOURCE CAPTURE':'GUIDED VIEW'}</span></span>{fullscreen?<button aria-label="Close expanded preview" onClick={()=>setExpanded(false)}><X size={18}/></button>:<button ref={expandButton} aria-label="Expand application preview" aria-haspopup="dialog" onClick={()=>setExpanded(true)}><Expand size={17}/></button>}</div>
  <div className="preview-tools"><div role="group" aria-label="Preview viewport"><button aria-pressed={!narrow} onClick={()=>setNarrow(false)}><Monitor size={15}/>Desktop</button><button aria-pressed={narrow} onClick={()=>setNarrow(true)}><Smartphone size={15}/>Narrow</button>{image&&<button aria-pressed={detail} onClick={()=>setDetail(!detail)}>Full-size image</button>}</div><span>{mobileCapture?'Actual mobile capture':narrow?'Same artifact · narrow viewing frame':slide.kind}</span></div>
  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable image regions need focus for keyboard panning. */}
  <div className="preview-stage"><div className="preview-viewport" tabIndex={0} role="region" aria-label="Scrollable source preview">{image?<PreviewImage key={image} src={image} width={mobileCapture?d.narrowWidth||390:slide.width||1440} height={mobileCapture?d.narrowHeight||900:slide.height||1000} alt={mobileCapture?`Actual ${p.name} mobile application capture`:`${p.name}: ${slide.title} — ${slide.kind.toLowerCase()}`}/>:<div className="preview-terminal"><span className="mono">{slide.kind} / NO EXECUTION</span><pre>{slide.code}</pre><span className="preview-terminal-cursor" aria-hidden="true">▍</span></div>}</div></div>
  <div className="preview-caption" aria-live="polite"><span className="preview-index mono">{String(selected+1).padStart(2,'0')} / {String(d.slides.length).padStart(2,'0')}</span><div><h3>{mobileCapture?'Original mobile interface':slide.title}</h3><p>{mobileCapture?'A real mobile screenshot from the same source snapshot. Return to Desktop to inspect the selected workflow stage.':slide.note}</p>{source&&<a href={sourceFile(p,source)} target="_blank" rel="noreferrer">Inspect source artifact <ArrowUpRight size={13}/></a>}</div></div>
  <div className="preview-controls"><button aria-label="Previous preview stage" onClick={()=>{setSelected((selected+d.slides.length-1)%d.slides.length);setNarrow(false)}}><ChevronLeft size={17}/></button><div role="group" aria-label="Preview stages">{d.slides.map((s,i)=><button key={s.title} aria-label={`Preview stage ${i+1}: ${s.title}`} aria-pressed={selected===i} onClick={()=>{setSelected(i);setNarrow(false)}}>{String(i+1).padStart(2,'0')}<span>{s.title}</span></button>)}</div><button aria-label="Next preview stage" onClick={()=>{setSelected((selected+1)%d.slides.length);setNarrow(false)}}><ChevronRight size={17}/></button></div>
 </div>;
 return <div className="project-preview"><p className="preview-disclosure"><span className="mono">SOURCE-GROUNDED PREVIEW</span> Original captures and labelled guided views. This frame does not host the original application.</p>{frame()}<div className="preview-next"><p>{d.demo}</p><a className="text-button" href="#demo">Try the demonstration <ArrowRight size={16}/></a></div>{expanded&&<dialog ref={dialog} className="preview-dialog" aria-label={`${p.name} expanded application preview`} onCancel={()=>setExpanded(false)}>{frame(true)}</dialog>}</div>;
}
