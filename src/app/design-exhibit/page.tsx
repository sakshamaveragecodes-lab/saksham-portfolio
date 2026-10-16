import type {Metadata} from 'next';
import Link from 'next/link';
import {DesignExhibit} from '@/components/design-exhibit';
export const metadata:Metadata={title:'Credited 3D Design Exhibit',description:'An optional, explicitly credited ThreeUI bookshelf study by Meng To, with locally hosted runtime and verified MIT source provenance.'};
export default function DesignExhibitPage(){return <div className="container page-section"><span className="eyebrow">REFERENCE EXHIBIT</span><h1>A study in tactile interfaces.</h1><p className="page-intro">A separate space to inspect a verified open-source 3D reference. Saksham’s own engineering work lives in the <Link href="/projects/">project laboratory</Link>.</p><DesignExhibit/></div>}
