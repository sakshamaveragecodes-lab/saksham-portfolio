'use client';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffectsAllowed } from '@/lib/effects';
import { cinemaState, smooth } from './timeline';
import './cinema.css';
import {contentSections,sectionKind,sectionFrame,readingComposition} from './reading';
import {worldForPath} from './worlds';
const ProductionRenderer = dynamic(() => import('./production/renderer'), {ssr:false});
class Boundary extends Component<{
    children: ReactNode;
    onFailure: () => void;
}, {
    failed: boolean;
}> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    componentDidCatch() { this.props.onFailure(); }
    render() { return this.state.failed ? null : this.props.children; }
}
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export function EngineeringUniverse() {
    const path = usePathname().replace(/\/$/, '') || '/';
    const world = worldForPath(path);
    const eligible = path === '/' || path === '/projects/sourcelens' || world !== null;
    const allowed = useEffectsAllowed();
    const hydrated=useSyncExternalStore(subscribeHydration,clientSnapshot,serverSnapshot);
    const canvas=useRef<HTMLCanvasElement>(null);
    const [failed, setFailed] = useState(false);
    const [ready, setReady] = useState(false);
    const [active, setActive] = useState(true);

    const surface = useRef<HTMLDivElement>(null);
    const failure = useCallback(() => { setFailed(true); setReady(false); }, []);
    const created = useCallback((value=true) => setReady(value), []);
    useEffect(() => {
        const root = document.documentElement;
        const running = eligible && allowed && ready && !failed;
        if (failed)
            root.dataset.cinemaFailed = 'true';
        else
            delete root.dataset.cinemaFailed;
        if (!running) {
            delete root.dataset.cinemaReady;
            cinemaState.active = false;
            return;
        }
        root.dataset.cinemaReady = 'true';
        const story = document.querySelector<HTMLElement>('[data-cinematic-story]');
        if (!story)
            return;
        let content=contentSections().map(el=>({el,top:0,height:0})),dirty=true;
        const rail = story.querySelector('.cinema-chapter-rail span');
        const chapters = Array.from(story.querySelectorAll<HTMLElement>('[data-cinema-chapter]'));
        cinemaState.source = story.dataset.cinematicStory === 'source';
        cinemaState.selection = -1;
        cinemaState.spread = 0;
        let raf = 0;
        const present=(progress:number)=>{
            story.querySelectorAll<HTMLButtonElement>('.world-chapter-controls button').forEach((button,i)=>button.setAttribute('aria-pressed',String(Math.round(progress*3)===i)));
            if (rail){const label=String(Math.round(progress*3)+1).padStart(2,'0');if(rail.textContent!==label)rail.textContent=label;}
            for (let i = 0; i < chapters.length; i++) {
                const d = progress * 3 - i;
                const opacity = 1 - smooth((Math.abs(d) - .18) / .32);
                const c = chapters[i];
                c.style.setProperty('--chapter-opacity', String(opacity));
                if(progress!==0)c.style.translate=`${-d*24}px ${-d*13}px`;else c.style.removeProperty('translate');
                c.dataset.current = String(Math.round(progress * 3) === i);
                c.inert = Math.round(progress * 3) !== i || opacity < .05;
            }
        };
        cinemaState.present=present;
        const update = () => {
            const rect = story.getBoundingClientRect(), height = innerHeight;
            const progress = Math.max(0, Math.min(1, -(rect.top - (innerWidth <= 850 ? 72 : 87)) / Math.max(1, rect.height - height)));
            if(dirty){content=contentSections().map(el=>{const r=el.getBoundingClientRect();return {el,top:r.top+scrollY,height:r.height}});dirty=false;}
            const reading=rect.bottom<height*.7;
            let current=content[0],nearest=Infinity;
            content.forEach(section=>{const d=Math.abs(section.top-scrollY-height*.28);if(d<nearest){current=section;nearest=d}});
            cinemaState.content=reading;
            cinemaState.section=Math.max(0,content.indexOf(current));
            cinemaState.sectionProgress=current?sectionFrame({top:current.top-scrollY,height:current.height},height).phase:0;
            cinemaState.sectionKind=current?sectionKind(current.el):'overview';
            const composition=readingComposition(cinemaState.sectionKind,cinemaState.sectionProgress);
            cinemaState.progress = reading?composition.progress:progress;
            if(reading)cinemaState.spread=composition.spread;
            const specialist=Array.from(document.querySelectorAll<HTMLElement>('.world-viewport')).some(el=>{const r=el.getBoundingClientRect();return r.top<height&&r.bottom>0});
            const modal=!!document.querySelector('dialog[open], [role=dialog]');
            const visible = (reading || rect.top < height && rect.bottom > height * .25) && !specialist && !modal && document.visibilityState !== 'hidden';
            cinemaState.active = visible;
            setActive(visible);
            const device = navigator as Navigator & {
                deviceMemory?: number;
            };
            cinemaState.compact = innerWidth <= 850 || (device.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;

            if (surface.current)
                {surface.current.style.opacity=visible?(reading?(innerWidth<=850?'.23':'.34'):String(Math.min(1,Math.max(0,(rect.bottom-height*.15)/(height*.6))))):'0';surface.current.dataset.mode=reading?'reading':'introduction';surface.current.dataset.section=cinemaState.sectionKind;}

        };
        const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
        const pointer = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse')
                return;
            cinemaState.pointer = [(e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2];
        };
        const resized=()=>{dirty=true;schedule()};
        const resize = new ResizeObserver(resized);
        resize.observe(story);resize.observe(document.body);
        const dialogs=new MutationObserver(records=>{if(records.some(r=>r.type==='attributes'||[...r.addedNodes,...r.removedNodes].some(n=>n instanceof Element&&(n.matches('dialog,[role=dialog]')||n.querySelector('dialog,[role=dialog]')))))schedule()});dialogs.observe(document.body,{attributes:true,attributeFilter:['open'],subtree:true,childList:true});
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', resized);
        window.addEventListener('saksham:navigation',schedule);
        document.addEventListener('visibilitychange', schedule);
        window.addEventListener('pointermove', pointer, { passive: true });
        update();
        return () => {
            delete root.dataset.cinemaReady;
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', resized);
            window.removeEventListener('saksham:navigation',schedule);dialogs.disconnect();
            document.removeEventListener('visibilitychange', schedule);
            window.removeEventListener('pointermove', pointer);
            resize.disconnect();
            cancelAnimationFrame(raf);
            for (const c of chapters) {
                c.inert = false;
                c.style.removeProperty('--chapter-opacity');
                c.style.removeProperty('translate');
                delete c.dataset.current;
            }
            if(cinemaState.present===present)cinemaState.present=undefined;
            cinemaState.active = false;cinemaState.content=false;
        };
    }, [eligible, allowed, ready, failed, path]);
    if (!eligible || (hydrated&&!allowed))
        return null;
    if (failed)
        return <div className="cinema-fallback-notice" role="status">Spatial rendering is unavailable. The complete readable introduction and project tools remain available.<button type="button" onClick={() => { setReady(false); setFailed(false); }}>Retry 3D rendering</button></div>;
    return <div className="cinema-surface" ref={surface} data-cinema-renderer data-active={active} aria-hidden="true"><div className="production-stage"><canvas ref={canvas} aria-hidden="true"/></div>{allowed&&<Boundary onFailure={failure}><ProductionRenderer canvasRef={canvas} world={world || (path === '/projects/sourcelens'?'sourcelens':'home')} active={active} onReady={created} onFailure={failure}/></Boundary>}</div>;
}
