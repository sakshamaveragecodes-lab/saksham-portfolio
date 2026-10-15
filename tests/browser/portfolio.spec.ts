import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {projects} from '../../src/lib/projects';
const prefix=new URL(process.env.TEST_BASE_URL||'http://127.0.0.1:3000').pathname.replace(/\/$/,'');
test('main journey, filters, flagship demo, architecture and source',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(prefix+'/');await expect(page.getByRole('heading',{level:1})).toContainText('Intelligence');
 await page.getByRole('link',{name:'Explore the project lab'}).click();await expect(page).toHaveURL(/\/projects\//);
 await page.getByRole('textbox',{name:'Search projects'}).fill('SourceLens');await expect(page.locator('.project-card')).toHaveCount(1);
 await page.getByRole('link',{name:/SourceLens/}).last().click();await expect(page.getByRole('heading',{level:1})).toHaveText('SourceLens');
 await page.getByRole('button',{name:'Inspect recorded answer'}).click();await expect(page.locator('blockquote')).toContainText('24 days');
 await page.getByRole('link',{name:'Architecture',exact:true}).click();await page.getByRole('button',{name:/FAISS retrieval/}).click();await expect(page.locator('.architecture-readout h3')).toHaveText('FAISS retrieval');
 await expect(page.getByRole('link',{name:'Source code'})).toHaveAttribute('href',/github.com\/sakshamaveragecodes-lab\/sourcelens-rag-chatbot/);
 await page.getByRole('link',{name:'Resume',exact:true}).click();await expect(page.getByRole('heading',{name:'Official PDF awaiting publication.'})).toBeVisible();
 await page.getByRole('link',{name:/Let’s connect/}).first().click();await expect(page.getByRole('link',{name:/Find me on GitHub/})).toHaveAttribute('href','https://github.com/sakshamaveragecodes-lab');
 expect(errors).toEqual([]);
});
test('CareerLens component updates scores and FORM computes real replay reps',async({page})=>{
 await page.goto(prefix+'/projects/careerlens/');await page.getByRole('button',{name:'Clear skills'}).click();await expect(page.locator('.score-number')).toContainText('0.0');
 await page.getByLabel('Python',{exact:true}).check();await expect(page.locator('.score-number')).not.toContainText('0.0');
 await page.getByLabel('Target role').selectOption('0');await expect(page.getByLabel('SQL',{exact:true})).toBeVisible();
 await page.goto(prefix+'/projects/form/');await page.getByRole('button',{name:'Run 12-second replay'}).click();await expect(page.locator('.pose-stats')).toContainText('3');await expect(page.locator('.pose-stats')).toContainText('Replay complete');
 await page.getByLabel('Exercise',{exact:true}).selectOption('curl');await expect(page.getByLabel('Replay position')).toHaveValue('0');
});
test('all routes, assets, anchors and metadata are valid',async({page,request})=>{
 const paths=['/','/about/','/skills/','/experience/','/certifications/','/resume/','/contact/','/privacy/','/projects/',...projects.map(p=>`/projects/${p.slug}/`)];
 for(const path of paths){const response=await page.goto(prefix+path);expect(response?.status(),path).toBe(200);await expect(page.locator('h1')).toHaveCount(1);expect(await page.title()).toContain('Saksham');
 const bad=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(el=>(el as HTMLAnchorElement).hash).filter(hash=>hash&&!document.getElementById(decodeURIComponent(hash.slice(1)))));expect(bad,path).toEqual([]);
 for(const src of await page.locator('img').evaluateAll(els=>els.map(i=>i.getAttribute('src')!))){expect((await request.get(src)).status(),src).toBe(200)} }
 expect((await request.get(prefix+'/not-a-real-page/')).status()).toBe(404);
 expect((await request.get(prefix+'/sitemap.xml')).status()).toBe(200);expect((await request.get(prefix+'/robots.txt')).status()).toBe(200);
});
for(const width of [390,768,1440]){test(`responsive layouts and visual evidence ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:950});await page.emulateMedia({reducedMotion:'reduce'});
 for(const path of ['/','/projects/','/projects/careerlens/','/projects/form/','/about/','/contact/']){await page.goto(prefix+path);await page.waitForTimeout(150);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBeTruthy();await page.screenshot({path:`test-results/screenshots/${width}-${path.replaceAll('/','_')||'home'}.png`,fullPage:true});}
 if(width===390){await page.goto(prefix+'/');await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('link',{name:'Project lab',exact:true}).click();await expect(page).toHaveURL(/\/projects\//);await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');}
});}
test('keyboard navigation, reduced motion and accessibility scans',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(prefix+'/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('.canvas-wrap')).toHaveCount(0);
 for(const path of ['/','/projects/','/projects/careerlens/','/projects/form/','/contact/','/resume/']){await page.goto(prefix+path);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),path).toEqual([])}
});
test('search empty state and category/technology filters work',async({page})=>{await page.goto(prefix+'/projects/');await page.getByRole('button',{name:'Machine Learning',exact:true}).click();await expect(page.locator('.project-card')).toHaveCount(3);await page.getByRole('combobox',{name:'Filter by technology'}).selectOption('React');await expect(page.getByRole('heading',{name:'No matching projects.'})).toBeVisible();await page.getByRole('button',{name:'Reset filters'}).click();await expect(page.locator('.project-card')).toHaveCount(8);await page.getByRole('button',{name:'Depth view'}).click();await expect(page.getByRole('button',{name:'Grid view'})).toHaveAttribute('aria-pressed','true')});
test('initial static HTML exposes content without JavaScript',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto(`${process.env.TEST_BASE_URL||'http://127.0.0.1:3000'}/`);await expect(page.getByRole('heading',{name:'Intelligence, engineered.'})).toBeVisible();await expect(page.getByRole('heading',{name:'Ideas, brought into focus.'})).toBeVisible();await context.close()});
test('guided pipelines, stored metrics, refusal cases and actual video work',async({page})=>{
 await page.goto(prefix+'/projects/sourcelens/');await page.getByLabel('Recorded question').selectOption('4');await page.getByRole('button',{name:'Inspect recorded answer'}).click();await expect(page.locator('.demo-output blockquote')).not.toBeEmpty();await expect(page.locator('.demo-output small')).toContainText('Authored synthetic corpus');
 for(const slug of ['studybuddy','pymentor']){await page.goto(`${prefix}/projects/${slug}/`);const before=await page.locator('.demo-output pre').textContent();await page.getByRole('button',{name:'Next stage'}).click();await expect(page.locator('.demo-output pre')).not.toHaveText(before!);}
 for(const slug of ['airbnb','logistic-diabetes','random-forest-diabetes']){await page.goto(`${prefix}/projects/${slug}/`);const choice=page.locator('.metric-choices button').nth(1);await choice.click();await expect(choice).toHaveAttribute('aria-pressed','true');await expect(page.locator('.demo-output')).toContainText('STORED RESULT');}
 await page.goto(prefix+'/projects/careerlens/');await page.locator('video').evaluate(async(video:HTMLVideoElement)=>{video.muted=true;await video.play()});await expect.poll(()=>page.locator('video').evaluate((video:HTMLVideoElement)=>video.currentTime)).toBeGreaterThan(0);await page.locator('video').evaluate((video:HTMLVideoElement)=>video.pause());
});
