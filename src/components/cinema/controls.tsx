'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { setEffectsPreference, useEffectsAllowed } from '@/lib/effects';
import { cinemaState } from './timeline';
export function CinemaControls() { const allowed = useEffectsAllowed(); const [paused, setPaused] = useState(false); useEffect(() => { cinemaState.paused = false; }, []); return <><button type="button" disabled={!allowed} aria-pressed={paused} onClick={() => { cinemaState.paused = !paused; setPaused(!paused); }}>{paused ? 'Resume atmosphere' : 'Pause atmosphere'}</button><button type="button" onClick={() => setEffectsPreference(allowed)}>{allowed ? 'Reduce effects' : 'Enable effects'}</button></>; }
export function CinematicProjectLinks() { return <nav className="cinema-project-links" aria-label="Select an engineering environment">{[['sourcelens', 'SourceLens'], ['careerlens', 'CareerLens'], ['form', 'FORM']].map(([slug, name], i) => <Link href={`/projects/${slug}/`} key={slug} onPointerEnter={() => { cinemaState.selection = i; }} onPointerLeave={() => { cinemaState.selection = -1; }} onFocus={() => { cinemaState.selection = i; }} onBlur={() => { cinemaState.selection = -1; }}>{name} ↗</Link>)}</nav>; }
