// Keep actual test failures inspectable through GitHub's Checks API when the
// environment cannot download the runner's separate log archive.
import {readFile} from 'node:fs/promises';
const report=JSON.parse(await readFile('test-results/browser-results.json','utf8'));
const escape=value=>String(value).replace(/\u001b\[[0-9;]*m/g,'').replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A');
function visit(suite){
 for(const spec of suite.specs||[])for(const test of spec.tests||[])for(const result of test.results||[]){
  if(result.status==='passed'||result.status==='skipped')continue;
  const error=result.error?.message||result.errors?.map(e=>e.message).join('\n')||`Status: ${result.status}`;
  process.stdout.write(`::error title=${escape(spec.title).replaceAll(',','%2C').replaceAll(':','%3A')}::${escape(error)}\n`);
 }
 for(const child of suite.suites||[])visit(child);
}
for(const suite of report.suites)visit(suite);
