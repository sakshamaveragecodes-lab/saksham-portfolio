import {test,expect,chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const origin=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
test('cinematic scroll changes spatial state, supports reverse travel and yields to original project functionality',async()=>{
 test.setTimeout(120000);
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||(process.env.CI?undefined:'/usr/bin/chromium'),channel:process.env.CI&&!process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?'chromium':undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{const page=await browser.newPage({viewport:{width:1280,height:800}});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/');await expect(page.locator('html')).toHaveAttribute('data-cinema-ready','true',{timeout:20000});await expect(page.locator('[data-cinema-renderer] canvas')).toHaveCount(1);
 await page.evaluate(()=>{const s=document.querySelector<HTMLElement>('[data-cinematic-story]')!;scrollTo({top:s.offsetTop-87+(s.offsetHeight-innerHeight)*2/3,behavior:'instant'})});
 await expect(page.locator('[data-cinema-chapter="2"]')).toHaveAttribute('data-current','true');await page.getByRole('link',{name:'SourceLens ↗',exact:true}).focus();await expect(page.getByRole('link',{name:'SourceLens ↗',exact:true})).toBeFocused();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(page.locator('[data-cinema-chapter="0"]')).toHaveAttribute('data-current','true');
 await page.getByRole('link',{name:'Skip introduction ↓',exact:true}).click();await expect(page).toHaveURL(/#selected-work$/);await expect(page.locator('[data-cinema-renderer]')).toHaveAttribute('data-active','false');
 await page.goto(origin+'/projects/sourcelens/');await expect(page.locator('[data-cinematic-story]')).toHaveAttribute('data-cinematic-story','source');await page.getByRole('link',{name:'Skip introduction ↓',exact:true}).click();await expect(page.locator('h1')).toHaveText('SourceLens');await page.locator('#preview').scrollIntoViewIfNeeded();await expect(page.getByRole('link',{name:'Explore Full App',exact:true}).first()).toBeVisible();
 await page.locator('#world').scrollIntoViewIfNeeded();await expect(page.locator('[data-cinema-renderer]')).toHaveAttribute('data-active','false');await expect(page.locator('.project-world canvas')).toBeVisible({timeout:20000});
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(page.locator('[data-cinema-renderer]')).toHaveAttribute('data-active','true');await page.locator('[data-cinema-renderer] canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('[data-cinema-renderer]')).toHaveCount(0);await expect(page.locator('[data-cinema-chapter="3"]')).not.toHaveAttribute('inert','');expect(errors).toEqual([]);
 }finally{await browser.close()}
});
test('cinematic pages remain readable, keyboard accessible and free of sampled axe violations with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/projects/sourcelens/']){await page.goto(origin+path);await expect(page.locator('[data-cinema-renderer]')).toHaveCount(0);await expect(page.locator('[data-cinema-chapter="3"]')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])}
});
