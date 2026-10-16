# Project Saksham

## Current milestone

Immersive edition in progress on feat/immersive-engineering-worlds, based on actual latest remote 6441cd7 (origin/main tracking ref was stale; fetch refspec only updates origin/HEAD). Baseline lint, strict TS, eight unit/provenance tests, static production export and all sixteen browser tests passed at the Pages prefix (50.7 s). Preserve current cloud previews and existing project worlds. Implementation and local QA complete: eight source-grounded full-app workspaces, isolated MIT-credited ThreeUI exhibit (exact canonical checksum), improved hero/world lifecycle and site interactions. Latest lint, TS, ten unit/provenance tests, static export and all 23 browser tests pass. Skills contrast and dynamic exhibit control naming were corrected without weakening checks. Full app, preview, resume, actual SwiftShader, economy/offscreen behavior and modal fallbacks verified. Homepage local mobile lab sample 99/100/100/100, LCP 1.9 s, CLS 0. Remaining local mobile samples: SourceLens 99/100/100/100 (LCP 2.1 s); CareerLens workspace 98/98/100/100 (LCP 2.2 s); all CLS 0. Initial JS Home 109 kB unchanged, cases 130 kB (+2), workspaces 137 kB. PR #2 opened. Initial CI found graphics warm-up timing and fallback-dialog focus timing; graphics capability probes are now deferred until an allowed scene enters view, and fallback focus runs after the open dialog is committed. Both affected browser scenarios pass locally; rendered-canvas assertions remain mandatory with a bounded 20-second initialization budget and project-specific diagnostics. Await updated full CI, then merge and verify Pages. The legacy Vercel preview still fails independently of the Pages release. No paid services or new runtime backend.

Preview/explanation upgrade: implemented one shared source-backed preview for all eight existing projects, with workflow stages, genuine mobile screenshots where available, labelled terminal/notebook views, full-size image panning and an accessible native fullscreen dialog. Added audience/takeaway summaries and precise original-architecture explanations. No homepage, hero, dependencies, backend or paid services changed. Original demos preserved; CareerLens recording moved into a disclosure in Preview. Lint, TypeScript, eight unit/provenance tests, static Pages export and all 14 local browser tests passed. All preview source paths verified in the eight pinned GitHub trees. Representative desktop/mobile/fullscreen screenshots inspected. Published application commit a43477711d4aec0c5c44520b18782256394e9063; Pages run 38808860949 and verify run 38808860928 both succeeded. All 14 browser tests also passed against the actual public HTTPS URL (51.8 s), and production screenshots were inspected. Production CareerLens Lighthouse mobile sample: 100/100/100/100, LCP 1.3 s, CLS 0, TBT 50 ms; page-specific cloud-proxy lab run, no field INP. No routine manual action or new cost. See docs/PROJECT_PREVIEWS.md and docs/qa/preview-upgrade-local.json.
Production published and verified: https://sakshamaveragecodes-lab.github.io/saksham-portfolio/

Initial release record (before the resume update): application commit 33d5bebc3249e2d6847cabfd40809ae5d6b50c99 deployed successfully by run 38799584642; verify run 38799584095 also passed. All ten browser tests passed against the actual public site with normal TLS verification and supported cloud CA/proxy configuration. Real production WebGL and pause control passed. Production Lighthouse 13.5.0 mobile lab run: 100/100/100/100, LCP 1.3 s, CLS 0, TBT 60 ms. This is a single lab run through the cloud proxy, not field INP or a performance guarantee.

Official resume update is published and verified (16 October 2026). User supplied the original PDF; its bytes are preserved under public/documents/Saksham_Jadhav_AI_Engineer_Resume.pdf, SHA256 7b6219b010f443301b7a75756ebcf531b1f227300d897d9b4e1fb6e10f82a130. Do not request another upload. Education, UNLOX program, two resume-sourced credentials, About/Home positioning and contact email are updated. BCA end date is expected; Trivion is a credential partner, not asserted employment. Credentials are not independently issuer-authenticated. All 11 public browser tests passed, including actual download/hash/viewer, nine-route axe scans, desktop/tablet/mobile and email. Native PDF rendering was visually inspected after load on desktop and mobile. The framing-header bug was fixed for same-origin PDF responses. CI explicitly uses full Chromium for native PDF viewer support and passed after the earlier browser-runner failure. Current resume-release Lighthouse mobile lab run: 94/100/100/100, LCP 2.0 s, CLS 0. No field INP or unlimited free hosting claims. Core resume release application commit: 3a3826e01647e0a75c2946ce5efb7b122b5cacc5; CI browser configuration update: 013f5a947cced0f94a9382eb1f8d1c218b158741.

CivicMerge and additional private evaluation work remain unverified without accessible sanitized sources. No issuer certificate verification links were provided; this is explicitly stated on the credentials page. No further owner action is needed for the published resume update.

User authorizes application creation, commits, pushes and free deployment. This supersedes earlier setup-only file restrictions. The Pages setting is already enabled: do not ask for it again.

## Evidence
- Portfolio checkout is empty, unborn `work` branch; origin is correct.
- Eight nonempty project repos retrieved read-only into `/tmp/portfolio-evidence`; public GitHub profile confirms nine project repositories plus portfolio. PYTHON-FUNDAMENTALS empty.
- SourceLens, CareerLens, FORM source, recorded validation and actual screenshots exist. Records are historical source evidence, not tests rerun here.
- CivicMerge repo guessed name not found. Public endpoint blocked by current egress proxy; no features verified.
- No resume PDF/DOCX in workspace, /tmp or /home/agent. Authorized history reveals attachment exists in another conversation but does not expose attachment contents/ID.
- No VERCEL or CLOUDFLARE credential variables. Git HTTPS reads work. GitHub API and Vercel destinations blocked (403 proxy). Required domains saved additively to existing empty custom allowlist; draft does not apply runtime changes.
- Existing Node 24, npm 11, Chromium available.

