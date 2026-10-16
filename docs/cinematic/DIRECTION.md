# Cinematic proof — direction pending reference inspection

Status: original storyboard retained for context. Home and SourceLens proof is now implemented and verified; see PROOF_REVIEW.md for the current build, results and remaining owner-review gate.

## Reference and preview evidence

- On 16 October 2026, real Chromium desktop (1440 × 900) and mobile (390 × 844) navigation to https://morphowater.com/ both failed with `ERR_TUNNEL_CONNECTION_FAILED`. No visual or motion claims about MORPHO can be made. A desktop/mobile scroll recording from the owner is needed if permitted egress does not resolve access.
- Existing feature branch `feat/immersive-engineering-worlds`, starting at d39ff75, was clean. No new worktree/task/agent or public deployment.
- `npm run dev -- --port 3300` starts successfully; internal homepage request returns 200 with identity and SourceLens. Codex `open_in_codex` returned `queued`, which does not prove desktop reachability. No callable private forwarding mechanism was found. Never substitute an unrestricted tunnel or a public unfinished deployment.
- Safe fallback: actual browser-captured recordings/screenshots plus this locally runnable checkout. Baseline captures live under `/tmp/cinematic-review`; they show the existing release, not the proposed work.

## Proposed art direction: The Evidence Observatory

Intelligence as an explorable world. A continuous architectural volume, built from suspended document lamellae, cut-metal instrument rails and a luminous evidence channel. Obsidian background; silver readable typography; pale blue transmitted light; a single warm-white focal signal. The scene has a recognizable silhouette and physical scale, rather than an orb or particle field.

The visual protagonist is a folded, open structure: many thin information sheets arranged around an off-axis path. Through the journey it opens into distinct working environments. Empty space is deliberate: text sits in clear composition zones, with geometry framing rather than covering it. Materials use fine roughness, restrained reflections and local light. Refraction is an optional quality enhancement, not a prerequisite for legibility.

Camera language: slow lateral dolly, a controlled passage between layers, then a wider reveal. No spinning cameras, forced intro, scroll hijacking or repeated reset between chapters. Pointer displacement stays small and returns gently to the authored composition. Touch receives an authored centered composition, not pointer emulation. Links are immediately available.

## Homepage storyboard

| Chapter | Scroll interval within introduction | Spatial action | Content and purpose |
| --- | --- | --- | --- |
| 01 / Potential | 0–18% | Camera looks across a dark folded archive; one illuminated cut exposes the interior. Gentle material response follows the pointer. | Saksham’s identity, current verified positioning and immediate Project Lab CTA. |
| 02 / Structure | 18–42% | A lateral camera move separates the lamellae into connected input lanes. A bounded pulse traverses those lanes; no random particle backdrop. | Existing retrieval/language/vision/software competencies appear in the open composition zone. |
| 03 / Systems | 42–68% | The lanes reorganize into three different assemblies: evidence archive, matching instrument, pose framework. Camera travels through the same space instead of swapping canvases. | SourceLens, CareerLens and FORM are revealed with their actual descriptions and honest demo modes. |
| 04 / Laboratory | 68–88% | Camera pulls back to disclose the three assemblies as part of the larger observatory. Their labels remain semantic links. Keyboard focus creates the same selection feedback as pointer hover. | Existing selected project content; clear access to all eight projects and conventional lab search. |
| 05 / Invitation | 88–100% | Lights settle; the scene hands off into the existing technical content with a continuous horizon and no blocking transition. | Existing engineering principles, skills, resume and contact remain readable. |

The scene does not claim to show real model internals, learned embedding coordinates or inference results. Use a concise conceptual-visualization disclosure. Preserve the original professional copy and project summaries.

## SourceLens proof storyboard

