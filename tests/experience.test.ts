import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {validateExperienceQuestion} from '../src/lib/experience-data';
import {execFileSync} from 'node:child_process';
test('PyMentor browser input boundary agrees with original Python validation including Unicode length',()=>{
 const inputs=['',' \n\t ','  a   Python\nquestion ','x'.repeat(2000),'x'.repeat(2001),'😀'.repeat(2000),'😀'.repeat(2001),'\u00a0why\u2003Python?\u00a0','\u001c a\u0085b\u001f','\ufeffwhy?\ufeff'];
 const python=`import json,sys\ndef check(q):\n q=' '.join(q.strip().split())\n return {'question':q,'error':'Question cannot be empty.' if not q else 'Question is too long. Please keep it under 2000 characters.' if len(q)>2000 else None}\nprint(json.dumps([check(q) for q in json.loads(sys.stdin.read())]))`;
 const expected=JSON.parse(execFileSync('python3',['-c',python],{input:JSON.stringify(inputs),encoding:'utf8'}));
 assert.deepEqual(inputs.map(validateExperienceQuestion),expected);
});
test('credited exhibit preserves canonical bytes, distinguishes derivative and pins every vendor module',()=>{
 const root='public/exhibits/threeui/';const manifest=JSON.parse(readFileSync(root+'manifest.json','utf8'));const hash=(file:string)=>createHash('sha256').update(readFileSync(root+file)).digest('hex');
 assert.equal(hash('original.html.txt'),'606f200fed8602c243f40a11c8c364f0e625c57f80e7c97dc76419da207f198e');assert.equal(hash('index.html'),manifest.adapterSha256);assert.notEqual(manifest.adapterSha256,manifest.canonicalSha256);
 for(const [file,sha] of Object.entries(manifest.files))assert.equal(hash(file),sha,file);
 const html=readFileSync(root+'index.html','utf8');assert.ok(!/https?:\/\//.test(html));assert.ok(html.includes('./vendor/build/three.module.js'));assert.ok(readFileSync(root+'licenses/ThreeUI-MIT.txt','utf8').includes('Meng To'));assert.ok(readFileSync(root+'licenses/Three-MIT.txt','utf8').includes('MIT License'));
});
