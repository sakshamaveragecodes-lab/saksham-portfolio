import type {Metadata} from 'next';
import {FoundryExperience} from '@/components/foundry/experience';
export const metadata:Metadata={title:'Evidence Foundry · Unpublished cinematic study',description:'Original cinematic material and environment study for the Project Saksham portfolio.',robots:{index:false,follow:false}};
export default function CinematicStudy(){return <FoundryExperience/>}
