import {createHash} from 'node:crypto';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {studioPixels} from './studio-pixels';
async function bake(){const {size,faces,flow}=studioPixels(),folder='public/studies/evidence-foundry/lighting';await mkdir(folder,{recursive:true});
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const records=[];for(const [i,bytes]of [...faces,flow].entries()){const png=await sharp(Buffer.from(bytes),{raw:{width:size,height:size,channels:4}}).png({compressionLevel:9}).toBuffer(),sha=hash(png),file=`${i===6?'curl-field':`studio-${i}`}-${sha.slice(0,12)}.png`;await writeFile(`${folder}/${file}`,png);records.push({url:`/studies/evidence-foundry/lighting/${file}`,sha256:sha,rgbaSha256:hash(bytes),bytes:png.length});}
const sourceSha256=hash(Buffer.concat(await Promise.all(['src/components/foundry/studio-material.ts','src/components/foundry/fluid.ts'].map(p=>readFile(p)))));await writeFile('src/components/cinema/production/texture-manifest.json',JSON.stringify({size,sourceSha256,faces:records.slice(0,6),flow:records[6]},null,2)+'\n');console.log('Baked original lossless studio/curl maps:',records.reduce((sum,r)=>sum+r.bytes,0),'bytes');

}
void bake().catch(error=>{console.error(error);process.exitCode=1});
