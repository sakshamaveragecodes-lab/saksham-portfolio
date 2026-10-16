import Link from 'next/link';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {worlds,type WorldKey} from './worlds';
import {WorldControls,SpatialIndex} from './world-controls';
import {CinemaControls} from './controls';
import './cinema.css';
export function WorldStory({world}:{world:WorldKey}){
 const def=worlds[world],project=!['projects','about','skills','experience','certifications','resume','contact'].includes(world);
 return <section className={`cinema-story cinema-world cinema-${world}`} data-cinematic-story={world} aria-label={`${def.name} spatial introduction`}>
  <noscript><style>{`.cinema-story{height:auto!important}.cinema-sticky{position:relative!important;top:auto!important;height:auto!important;display:block!important}.cinema-chapter{position:relative!important;top:auto!important;transform:none!important;opacity:1!important;pointer-events:auto!important;padding:40px 0!important}.cinema-chapter-rail,.cinema-foot button,.world-controls{display:none!important}.cinema-ambient{display:block!important}`}</style></noscript>
  <div className="cinema-sticky"><div className="cinema-ambient" aria-hidden="true"><span/><span/><span/></div>
   <div className="cinema-topline"><span>{def.name.toUpperCase()} / {def.environment}</span><span>SAKSHAM / ENGINEERING OBSERVATORY</span></div>
   <div className="cinema-chapters">{def.chapters.map((c,i)=><article className={`cinema-chapter chapter-${i}`} data-cinema-chapter={i} key={c.label}><div className="cinema-label">{c.label}</div><h2>{c.title}<br/><em>{c.accent}</em></h2><p>{c.copy}</p>{i===3&&<a className="cinema-link" href="#page-content">{project?'Explore the actual project':world==='projects'?'Search the full laboratory':`Explore ${def.name.toLowerCase()}`} <ArrowDown size={18}/></a>}{i===3&&project&&<Link className="world-app-link" href={`/projects/${world}/experience/`}>Explore Full App <ArrowUpRight size={15}/></Link>}</article>)}</div>
   {world==='projects'&&<SpatialIndex/>}
   <WorldControls key={world} world={world}/>
   <div className="cinema-foot"><span className="cinema-disclosure">ORIGINAL CONCEPTUAL SCULPTURE · NOT MODEL OUTPUT</span><div><CinemaControls/><a href="#page-content">Skip introduction ↓</a></div></div>
   <div className="cinema-chapter-rail" aria-hidden="true"><span>01</span><i/><span>04</span></div>
  </div>
 </section>;
}
