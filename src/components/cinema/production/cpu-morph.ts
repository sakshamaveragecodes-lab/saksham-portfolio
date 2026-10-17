import * as T from 'three';
import type {Model} from './model';
/** Absolute-target blending equivalent to Three's GPU morph chunks. Software GPUs
 * otherwise pay for vertex-texture gathers; stream a small, compact vertex buffer instead.
 * Motion functions retain their captured weight array, while the draw sees no GPU targets.
 */
export function cpuMorphs(model:Model){const entries:{mesh:T.Mesh;weights:number[];sets:{attribute:T.BufferAttribute;poses:Float32Array[]}[]}[]=[];
 model.root.traverse(o=>{if(!(o instanceof T.Mesh)||!o.geometry.morphAttributes.position?.length||!o.morphTargetInfluences)return;const g=o.geometry,weights=o.morphTargetInfluences,sets:typeof entries[number]['sets']=[];for(const key of ['position','normal']){const targets=g.morphAttributes[key];if(!targets?.length)continue;const original=g.getAttribute(key),poses=[original,...targets].map(a=>new Float32Array(a.array)),attribute=new T.BufferAttribute(poses[0].slice(),3).setUsage(T.DynamicDrawUsage);g.setAttribute(key,attribute);sets.push({attribute,poses});}g.morphAttributes={};o.morphTargetInfluences=undefined;entries.push({mesh:o,weights,sets});});
 model.motions.push(()=>{for(const {weights,sets}of entries){const base=1-weights.reduce((sum,w)=>sum+w,0);for(const {attribute,poses}of sets){const out=attribute.array as Float32Array;for(let i=0;i<out.length;i++){let value=poses[0][i]*base;for(let j=0;j<weights.length;j++)value+=poses[j+1][i]*weights[j];out[i]=value;}attribute.needsUpdate=true;}}});return entries.length;
}
