# Development preview diagnosis — 16 October 2026

Update: see REFERENCE_ACCESS.md and WINDOWS_REVIEW.md. MORPHO now renders in cloud Chromium; prior access failures below are historical. Private cloud-to-desktop forwarding remains unavailable; use the exact-feature-branch Git bundle for Windows review.

No production changes. Existing feature branch: `feat/immersive-engineering-worlds`.

## What was verified

`npm run dev -- --port 3300` starts Next 15.5.28, listening on 0.0.0.0:3300. Cloud-internal Chromium renders both Home and SourceLens at desktop and mobile sizes. Four scroll recordings and screenshots were captured. All four pages return 200 with no runtime page errors or horizontal document overflow. Desktop Home renders WebGL; mobile Home intentionally uses the existing lightweight fallback.

A separate real browser journey from Home → Project Lab → SourceLens observed 13 Next asset responses, zero failed requests, zero HTTP errors, zero JavaScript console/page errors and an established `/_next/webpack-hmr` WebSocket. The final actual URL inside that browser was `http://127.0.0.1:3300/projects/sourcelens/`. HMR transport is connected; live editing on the owner's desktop has not been verified.

Codex desktop browser-open was attempted with both 127.0.0.1:3300 and localhost:3300. Both returned `queued`, not a reachable private preview URL. The owner reported a blank tab. No tool is available to inspect that desktop tab's address bar/console/network requests or provision private forwarding. Cloud loopback and desktop loopback are separate network namespaces unless the host provides a bridge. The application is demonstrably rendering inside the cloud; the evidence points to missing desktop-to-cloud preview connectivity. Exact desktop request failure cannot be observed with available tools.

Do not advertise these internal loopback addresses as remote preview links. Do not use a public tunnel, expose project directories or deploy an unfinished redesign. The server stays alive during this session, but processes do not survive environment restoration.

Existing dev warnings: autoprefixer suggests `flex-end` for one CSS value; Next warns about future allowedDevOrigins enforcement. Neither prevented local HTML, assets or HMR from loading. No speculative CORS/CSP weakening was introduced.

## Safe local alternative

On the owner's computer, use a local checkout of the existing repository and feature branch:

```sh
cd saksham-portfolio
git switch feat/immersive-engineering-worlds
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3300
```

Then open `http://127.0.0.1:3300/` on **that same computer**; SourceLens is `/projects/sourcelens/`. No Pages base path is needed in development. This is an independent local dev process; it cannot observe edits made in the cloud unless source changes are transferred. It does not restore a private cloud live preview.

A source archive generated from the current workspace's tracked files plus the cinematic documentation is available at `/tmp/cinematic-review/saksham-portfolio-development.tar.gz`. It excludes `.git`, credentials, dependencies and generated outputs. Extract to a separate local folder and run the same install/dev commands (omit `git switch` for the archive). The archive is refreshed at implementation checkpoints. The complete edition is described in COMPLETE_EDITION.md, with historical prototype evidence in PROOF_REVIEW.md; prefer the feature-branch Git bundle when retaining branch history.

## Evidence and review

Cloud-local artifacts under `/tmp/cinematic-review`:

- `preview-diagnosis.json`: HTTP/asset/HMR/console observations.
- `baseline.json`: four desktop/mobile route capture results.
- `before-home-desktop.mp4`, `before-home-mobile.mp4`.
- `before-sourcelens-desktop.mp4`, `before-sourcelens-mobile.mp4`.
- matching PNG screenshots and timestamped captured frame sequences.

Videos are genuine Chromium screencast frames encoded with the installed system FFmpeg, preserving captured elapsed timing. The unavailable Playwright FFmpeg download was not bypassed with an unverified binary. Captures use headless Chromium/SwiftShader software WebGL; they are baseline evidence, not a physical-GPU frame-rate claim or the proposed redesign. Output encoding at 24 fps does not establish rendering at 24/60 fps.

MORPHO could not be rendered on desktop or mobile (`ERR_TUNNEL_CONNECTION_FAILED`). The environment configuration draft preserves previous allowlist entries and adds morphowater.com/www.morphowater.com. The host requires review/save/publish before changes can affect permitted egress. Saving a draft is not successful runtime access. If reference access remains unavailable, obtain an owner-provided desktop/mobile scroll and interaction video before claiming reference-based artistic calibration.
