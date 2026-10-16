import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lamellaData,gridData,cubeData,octaData} from '../src/components/cinema/geometry';
import {sheetPose,cameraPose} from '../src/components/cinema/timeline';
test('shared spatial meshes have valid GPU indices, finite attributes and normalized normals',()=>{
 for(const data of [lamellaData(false),lamellaData(true),gridData(70,70,16,16),cubeData(),octaData()]){
  assert.equal(data.indices.length%3,0);assert.equal(data.normals.length,data.positions.length);assert.equal(data.uvs.length,data.positions.length/3*2);
  for(const value of [...data.positions,...data.normals,...data.uvs])assert.ok(Number.isFinite(value));
  for(const index of data.indices)assert.ok(index<data.positions.length/3);
  for(let i=0;i<data.normals.length;i+=3)assert.ok(Math.abs(Math.hypot(...data.normals.slice(i,i+3))-1)<1e-5);
  for(let i=0;i<data.indices.length;i+=3){const [a,b,c]=Array.from(data.indices.slice(i,i+3));const p=data.positions;const u=[p[b*3]-p[a*3],p[b*3+1]-p[a*3+1],p[b*3+2]-p[a*3+2]],v=[p[c*3]-p[a*3],p[c*3+1]-p[a*3+1],p[c*3+2]-p[a*3+2]];assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-8)}
 }
});
test('both renderer timelines remain finite and invertible during forward and reverse travel',()=>{
 for(const source of [false,true])for(const mobile of [false,true])for(const p of Array.from({length:101},(_,i)=>i/100)){
  const camera=cameraPose(p,source,mobile,[.8,-.6]);assert.ok([...camera.camera,...camera.focus].every(Number.isFinite));assert.notDeepEqual(camera.camera,camera.focus);
  for(let i=0;i<24;i++){const s=sheetPose(i,24,p,source);assert.ok([...s.position,...s.rotation,...s.scale].every(Number.isFinite));assert.ok(s.scale.every(v=>v>0))}
 }
});

import {worldSurface,worldAssembly,worldCamera} from '../src/components/cinema/world-geometry';
import {worlds,worldForPath,type WorldKey} from '../src/components/cinema/worlds';
test('all fourteen added worlds have distinct bounded geometry and safe camera/instance lifecycles',()=>{
 const signatures=new Set<string>();
 for(const key of Object.keys(worlds) as WorldKey[]){
  const d=worldSurface(key);signatures.add(Array.from(d.positions).map(v=>v.toFixed(3)).join(','));
  assert.ok(d.positions.length/3<65536);assert.ok(d.indices.every(i=>i<d.positions.length/3));assert.ok(d.positions.every(Number.isFinite));assert.ok(d.normals.every(Number.isFinite));
  for(const p of [0,.17,.33,.5,.67,.83,1])for(const spread of [0,1]){
   const assembly=worldAssembly(key,p,4,spread,2);
   for(const poses of Object.values(assembly)){assert.ok(poses.length<=64,`${key}: instance buffer capacity`);for(const pose of poses){assert.ok([...pose.position,...pose.rotation,...pose.scale].every(Number.isFinite));assert.ok(pose.scale.every(v=>v>0));}}
   for(const compact of [false,true]){const c=worldCamera(key,p,compact,[1,-1]);assert.ok([...c.camera,...c.focus].every(Number.isFinite));assert.ok(Math.hypot(...c.camera.map((v,i)=>v-c.focus[i]))>1);}
  }
  assert.equal(worlds[key].chapters.length,4);
 }
 assert.equal(signatures.size,Object.keys(worlds).length,'A world cannot be a recolor of another mesh');
 assert.equal(worldForPath('/projects/form'),'form');assert.equal(worldForPath('/projects/form/experience'),null);assert.equal(worldForPath('/unknown'),null);
});
