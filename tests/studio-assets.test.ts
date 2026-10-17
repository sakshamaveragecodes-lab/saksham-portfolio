import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import maps from '../src/components/cinema/production/texture-manifest.json';
import {studioPixels} from '../scripts/studio-pixels';
const sha=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
test('baked lighting and curl maps preserve every original RGBA byte and source integrity',async()=>{const original=studioPixels();assert.equal(maps.size,original.size);assert.equal(maps.sourceSha256,sha(Buffer.concat(await Promise.all(['src/components/foundry/studio-material.ts','src/components/foundry/fluid.ts'].map(p=>readFile(p))))));for(const [i,record]of [...maps.faces,maps.flow].entries()){assert.ok(record.url.startsWith('/studies/evidence-foundry/lighting/'));const png=await readFile('public'+record.url);assert.equal(sha(png),record.sha256);const decoded=await sharp(png).ensureAlpha().raw().toBuffer();assert.equal(sha(decoded),record.rgbaSha256);assert.deepEqual(new Uint8Array(decoded),i===6?original.flow:original.faces[i]);}});
