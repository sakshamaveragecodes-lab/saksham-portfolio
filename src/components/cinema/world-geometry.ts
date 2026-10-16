import {withNormals,type MeshData} from './geometry';
import {segment,smooth,type Vec3} from './timeline';
import {worlds,type WorldKey} from './worlds';
export type Pose={position:Vec3;rotation:Vec3;scale:Vec3};
export type Assembly={surfaces:Pose[];boxes:Pose[];nodes:Pose[]};
const tau=Math.PI*2;
/** Each surface is designed in object space. No pretrained models, copied assets or chart data. */
export function worldSurface(key:WorldKey,n=36):MeshData {
 if(key==='projects'){
  const keys:WorldKey[]=['resume','careerlens','form','studybuddy','pymentor','airbnb','logistic-diabetes','random-forest-diabetes'];
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
  keys.forEach((k,i)=>{const d=worldSurface(k,24),offset=positions.length/3,a=i*tau/8;for(let v=0;v<d.positions.length;v+=3)positions.push(Math.cos(a)*4+d.positions[v]*.24,d.positions[v+1]*.24,Math.sin(a)*4+d.positions[v+2]*.24);uvs.push(...d.uvs);indices.push(...Array.from(d.indices,v=>v+offset));});
  return withNormals(new Float32Array(positions),new Float32Array(uvs),new Uint16Array(indices));
 }
 const ny=12,positions:number[]=[],uvs:number[]=[],indices:number[]=[];
 for(let j=0;j<=ny;j++)for(let i=0;i<=n;i++){
  const u=i/n,v=j/ny,a=u*tau,r=2+v*.7;let p:Vec3;
  switch(key){
   case 'careerlens':p=[Math.cos(a*1.35)*r,(u-.5)*5,Math.sin(a*1.35)*r];break;
   case 'form':p=[(u-.5)*8,Math.sin(u*tau*2)*.65+(v-.5)*.18,(v-.5)*.8];break;
   case 'studybuddy':{const x=(u-.5)*6;p=[x,Math.abs(x)*.28+Math.sin(v*Math.PI)*.2,(v-.5)*4];break;}
   case 'pymentor':p=[Math.sin(u*tau)*1.1+(v-.5)*.6,Math.cos(u*tau)*.6,(u-.5)*12];break;
   case 'airbnb':p=[(u-.5)*8,(u-.5)*1.7+(v-.5)*.5,(v-.5)*7];break;
   case 'logistic-diabetes':p=[(u-.5)*8,3/(1+Math.exp(-(u-.5)*9))-1.5,(v-.5)*5];break;
   case 'random-forest-diabetes':p=[Math.cos(a)*(.3+v*1.5),v*1.4,Math.sin(a)*(.3+v*1.5)];break;
   case 'about':p=[(u-.5)*7,Math.sin(u*5+v)*.35,(v-.5)*4];break;
   case 'skills':p=[Math.cos(a)*(1.4+v*.4),Math.sin(a)*1.8,(v-.5)*1.6];break;
   case 'experience':p=[(u-.5)*7,u*2+(v-.5)*.1,(v-.5)*2.4];break;
   case 'certifications':{const theta=Math.floor(u*8)/8*tau+(u*8%1)*tau/8;p=[Math.cos(theta)*(1+v),Math.sin(theta)*(1+v),(v-.5)*1.4+Math.cos(a*4)*.25];break;}
   case 'resume':p=[(u-.5)*4,Math.sin(u*Math.PI)*.45,(v-.5)*5.4];break;
   case 'contact':p=[(u-.5)*9,Math.sin(u*Math.PI)*2+(v-.5)*.3,Math.cos(u*Math.PI)*2+(v-.5)*.5];break;
   default:p=[Math.cos(a)*r,.3*Math.sin(a*3),(v-.5)*2];
  }
  positions.push(...p);uvs.push(u,v);
  if(i<n&&j<ny){const k=j*(n+1)+i;indices.push(k,k+1,k+n+2,k,k+n+2,k+n+1);}
 }
 return withNormals(new Float32Array(positions),new Float32Array(uvs),new Uint16Array(indices));
}
const pose=(position:Vec3,scale:Vec3=[1,1,1],rotation:Vec3=[0,0,0]):Pose=>({position,rotation,scale});
/** Choreographed assemblies: conceptually explain each source pipeline, never pretend to visualize fitted artifacts. */
export function worldAssembly(key:WorldKey,p:number,time:number,spread:number,selection=-1):Assembly{
 const a:Assembly={surfaces:[],boxes:[],nodes:[]},open=smooth(p*3),phase=p*3,explode=spread*.8;
 const surface=(pos:Vec3,size:Vec3=[1,1,1],rot:Vec3=[0,0,0])=>a.surfaces.push(pose(pos,size,rot));
 const box=(pos:Vec3,size:Vec3,rot:Vec3=[0,0,0])=>a.boxes.push(pose(pos,size,rot));
 const node=(pos:Vec3,size=.12)=>a.nodes.push(pose(pos,[size,size,size],[time*.06,0,0]));
 const link=(from:Vec3,to:Vec3,width=.04)=>{const dx=to[0]-from[0],dy=to[1]-from[1],dz=to[2]-from[2],length=Math.hypot(dx,dy,dz);box(from.map((v,i)=>(v+to[i])/2) as Vec3,[width,length,width],[Math.atan2(dz,Math.hypot(dx,dy)),0,-Math.atan2(dx,dy)]);};
 switch(key){
  case 'careerlens':
   for(let i=0;i<3;i++)surface([(i-1)*(explode+smooth((phase-.6)/1.4)*2),.15*(i-1),0],[1+i*.12,1,1+i*.12],[0,(i-1)*(.5+open*.3),0]);
   for(let i=0;i<13;i++){const h=.6+(13-i)*.18*open;box([(i-6)*.43,-2+h/2,1.6+explode],[.24,h,.35]);node([(i-6)*.43,-2+h+.25,1.6+explode],.09);}
   break;
  case 'form':{
   const angle=.25+(Math.sin(time*.8)*.5+.5)*.65+smooth((phase-.5)/1.5)*.15;
   const joints:Vec3[]=[[0,2.1,0],[0,1.5,0],[-.7,1.3,0],[.7,1.3,0],[-1.1,.55,-.2],[1.1,.55,-.2],[0,.2,0],[-.5,-.5-Math.sin(angle)*.5,.65*Math.sin(angle)],[.5,-.5-Math.sin(angle)*.5,.65*Math.sin(angle)],[-.7,-1.9,0],[.7,-1.9,0]];
   const crouch=Math.sin(angle)*.6;for(let i=0;i<7;i++){joints[i][1]-=crouch;joints[i][2]-=crouch*.2;}joints.forEach((j,i)=>node(j,i===0?.24:.12));
   for(const [x,y]of [[0,1],[1,2],[1,3],[2,4],[3,5],[1,6],[6,7],[6,8],[7,9],[8,10]])link(joints[x],joints[y],.07);
   for(let i=0;i<3;i++)surface([0,-2.2-i*.17,-2-explode-i*.3],[.8,1,.7],[0,0,0]);
   box([0,-2.15,0],[4.5,.08,3]);break;}
  case 'studybuddy':
   for(let i=0;i<7;i++)surface([0,-.8+i*.11,0],[1,1,1],[0,0,(i-3)*(.025+open*.045+explode*.05)]);
   box([0,1.1,-2.8-explode],[2.4,1.7,.3]);for(let i=0;i<12;i++)node([(i%4-1.5)*.45,.65+Math.floor(i/4)*.4,-2.5-explode],.09);
   for(let i=0;i<6;i++)link([1.2,1.1,-2.5],[2.7,.4-i*.18,1+i*.2],.025);break;
  case 'pymentor':
   surface([0,0,0],[1,1,1],[0,0,0]);
   for(let i=0;i<5;i++){const z=(i-2)*(2.1+explode),r=1.7+i*.08;box([-r,0,z],[.08,r*2,.12]);box([r,0,z],[.08,r*2,.12]);box([0,r,z],[r*2,.08,.12]);box([0,-r,z],[r*2,.08,.12]);node([Math.sin(time*.5+i)*.6,0,z],.16);}
   break;
  case 'airbnb':
   surface([0,.2+open*.7+explode,0],[1,1,1],[0,p*.09,0]);
   for(let z=0;z<6;z++)for(let x=0;x<7;x++){const h=.3+((x*7+z*3)%11)*.16;box([(x-3)*.85,-2+h/2,(z-2.5)*.9],[.42,h,.42]);if((x+z)%4===0)node([(x-3)*.85,.2+open*.7+explode+(x-3)*.23,(z-2.5)*.9],.09);}
   break;
  case 'logistic-diabetes':
   surface([0,0,0],[1,1,1],[0,(open-.5)*.25,0]);
   for(let i=0;i<30;i++){const x=(i%10-4.5)*.6;node([x,(i<15?-1:1)*(1.15+explode)+(i%3)*.13,(Math.floor(i/10)-1)*1.6],i<15?.12:.17);}
   box([0,0,0],[.035,4.4,6.2]);break;
  case 'random-forest-diabetes':
   for(let tree=0;tree<3;tree++){const x=(tree-1)*(2.8+explode+open*.3),z=(tree%2)*-1.8;link([x,-2,z],[x,0,z],.11);
    for(let b=0;b<2;b++){const xx=x+(b?1:-1)*.65;link([x,0,z],[xx,1,z],.07);for(let k=0;k<2;k++){const leaf:Vec3=[xx+(k?1:-1)*.4,1.9,z+(k?1:-1)*.25];link([xx,1,z],leaf,.04);node(leaf,.18);}}
    surface([x,.3,z],[.65,.6,.65],[0,time*.03+tree,0]);}
   break;
  case 'about':for(let i=0;i<8;i++)surface([Math.sin(i*.6)*.3,(i-3.5)*(.3+explode*.15),0],[1,1,1],[0,(i-3.5)*(.04+open*.05),0]);break;
  case 'skills':
   for(let i=0;i<4;i++){const theta=i*Math.PI/2,x=Math.cos(theta)*(2.1+explode),y=Math.sin(theta)*(1.5+explode*.4);surface([x,y,0],[.55,.55,.55],[0,theta,p*.3]);node([x,y,0],.25);link([0,0,0],[x,y,0],.05);for(let j=0;j<4;j++){const leaf:Vec3=[x+Math.cos(j*tau/4)*.75,y+Math.sin(j*tau/4)*.75,.6];node(leaf,.08);link([x,y,0],leaf,.025);}}node([0,0,0],.4);break;
  case 'experience':
   surface([0,-.5,-1],[1,1,1]);for(let i=0;i<7;i++){const x=(i-3)*.85,y=(i-3)*.45;box([x,y,0],[.75,.12,2+explode]);link([x,y,0],[x,y+1,0],.025);node([x,y+1,0],.12);}break;
  case 'certifications':
   for(let i=0;i<4;i++)surface([0,0,(i-1.5)*(.4+explode)],[1+i*.1,1+i*.1,1],[0,0,i*.15+open*.2]);node([0,0,0],.8);break;
  case 'resume':
   for(let i=0;i<8;i++)surface([0,(i-3.5)*.08,0],[1,1,1],[0,0,(i-3.5)*(.025+open*.045+explode*.07)]);
   box([0,-.5,0],[4.2,.15,5.6]);for(let i=0;i<6;i++)box([0,.65,-1.6+i*.55],[i%2?2:2.8,.025,.035]);break;
  case 'contact':
   for(let i=0;i<4;i++)surface([0,(i-1.5)*(.45+explode),0],[1,1,1],[0,i*.35+open*.2,0]);node([3.8,1.2,-1],.5);break;
  case 'projects':{
   surface([0,0,0],[1+explode*.22,1,1+explode*.22],[0,0,0]);
   const kinds:WorldKey[]=['resume','careerlens','form','studybuddy','pymentor','airbnb','logistic-diabetes','random-forest-diabetes'];
   for(let i=0;i<8;i++){const theta=i*tau/8,x=Math.cos(theta)*(4+explode),z=Math.sin(theta)*(4+explode),lift=selection===i?.7:0;box([x,-1.7+lift,z],[1.7,.08,1.7]);const sub=worldAssembly(kinds[i],p,time,0);for(const [kind,poses]of Object.entries(sub) as [keyof Assembly,Pose[]][]){for(const s of poses.slice(0,kind==='surfaces'?1:5)){const adjusted=pose([x+s.position[0]*.24,s.position[1]*.24+lift,z+s.position[2]*.24],s.scale.map(v=>v*.24) as Vec3,s.rotation);if(kind!=='surfaces')a[kind].push(adjusted);}}}break;}
 }
 const turn:Partial<Record<WorldKey,number>>={careerlens:.2,form:-.12,studybuddy:.3,pymentor:-.18,airbnb:.15,'logistic-diabetes':-.25,'random-forest-diabetes':.12,projects:.3,about:.16,skills:-.4,experience:.1,certifications:.35,resume:-.2,contact:.25};
 const angle=(turn[key]??0)*smooth(p),co=Math.cos(angle),si=Math.sin(angle);
 for(const poses of Object.values(a))for(const pose of poses){const [x,y,z]=pose.position;pose.position=[x*co+z*si,y,z*co-x*si];pose.rotation[1]+=angle;}
 return a;
}
export function worldCamera(key:WorldKey,p:number,mobile:boolean,pointer:[number,number]){
 const def=worlds[key],camera=segment(p,def.camera),focus=segment(p,def.focus),offset=mobile?0:2.7;
 camera[0]+=offset+pointer[0]*.28;camera[1]+=(mobile?1.5:0)-pointer[1]*.2;camera[2]+=mobile?7:0;
 focus[0]-=mobile?0:2.8;focus[1]+=mobile?2:0;
 return {camera,focus,offset};
}
