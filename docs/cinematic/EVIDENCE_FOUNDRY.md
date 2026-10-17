# Evidence Foundry — unpublished quality benchmark

This study responds to the owner's rejection of the previous release's cinematic quality. Functional tests and Lighthouse are not artistic acceptance. Production remains unchanged; do not merge, push an automatic public preview, or deploy this study before owner inspection and explicit approval. The existing feature branch and all prior work remain authoritative.

## Art direction

A current enters a machined graphite chamber, opens into silver membranes, passes through a refractive aperture, and reorganizes into an archive of source leaves. Arctic silver, graphite ceramic, restrained champagne reflections, deep structural shadows and a continuous camera provide the visual language. The environment is original; no MORPHO artwork, product, branding, video or source code is used in the application.

The supplied desktop/mobile MORPHO recordings remain the reference for framing, material contrast, large changes in scale, continuity through an opening and controlled text timing. They show a detailed product, a passage through its opening and photographic water/lifestyle environments. This study is a real-time, entirely modeled engineering chamber: it does not claim photographic scenery, ocean simulation, commercial production parity or artistic acceptance.

## Forty-second storyboard

| Native scroll / review time | Camera and geometry | Typography / meaning |
| --- | --- | --- |
|0–20% /0–8s|Oblique wide approach, layered process bed and six continuous folded silver skins; close-range pointer response|Before an answer, a current. Information is unstructured; artwork, not a live model.|
|20–40% /8–16s|Camera descends into the flow; the same topology opens into separate long layers|Let the structure surface. Relates to extraction/chunking, not an actual document rendering.|
|40–60% /16–24s|Camera travels between structures and through an opening, with six articulated aperture leaves and thin-volume glass|Through the noise. Into context. The archive is conceptual, not embedding coordinates.|
|60–80% /24–32s|Flowing forms reorganize into source-leaf backing geometry; archive leaves assemble on the rear dais|Many fragments. One useful context. Retrieval keeps the source connection.|
|80–100% /32–40s|Camera arcs across the archive, selected leaves advance; the first membranes remain as source-leaf backing instead of disappearing|An answer needs somewhere to stand. Direct links lead to the untouched real SourceLens preview/workspace.|

Normal wheel/touch scrolling is never intercepted. The optional40-second playback scrolls the actual page and is interrupted by user wheel, touch, navigation keys or Stop. Chapter buttons and a labelled native range support deliberate review. Typography follows the presented camera phase rather than jumping ahead to the scroll target. The path is reversible; there is no compulsory intro.

## Asset and rendering production

- `scripts/build-foundry-assets.py`: original Blender4.3.2 source for layered process bed, recessed gutters, asymmetric buttresses, embedded lights, ceiling baffles, inlet and archive dais. Immutable geometry is batched by material and simplified. Six chamfered aperture leaves remain articulated. Compact rendering removes subpixel inlays and reduces the architectural depth subdivisions; it retains the same chamber and aperture. The self-contained915KB GLB and174KB compact variant are committed; ordinary development/builds do not require Blender.
- `membrane.ts`: six bounded surfaces, each with consistent topology through folded, separated and source-leaf poses; normals are computed per pose and seams close exactly. GPU morph streams on capable devices, fewer longitudinal samples and CPU vertex blending in software rendering. A critically damped response handles irregular frame intervals without camera jumps.
- `studio-material.ts`: original angular studio light field, metallic Fresnel/environment reflections, advected periodic curl-field microstructure, atmospheric distance falloff and a thin-volume glass shader. Capable desktop uses an offscreen background for screen-space refraction/controlled dispersion and a bounded planar floor reflection. Glass has no multi-bounce ray tracing or physically accurate caustics. `?optics=full` is a local diagnostic to exercise these passes on software hardware.
- `fluid.ts`: locally generated periodic noise potential/curl texture, a bounded linearized shallow-water height/velocity solver and pointer pressure impulses. This is not full Navier–Stokes CFD, real mercury, an ocean simulation or inference.
- `scene.tsx`: one renderer, five authored shots, adaptive DPR, renderer diagnostics, resource disposal, resize handling, view/document/modal suspension and explicit context/asset/half-float-capability failure fallback. Archive backing geometry and atlas-mapped page faces use two instanced draws with consistent matrices. No renderer per card, new dependency, service or inference. The existing root renderer is ineligible on this study route.

Mobile keeps the same storyboard but has wider/higher framing, fewer membrane/pool vertices, a smaller field and refracted environment lighting instead of screen-space refraction and planar reflection. Reduced motion/no-JavaScript/WebGL failure expose all five semantic articles and original source/workspace links. Motion can be reduced, material time paused and the sequence skipped. The model artwork explicitly identifies its conceptual status.

## Review location

Unpublished route: `/cinematic-study/`. Use the documented existing Windows loopback workflow, not the unsupported cloud-to-desktop port-forwarding. The refreshed source bundle includes all original history/features and this local candidate; no cloud changes automatically synchronize to Windows.

Final measurements, browser outcomes and actual recording review are written alongside the downloadable recordings after execution. Rendering performance is distinct from encoded video FPS. Physical GPU/Android/Edge measurements remain unavailable in the cloud environment.