## Architecture
Static-export Next.js, strict TS, self-hosted assets, lazy R3F hero, static case-study registry, browser algorithms and labelled guided demos. No API/database/runtime inference. No private personal info or invented professional history.

## Blocked inputs
Latest official resume required for education, certifications, official PDF download and professional email. Vercel authenticated logs or GitHub Pages enablement required. Continue independent verification.

## Implementation and QA
- Eight case studies, searchable/filterable lab, original procedural R3F hero, reduced-motion/mobile fallback, SVG architecture stage explorer, project-linked skills and honest missing-document states implemented.
- CareerLens port verified against 156 original sklearn fixtures across 13 profiles. FORM uses original source geometry on synthetic landmarks. No original full-model inference is hosted.
- 7 algorithm/provenance tests passed; 10 browser tests passed. Axe WCAG scans found no violations on six representative routes. Responsive screenshots captured at 390/768/1440px and inspected. WebGL rendering and pause control verified separately using software WebGL; no browser application errors.
- Corrected missing Airbnb image using actual report capture, explicit exercise label and selected architecture-number contrast.
- Removed root loading boundary after Lighthouse exposed delayed SSR content/CLS. Static content now available without JavaScript.
- Lighthouse 12.8.2 local mobile compressed export: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.9 s, CLS 0, TBT 90 ms. These are lab metrics; no field INP or production metrics claimed.
- 18 public GitHub/profile/source-snapshot links returned HTTP 200. Production dependency audit: zero advisories. Development tools were updated; full dependency audit now reports zero advisories.
- Official resume/credentials/email remain absent, so those required features cannot be completed with truthful content.

- Authorized professional-history review found additional Oli evaluation work, but the source/archive is on another local machine and includes private evidence. It is not published or described as employment. No raw conversations are copied into the repository.
- Final complete npm audit (including development dependencies): zero advisories after replacing deprecated Next lint config dependency chain with explicit TypeScript/React/a11y rules and updating Lighthouse. Next build emits a non-failing notice that its optional lint plugin is absent; strict TypeScript, React hook and accessibility lint rules run separately.

## Release checkpoint
- Initial implementation commit 64b7b85cdd178c40450ee2ff81063155d1345dcf pushed to remote main. GitHub verify run 38797963130 passed.
- Vercel Git integration failed deployment dpl_6G3mzZCwsTopXLg4a9ye3LFtstrQ. Public status provides no cause; authenticated logs return 403. Actual preview is saksham-portfolio-h7d2qcvl9-sakshamaveragecodes-labs-projects.vercel.app.
- The guessed saksham-portfolio.vercel.app is another person's site. It is not this project. Canonical URLs corrected to the planned GitHub Pages address through shared site config; no personal information from that unrelated site is copied.
- GitHub API authentication now works as the owner, with repo admin/push flag. Enabling GitHub Pages through POST /repos/.../pages returned 403 Resource not accessible by integration. This scoped permission limitation is not bypassed. Async question asks owner to enable Pages (GitHub Actions source) or provide authenticated Vercel build logs; user selected GitHub Pages. The setting itself has not yet been observed enabled; do not treat the option selection as a completed external change.
- Same-repository GitHub Pages workflow and prefix-aware assets/canonical/robots/test tooling prepared. Root-host Vercel builds remain supported through build-time site URL and base-path config.
- Lighthouse 13.5.0 on unchanged application also measured 99/100/100/100; LCP 1.8 s, CLS 0, TBT 120 ms.
- Saved reusable install_script/start_skill and updated necessary network domains in environment draft. Saving does not publish configuration.

- Pages path build passed all ten browser tests (including production CSP) at local /saksham-portfolio/. Pages publish workflow 38798973733 failed at configure-pages because the repository site is not enabled; build/deploy steps were skipped. This is an account configuration blocker, not an application build failure.

## Final local release evidence
- Initial and Pages-preparation verify workflows both passed in GitHub Actions (38797963130, 38798973846).
- Final project-path local Lighthouse 13.5.0: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 120 ms. Production/field metrics unmeasured.
- Public-repo Pages eligibility verified against official github/docs source; actual site is still disabled. Publish workflow failure is isolated to configure-pages, with remaining build/deploy steps skipped.
- Latest source dimensions come from actual media metadata to reserve accurate layout space. No source application or credential was modified.

## Publishing resumed
- The owner enabled Pages with workflow source; GET /repos/.../pages now returns the intended HTTPS URL. No duplicate repository or Vercel project was created.
- Run 38799584642 built, linted and tested commit 33d5beb successfully and is publishing the Pages artifact. Await deployment status, then run all browser journeys against the public URL.
- Environment draft now records the real committed repository snapshot and complete tested setup/start instructions. It is saved, not published.

## Resume update local verification
- Build, lint, strict TypeScript, seven algorithm tests and all eleven browser tests passed.
- Browser PDF download and HTTP body match the original uploaded file SHA-256 exactly. Embedded PDF is rendered with fit-width navigation; a visual check caught the original global anti-framing header. PDF responses now permit same-origin framing while the app retains its deny policy. Regression test checks failed PDF requests/error frames.
- Nine routes received axe scans. Responsive screenshots for resume, experience and credentials were captured at 390/768/1440px, inspected and showed no document overflow.
- Ready to push, deploy and repeat browser checks on the actual public release.
