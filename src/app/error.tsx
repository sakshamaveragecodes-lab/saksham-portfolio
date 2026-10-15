'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="container page-section"><span className="eyebrow">A RECOVERABLE INTERRUPTION</span><h1>Something didn’t load.</h1><p>Please try the page again.</p><button className="button primary" onClick={reset}>Try again</button></div>}
