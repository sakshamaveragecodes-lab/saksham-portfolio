import {test,expect} from '@playwright/test';
import {projects} from '../../src/lib/projects';
import {projectDetails} from '../../src/lib/project-details';
const prefix=new URL(process.env.TEST_BASE_URL||'http://127.0.0.1:3000').pathname.replace(/\/$/,'');
test.setTimeout(120000);

test('every project has accessible, distinct 3D guided architecture',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const p of projects){
  const errors:string[]=[];const catchError=(e:Error)=>errors.push(e.message);page.on('pageerror',catchError);
  await page.goto(`${prefix}/projects/${p.slug}/`);
  await expect(page.getByRole('link',{name:'3D Walkthrough'})).toHaveAttribute('href','#world');
  const world=page.locator('.project-world');
  await expect(world).toBeVisible();
  await expect(world.getByRole('heading',{name:'Explore the system in motion.'})).toBeVisible();
  const expected=projectDetails[p.slug].stages;
  await expect(world.locator('.world-stage-list button')).toHaveCount(p.steps.length);
  await expect(world.locator('.world-css-fallback')).toBeVisible();
  await expect(world.locator('canvas')).toHaveCount(0);
  await world.getByRole('button',{name:`Stage ${p.steps.length}: ${p.steps.at(-1)}`}).click();
  await expect(world.locator('.world-readout h3')).toHaveText(p.steps.at(-1)!);
  await expect(world.locator('.world-readout p')).toHaveText(expected.at(-1)!);
  await expect(world.getByRole('button',{name:'Auto tour'})).toBeDisabled();
  await world.getByRole('button',{name:'Reset walkthrough'}).click();
  await expect(world.locator('.world-readout h3')).toHaveText(p.steps[0]);
  await expect(world.locator('.world-stage-list button').first()).toHaveAttribute('aria-pressed','true');
  expect(errors,p.slug).toEqual([]);page.off('pageerror',catchError);
 }
});

test('motion layer remains decorative and core content is immediately available',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(prefix+'/about/');
 await expect(page.locator('body')).toHaveAttribute('data-route','about');
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.locator('.reading-progress')).toHaveAttribute('aria-hidden','true');
 await page.goto(prefix+'/projects/sourcelens/');
 await expect(page.locator('body')).toHaveAttribute('data-route','project');
 await expect(page.locator('.world-readout')).toContainText('Validate bounded PDF uploads');
});
