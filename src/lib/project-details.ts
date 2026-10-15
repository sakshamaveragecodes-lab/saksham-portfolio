import data from './project-details.json';
export interface PreviewSlide {title:string;image:string|null;note:string;source:string|null;kind:string;code?:string|null;width?:number;height?:number}
export interface ProjectDetails {audience:string;takeaway:string;walkthrough:string;demo:string;stages:string[];slides:PreviewSlide[];narrow?:string;narrowSource?:string;narrowWidth?:number;narrowHeight?:number}
export const projectDetails:Record<string,ProjectDetails> = data;
