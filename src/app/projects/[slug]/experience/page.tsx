import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {projects} from '@/lib/projects';
import {siteUrl} from '@/lib/site';
import {AppExperience} from '@/components/app-experience';
export const dynamicParams=false;
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=projects.find(x=>x.slug===slug);return {title:`${p?.name??'Project'} · Application experience`,description:`Explore ${p?.name??'this project'} through a source-backed interactive workspace. Browser ports and recorded behavior are clearly identified.`,alternates:{canonical:`${siteUrl}/projects/${slug}/experience/`}}}
export default async function ExperiencePage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const project=projects.find(p=>p.slug===slug);if(!project)notFound();return <AppExperience project={project}/>}
