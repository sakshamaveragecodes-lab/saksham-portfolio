import * as T from 'three';
/** Identical topology through three designed poses. Rounded section becomes a source leaf.
 * Normals are authored per pose, so the render loop blends six small vertex streams instead
 * of re-evaluating a noisy parametric surface three times for every vertex and every pass.
 */
export function membrane(band:number,compact:boolean){const length=compact?36:88,around=12,lane=band-2.5;const g=new T.PlaneGeometry(1,1,length,around);const uv=g.getAttribute('uv');const sets:T.Float32BufferAttribute[]=[],normals:T.BufferAttribute[]=[];
 const a=new T.CubicBezierCurve3(new T.Vector3(-2.6+lane*.15,-1.4,4.2),new T.Vector3(-6+lane*.4,5.8+lane*.25,.4),new T.Vector3(7.2+lane*.28,4.7-lane*.2,-4.8),new T.Vector3(.8+lane*.4,-1.75,-10.8));
 const b=new T.CubicBezierCurve3(new T.Vector3(lane*.9,-.9,3),new T.Vector3(lane*1.3,2.8,-2),new T.Vector3(lane*1.2,-1.3,-8),new T.Vector3(lane*.8,1.2,-15));
 for(let pose=0;pose<3;pose++){const values=new Float32Array(uv.count*3);for(let i=0;i<uv.count;i++){const u=uv.getX(i),t=uv.getY(i)*Math.PI*2,p=pose===0?a.getPoint(u):pose===1?b.getPoint(u):new T.Vector3(lane*1.6,-2.075+u*2.15,-24.96);let x=Math.cos(t),y=Math.sin(t);if(Math.abs(x)<1e-8)x=0;if(Math.abs(y)<1e-8)y=0;if(pose===2){x=Math.sign(x)*Math.abs(x)**.2;y=Math.sign(y)*Math.abs(y)**.2}const width=pose===2?.63:(.58+1.1*Math.max(.001,Math.sin(u*Math.PI))**.7)*(pose===1?.42:1),thick=pose===2?.045:.075,roll=pose===0?1.5-u*4+lane*.15:pose===1?.14*lane:0;const sx=x*width,sy=y*thick;p.x+=sx*Math.cos(roll)-sy*Math.sin(roll);p.y+=sx*Math.sin(roll)+sy*Math.cos(roll);values.set(p.toArray(),i*3)}const attr=new T.Float32BufferAttribute(values,3);sets.push(attr);g.setAttribute('position',attr);g.computeVertexNormals();normals.push(g.getAttribute('normal').clone());}
 g.setAttribute('position',sets[0]);g.setAttribute('normal',normals[0]);g.morphAttributes.position=[sets[1],sets[2]];g.morphAttributes.normal=[normals[1],normals[2]];g.computeBoundingSphere();return g;
}
