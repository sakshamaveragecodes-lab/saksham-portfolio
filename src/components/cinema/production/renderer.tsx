'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { cinemaState } from '../timeline';
import type { StageKey } from './direction';
import type { StageReceipt, StageUpdate } from './engine';
declare global {
    interface Window {
        __sakshamStage?: StageReceipt;
    }
}
/** The same stage engine runs off the main thread where transfer is supported.
 * One persistent canvas/worker; readable content never depends on worker startup. */
export default function ProductionRenderer({ world, active, onReady, onFailure, canvasRef }: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    world: StageKey;
    active: boolean;
    onReady: (value?: boolean) => void;
    onFailure: () => void;
}) {
    const requested = useRef(world), visible = useRef(active);
    useEffect(() => { requested.current = world; }, [world]);
    useEffect(() => { visible.current = active; }, [active]);
    useEffect(() => {
        const canvas = canvasRef.current, parent = canvas?.parentElement;
        if (!canvas || !parent)
            return;
        let disposed = false, raf = 0, last = '', worker: Worker | undefined, fallback: ReturnType<typeof import('./engine')['createStage']> | undefined, receipt: StageReceipt | undefined;
        let {width,height}=parent.getBoundingClientRect();
        const observer=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height});observer.observe(parent);
        const view = (): StageUpdate => ({world:requested.current,active:visible.current,width,height,pixelRatio:devicePixelRatio});
        const state = () => { const snapshot = { ...cinemaState }; delete snapshot.present; return snapshot; };
        const publish = (value: StageReceipt) => { receipt = value; window.__sakshamStage = value; window.__sakshamCinema = value; };
        const onWorld = (key: StageKey, title: string) => { canvas.dataset.cinematicWorld = key; canvas.dataset.stageTitle = title; };
        const lost = (event: Event) => { event.preventDefault(); onFailure(); };
        canvas.addEventListener('webglcontextlost', lost);
        const synchronize = () => { if (disposed)
            return; raf = requestAnimationFrame(synchronize); const snapshot = { type: 'update', view: view(), state: state() }, key = JSON.stringify(snapshot); if (key === last)
            return; last = key; if (worker)
            worker.postMessage(snapshot);
        else
            fallback?.update(snapshot.view); };
        const start = async () => {
            if (typeof Worker !== 'undefined' && typeof canvas.transferControlToOffscreen === 'function') {
                // Respect browser capability failures before transferring the visible canvas.
                // This short-lived probe is released before the one persistent stage starts.
                const probe = document.createElement('canvas'), gl = probe.getContext('webgl2');
                if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
                    gl?.getExtension('WEBGL_lose_context')?.loseContext();
                    onFailure();
                    return;
                }
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
                worker.onmessage = event => { if (disposed)
                    return; const m = event.data; if (m.type === 'ready')
                    onReady();
                else if (m.type === 'failure')
                    onFailure();
                else if (m.type === 'world')
                    onWorld(m.world, m.title);
                else if (m.type === 'receipt')
                    publish(m.receipt);
                else if (m.type === 'present')
                    cinemaState.present?.(m.progress); };
                worker.onerror = () => { if (!disposed)
                    onFailure(); };
                const offscreen = canvas.transferControlToOffscreen();
                worker.postMessage({ type: 'initialize', canvas: offscreen, view: view(), state: state(), review: new URLSearchParams(location.search).get('optics') === 'full' }, [offscreen]);
            }
            else {
                const [{ createStage }, { loadStudioTextures }] = await Promise.all([import('./engine'), import('./textures')]);
                const textures = await loadStudioTextures();
                if (disposed) {
                    textures.environmentMap.dispose();
                    textures.grain.dispose();
                    return;
                }
                fallback = createStage({ ...view(), ...textures, canvas, review: new URLSearchParams(location.search).get('optics') === 'full', onReady, onFailure, onWorld, publish });
            }
            synchronize();
        };
        const startup = setTimeout(() => { void start().catch(() => { if (!disposed)
            onFailure(); }); }, 0);
        return () => { disposed = true; clearTimeout(startup); cancelAnimationFrame(raf); observer.disconnect(); canvas.removeEventListener('webglcontextlost', lost); fallback?.dispose(); if (worker) {
            const owned = worker;
            const timeout = setTimeout(() => owned.terminate(), 500);
            owned.onmessage = e => { if (e.data.type === 'disposed') {
                clearTimeout(timeout);
                owned.terminate();
            } };
            owned.postMessage({ type: 'dispose' });
        } if (window.__sakshamStage === receipt)
            delete window.__sakshamStage; if (window.__sakshamCinema === receipt)
            delete window.__sakshamCinema; onReady(false); };
    }, [canvasRef, onReady, onFailure]);
    return null;
}