1. **Enter the archive:** the homepage evidence assembly becomes a larger layered document corridor. Clear project title/actions remain available from first paint. A conceptual/source-backed label is visible.
2. **Extract:** planar sheets separate into bounded, page-linked fragments. Text explains the actual documented extraction/chunking stages; geometry itself is illustrative.
3. **Retrieve:** camera follows a query pathway across a finite evidence volume. Selection highlights the associated source-backed architecture stage. Do not invent similarity values or embedding coordinates.
4. **Ground:** fragments converge into a citation frame with a deliberate empty branch for insufficient evidence. Use the existing stored synthetic cases only when showing actual recorded outputs.
5. **Hand off:** open the original application preview, Full App workspace, demonstration and architecture sections. They retain their controls, links, evidence, limitations and sources. The scene yields rendering resources when the existing architecture visualization becomes active.

All chapters can be skipped. Existing anchor navigation remains usable. The initial proof does not redesign the other seven project pages or professional routes before owner review.

## Architecture decision

Current infrastructure: isolated lazy `HeroArt`/`Scene`; per-project `ProjectWorld`; `SiteMotion` owns minor DOM reveals and pointer tilt. No central camera or chapter timeline exists. Retain these working components until the proof is accepted; do not copy their local effects into another parallel system.

Proposed proof architecture:

- A lazy route-aware `EngineeringUniverse` mounted once under the root layout for Home and SourceLens. One persistent R3F Canvas, original geometry/material modules, no new choreography dependency initially.
- A pure typed chapter timeline owns normalized scroll progress, camera position/look target, assembly transforms, lighting and matching DOM composition progress. Use authored endpoints and smooth interpolation. Native scroll is the source of truth; direct anchor jumps and reverse scrolling must remain deterministic.
- One small controller measures chapter bounds with ResizeObserver and updates mutable frame state through passive scroll listeners. No React rerender per frame. Camera damping is delta-time based and clamps long resume gaps.
- Native semantic content remains server-rendered; decorative Canvas uses `aria-hidden`. No CSS hides critical text pending JS/WebGL. Chapter controls and Skip introduction are normal keyboard-accessible controls/links.
- Route changes preserve the renderer but reset chapter measurements and explicitly dispose removed scene geometry/material resources. Restrict pointer listeners to the intended stage; do not intercept links or touch scrolling.
- Integrate existing `useEffectsAllowed` preference, document visibility and rendering activity. Existing project-world Canvas must never render concurrently with the cinematic scene. An explicit activity owner coordinates the handoff; merely hiding a Canvas is insufficient.
- Reduced motion: immediate semantic layout and static authored illustration; no continuous camera/shader movement. WebGL creation/context failure follows the same readable fallback. Mobile gets a shorter storyboard, closer geometry crops, fewer instances and DPR cap.
- Adaptive quality: start conservatively; measure frame intervals after warmup, lower DPR/detail if sustained overruns occur. Do not equate software WebGL timing with physical GPU performance. Refraction/postprocessing only if measured cost permits it.
- No fetched assets, APIs, tracking, backend or new hosting dependency. Base-path-safe local assets; static export unchanged.

## Proof acceptance, before extension

Capture old/new homepage and SourceLens scroll, reverse scroll and keyboard/direct-anchor travel at desktop/mobile sizes. Record actual frames/video with renderer/platform disclosed. Inspect focal composition, geometry continuity and readable typography at chapter boundaries. Check scene lifecycle, reduced effects, WebGL unavailable/lost, visibility suspension, route changes, scrolling responsiveness and focus.

Rerun existing previews, Full App workspace, demo, architecture, source link, PDF and contact journeys; lint, strict TS, unit/provenance tests, build with Pages base path and relevant browser/axe checks. Measure frame-time distribution, major transferred resources and loading performance, with test hardware/software limits explicit. No claim of MORPHO-level quality or 60 fps without evidence.

Review deliverable: actual unpublished interactive preview if a supported private route exists; otherwise recordings/screenshots and runnable development instructions, clearly labelled as a limitation. Owner visual approval is required before extending the direction, and final approval is required before production merge/deployment.
