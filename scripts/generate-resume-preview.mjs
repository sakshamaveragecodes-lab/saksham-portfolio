/** Local, reproducible derivative; never modifies the official PDF. Requires Poppler. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdtemp,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import sharp from 'sharp';
const source='public/documents/Saksham_Jadhav_AI_Engineer_Resume.pdf',expected='7b6219b010f443301b7a75756ebcf531b1f227300d897d9b4e1fb6e10f82a130';
if(createHash('sha256').update(await readFile(source)).digest('hex')!==expected)throw Error('Official source changed; review provenance before regenerating');
const dir=await mkdtemp(join(tmpdir(),'saksham-resume-'));
try{const prefix=join(dir,'page');execFileSync('pdftoppm',['-f','1','-singlefile','-scale-to','1800','-png',source,prefix]);await mkdir('public/documents/preview',{recursive:true});await sharp(prefix+'.png').webp({quality:88}).toFile('public/documents/preview/resume-page-1.webp');
const text=execFileSync('pdftotext',['-layout',source,'-'],{encoding:'utf8'}).replace(/(?:\+91[\s-]*)?[6-9](?:[\s-]*\d){9}/g,'[phone omitted from text preview]').replace(/\f/g,'').trim();
await writeFile('src/lib/resume-preview.json',JSON.stringify({sourceSha256:expected,width:1273,height:1800,text},null,2)+'\n');console.log('Generated original-page WebP and extracted text; official PDF unchanged.');}finally{await rm(dir,{recursive:true,force:true})}
