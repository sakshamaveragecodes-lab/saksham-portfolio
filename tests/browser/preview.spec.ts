import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {projects} from '../../src/lib/projects';
import {projectDetails} from '../../src/lib/project-details';
test.setTimeout(120000);
const prefix=new URL(process.env.TEST_BASE_URL||'http://127.0.0.1:3000').pathname.replace(/\/$/,'');
for(const width of [390,1440])test(`all eight source previews, stages and viewport controls at ${width}px`,async({page,request})=>{
 await page.setViewportSize({width,height:950});await page.emulateMedia({reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const p of projects){const d=projectDetails[p.slug];await page.goto(`${prefix}/projects/${p.slug}/`);await page.getByRole('link',{name:'Preview',exact:true}).click();const preview=page.locator('.project-preview');
  await expect(preview).toContainText('This frame does not host the original application');await expect(preview.getByRole('link',{name:'Try the demonstration'})).toHaveAttribute('href','#demo');
  for(let i=0;i<d.slides.length;i++){await preview.getByRole('button',{name:`Preview stage ${i+1}: ${d.slides[i].title}`,exact:true}).click();await expect(preview.locator('.preview-caption h3')).toHaveText(d.slides[i].title);
   if(d.slides[i].image){await expect(preview.locator('.preview-image')).toHaveClass('preview-image is-ready');expect(await preview.locator('img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0)}else{await expect(preview.locator('pre')).toHaveText(d.slides[i].code!)}
   const source=preview.getByRole('link',{name:'Inspect source artifact'});await expect(source).toHaveAttribute('href',`${p.source}/blob/${p.commit}/${d.slides[i].source}`);
  }
  await preview.getByRole('button',{name:'Next preview stage'}).click();await expect(preview.locator('.preview-caption h3')).toHaveText(d.slides[0].title);
  if(d.slides[0].image){const zoom=preview.getByRole('button',{name:'Full-size image'});await zoom.click();await expect(zoom).toHaveAttribute('aria-pressed','true');await expect(preview.locator('.preview-window')).toHaveClass(/preview-detail/);await preview.getByRole('region',{name:'Scrollable source preview'}).focus();await page.keyboard.press('ArrowRight');await zoom.click();}
  await preview.getByRole('button',{name:'Previous preview stage'}).click();await expect(preview.locator('.preview-caption h3')).toHaveText(d.slides.at(-1)!.title);
  await preview.getByRole('button',{name:'Narrow',exact:true}).click();await expect(preview.locator('.preview-window')).toHaveClass(/preview-narrow/);await expect(preview).toContainText(d.narrow?'Actual mobile capture':'Same artifact · narrow viewing frame');
  expect(await preview.locator('.preview-viewport').evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration))).toBe(0);
  if(d.narrow){await expect(preview.locator('.preview-image')).toHaveClass('preview-image is-ready');expect((await request.get(prefix+d.narrow)).status()).toBe(200)}
  await preview.getByRole('button',{name:'Desktop',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),p.slug).toBeTruthy();
  await preview.screenshot({path:`test-results/screenshots/preview-${p.slug}-${width}.png`});
  await preview.getByRole('button',{name:'Expand application preview'}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('button',{name:'Close expanded preview'})).toBeFocused();
  await dialog.getByRole('button',{name:'Next preview stage'}).click();await expect(dialog.locator('.preview-caption h3')).toHaveText(d.slides[0].title);
  await page.keyboard.press('Shift+Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBeTruthy();await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(preview.getByRole('button',{name:'Expand application preview'})).toBeFocused();
  await preview.getByRole('link',{name:'Try the demonstration'}).click();await expect(page).toHaveURL(/#demo$/);await expect(page.locator('#demo h2')).toHaveText('Explore the behavior.');
  await page.locator('#architecture button').first().click();await expect(page.locator('.architecture-readout p')).toHaveText(d.stages[0]);
 }
 expect(errors).toEqual([]);
});
test('preview and expanded viewer accessibility, close control and image failure fallback',async({page})=>{
 for(const slug of ['sourcelens','pymentor','random-forest-diabetes']){
  await page.goto(`${prefix}/projects/${slug}/`);await page.getByRole('link',{name:'Preview',exact:true}).click();
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations).toEqual([]);
  await page.getByRole('button',{name:'Expand application preview'}).click();const expanded=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(expanded.violations).toEqual([]);
  await page.getByRole('button',{name:'Close expanded preview'}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
 }
 await page.route('**/media/previews/studybuddy-home.webp',route=>route.abort());await page.goto(`${prefix}/projects/studybuddy/`);await page.getByRole('link',{name:'Preview',exact:true}).click();await expect(page.getByText('Capture could not load.')).toBeVisible();await expect(page.getByRole('link',{name:'Open image directly'})).toHaveAttribute('href',prefix+'/media/previews/studybuddy-home.webp');await page.getByRole('button',{name:'Next preview stage'}).click();await expect(page.locator('.preview-image')).toHaveClass('preview-image is-ready');
});
