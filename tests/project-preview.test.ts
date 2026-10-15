import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {projects} from '../src/lib/projects';
import {projectDetails} from '../src/lib/project-details';
import media from '../docs/qa/preview-media.json';
test('all preview artifacts are local, traceable and unchanged from their reviewed manifest',()=>{
 assert.deepEqual(Object.keys(projectDetails).sort(),projects.map(p=>p.slug).sort());
 for(const p of projects){const d=projectDetails[p.slug];assert.equal(d.stages.length,p.steps.length,`${p.slug} architecture coverage`);assert.ok(d.audience&&d.takeaway&&d.walkthrough&&d.demo);assert.ok(d.slides.length>=2);
  for(const s of d.slides){assert.ok(s.source);assert.ok(s.note);if(s.image){assert.ok(media.some(m=>m.asset===s.image&&m.project===p.slug&&m.source===s.source));assert.ok(s.width&&s.height)}else{assert.ok(s.code&&s.kind!=='Actual application capture')}}
 }
 for(const m of media){assert.ok(m.asset.startsWith('/media/'));assert.equal(createHash('sha256').update(readFileSync('public'+m.asset)).digest('hex'),m.sha256,m.asset)}
});
