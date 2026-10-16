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

The cloud server currently works internally at port 3300. Codex browser-open returns `queued`; it is not a private forwarding provisioner, nor proof that a desktop tab reached this process. No supported private forwarding/browser-inspection tool is exposed in this environment. Do not keep retrying loopback links as though they were cloud preview URLs.

All professional content, original previews, Full App workspaces, demos, resume and credited exhibit are preserved. The latest bundle contains the implemented Home and SourceLens cinematic proof and all preserved original functionality. Remaining projects and major pages are still pending extension after visual approval. Hosting remains the existing ₹0 GitHub Pages deployment.

## Update an existing review checkout after a checkpoint

Download the latest `saksham-portfolio-feature.bundle` (or the explicitly named checkpoint bundle). Stop the local dev server with Ctrl+C, open PowerShell in the existing review checkout, and check `git status --short`. If it lists changes, preserve/reconcile those local files before updating; do not reset them.

With a clean checkout:

```powershell
git switch feat/immersive-engineering-worlds
git pull --ff-only "$env:USERPROFILE\Downloads\saksham-portfolio-feature.bundle" feat/immersive-engineering-worlds
npm.cmd run dev -- --hostname 127.0.0.1 --port 3300
```

This fast-forwards **only the local feature branch**, using the downloaded bundle. It does not merge into main, push to GitHub, or publish anything. If the command cannot fast-forward, stop and report the Git output in this original conversation. The cinematic proof adds no dependencies; npm ci is needed for a fresh clone, or when a later checkpoint changes the lockfile.

Review the full four-chapter scroll and reverse scroll on Home and SourceLens. Try the project links in the Systems chapter, Pause atmosphere, Reduce effects, Skip introduction and the preserved SourceLens preview, Full App workspace, demonstration and architecture. The local server updates after local source transfers; there is still no automatic cloud-to-Windows source synchronization.
