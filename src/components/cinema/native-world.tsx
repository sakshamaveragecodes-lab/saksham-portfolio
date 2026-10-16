'use client';
import {useEffect,useRef} from 'react';
import {Matrix4} from 'three/src/math/Matrix4.js';
import {Matrix3} from 'three/src/math/Matrix3.js';
import {Vector3} from 'three/src/math/Vector3.js';
import {Euler} from 'three/src/math/Euler.js';
import {Quaternion} from 'three/src/math/Quaternion.js';
import {program,mesh,type Program,type Mesh} from './native-gl';
import {cubeData,octaData,gridData} from './geometry';
import {worldAssembly,worldCamera,worldSurface,type Pose} from './world-geometry';
import {worlds,type WorldKey} from './worlds';
import {cinemaState,smooth,type Vec3} from './timeline';
import {waterVertex,waterFragment} from './materials';
const vertex=`varying vec3 n;varying vec3 v;varying vec3 local;uniform float uTime;uniform float uProgress;uniform float uSurface;void main(){vec3 q=position;if(uSurface>.5){__MORPH__} q+=normal*(sin(position.x*1.2+position.z*.8+uTime*.35)*.018);vec4 p=instanceMatrix*vec4(q,1.);vec4 mv=modelViewMatrix*p;n=normalize(normalMatrix*mat3(instanceMatrix)*normal);v=-mv.xyz;local=p.xyz;gl_Position=projectionMatrix*mv;}`;
const fragment=`precision highp float;varying vec3 n;varying vec3 v;varying vec3 local;uniform float uTime;uniform float uProgress;uniform float uFinish;void main(){vec3 N=normalize(cross(dFdx(v),dFdy(v)));if(dot(N,normalize(n))<0.)N=-N;N*=gl_FrontFacing?1.:-1.;vec3 V=normalize(v);vec3 L=normalize(vec3(-.5+sin(uTime*.16)*.2,.8,1.));float diffuse=max(0.,dot(N,L));float fresnel=pow(1.-abs(dot(N,V)),2.5);float spec=pow(max(0.,dot(reflect(-L,N),V)),mix(24.,100.,uFinish));vec3 R=reflect(-V,N);float strip=pow(max(0.,1.-abs(R.x*.7+R.y*.4-.25)),18.);float seam=pow(1.-abs(sin(local.x*.8+local.y*.6+uProgress*3.)),30.);vec3 c=mix(vec3(.045,.085,.12),vec3(.54,.65,.72),diffuse*.7+fresnel*.45)+vec3(.65,.84,.95)*(spec*.75+strip*.35)+vec3(.2,.42,.5)*seam*.1;float fog=1.-exp(-length(v)*.009);c=mix(c,vec3(.031,.051,.074),fog);gl_FragColor=vec4(c,1.);}`;
/** One small renderer for the additional worlds; no parallel contexts or external scene assets. */
export default function NativeWorld({world,active,onReady,onFailure}:{world:WorldKey;active:boolean;onReady:()=>void;onFailure:()=>void}){
 const continuity=useRef<{eye:Vec3;focus:Vec3}|null>(null);
 const ref=useRef<HTMLCanvasElement>(null),activeRef=useRef(active),start=useRef<()=>void>(()=>{});
 useEffect(()=>{activeRef.current=active;if(active)start.current();},[active]);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl){onFailure();return;}
  const debug=gl.getExtension('WEBGL_debug_renderer_info'),software=/swiftshader|llvmpipe|software/i.test(debug?String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)):'');
  let quality=software?.65:Math.min(devicePixelRatio,innerWidth<=850?1.25:1.5),raf=0,last=0,time=0,p=0,spread=0,disposed=false,slow=0,resizePending=false;
  const stats={frames:0,frameMs:[] as number[],calls:0,triangles:0,geometries:4,textures:0,quality};window.__sakshamCinema=stats;
  const meshes:Mesh[]=[],programs:Program[]=[],matrix=new Matrix4(),root=new Matrix4(),floor=new Matrix4(),view=new Matrix4(),projection=new Matrix4(),mv=new Matrix4(),normal=new Matrix3(),pos=new Vector3(),size=new Vector3(),quat=new Quaternion(),euler=new Euler(),eye=new Vector3(),focus=new Vector3(),up=new Vector3(0,1,0),target=new Vector3(),data=new Float32Array(64*16);
  const write=(i:number,pose:Pose)=>{matrix.compose(pos.set(...pose.position),quat.setFromEuler(euler.set(...pose.rotation)),size.set(...pose.scale));data.set(matrix.elements,i*16);};
  const resize=()=>{const w=Math.max(1,Math.round(canvas.clientWidth*quality)),h=Math.max(1,Math.round(canvas.clientHeight*quality));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,canvas.width,canvas.height);const y=.1*Math.tan(42*Math.PI/360),x=y*canvas.width/canvas.height;projection.makePerspective(-x,x,y,-y,.1,100);};
  const observer=new ResizeObserver(()=>{resizePending=true;start.current()});observer.observe(canvas);resize();
  const lost=(event:Event)=>{event.preventDefault();onFailure();};canvas.addEventListener('webglcontextlost',lost);
  const cleanup=()=>{if(disposed)return;if(stats.frames>0)continuity.current={eye:eye.toArray() as Vec3,focus:focus.toArray() as Vec3};disposed=true;cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('webglcontextlost',lost);meshes.forEach(m=>{m.buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteVertexArray(m.vao);});programs.forEach(p=>gl.deleteProgram(p.program));delete window.__sakshamCinema;};
  let metal:Program,water:Program;
  try{const morph:Partial<Record<WorldKey,string>>={
   careerlens:'float f=smoothstep(.18,.65,uProgress);q=mix(q,vec3((uv.x-.5)*2.4,(uv.y-.5)*5.,0.),f);',
   studybuddy:'q.y+=abs(q.x)*smoothstep(.1,.7,uProgress)*.35;',
   pymentor:'q.xy*=1.-smoothstep(.2,.8,uProgress)*.55;',
   airbnb:'q.y*=.35+smoothstep(.1,.65,uProgress)*.8;',
   'logistic-diabetes':'q.y*=.35+smoothstep(.1,.65,uProgress)*.9;',
   about:'q.y+=sin(uv.x*6.28)*smoothstep(.1,.8,uProgress)*.4;',
   skills:'q.z+=sin(uv.x*6.28)*smoothstep(.1,.8,uProgress)*.7;',
   certifications:'q.z*=1.+smoothstep(.1,.8,uProgress);',
   resume:'q.y+=abs(q.x)*smoothstep(.15,.7,uProgress)*.25;',
   contact:'q.z*=1.-smoothstep(.1,.8,uProgress)*.7;'
  };
  metal=program(gl,vertex.replace('__MORPH__',morph[world]??''),fragment);programs.push(metal);water=program(gl,waterVertex,waterFragment);programs.push(water);[worldSurface(world),cubeData(),octaData(),gridData(70,70,16,16)].forEach(d=>meshes.push(mesh(gl,d)));gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(8/255,13/255,19/255,1);}catch{cleanup();onFailure();return;}
  const uniforms=(s:Program,model:Matrix4)=>{gl.useProgram(s.program);mv.multiplyMatrices(view,model);normal.getNormalMatrix(mv);const u=s.uniforms;gl.uniformMatrix4fv(u.modelMatrix,false,model.elements);gl.uniformMatrix4fv(u.modelViewMatrix,false,mv.elements);gl.uniformMatrix4fv(u.viewMatrix,false,view.elements);gl.uniformMatrix4fv(u.projectionMatrix,false,projection.elements);gl.uniformMatrix3fv(u.normalMatrix,false,normal.elements);gl.uniform1f(u.uTime,time);gl.uniform1f(u.uProgress,p);gl.uniform2f(u.uPointer,...cinemaState.pointer);gl.uniform3f(u.uTint,...worlds[world].tint);gl.uniform1f(u.uOpacity,1);gl.uniform1f(u.uFinish,Math.min(1,worlds[world].finish+(cinemaState.content?Math.sin(cinemaState.sectionProgress*Math.PI)*.2:0)));};
  const draw=(m:Mesh,poses:Pose[])=>{if(!poses.length)return;poses.forEach((s,i)=>write(i,s));gl.bindVertexArray(m.vao);gl.bindBuffer(gl.ARRAY_BUFFER,m.matrices);gl.bufferSubData(gl.ARRAY_BUFFER,0,data.subarray(0,poses.length*16));gl.drawElementsInstanced(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0,poses.length);stats.calls++;stats.triangles+=m.count/3*poses.length;};
  const first=worldCamera(world,0,innerWidth<=850,[0,0]),previous=continuity.current;let arrival=previous?0:1;eye.set(...(previous?.eye??first.camera));focus.set(...(previous?.focus??first.focus));
  const frame=(now:number)=>{
   raf=0;if(disposed||!activeRef.current)return;raf=requestAnimationFrame(frame);if(!cinemaState.active){last=now;return;}
   if(cinemaState.content&&last&&now-last<32)return;
   const delta=last?(now-last)/1000:1/60;last=now;const dt=Math.min(delta,.05),blend=1-Math.exp(-dt*8);if(!cinemaState.paused)time+=dt;p+=(cinemaState.progress-p)*blend;spread+=(cinemaState.spread-spread)*blend;
   arrival=Math.min(1,arrival+dt*1.6);const enter=smooth(arrival);
   const mobile=innerWidth<=850,camera=worldCamera(world,p,mobile,cinemaState.pointer);eye.lerp(target.set(...camera.camera),blend);focus.set(...camera.focus);if(previous&&arrival<1)focus.lerpVectors(pos.set(...previous.focus),target.set(...camera.focus),enter);view.lookAt(eye,focus,up).setPosition(eye).invert();
   root.compose(pos.set(camera.offset,(mobile?-1:0)-(1-enter)*.8,0),quat.setFromEuler(euler.set(0,Math.sin(time*.12)*.025+(1-enter)*.3,0)),size.setScalar(.86*(.72+.28*enter)));floor.compose(pos.set(0,-3.2,0),quat.setFromEuler(euler.set(-Math.PI/2,0,0)),size.setScalar(1));
   // Resizing clears the drawing buffer: always resize BEFORE this frame's draw.
   if(delta>.035)slow++;if(stats.frames===59&&slow>20){quality=software?.45:.85;stats.quality=quality;resizePending=true;}
   if(resizePending){resize();resizePending=false;}
   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);stats.calls=0;stats.triangles=0;
   uniforms(water,floor);draw(meshes[3],[{position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}]);uniforms(metal,root);
   const assembly=worldAssembly(world,p,time,spread,cinemaState.selection);gl.uniform1f(metal.uniforms.uSurface,1);draw(meshes[0],assembly.surfaces);gl.uniform1f(metal.uniforms.uSurface,0);draw(meshes[1],assembly.boxes);draw(meshes[2],assembly.nodes);
   stats.frames++;if(stats.frames>30){stats.frameMs.push(delta*1000);if(stats.frameMs.length>720)stats.frameMs.shift();}
   gl.bindVertexArray(null);
  };
  start.current=()=>{if(!raf&&!disposed){last=0;raf=requestAnimationFrame(frame);}};onReady();start.current();return cleanup;
 },[world,onReady,onFailure]);
 return <canvas ref={ref} data-cinematic-world={world} style={{width:'100%',height:'100%',display:'block'}}/>;
}
