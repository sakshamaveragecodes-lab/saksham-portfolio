/** Authored spatial keyframes. No model outputs or learned coordinates. */
export type Vec3 = [number, number, number];
export const cinemaState = {progress:0, source:false, compact:false, active:false, paused:false, pointer:[0,0] as [number,number], quality:1, selection:-1};
export const smooth = (t:number) => {const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x)};
export function segment(progress:number, stops:Vec3[]):Vec3 {
 const p=Math.max(0,Math.min(stops.length-1,progress*(stops.length-1)));const a=Math.min(stops.length-2,Math.floor(p));const t=smooth(p-a);
 return stops[a].map((v,i)=>v+(stops[a+1][i]-v)*t) as Vec3;
}
export function sheetPose(index:number,count:number,p:number,source:boolean):{position:Vec3;rotation:Vec3;scale:Vec3}{
 const t=index/(count-1),a=t*Math.PI*2.4;
 const emergence:Vec3=[Math.cos(a)*1.25,(t-.5)*4.6,Math.sin(a)*1.25];
 const corridor:Vec3=[(index%2?1:-1)*2.5,Math.sin(t*Math.PI)*.3,(t-.5)*17];
 const assembly=Math.floor(t*2.99),local=(t*3)%1;
 const archive:Vec3=[(assembly-1)*4.6,(local-.5)*3.3,Math.sin(local*Math.PI)*.7];
 const grounded:Vec3=[(index%2?1:-1)*(1.15+t*.6),(t-.5)*4.5,Math.sin(t*9)*.25];
 const pages:Vec3=[Math.sin(t*3.14)*.35,(t-.5)*4.6,Math.cos(t*3.14)*.25];
 const positions=source?[pages,corridor,archive,grounded]:[emergence,corridor,archive,archive];
 const rotations:Vec3[]=source?[[.05,.3+Math.sin(t*3.14)*.15,-.12],[0,index%2?-.22:.22,0],[0,assembly*.6,.08],[0,index%2?-.18:.18,0]]:[[.16,a+.2,.08],[0,index%2?-.22:.22,0],[Math.PI/2,0,0],[Math.PI/2,0,0]];
 const scales:Vec3[]=[[1,1,1],[.75,1.3,.8],[.65,.55,.7],source?[.48,.3,.7]:[.65,.55,.7]];
 return {position:segment(p,positions),rotation:segment(p,rotations),scale:segment(p,scales)};
}
