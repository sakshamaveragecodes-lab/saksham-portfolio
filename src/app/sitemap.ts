import {siteUrl} from '@/lib/site';
import type {MetadataRoute} from 'next';
import {projects} from '@/lib/projects';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return ['','/about','/projects','/experience','/skills','/certifications','/contact','/privacy','/design-exhibit',... projects.map(p=>`/projects/${p.slug}`)].map(path=>({url:`${siteUrl}${path}/`,changeFrequency:'monthly',priority:path===''?1:0.7}))}
