'use client';
import Link from 'next/link';
import {asset} from '@/lib/site';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
import {ArrowUpRight, Menu, X, Github} from 'lucide-react';
import {github} from '@/lib/projects';
import {EffectsControl} from './effects-control';
const links=[['/projects','Project lab'],['/about','About'],['/skills','Expertise'],['/experience','Journey'],['/resume','Resume']];
export function Navigation(){const path=usePathname();const[open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[open]);
 return <header className="header"><div className="nav-shell"><Link href="/" className="brand" onClick={()=>setOpen(false)} aria-label="Saksham engineering portfolio home"><span className="brand-mark" aria-hidden="true">s<span>.</span></span><span>SAKSHAM<span className="brand-sub">ENGINEERING PORTFOLIO</span></span></Link><nav aria-label="Main navigation" id="mobile-menu" className={open?'nav-links is-open':'nav-links'}>{links.map(([href,label])=><Link key={href} href={href} aria-current={path.startsWith(href)?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="nav-contact" href="/contact" onClick={()=>setOpen(false)}>Let’s connect <ArrowUpRight size={15}/></Link></nav><button className="icon-button menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div><noscript><nav className="no-script-nav" aria-label="Navigation without JavaScript">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}<Link href="/contact">Contact</Link></nav></noscript></header>
}
export function Footer(){return <footer className="footer"><div className="footer-top"><Link href="/" className="footer-name">Saksham Jadhav<span>Building with curiosity. Engineering with evidence.</span></Link><a href={github} target="_blank" rel="noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={15}/></a></div><div className="footer-controls"><EffectsControl/><Link className="text-button" href="/design-exhibit">Third-party interaction study <ArrowUpRight size={14}/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Saksham Pradeep Jadhav</span><div><Link href="/certifications">Credentials</Link><Link href="/privacy">Privacy</Link><a href={asset("/project-evidence.json")}>Source registry</a></div><span className="mono">DESIGNED TO BE EXPLORED ↗</span></div></footer>}
