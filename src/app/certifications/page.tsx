import Link from 'next/link';
import type {Metadata} from 'next';
import {ShieldCheck,ArrowUpRight} from 'lucide-react';
export const metadata:Metadata={title:'Certifications'};
export default function Certifications(){return <div className="container page-section"><div className="page-heading"><span className="eyebrow">CREDENTIALS & VERIFICATION</span><h1>Credibility starts<br/><span className="muted">with evidence.</span></h1><p>Only source-verified credentials belong here.</p></div><div className="document-state"><ShieldCheck size={36}/><h2>Credential documents pending.</h2><p>No certificate or official resume was available to verify credential names, issuers or dates. This page will publish those details once supported by the original documents.</p><Link href="/projects" className="button secondary">Explore source-backed project evidence <ArrowUpRight size={16}/></Link></div></div>}
