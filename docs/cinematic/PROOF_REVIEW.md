# Cinematic proof: Home + SourceLens

Historical prototype checkpoint. The owner subsequently approved this baseline and authorized the complete portfolio transformation and production release after all mandatory checks pass. See COMPLETE_EDITION.md for the current scope. The evidence below describes the prototype, not new measurements for the completed edition.

## Open the proof

Use the latest `saksham-portfolio-feature.bundle` and WINDOWS_REVIEW.md. Existing review checkouts can fast-forward their local feature branch from that bundle; no public push is needed. Fresh clones need Git for Windows, Node 24 and npm ci. Start:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3300
```

On that Windows computer, review Home at `http://127.0.0.1:3300/` and SourceLens at `http://127.0.0.1:3300/projects/sourcelens/`. Keep the terminal running. This local process does not automatically synchronize cloud edits. Cloud-to-desktop forwarding is unavailable with the exposed integration; no repeated tunnel attempts or public preview deployment were made.

## Implemented scenes

- **Home / Potential:** original folded, curved silver lamellae above a procedural fluid surface; identity and immediate project navigation. Small pointer movement affects camera composition and the fluid field.
- **Home / Structure:** sheets separate and rotate into a passage while the camera advances through the same environment. Typography crossfades with native scroll; reverse travel is supported.
- **Home / Systems:** sheets reorganize into three assemblies that accompany document retrieval, matching and pose geometry. Keyboard/pointer project selection lifts the corresponding assembly; links open the existing project pages.
- **Home / Laboratory:** camera pulls back to a wide view and hands off to the preserved selected-work grid and all original professional/technical content.
- **SourceLens / Archive:** a distinct layered document structure opens into the extraction passage, contracts into a conceptual retrieval field, then forms evidence columns around a citation frame. These are illustrations, not model output, actual embeddings, scores or real uploaded documents.
- The complete original SourceLens case study, original cloud preview, Full App workspace, recorded cases, interactive architecture, evidence, limitations and source links remain below the new opening.

## Architecture and motion

One route-aware WebGL stage persists through client navigation between Home and SourceLens; browser tests verify canvas identity at desktop and mobile sizes. Desktop uses R3F; compact devices use a small native WebGL2 instancing backend that downloads only Three math classes. Both use the same geometry, materials and camera keyframes, with one active backend rather than parallel canvases. A typed timeline coordinates camera/focus, instanced geometry, assembly transforms and semantic chapter state. Native scrolling, direct links, skip, pointer interaction and reverse scrolling work without a scroll-hijacking library. No dependencies or remote assets were added.

The desktop studio environment is generated locally with PMREM. Hardware rendering uses physical metal/clearcoat and a small transmissive prism. Compact devices use simpler materials/geometry in the native backend. Software renderers use an original inexpensive silver shader, capped resolution and adaptive quality. Unused reflection generation and expensive prism materials are skipped on software renderers. The GLSL surface is an artistic fluid study, not a physical fluid simulation. Lighting, material response and environment remain consistent across both proof pages.

Pause atmosphere freezes ambient motion while retaining scroll navigation. Reduced effects follow the existing persisted preference; system reduced motion always wins. No-JavaScript/reduced-motion states expose readable chapters; context failure shows an explicit notice with a manual retry. The introductory scene stops drawing offscreen/when hidden and yields to the preserved architecture world. Navigating away removes its Canvas and diagnostics. The original eight project worlds remain intact; two contexts can be retained on SourceLens after visiting both sections, but tests assert that at most one renderer is active.

## Verification

- Lint, strict TypeScript, all 12 unit/provenance/geometry tests and the production static export with `/saksham-portfolio` pass.
- The full 26-test browser regression passes against the actual static build, including three cinematic tests, all eight workspaces/previews, original demos/worlds, native/fallback dialogs, PDF checksum/download, professional content, keyboard, reduced motion, no-WebGL and sampled axe checks.
- An early-click regression was found and fixed by making initial cinematic layout stable before WebGL readiness. A no-JS/mobile overflow and a close-camera blank-wall composition were also fixed. Assertions were retained; obsolete old-hero selectors were replaced by equivalent new controls and rendering checks. Final frame review then found overlapping chapter headings: the handoff now clears one heading before revealing the next and makes faded links inert. Six final targeted browser checks pass, including the transition, first-chapter project opening, main journey, keyboard/reduced motion and no-JavaScript behavior.
- Desktop/mobile scroll and reverse-scroll captures are genuine browser screencast frames. Software WebGL and capture overhead limit their fidelity; video encoding frame rate is not a render-performance measurement.
- All existing public assets, professional/source registry data, original demo/preview/workspace code, dependencies, deployment configuration and workflows are unchanged from the approved release. Existing source/provenance integrity tests confirm the resume/media/exhibit bytes.

## Review evidence and limits

Actual captures and machine-readable results are under `/tmp/cinematic-review/final-proof`. Browser recordings are available for Home and SourceLens at 1440×900 and 390×844. They are compared with the `before-*` recordings in the parent directory and the captured MORPHO desktop/mobile sequences. Reference visuals informed composition, pacing and scene continuity; no third-party model, footage, branding, font or code was copied.

A stationary six-second Home software-rendering sample after warmup measured approximately 28 fps desktop / 59 fps mobile after optimization (median frame times 33.1 ms / 16.7 ms, p95 52.3 ms / 16.8 ms). Desktop adapted to DPR .45, mobile to .65. These are cloud Chromium/SwiftShader samples, not physical Windows/GPU results or guarantees across scroll/transitions. Earlier samples were substantially slower; hiding inactive assemblies and removing an unnecessary shaded under-surface reduced the initial scene from 25 to 3 draw calls. Both offscreen samples recorded zero additional scene frames; leaving via client navigation removed the Canvas and diagnostics. GPU memory bytes and physical GPU timing are not exposed. Resource counts are renderer object counts (Three.js on desktop, native mesh bookkeeping on compact devices), not a VRAM measurement.

The full-quality physical material path still needs review on the owner's graphics-accelerated Windows browser. The software fallback intentionally trades material fidelity/resolution for responsiveness. Desktop software rendering remains below the 60 fps ambition. Do not describe this as having reached MORPHO-level polish or complete production readiness. Artistic acceptance remains the owner's checkpoint; remaining portfolio routes have deliberately not been redesigned before that review.

## Mandatory scope after visual approval

The complete transformation includes all eight projects—SourceLens, CareerLens, FORM, StudyBuddy, PyMentor, Airbnb regression, logistic diabetes classification and random-forest diabetes classification—and every major portfolio page: Home, Project Laboratory, About, Skills, Experience/Education, Certifications, Resume and Contact. Each project needs its own structural identity, camera choreography and source-grounded interactions, not one scene recolored. All current functionality remains available. This two-page proof is the first review gate, not the final scope. Extension is pending explicit owner approval; merging/deployment requires approval as well.

## Loading-performance evidence

Mobile Lighthouse simulations against the local static export after the compact-backend optimization: Home **94 performance / 100 accessibility / 100 best practices / 100 SEO**, LCP 2.0 s, CLS 0, TBT 280 ms; SourceLens **91/100/100/100**, LCP 2.4 s, CLS 0, TBT 330 ms. An unchanged CareerLens workspace control measured 98/98/100/100, LCP 2.3 s, CLS 0, TBT 90 ms. These are lab samples, not public-production measurements, field INP or guarantees. The earlier Home 67 / SourceLens 68 samples exposed the unnecessary software reflection setup and larger renderer startup; those results are not represented as passing. Both proof pages now meet the requested Lighthouse score target in this run.
