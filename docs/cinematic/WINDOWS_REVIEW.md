# Private Windows review workflow

This is the fallback for the unsupported cloud-to-desktop forwarding path. It uses the same repository and feature branch; no production merge, push or deployment is involved. It does not synchronize cloud edits automatically.

## Prerequisites

Use Git for Windows and Node.js 24 (the version used by this workspace). In PowerShell, `git --version` and `node --version` should succeed. `npm.cmd` below avoids PowerShell's npm.ps1 execution-policy issue without changing your execution policy.

## Restore this exact feature branch privately

Download `saksham-portfolio-feature.bundle` from this conversation to Downloads. The bundle contains the existing `feat/immersive-engineering-worlds` branch and complete Git history, including local documentation commits. It excludes local Git configuration, credential stores, node_modules and generated build outputs. Its integrity and complete-history status were checked using `git bundle verify`; Windows execution has not been tested from this Linux cloud machine.

Use an unoccupied local folder. These commands fail rather than overwrite an existing checkout:

```powershell
$reviewBundle = Join-Path $env:USERPROFILE 'Downloads\saksham-portfolio-feature.bundle'
$reviewFolder = Join-Path $env:USERPROFILE 'source\saksham-portfolio-review'
New-Item -ItemType Directory -Force (Split-Path $reviewFolder) | Out-Null
git clone --branch feat/immersive-engineering-worlds $reviewBundle $reviewFolder
if ($LASTEXITCODE -ne 0) { throw 'Clone failed; do not continue in an existing folder.' }
Set-Location $reviewFolder
git remote set-url origin https://github.com/sakshamaveragecodes-lab/saksham-portfolio.git
git status --short
git branch --show-current
npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
npm.cmd run dev -- --hostname 127.0.0.1 --port 3300
```

Keep that terminal running. In a second PowerShell window:

```powershell
Start-Process 'http://127.0.0.1:3300/'
```

Review locations on **the same Windows computer**:

- Homepage: `http://127.0.0.1:3300/`
- SourceLens: `http://127.0.0.1:3300/projects/sourcelens/`
- Existing full workspace: `http://127.0.0.1:3300/projects/sourcelens/experience/`

The explicit last hostname argument overrides the npm script's default 0.0.0.0 binding, restricting this process to your computer's loopback interface. No tunnel or public hosting service is used. The dev server prints its actual address; port 3300 must be free. If it reports that port is in use, stop the conflicting process only if it belongs to you, or choose another port and use the same number in the browser.

## Honest limits

Local source edits receive Next HMR. Changes made by Codex in the cloud do **not** appear on Windows until an updated source snapshot/bundle is transferred. A public Git push is not needed for that transfer. Keep all implementation in this original conversation; use Windows only for running/reviewing the exported work.

A development server can run internally at port3300; the static export used for current cloud checks runs internally at port3400. Neither loopback address is a desktop forwarding URL. Codex browser-open returns `queued`; it is not a private forwarding provisioner, nor proof that a desktop tab reached this process. No supported private forwarding/browser-inspection tool is exposed in this environment. Do not keep retrying loopback links as though they were cloud preview URLs.

All professional content, original previews, Full App workspaces, demos, resume and credited exhibit are preserved. The latest bundle contains all eight distinct cinematic project worlds, all major portfolio pages, the continuous reading-section system, the mobile modal directory and plugin-independent Resume preview. All original functionality remains available. The current review candidate remains unpublished. Final owner approval is required before merge/deployment. Hosting remains the existing ₹0 GitHub Pages deployment.

## Update an existing review checkout after a checkpoint

Download the latest `saksham-portfolio-feature.bundle` (or the explicitly named checkpoint bundle). Stop the local dev server with Ctrl+C, open PowerShell in the existing review checkout, and check `git status --short`. If it lists changes, preserve/reconcile those local files before updating; do not reset them.

With a clean checkout:

```powershell
git switch feat/immersive-engineering-worlds
git pull --ff-only "$env:USERPROFILE\Downloads\saksham-portfolio-feature.bundle" feat/immersive-engineering-worlds
npm.cmd run dev -- --hostname 127.0.0.1 --port 3300
```

This fast-forwards **only the local feature branch**, using the downloaded bundle. It does not merge into main, push to GitHub, or publish anything. If the command cannot fast-forward, stop and report the Git output in this original conversation. This enhancement adds no dependencies; npm ci is needed for a fresh clone, or when a later checkpoint changes the lockfile.

Review the full four-chapter scroll and reverse scroll on Home and SourceLens. Try the project links in the Systems chapter, Pause atmosphere, Reduce effects, Skip introduction and the preserved SourceLens preview, Full App workspace, demonstration and architecture. The local server updates after local source transfers; there is still no automatic cloud-to-Windows source synchronization.

## Evidence Foundry quality-correction candidate (unpublished)

Use `/cinematic-study/` on the same local development server. The optional **Play40-second sequence** button reviews all five shots; normal scroll, the range and chapter controls also work. Stop, wheel/touch or navigation keys interrupt playback. **Pause material motion**, **Reduce effects** and **Skip to study notes** remain available. Read `EVIDENCE_FOUNDRY.md` for the art direction and honest material/simulation boundaries. Existing routes remain unchanged.

Download `saksham-evidence-foundry.bundle` from the handoff. Update the existing Windows checkout (first inspect `git status`; preserve any local work):

```powershell
git fetch "C:\Users\YOUR_NAME\Downloads\saksham-evidence-foundry.bundle" feat/immersive-engineering-worlds
git switch feat/immersive-engineering-worlds
git merge --ff-only FETCH_HEAD
npm.cmd ci
npm.cmd run dev -- --hostname 127.0.0.1 --port 3300
```

Open `http://127.0.0.1:3300/cinematic-study/` **on that Windows computer**. If the fast-forward fails, preserve both histories; do not reset/discard local changes. Blender is unnecessary to run the committed asset. The bundle is a manual snapshot, not a cloud tunnel or automatic sync. The current public site is unchanged; this candidate is not approved for release.

## Full portfolio extension

The later `saksham-full-foundry.bundle` contains the complete unpublished route extension, not just `/cinematic-study/`. Fetch that bundle into the same existing checkout and fast-forward the existing feature branch using the procedure above. Do not reset or overwrite any local edits if fast-forward is unavailable. Use `npm.cmd ci` and `npm.cmd run dev -- --hostname 127.0.0.1 --port 3300` on Windows; open `http://127.0.0.1:3300/` on that same Windows computer. All eight ordinary project routes and major pages now use the shared production-stage renderer. The prior isolated `/cinematic-study/` remains available for comparison.

The full review ZIP includes actual desktop/mobile Chromium films, frame sequences, source bundle and QA receipts. Cloud software rendering is separate from your machine's physical GPU. For an explicit expensive optics inspection use `/projects/careerlens/?optics=full`; the default URL remains adaptive. This query is a diagnostic, not a performance promise. Manual file transfer is still required; there is no cloud-to-desktop private forwarding or automatic live synchronization.

The public GitHub Pages website is unchanged. The owner must give final merge/deployment approval after inspecting this complete candidate.
