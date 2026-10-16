# Reference and review connection diagnosis — 16 October 2026

## Current result

**MORPHO can now be visually inspected in cloud Chromium. Private cloud-to-desktop development forwarding remains unavailable with the exposed tools.** These are separate outcomes. No application source, public preview, deployment configuration or production content changed.

### Private development preview

One further Codex built-in browser request used `http://127.0.0.1:3300/`, as explicitly requested by the owner. It returned `queued` again; it did not provision or identify a private forwarding address. The owner previously observed a blank/New Tab. There is no callable forwarding tool or desktop tab inspection API in the current tool inventory. Do not retry this same loopback connection as a remedy.

Cloud-internal HTTP remains 200 and the existing browser journey/JavaScript/asset/HMR checks passed. This proves application readiness in the cloud, not desktop access. We cannot read the actual desktop tab URL, response, console or request failures. The exact desktop failure is therefore unobserved; the missing supported bridge is the actionable platform limitation.

The safe review alternative is the exact existing feature branch exported as a Git bundle: `/tmp/cinematic-review/saksham-portfolio-feature.bundle`. Complete history and branch restoration prerequisites are verified by `git bundle verify`. See WINDOWS_REVIEW.md for PowerShell commands, loopback-only binding and limits. User-side Windows execution is still unverified. No new Codex task, public source push, remote tunnel, merge or deployment is involved. Cloud edits do not synchronize into the Windows clone automatically.

### MORPHO network checks

- Both morphowater.com and www.morphowater.com are present in saved configuration draft revision 8; policy is restricted. The exposed configuration API reports a draft, not the complete applied runtime allowlist.
- Local `getaddrinfo` fails with EAI_AGAIN / temporary name resolution failure for both MORPHO hosts **and github.com**. This is a broad local resolver observation. Supported HTTPS proxy requests work despite it; do not bypass that proxy or infer host-specific DNS failure.
- `https://morphowater.com/?lang=en`: proxy CONNECT 200, final HTTPS 200, zero redirects, curl exit 0.
- `https://www.morphowater.com/?lang=en`: proxy CONNECT 200, HTTPS 301 to `https://morphowater.com/?lang=en`, final HTTPS 200, one redirect, curl exit 0.
- Earlier ERR_TUNNEL_CONNECTION_FAILED is no longer reproduced. The prior draft included the required domains, but we cannot identify which outside runtime change restored access. No TLS checks were disabled; no direct connection bypass or proxy credentials were exposed.
- A desktop Codex browser-open request for the exact English URL returned `queued`. Desktop rendering remains unobserved. Cloud visual inspection now succeeds, so desktop access is not required to inspect the sampled reference sequences.

### Actual visual inspection

Chromium used the supported HTTPS proxy, normal TLS verification and software WebGL. Captured desktop 1440×900 and mobile 390×844. Essential-only consent was selected. Real wheel events traversed the opening scroll story and subsequent imagery. Sampled frames were opened and inspected; no claims are based on HTML alone.

Observed visual composition: initial can framed by oversized light typography; can reorients to an overhead view; the opening chapter gives way to full-viewport waterfall footage; typography is recomposed over moving natural footage; later desktop imagery includes a translucent globe/location treatment over a landscape/lifestyle transition. Mobile uses a narrower can composition and stacked text with the same opening narrative. These observations are creative references only. No branding, models, footage, fonts, shaders or implementation code is copied into the portfolio.

The sample traversed approximately 8,500 desktop / 6,000 mobile CSS pixels, not every commercial page or all seven chapters. This is not a complete audit of all interactions, audio, timing on physical hardware or accessibility. User recordings are no longer required to unblock these sampled reference observations; additional recordings remain useful for any unsampled interaction the owner wants emphasized.

No page runtime exceptions or HTTP errors were observed. The Cloudflare analytics beacon was blocked by the reference's CSP. A cascade video request was aborted during scrolling in each run; sampled video elements nevertheless reached readyState 4 and advanced playback time. Do not claim all reference assets/behaviors were exhaustively verified.

Evidence outside the checkout:

- `/tmp/cinematic-review/morpho-inspection.json`: exact captured states, failures and errors.
- `morpho-desktop-scroll.mp4`, `morpho-mobile-scroll.mp4`: genuine timestamped screencast frame sequences encoded with system FFmpeg.
- `morpho-{desktop,mobile}-chapter-{0..4}.png`: inspected chapter captures.
- 136 desktop / 177 mobile original captured JPEG frames.

The 24-fps video encoding is an output format, not a measured rendering-performance claim. Actual review can now use these captures and the Windows local workflow, with the lack of synchronized cloud live preview clearly disclosed. Cinematic implementation remains paused in this issue-resolution step; no visual approval or deployment approval has been inferred.
