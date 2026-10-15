import {chromium} from '@playwright/test';
import sharp from 'sharp';
const target=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(target);await page.locator('.canvas-wrap canvas').waitFor();await page.waitForTimeout(1200);
 await sharp(await page.screenshot()).webp({quality:85}).toFile('docs/qa/production-webgl.webp');
 await page.getByRole('button',{name:'Pause 3D'}).click();if(await page.locator('.canvas-wrap').count())throw Error('Pause did not remove the canvas');
 if(errors.length)throw Error(errors.join('\n'));console.log('Actual production WebGL canvas and pause control passed; no application page errors.');
}finally{await browser.close()}
