'use client';
import {useEffect,useRef,useState} from 'react';
import {asset} from '@/lib/site';
import {useSceneActivity} from '@/lib/effects';
import styles from './design-exhibit.module.css';

export function DesignExhibit(){
 const stage=useRef<HTMLDivElement>(null);const frame=useRef<HTMLIFrameElement>(null);const activity=useSceneActivity(stage);
 const [open,setOpen]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const launch=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(open&&loaded)frame.current?.contentWindow?.postMessage({type:'saksham-exhibit-activity',visible:activity.visible,reduced:!activity.allowed},location.origin)},[open,loaded,activity.visible,activity.allowed]);
 const close=()=>{setOpen(false);setLoaded(false);requestAnimationFrame(()=>launch.current?.focus())};
 return <section className={styles.exhibit} aria-labelledby="exhibit-title">
  <div className={styles.heading}><div><span className="eyebrow">THIRD-PARTY DESIGN STUDY · MIT</span><h2 id="exhibit-title">Working Volumes</h2><p>An interactive bookshelf by Meng To / ThreeUI. Explore its authored geometry, book inspection and page-turning interactions in a separately loaded scene.</p></div><span className={styles.credit}>Original concept & implementation<br/><strong>Meng To · ThreeUI</strong></span></div>
  <div className={styles.stage} ref={stage}>
   {open?<><div className={styles.toolbar}><span role="status">{loaded?'Interactive frame loaded. Graphics availability depends on your browser.':'Loading the self-hosted exhibit…'}</span><button type="button" onClick={close}>Close exhibit</button></div><iframe ref={frame} className={styles.frame} title="Working Volumes — credited ThreeUI interactive exhibit" src={`${asset('/exhibits/threeui/index.html')}?motion=${activity.allowed?'immersive':'reduced'}`} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" onLoad={()=>setLoaded(true)}/></>:<div className={styles.poster}><div className={styles.shelf} aria-hidden="true">{['I','II','III','IV','V','VI','VII'].map((n,i)=><span key={n} style={{height:`${134+(i%3)*17}px`}}>{n}</span>)}</div><h3>Seven volumes. One tactile scene.</h3><p>Load this optional WebGL study when you’re ready. The portfolio and project demonstrations remain available independently.</p></div>}
  </div>
  <div className={styles.actions}><button className="button primary" ref={launch} type="button" disabled={open} onClick={()=>setOpen(true)}>{open?'Exhibit is open':'Launch credited 3D exhibit'}</button><a className="button secondary" href={asset('/exhibits/threeui/original.html.txt')} download="threeui-complete-shelf-v2-original.html.txt">Download original source</a></div>
  <p className={styles.note}>Use the exhibit’s arrow controls to browse, Open to inspect a volume, and Open book to read sample pages. Escape returns a book to the shelf. Close exhibit removes its renderer. Reduced motion is respected; a static catalog appears if WebGL is unavailable.</p>
  <details className={styles.provenance}><summary>Authorship, adaptation & source integrity</summary><p>This is an independently authored third-party exhibit, not a Saksham project or a claim of original ownership. Product names inside the study are editorial references, not endorsements.</p><p>The canonical source is preserved byte for byte. The runnable adaptation replaces remote imports with local Three.js 0.165.0 files, uses a system font instead of Google Inter, adds a restrictive content policy, and bounds software-renderer quality with a host-controlled pause bridge. It is intentionally isolated from the portfolio’s Three.js version. Its iframe separates layout and lifecycle; it is not an untrusted-code security boundary.</p><p><a href="https://github.com/MengTo/threeui" target="_blank" rel="noopener noreferrer">ThreeUI repository</a> · <a href="https://www.npmjs.com/package/@designcodeio/threeui/v/1.2.0" target="_blank" rel="noopener noreferrer">Verified package 1.2.0</a> · <a href={asset('/exhibits/threeui/licenses/ThreeUI-MIT.txt')}>ThreeUI MIT license</a> · <a href={asset('/exhibits/threeui/licenses/Three-MIT.txt')}>Three.js MIT license</a> · <a href={asset('/exhibits/threeui/manifest.json')}>Checksums & adaptation manifest</a></p><p className={styles.hash}>Canonical SHA-256: 606f200fed8602c243f40a11c8c364f0e625c57f80e7c97dc76419da207f198e</p></details>
 </section>;
}
