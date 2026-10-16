# Verification and release status

**Public production:** https://sakshamaveragecodes-lab.github.io/saksham-portfolio/

The initial application at commit `33d5bebc3249e2d6847cabfd40809ae5d6b50c99` was published by [GitHub Actions run 38799584642](https://github.com/sakshamaveragecodes-lab/saksham-portfolio/actions/runs/38799584642). Its separate verify workflow also passed. Production behavior was checked in Chromium; deployment success alone was not treated as verification.

The official resume/profile update at `3a3826e01647e0a75c2946ce5efb7b122b5cacc5` was published by run 38802583632. The full-Chromium CI configuration at `013f5a947cced0f94a9382eb1f8d1c218b158741` passed verify run 38803288093 and publish run 38803287756.

## Immersive edition local release gate

The feature branch continues from the current production source `6441cd7`; no previous preview or professional source was removed. Lint, strict TypeScript, ten algorithm/provenance tests and the static build pass. All 23 browser tests pass in one final run (see `qa/immersive-local-browser.json`), including all eight application workspaces, the original previews/demos/PDF, desktop/mobile/tablet, axe, keyboard, reduced effects, native/fallback dialogs, actual software WebGL, viewport suspension, context loss and the credited exhibit’s real page-turning controls. Screenshots were inspected and representative captures retained. Automated checks are not an exhaustive accessibility certification or physical-device test.

One local mobile Lighthouse sample per route measured Home **99/100/100/100** (LCP 1.9 s), SourceLens case study **99/100/100/100** (LCP 2.1 s), and CareerLens workspace **98/98/100/100** (LCP 2.2 s). All three recorded CLS 0. These are lab simulations, not field INP or guarantees; see `qa/immersive-lighthouse-local.json`. Initial JS remains 109 kB on Home (baseline 109 kB), 130 kB on case studies (baseline 128 kB), and 137 kB on new workspaces. The 3.4 MB optional exhibit assets are not loaded by ordinary portfolio pages. No dependency was added; npm audit reports zero advisories, with vendored source checked separately.

Reference licensing and canonical/adapter integrity are documented in `THIRD_PARTY_REFERENCES.md`; source behavior and maintenance in `IMMERSIVE_EDITION.md`. Production verification is performed after the PR release, separately from these local results.

## Application preview upgrade

Application commit `a43477711d4aec0c5c44520b18782256394e9063` deployed successfully through Pages run [38808860949](https://github.com/sakshamaveragecodes-lab/saksham-portfolio/actions/runs/38808860949); verify run [38808860928](https://github.com/sakshamaveragecodes-lab/saksham-portfolio/actions/runs/38808860928) also passed. Lint, strict TypeScript, eight unit/provenance tests, the static production export and all 14 local browser tests passed. All 14 tests then passed against the actual public HTTPS site in 51.8 seconds, with certificate verification enabled. See `qa/preview-upgrade-production.json`.

The suite visits every stage of all eight previews at 390 and 1440 pixels, inspects full-size images and genuine mobile captures, tests modal closing/focus containment/return, reduced motion, graceful failed-image recovery, source links, original demos, video playback, resume download/checksum and contact links. Existing 768-pixel coverage remains. Automated axe scans cover nine existing representative routes plus three additional preview types in page and expanded-dialog states; no sampled WCAG A/AA violations were found. This is not a complete accessibility or physical-device certification. Representative production screenshot, terminal, notebook, mobile and expanded-view images were inspected.

All source artifact paths were verified through their eight pinned GitHub trees (`qa/preview-source-links.json`); local image dimensions and hashes are in `qa/preview-media.json`. No original model tests were rerun or newly implied. The native viewer’s cached-image loading issue was fixed rather than relaxing assertions. No dependencies or hosting services were added. See `PROJECT_PREVIEWS.md` for maintenance and demonstration boundaries.

## Actual production checks

**Latest resume update:** all 11 public-site browser tests passed, including actual native viewer loading, real download events, original PDF checksum, education, program, two resume-listed credentials and the professional email link. The original 10-test release record below is retained as historical evidence. See `qa/resume-update-production.json`.


- **10 Playwright tests passed** against the public HTTPS URL. They cover the recruiter journey, filters, actual scoring/replay updates, architecture selection, all 17 content routes, local assets, anchors, 404, sitemap, mobile navigation, keyboard skip navigation, reduced motion, guided pipelines, stored metric controls, real video playback and initial HTML without JavaScript.
- Axe scans on six representative routes reported no WCAG A/AA violations. This is automated evidence, not a complete accessibility certification.
- Desktop/tablet/mobile screenshots at 1440, 768 and 390 CSS pixels were captured. Representative production screenshots were inspected; no sampled route had document-level horizontal overflow.
- The actual WebGL hero rendered over the production URL with software WebGL, its pause control worked and no application page errors were observed. This is not a physical-device GPU compatibility claim.
- Chromium initially lacked the cloud proxy CA. The platform-supplied CA was trusted in the browser-test execution context, and Playwright's API asset requests were configured to use the supported HTTPS proxy. Final tests preserved certificate verification; no ignore-certificate flags were used.
- `qa/production-browser-summary.json` records the final passing production run. Earlier environment trust/DNS failures were diagnosed and superseded, not labelled passing.

## Measured performance

The preview upgrade’s **CareerLens project page** measured **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, LCP **1.3 s**, CLS **0**, TBT **50 ms**, in one production mobile simulation through the cloud proxy. See `qa/preview-upgrade-lighthouse-production.json`. Its local mobile simulation also scored 100 in the four standard categories (LCP 1.9 s, CLS 0). These are page-specific lab samples, not site-wide guarantees or field INP. The homepage was not modified by this upgrade; its earlier measurements below retain their original release scope.

The latest resume/profile release mobile lab run measured **94 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, LCP **2.0 s**, CLS **0**, TBT **170 ms**. See `qa/resume-update-lighthouse.json`. This remains a single simulation through the cloud proxy, not field INP. The earlier initial-release measurements below are historical.


Lighthouse 13.5.0 performed **one mobile simulation against the production URL through this cloud environment's egress proxy**:

| Metric | Production run |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.3 seconds |
| CLS | 0 |
| Total blocking time | 60 ms |

`qa/lighthouse-production.json` preserves the timestamp and scope. These are lab measurements, not field data or guarantees across networks/devices. **Real-user INP is unmeasured.** No analytics service was added.

A separate local project-path run scored 99/100/100/100, LCP 1.8 s, CLS 0 and TBT 120 ms (`qa/lighthouse-local.json`). The first development candidate scored 77: a root loading boundary delayed the static content and shifted the footer. Removing that boundary resolved the layout shift. Static content is now visible without JavaScript.

## Build, algorithm and source checks

- Frozen `npm ci`, strict TypeScript, lint and production static export passed locally and in GitHub CI.
- **7 algorithm/provenance tests passed**, including 156 scoring fixtures generated by the original Python/sklearn JobMatcher across all 13 role profiles and actual FORM geometry replay checks.
- Ten local browser tests also passed for root hosting and the project-path build. Four routing/responsive tests were rerun after exact media dimensions were added; all passed.
- Eighteen public GitHub/profile/source-snapshot links returned HTTP 200 (`qa/link-audit.json`).
- The complete dependency audit reported **zero known advisories**, including development tools (`qa/dependency-audit.json`). Advisory checks reflect the registry database at execution time, not a vulnerability-free guarantee.
- A targeted source-secret scan passed. No API routes, database, hosted inference, analytics or runtime credentials were introduced.
- Next prints a non-failing notice that its optional lint plugin is absent. Explicit TypeScript, React hook and JSX accessibility lint rules run and pass. GitHub also reports upstream action-runtime migration notices; the workflows completed successfully.

## Demonstration contracts

| Project | Mode | Executed or displayed here |
| --- | --- | --- |
| SourceLens | GUIDED_DEMO | Original stored synthetic evaluation cases, outputs and citations; no Qwen/MiniLM inference |
| CareerLens | CLIENT_SIDE_INTERACTIVE | Source-derived scoring formula and role data; actual original video; no resume parser |
| FORM | CLIENT_SIDE_INTERACTIVE | Original geometry engine on labelled synthetic landmarks; no camera or MediaPipe inference |
| StudyBuddy | GUIDED_DEMO | Source-backed local-inference stages and actual screenshot |
| PyMentor | GUIDED_DEMO | Prompt/model/parser pipeline stages; no Gemini API calls |
| Airbnb regression | GUIDED_DEMO | Stored metrics, interpretation and original report image |
| Logistic diabetes | GUIDED_DEMO | Recorded evaluation metrics and notebook plot; no patient inputs |
| Random forest diabetes | GUIDED_DEMO | Recorded metrics and confusion matrix; no patient inputs |

No original application is labelled LIVE. Historical project test records are attributed to their source repositories, not presented as full application suites rerun by the portfolio.

## ₹0 infrastructure and release history

The repository is public. GitHub's official [Pages availability source](https://github.com/github/docs/blob/main/data/reusables/gated-features/pages.md) confirms public-repository Pages is available on GitHub Free. The application uses static export, the provider-generated HTTPS address and standard public-repository Actions. No paid plan, purchased domain, database, API subscription, card payment or duplicate Vercel project was created. Provider quotas still apply.

The existing Vercel integration attempted deployment and failed; authenticated build logs were unavailable. The similarly named `saksham-portfolio.vercel.app` belongs to another person and is not this portfolio. GitHub Pages was initially disabled, and the scoped GitHub integration could not enable it (HTTP 403). The owner enabled the GitHub Actions source, after which the publishing workflow succeeded. The Vercel failure does not block the verified Pages deployment.

Production HTML applies a CSP meta policy. GitHub Pages cannot apply arbitrary custom HTTP headers; `vercel.json` additionally supplies headers if a future verified Vercel deployment is used. There are no privileged browser operations or sensitive inputs in these demos.

## Remaining content limitations

1. The official resume is now supplied and published unchanged. Its education, program, credential and professional email details are transcribed into the site. Credential details are resume-sourced; separate certificates and public issuer verification links were not supplied, so independent issuer authentication is not claimed.
2. CivicMerge source was not accessible, and its supplied endpoint returned a proxy denial. Its capabilities remain unpublished. Python Fundamentals is empty. Additional professional evaluation work was found in authorized history, but its sanitized source archive was unavailable; private transcripts were not published.
3. Field INP, physical-device testing and large-scale accessibility/performance testing remain unmeasured.

## Reproduce

```sh
npm ci
npm run lint
npm test
NEXT_PUBLIC_BASE_PATH=/saksham-portfolio NEXT_PUBLIC_SITE_URL=https://sakshamaveragecodes-lab.github.io/saksham-portfolio npm run build
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/saksham-portfolio npm start
# Against the running local export:
TEST_BASE_URL=http://127.0.0.1:3000/saksham-portfolio npm run test:e2e
# Against production:
TEST_BASE_URL=https://sakshamaveragecodes-lab.github.io/saksham-portfolio npm run test:e2e -- --timeout=120000
npm audit
```

Cloud Chromium must trust the environment's platform CA, just as its system HTTP client does. If required, import the supplied `/usr/local/share/ca-certificates/environment-proxy-ca.crt` into the Chromium NSS trust database in the browser-test execution context using supported permissions. Do not disable TLS verification. `scripts/verify-webgl.mjs` additionally checks the live 3D scene using software WebGL.

## Official resume update

Source received 16 October 2026: one-page owner-supplied official PDF. Published SHA-256: `7b6219b010f443301b7a75756ebcf531b1f227300d897d9b4e1fb6e10f82a130` (original bytes preserved). PDF structure inspection identified a standard initial-view destination and a content-credentials attachment, rather than an executable initial action. Professional contact information is present; no residential address or government identifier was identified. The phone number remains only in the official PDF.

The resume viewer, download and professional email action are implemented. BCA education is explicitly in progress with an expected June 2027 completion. UNLOX is presented as an internship and project-based learning program; Trivion is the partner named by the resume, not an asserted employer. Two credentials are labelled resume-sourced without implying independent issuer verification. Updated verification results are recorded in `qa/resume-update-local.json` and `qa/resume-update-production.json` after execution.

The resume update passed lint, TypeScript, production export, seven algorithm tests and all eleven local and public browser tests. Axe coverage now includes nine representative routes. PDF download bytes and native viewer behavior were tested separately; the original global framing-denial header was narrowed for same-origin PDF responses. The app retains its framing-denial policy. Full Chromium is explicitly selected in CI for native PDF viewer support; the rerun passed. CI failures are now surfaced as check annotations so diagnostics do not rely solely on the separate runner log archive.
