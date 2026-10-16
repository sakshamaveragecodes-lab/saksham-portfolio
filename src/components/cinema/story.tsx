import Link from 'next/link';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { CinemaControls, CinematicProjectLinks } from './controls';
import './cinema.css';
const home = [
    { label: '01 / POTENTIAL', title: <>Intelligence,<br /><em>engineered.</em></>, copy: <>I’m <strong>Saksham Jadhav.</strong> A BCA student exploring how intelligent systems become useful software—through retrieval, language, vision, and careful engineering.</> },
    { label: '02 / STRUCTURE', title: <>A signal.<br />A structure.<br /><em>A possibility.</em></>, copy: <>Retrieval. Language. Vision. Software. Different ways to turn information into something you can understand, inspect, and use.</> },
    { label: '03 / SYSTEMS', title: <>Beyond a model.<br /><em>Into a system.</em></>, copy: <>Documents become retrievable evidence. Skills become explainable scores. Movement becomes geometric signals. Three problems. Three distinct engineering systems.</> },
    { label: '04 / THE LABORATORY', title: <>Enter the work.<br /><em>Follow the evidence.</em></>, copy: <>Explore the original applications, source-backed workflows and honest demonstrations. The most interesting details are inside.</> }
];
const source = [
    { label: 'SOURCELENS / THE EVIDENCE ARCHIVE', title: <>A question.<br /><em>A way through.</em></>, copy: <>A domain-specific RAG application. Enter the path from PDF pages to retrieved context and evidence-constrained answers.</> },
    { label: '01 / INGEST & EXTRACT', title: <>The document<br /><em>opens up.</em></>, copy: <>PDF text is extracted and divided into chunks. Physical page references connect the source material with the evidence used downstream.</> },
    { label: '02 / RETRIEVE', title: <>Find the context.<br /><em>Keep the source.</em></>, copy: <>Sentence Transformer embeddings and FAISS support similarity retrieval. This spatial archive is conceptual—not actual embedding coordinates.</> },
    { label: '03 / GROUND', title: <>An answer needs<br /><em>somewhere to stand.</em></>, copy: <>Retrieved evidence constrains the response. Inspect citations, recorded synthetic cases, and the insufficient-evidence boundary in the original demonstration below.</> }
];
export function CinematicStory({ kind = 'home' }: {
    kind?: 'home' | 'source';
}) {
    const isSource = kind === 'source';
    return <section className={`cinema-story cinema-${kind}`} data-cinematic-story={kind} aria-label={isSource ? 'SourceLens spatial introduction' : 'Intelligence as an explorable world'}>
 <noscript><style>{`.cinema-story{height:auto!important}.cinema-sticky{position:relative!important;top:auto!important;height:auto!important;display:block!important}.cinema-chapter{position:relative!important;top:auto!important;transform:none!important;opacity:1!important;pointer-events:auto!important;padding:40px 0!important}.cinema-chapter-rail,.cinema-foot button{display:none!important}.cinema-ambient{display:block!important}`}</style></noscript><div className="cinema-sticky"><div className="cinema-ambient" aria-hidden="true"><span /><span /><span /></div>
 <div className="cinema-topline"><span>SAKSHAM / ENGINEERING OBSERVATORY</span><span>AN EXPLORABLE WORLD — VOL. 01</span></div>
 <div className="cinema-chapters">{(isSource ? source : home).map((chapter, i) => <article className={`cinema-chapter chapter-${i}`} data-cinema-chapter={i} key={chapter.label}><div className="cinema-label">{chapter.label}</div>{!isSource && i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}<p>{chapter.copy}</p>{i === 0 && !isSource && <Link href="/projects" className="cinema-link">Explore the project lab <ArrowUpRight size={18}/></Link>}{i === 2 && !isSource && <CinematicProjectLinks />}{i === 3 && <a href={isSource ? '#preview' : '#selected-work'} className="cinema-link">{isSource ? 'Explore the actual application' : 'Explore the selected projects'} <ArrowDown size={18}/></a>}</article>)}</div>
 <div className="cinema-foot"><span className="cinema-disclosure">CONCEPTUAL SPATIAL STUDY · ORIGINAL PROCEDURAL GEOMETRY</span><div><CinemaControls /><a href={isSource ? '#source-content' : '#selected-work'}>Skip introduction ↓</a></div></div>
 <div className="cinema-chapter-rail" aria-hidden="true"><span>01</span><i /><span>04</span></div>
 </div></section>;
}
