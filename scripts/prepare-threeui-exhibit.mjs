/** Reproducible, explicitly modified offline adapter. No dependency installation. */
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('public/exhibits/threeui');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const original=await readFile(resolve(root,'original.html.txt'));
const canonicalSha256='606f200fed8602c243f40a11c8c364f0e625c57f80e7c97dc76419da207f198e';
if(hash(original)!==canonicalSha256)throw Error('Canonical ThreeUI source checksum mismatch');
const files=['build/three.module.js','examples/jsm/controls/OrbitControls.js','examples/jsm/environments/RoomEnvironment.js','examples/jsm/geometries/RoundedBoxGeometry.js','examples/jsm/lights/RectAreaLightUniformsLib.js'];
// Optional copy from an independently integrity-verified three@0.165.0 npm extraction.
const upstream=process.argv[2];
if(upstream)for(const file of files){const target=resolve(root,'vendor',file);await mkdir(dirname(target),{recursive:true});await copyFile(resolve(upstream,file),target)}
let html=original.toString('utf8');
html=html.replace(/  <link rel="preconnect"[^>]+>\n/g,'').replace(/  <link\s+href="https:\/\/fonts.googleapis.com[^>]+>\n/g,'');
html=html.replace('https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js','./vendor/build/three.module.js').replace('https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/','./vendor/examples/jsm/');
html=html.replace('<head>','<head>\n<!-- Offline adapter of ThreeUI Working Volumes by Meng To (MIT). See licenses/ThreeUI-MIT.txt.\nCanonical bytes preserved in original.html.txt; this derivative removes remote font requests and self-hosts pinned Three.js. -->\n<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\'; connect-src \'none\'; object-src \'none\'; base-uri \'none\'; form-action \'none\'">');
// System font is intentional: no external font request and no unrelated font asset redistribution.
html=html.replaceAll('"Inter"','"system-ui"').replaceAll('Inter,','system-ui,').replace('600 82px Inter','600 82px system-ui');
// A narrow same-origin lifecycle bridge suspends the separate renderer offscreen.
html=html.replace('let reducedMotion = reducedMotionQuery.matches;', 'let hostReduced = new URLSearchParams(location.search).get("motion") === "reduced"; let reducedMotion = reducedMotionQuery.matches || hostReduced;');
html=html.replace('let suspended = false;', 'let embeddedVisible = true; let suspended = false;');
html=html.replace('suspended = document.hidden;', 'suspended = document.hidden || !embeddedVisible;');
html=html.replace('reducedMotion = event.matches;', 'reducedMotion = event.matches || hostReduced;');
html=html.replace('async function initialize() {', `window.addEventListener('message', event => {
      if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'saksham-exhibit-activity') return;
      embeddedVisible = event.data.visible === true;
      hostReduced = event.data.reduced === true;
      if (ready) { onReducedMotionChange({ matches: reducedMotionQuery.matches }); onVisibilityChange(); }
    });
    async function initialize() {`);
// Keep authored interaction behavior while bounding optional software-renderer cost.
html=html.replace('let renderer;', 'let renderer; let economy = false;');
html=html.replace('renderer.outputColorSpace = THREE.SRGBColorSpace;', `const debug = renderer.getContext().getExtension('WEBGL_debug_renderer_info');
      const deviceRenderer = debug ? String(renderer.getContext().getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
      economy = /swiftshader|llvmpipe|software/i.test(deviceRenderer) || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) || window.innerWidth < 820;
      renderer.outputColorSpace = THREE.SRGBColorSpace;`);
html=html.replace('renderer.shadowMap.enabled = true;', 'renderer.shadowMap.enabled = !economy;');
html=html.replace('key.shadow.mapSize.set(2048, 2048);', 'key.shadow.mapSize.set(1024, 1024);');
html=html.replace('const pmremGenerator = new THREE.PMREMGenerator(renderer);', 'if (!economy) { const pmremGenerator = new THREE.PMREMGenerator(renderer);');
html=html.replace('pmremGenerator.dispose();', 'pmremGenerator.dispose(); }');
html=html.replace('viewWidth < 820 ? 1.5 : 2', 'economy ? 1 : 1.35');
if(/https?:\/\//.test(html))throw Error('Unexpected remote dependency in adapted source');
await writeFile(resolve(root,'index.html'),html);
const entries={};for(const file of files)entries['vendor/'+file]=hash(await readFile(resolve(root,'vendor',file)));
const manifest={source:'@designcodeio/threeui@1.2.0 — CompleteShelfLandingPage',author:'Meng To / ThreeUI',license:'MIT',canonicalSha256,adapterSha256:hash(html),threeVersion:'0.165.0',files:entries,changes:['Self-host Three.js 0.165.0 and four required addons','Replace Google Inter stylesheet with system-ui fallback','Add attribution comment and restrictive offline CSP','Adaptive economy rendering: omit software/mobile shadows and environment capture; bound desktop shadows/DPR','Validated same-origin host messages pause offscreen rendering and honor device-local reduced-effects preference']};
await writeFile(resolve(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Verified ${relative(process.cwd(),root)}: canonical ${canonicalSha256}; adapter ${manifest.adapterSha256}`);
