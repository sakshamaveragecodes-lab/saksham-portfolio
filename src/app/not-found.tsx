import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
export default function NotFound(){return <div className="container page-section not-found"><span className="eyebrow">404 / OUTSIDE THE GRAPH</span><h1>This node<br/><span className="muted">isn’t connected.</span></h1><p>The page may have moved, or this path doesn’t exist.</p><Link href="/projects" className="button primary">Return to the laboratory <ArrowRight size={16}/></Link></div>}
