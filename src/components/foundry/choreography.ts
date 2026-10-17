/** Five authored shots, continuous world-space travel. No scroll interception. */
export const acts=[
 {id:'potential',label:'01 / UNBOUNDED',title:'Before an answer,',accent:'a current.',copy:'Information has motion. Understanding needs structure. An original material study of the path from flowing information to inspectable evidence.'},
 {id:'separation',label:'02 / SEPARATE',title:'Let the structure',accent:'surface.',copy:'The continuous silver skin opens into separate layers. In SourceLens, extraction and chunking give source material boundaries and page references.'},
 {id:'passage',label:'03 / KEEP THE SOURCE',title:'Through the noise.',accent:'Into context.',copy:'Move through the aperture. The scene reorganizes around the archive: a visual metaphor for retrieval, not actual embedding coordinates.'},
 {id:'archive',label:'04 / RETRIEVE',title:'Many fragments.',accent:'One useful context.',copy:'The liquid becomes an ordered field of source leaves. Retrieval selects context; the original application preserves the connection to the document.'},
 {id:'grounding',label:'05 / GROUND',title:'An answer needs',accent:'somewhere to stand.',copy:'Selected leaves assemble into evidence. Explore the real SourceLens preview, source code and documented refusal boundary after the sequence.'}
] as const;
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(a:number,b:number,v:number)=>{const x=clamp((v-a)/(b-a));return x*x*x*(x*(x*6-15)+10)};
export const shots=[
 {p:0,eye:[10,5.2,13],target:[-2,1,-2],fov:43},
 {p:.18,eye:[6.8,3.6,7],target:[-.8,1.5,-3],fov:46},
 {p:.37,eye:[.8,2.1,1],target:[0,1.3,-9],fov:51},
 {p:.59,eye:[-.6,1.9,-8],target:[0,1.3,-17],fov:51},
 {p:.78,eye:[-4.8,3.9,-17],target:[0,1.2,-24],fov:45},
 {p:1,eye:[5.8,3.3,-17.8],target:[0,1,-24],fov:43}
] as const;
