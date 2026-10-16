/** Shared DOM coordination; each content section has a deterministic reversible phase. */
export const sectionSelector='main .project-heading, main .case-section, main .case-columns, main .full-app-entry, main .next-project, main .page-heading, main .about-grid, main .interest-grid, main .knowledge-map, main .skill-panel, main .program-panel, main .education-card, main .timeline article, main .credential-card, main .official-resume, main .resume-preview, main .contact-card, main .copy-contact, main .source-note, main #selected-work, main .approach-section, main .final-cta, main .lab-toolbar, main .projects-grid, main .privacy, .footer';
export function contentSections(){return Array.from(document.querySelectorAll<HTMLElement>(sectionSelector)).filter(e=>!e.closest('[data-cinematic-story]'))}
export function sectionKind(e:HTMLElement){return e.dataset.motionSection||e.id||(['project-heading','page-heading','projects-grid','about-grid','skill-panel','knowledge-map','credential-card','education-card','program-panel','contact-card','official-resume','resume-preview','timeline','approach-section','final-cta','source-note','footer'].find(k=>e.classList.contains(k)))||'connections'}
export function sectionFrame(rect:{top:number;height:number},viewport:number){const phase=Math.max(0,Math.min(1,(viewport*.94-rect.top)/(rect.height+viewport*.7)));const arrival=Math.max(0,Math.min(1,(viewport*.96-rect.top)/(viewport*.65)));return {phase,arrival,visible:rect.top<viewport+80&&rect.top+rect.height>0}}
/** Section roles change the spatial composition, not the project's factual results. */
export function readingComposition(kind:string,phase:number){const t=Math.max(0,Math.min(1,phase));switch(kind){
 case 'overview':case 'project-heading':return {progress:.62+t*.12,spread:t*.25};
 case 'preview':return {progress:.12+t*.25,spread:.45+t*.25};
 case 'demo':return {progress:.36+t*.25,spread:Math.sin(t*Math.PI)*.65};
 case 'architecture':case 'decisions':return {progress:.44+t*.35,spread:.75};
 case 'evaluation':return {progress:.85+t*.15,spread:.1};
 case 'limitations':return {progress:1-t*.18,spread:0};
 case 'workspace':case 'next':return {progress:.55+t*.45,spread:t};
 default:return {progress:.2+t*.65,spread:Math.sin(t*Math.PI)*.35};
}}
