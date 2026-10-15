# Project preview maintenance

The existing static case-study pages use one `ProjectPreview` component. `src/lib/project-details.json` supplies audience, engineering takeaway, technical walkthrough, stage descriptions and preview artifacts for all eight projects. Existing scoring, geometry, stored-output and guided demos are unchanged.

Previews are not hosted copies of the original applications. No public deployment has been verified for these eight projects, so no “Open live app” link is offered. SourceLens, CareerLens, FORM and StudyBuddy use actual committed screenshots. PyMentor uses labelled terminal/process views, with source excerpts rather than invented model output. The three ML studies use original notebook/report artifacts and recorded results. FORM has a dashboard capture; its trainer process view is explicitly a guided visualization, not an invented interface screenshot. SourceLens and CareerLens have separate genuine mobile captures; other narrow views resize the same artifact and say so.

The fullscreen native dialog provides focus containment, Escape/close, focus restoration and scroll locking. Full-size image inspection allows scrolling through actual pixels. Captures are lazy-loaded with fixed viewing frames, dimension metadata, a cached-image completion check and recoverable failure states. No dependency or infrastructure service was added. Asset URLs use the shared GitHub Pages base-path helper.

## Source provenance

Every artifact links to its pinned original source commit. `docs/qa/preview-media.json` records local dimensions and SHA-256 hashes. Browser tests exercise all workflow stages, image loading, original mobile images, full-size inspection, viewport controls, both dialog closing paths, focus, reduced motion, demo anchors and source links. The manifest test checks local byte integrity and coverage; it does not establish the scientific validity of project results.

Added screenshot assets are WebP conversions of original PNGs at up to 1,600 pixels wide, quality 86, without cropping or invented content. Logistic regression confusion-matrix and ROC images were extracted from stored PNG notebook outputs (cells 24 and 26, zero-based), converted to WebP quality 88 without executing training. Random forest feature-importance and ROC images come from `SUPPORT/`. The existing logistic-regression image is the coefficient plot; its caption now identifies it correctly.

Source-backed descriptions use the same pinned implementation snapshots as `projects.json`. Project evaluations remain historical records; this portfolio does not claim to rerun the original model suites. StudyBuddy’s recorded OSI/DBMS responses are workflow evidence, not independently validated answers. Credentials, resume, homepage, 3D scene, contact and deployment configuration are outside this upgrade.
