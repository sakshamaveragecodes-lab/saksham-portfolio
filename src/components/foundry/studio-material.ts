import * as T from 'three';
import type {FlowUniforms} from './fluid';
/** Original studio light field: baked angular softboxes, no third-party HDR/image assets. */
export function studioEnvironment(){const images:HTMLCanvasElement[]=[];const size=128;const boxes=[{d:[-.45,.55,-.7],s:[.25,.06,.18],c:[.75,.9,1],power:.8},{d:[.2,.72,.66],s:[.035,.13,.2],c:[1,.98,.92],power:1},{d:[-.85,.2,.35],s:[.02,.55,.16],c:[.56,.8,1],power:.8},{d:[.65,.15,-.75],s:[.08,.4,.03],c:[1,.76,.49],power:.9},{d:[0,.95,-.3],s:[.6,.035,.035],c:[.82,.94,1],power:.9}];for(let face=0;face<6;face++){const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d')!,image=ctx.createImageData(size,size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const u=(x+.5)/size*2-1,v=(y+.5)/size*2-1;let d=[1,-v,-u];if(face===1)d=[-1,-v,u];if(face===2)d=[u,1,v];if(face===3)d=[u,-1,-v];if(face===4)d=[u,-v,1];if(face===5)d=[-u,-v,-1];const length=Math.hypot(...d);d=d.map(a=>a/length);const color=[.075,.095,.12].map((a,i)=>a+Math.max(0,d[1])*.06*(i===2?1.2:1));for(const box of boxes){const power=Math.exp(-d.reduce((sum,a,i)=>sum+(a-box.d[i])**2/box.s[i],0)*2)*box.power;for(let k=0;k<3;k++)color[k]+=power*box.c[k]}const j=(y*size+x)*4;for(let k=0;k<3;k++)image.data[j+k]=Math.min(255,Math.floor(color[k]*255));image.data[j+3]=255;}ctx.putImageData(image,0,0);images.push(c)}const texture=new T.CubeTexture(images);texture.colorSpace=T.SRGBColorSpace;texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;texture.needsUpdate=true;return texture;}
export function studioMetal(uniforms:FlowUniforms,env:T.CubeTexture,grain:T.Texture,color:string,roughness=.17,pool=false,deform=false,studioYaw=0){const ripple={value:grain};const material=new T.ShaderMaterial({uniforms:{...uniforms,uStudio:{value:env},uGrain:{value:grain},uColor:{value:new T.Color(color)},uStudioRotation:{value:new T.Vector2(Math.cos(studioYaw),Math.sin(studioYaw))},uRoughness:{value:roughness},uPool:{value:pool?1:0},uDeform:{value:deform?1:0},uRipple:ripple},side:T.DoubleSide,vertexShader:`
#include <common>
#include <morphtarget_pars_vertex>
uniform float uTime,uPool,uDeform,uImpulse,uProgress;uniform vec2 uPointer;uniform sampler2D uGrain,uRipple;varying vec3 vWorld,vNormal;varying vec2 vFlow;
float heightAt(vec2 v){vec2 a=v*vec2(2.,4.);vec2 shear=texture2D(uGrain,a*.5).gb-.5;return (texture2D(uGrain,a+shear*.2-vec2(0.,uTime*.025)).r-.42)*.1+texture2D(uRipple,v).r*.28;}
void main(){
#include <morphinstance_vertex>
vec3 objectNormal=normal;
#include <morphnormal_vertex>
vec3 transformed=position;
#include <morphtarget_vertex>
if(uPool>.5){float e=.004;transformed.z+=heightAt(uv);objectNormal=normalize(vec3((heightAt(uv-vec2(e,0))-heightAt(uv+vec2(e,0)))/10.,(heightAt(uv-vec2(0,e))-heightAt(uv+vec2(0,e)))/18.,2.*e));}
if(uDeform>.5){float profile=exp(-pow((uv.x-.48-uPointer.x*.1)*7.,2.))*(1.-smoothstep(.5,.8,uProgress));transformed.y+=uImpulse*.3*profile;transformed.z+=uImpulse*.15*profile;}
#ifdef USE_INSTANCING
transformed=(instanceMatrix*vec4(transformed,1.)).xyz;objectNormal=mat3(instanceMatrix)*objectNormal;
#endif
vWorld=(modelMatrix*vec4(transformed,1.)).xyz;vNormal=normalize(mat3(modelMatrix)*objectNormal);vFlow=uv;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`,fragmentShader:`
precision highp float;uniform samplerCube uStudio;uniform sampler2D uGrain;uniform vec3 uColor;uniform vec2 uStudioRotation;uniform float uRoughness,uTime,uPool;varying vec3 vWorld,vNormal;varying vec2 vFlow;
void main(){vec3 V=normalize(cameraPosition-vWorld),N=normalize(vNormal);if(!gl_FrontFacing)N=-N;vec2 flowUV=vFlow*vec2(3.,.6)-vec2(uTime*.035,0.);vec2 shear=texture2D(uGrain,flowUV*.5).gb-.5;vec3 grain=texture2D(uGrain,flowUV+shear*.3).rgb;N=normalize(N+vec3(shear.x,grain.r-.5,shear.y)*.045);vec3 R=reflect(-V,N);R.xz=mat2(uStudioRotation.x,uStudioRotation.y,-uStudioRotation.y,uStudioRotation.x)*R.xz;float rough=uRoughness+(grain.r-.45)*.08;vec3 reflection=textureCube(uStudio,R,rough*5.).rgb;float fresnel=pow(1.-max(0.,dot(N,V)),5.);vec3 F=mix(uColor,vec3(1.),fresnel);float occlusion=mix(.6,1.,smoothstep(-1.9,1.,vWorld.y));vec3 rgb=reflection*F*3.1*occlusion;rgb+=uColor*.018;rgb=mix(rgb,vec3(.035,.066,.09),smoothstep(17.,55.,length(cameraPosition-vWorld))*.8);gl_FragColor=vec4(rgb,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
}`});return{material,ripple};}
/** Thin-volume screen-space glass. Background is rendered once without the lens,
 * normals bend its image with controlled dispersion and Beer–Lambert attenuation.
 * This is not ray-traced multi-bounce refraction and is deliberately labelled as such.
 */
export function studioGlass(env:T.CubeTexture,studioYaw=0){const material=new T.ShaderMaterial({uniforms:{uStudioRotation:{value:new T.Vector2(Math.cos(studioYaw),Math.sin(studioYaw))},uBackground:{value:null},uStudio:{value:env},uResolution:{value:new T.Vector2(1,1)},uScreen:{value:0}},vertexShader:`varying vec3 vWorld,vNormal;void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`,fragmentShader:`precision highp float;uniform sampler2D uBackground;uniform samplerCube uStudio;uniform vec2 uResolution,uStudioRotation;uniform float uScreen;varying vec3 vWorld,vNormal;
void main(){vec3 V=normalize(cameraPosition-vWorld),N=normalize(vNormal);if(!gl_FrontFacing)N=-N;float cosTheta=max(.01,dot(N,V));float F=.034+(1.-.034)*pow(1.-cosTheta,5.);vec3 reflectedRay=reflect(-V,N);reflectedRay.xz=mat2(uStudioRotation.x,uStudioRotation.y,-uStudioRotation.y,uStudioRotation.x)*reflectedRay.xz;vec3 transmittedRay=refract(-V,N,1./1.45);transmittedRay.xz=mat2(uStudioRotation.x,uStudioRotation.y,-uStudioRotation.y,uStudioRotation.x)*transmittedRay.xz;vec3 reflected=textureCube(uStudio,reflectedRay).rgb*2.2;vec3 transmitted=textureCube(uStudio,transmittedRay).rgb;vec3 viewN=mat3(viewMatrix)*N;vec2 uv=gl_FragCoord.xy/uResolution,offset=viewN.xy*.029/max(.45,cosTheta);if(uScreen>.5){transmitted=vec3(texture2D(uBackground,clamp(uv-offset*1.015,.001,.999)).r,texture2D(uBackground,clamp(uv-offset,.001,.999)).g,texture2D(uBackground,clamp(uv-offset*.985,.001,.999)).b);}
vec3 absorption=exp(-vec3(.19,.065,.035)*.6/cosTheta);vec3 rgb=mix(transmitted*absorption,reflected,F);gl_FragColor=vec4(rgb,uScreen>.5?1.:.23);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}` ,transparent:true,depthWrite:false,side:T.FrontSide});return material;}
