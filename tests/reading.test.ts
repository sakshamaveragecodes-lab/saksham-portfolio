import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {sectionFrame,readingComposition} from '../src/components/cinema/reading';
import preview from '../src/lib/resume-preview.json';
test('native scroll chapters restore the same composition in either direction and remain bounded at deep links',()=>{
 const positions=[1500,700,100,-300,-900,-300,100,700,1500];const seen=new Map<number,ReturnType<typeof sectionFrame>>();
 for(const top of positions){const f=sectionFrame({top,height:1000},844);if(seen.has(top))assert.deepEqual(f,seen.get(top));seen.set(top,f);assert.ok(f.phase>=0&&f.phase<=1&&f.arrival>=0&&f.arrival<=1);for(const kind of ['overview','preview','demo','architecture','evaluation','limitations','next']){const p=readingComposition(kind,f.phase);assert.ok(p.progress>=0&&p.progress<=1&&p.spread>=0&&p.spread<=1)}}
 assert.notDeepEqual(readingComposition('preview',.5),readingComposition('evaluation',.5));
});
test('mobile resume derivative remains traceable to the unchanged official PDF and has reserved portrait dimensions',async()=>{
 const bytes=await readFile('public/documents/Saksham_Jadhav_AI_Engineer_Resume.pdf');assert.equal(createHash('sha256').update(bytes).digest('hex'),preview.sourceSha256);const image=await readFile('public/documents/preview/resume-page-1.webp');const info=await sharp(image).metadata();assert.equal(info.width,preview.width);assert.equal(info.height,preview.height);assert.ok(image.length<400000);assert.ok(preview.text.includes('[phone omitted'));assert.ok(preview.text.includes('Saksham'));
});
