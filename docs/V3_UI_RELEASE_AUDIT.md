# V3 / large-format interactive atlas — release audit

This update is based on the exact `project-san-andreas-file02-polished.zip` handoff and the three **SKTP 2613 Assignment 1** files supplied by the student. It is an interface/design development handoff, **not** a declaration that the geoscience assignment is ready to submit.

## Requested interface and motion changes

| Change | File and behavior | Scope / caveat |
|---|---|---|
| Enlarged layout and type | `app/globals.css`: larger body type, oversized heading scale, tall controls, broader content, increased spacing; `@media` breakpoints | Approximately 1.6–2× for major interface surfaces, and three stepped font sizes for small labels/body text. A literal 2× every element would break mobile usability. Requires device/browser QA. |
| Rectangular nav-hover highlight | `.chapter-nav a:hover`, `:focus-visible`, `.active` | Keyboard focus has the same rectangular fill. Menu collapses on mid-sized screens. |
| California map | `components/CaliforniaAtlas.tsx`, used by `ArchiveHero` and `EvidenceDesk` | Three user-requested POIs are clickable with detail/citation; the coastline/state, mountain shading and fault polyline are **schematic**, not imported GIS. Approximate site coordinates require independent validation. |
| Formation images | `components/FormationArt.tsx`, `EarthInterior.tsx` | Each tab displays an original educational graphic beside the text. A student-supplied local image overrides the graphic after the student enables its path in the media config. |
| Cross-section accordion | `components/EarthInterior.tsx` | Layer descriptions expand directly under each selected row. Clicking concentric layer circles selects the same accordion item. |
| Crooked fault trace + local relief | `components/FaultLab.tsx` | Animation uses a kinked conceptual trace and local uplift tied to motion slider. Restriction: not all strike-slip faults uplift; only suitable restraining bends, where local transpression occurs, can produce relief. No measured mountain growth/time value implied. |
| Seismicity map | `components/EvidenceDesk.tsx` with `CaliforniaAtlas compact` | Catalog event points over a simplified California atlas + trace; live USGS endpoint is unchanged and may fail offline. Never substitute fake quake locations. |
| Malaysian what-if slider | `components/MalaysiaPanel.tsx` | Two-mode actual-versus-counterfactual view, cross-section with into/out-of-page horizontal shear, plan-view inset with lateral marker movement, clickable stages and scrubbing. Illustrative progress, **not** historical dates or an earthquake recurrence forecast. |
| Own photographs and papers | `public/assets/README.md`, `public/assets/papers/README.md`, `src/data/user-media.ts`, `ReferenceArchive.tsx` | Empty local PDF slots for future supplied papers and 3 file names for optional formation images; no unlicensed PDF/photo bundled. |

## Scientific sourcing — critical boundaries

- The requested research item, *Nebular hypothesis after an explosion of big bang: Theoretical approach*, is a background reading. Some cosmological claims within it are not established simply by citing the paper, so early solar-system fundamentals have been cross-checked against NASA and Earth-structure basics against USGS. **Do not** treat the paper as evidence that the Big Bang itself was a stellar nebula.
- `https://doi.org/10.1029/2010EO220001` resolves to **Zoback, Hickman & Ellsworth (2010), Scientific drilling into the San Andreas Fault Zone**; `https://doi.org/10.1016/B978-0-12-812064-4.00010-4` resolves to **Scharer & Streig, The San Andreas Fault System** (book chapter). Both are included as bibliographic pointers, not as a claim that full text is reproduced here.
- The user-supplied `https://pubs.usgs.gov/unnumbered/7000032/report.pdf` could not be retrieved from this environment and `https://thulescientific.com/` could not be substantively assessed. **No quotations or unsupported claims from either source are inserted.** Add them only after reading and verifying what they actually support.
- Geological line of evidence currently uses a linked Wallace Creek peer-reviewed paper and a conceptual offset diagram. A measured geological survey/GIS trace has **not** been imported; don't describe the drawing as measured evidence.
- Relatively stable Peninsular Malaysia is **not** earthquake-free. The Malaysia literature and MetMalaysia link document intraplate and externally felt tremors. The scenario is a clearly separate what-if counterfactual; do not claim a real San Andreas-type transform crosses the peninsula.
- The California atlas uses approximate POI site positions; the printed fault outline and state border are not a georeferenced GIS product. Do not use for navigation, hazard, or quantitative distance. If survey-grade accuracy is required, import a licensed QFFD trace or similar GIS boundary and cite the exact layer/version.

## Checks performed and not performed

- PASS: Five ordered chapters in Next.js source; chapter navigation, tab and keyboard handlers in source.
- PASS: `scripts/check-source.mjs`, `scripts/test-gnss.mjs`, `scripts/test-motion.mjs`, `scripts/test-fault-lab.mjs` (baseline regressions).
- PASS: TypeScript/TSX **parser** diagnostics via globally installed TypeScript; stylesheet parsed by PostCSS.
- PASS: Targeted direct SVG rendering and inspection (map, bent fault and Malaysia cross-section). This is **not** a full browser test.
- **NOT VERIFIED**: Full `next build`, actual server endpoints, real mobile/desktop web-browser behavior, production link; npm dependencies unavailable in the local offline environment.
- **WORD LIMIT NOT FULLY VERIFIED**: `scripts/audit-words-v3.mjs` counts approximately **1,200 words in the default initial layout**, including SVG labels and excluding the closed bibliography dialog and SVG hover titles. The assignment permits **at most 1,200 words** *across the artefact*. The default layout alone meets that number **without spare words**. Other tab states, future student-authored text and the reference drawer are not included, so total assignment compliance cannot be claimed. Reduce the global script and audit every state before submission.
- **ACADEMIC CONTENT PENDING**: Source-backed geological data interpretation, a real quantitative/cited reconstruction for 100 or 200 Ma if one is claimed, distinction of >=3 genuinely independent data lines, final student-authored causal chain and Malaysia analysis, the required in-text citations, full/consistent APA reference audit, signed AI-use declaration, one-page cover sheet, recorded ≤60-second own-voice walkthrough, accessible public export/link.

### Local verification commands

```
npm install
npm run typecheck
npm run build
npm run check:source
npm run check:gnss
npm run check:motion
node scripts/test-v3.mjs
NODE_PATH="$(npm root -g)" node scripts/audit-words-v3.mjs
```

For the last command outside the npm-installed project, set `TYPESCRIPT_MODULE` to an actual globally installed TypeScript JS module. Run the app with `npm run dev`, examine interactions at 360 / 768 / 1440 px, verify image/PDF permissions, and test deployed link in an incognito/private browser.

### User assets expected

See the `public/assets/` READMEs. The project deliberately retains original illustrations until the user supplies licensed/sourced photographs and PDF documents. This maintains function without misrepresenting generated diagrams as borrowed field photographs.

## Student-authored text slots (do not submit empty)

`src/content/story.ts` stores five **STUDENT ANALYSIS PENDING** fields: `tectonics.mechanism` (which plate-driving force dominates and caveats), `evidence.synthesis` (three independent sources and their causal linkage), `time.interpretation` (cite a published reconstruction and explain its resolution/limits), `malaysia.comparison` (Malaysia-specific engineering implications), `malaysia.conclusion` (student’s own final synthesis). Replace and fact-check them personally, then re-run the word count. They are deliberately not AI-authored scientific conclusions.
