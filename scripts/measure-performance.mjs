import {chromium} from '@playwright/test';
import lighthouse from 'lighthouse';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const target=(process.env.TEST_BASE_URL||'http://127.0.0.1:3200/saksham-portfolio').replace(/\/$/,'');
const address=target.startsWith('https:')?(process.env.HTTPS_PROXY||process.env.HTTP_PROXY):undefined;
const u=address?new URL(address):undefined;
const proxy=u?{server:`${u.protocol}//${u.host}`,username:decodeURIComponent(u.username)||undefined,password:decodeURIComponent(u.password)||undefined}:undefined;
const profile=await mkdtemp(join(tmpdir(),'saksham-performance-'));
const browser=await chromium.launchPersistentContext(profile,{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,proxy,args:['--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=9344']});
const pages=[];
try{for(const path of (process.env.PERFORMANCE_PATHS?.split(',')||['/','/projects/sourcelens/','/projects/careerlens/experience/'])){const {lhr:r}=await lighthouse(target+path,{port:9344,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});if(r.runtimeError)throw Error(JSON.stringify(r.runtimeError));pages.push({url:r.finalDisplayedUrl,executed:r.fetchTime,scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time'].map(k=>[k,{value:r.audits[k].numericValue,display:r.audits[k].displayValue}]))});console.log(JSON.stringify(pages.at(-1)))}await writeFile(process.env.PERFORMANCE_OUTPUT||'/tmp/immersive-performance.json',JSON.stringify({scope:'One mobile Lighthouse simulation per representative page; lab samples, not field INP or performance guarantees',tool:'Lighthouse',fieldINP:'Not measured',pages},null,2)+'\n')}finally{await browser.close();await rm(profile,{recursive:true,force:true})}
