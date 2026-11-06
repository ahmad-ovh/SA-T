# V4 QA release report — Project San Andreas

**Audit date:** 6 November 2026 · **Input:** exact `project-san-andreas-v3-visual-refresh.zip` handoff. This is a **source-level + static Chromium layout** QA update, **not** a production-build or all-interactions certification. If the student's local patch has additional independent edits, those changes were not available for this inspection.

## Defects fixed / improvements delivered

1. **Mobile clipping:** formation-stage subtitles were forced onto a single overlong line; changed to wrap. Fault view panel headings were inheriting a 600px minimum width and disappearing off-screen on 360–390px phones; headings now wrap while the *diagram itself* retains intentional horizontal swipe/pan. The formation illustration no longer has a tall unused strip below the graphic on narrow screens.
2. **Duplicated California SVG definitions:** atlas is rendered twice (hero and seismicity) but V3 reused identical pattern, gradient and clip-path IDs. Added React `useId()`-scoped IDs and linked the selected point to its detail via `aria-controls`. This avoids cross-instance SVG-ID collisions.
3. **GNSS CSV safety:** blank numeric cells previously parsed as zero (`Number('') === 0`). New parser explicitly rejects empty values, non-finite values, implausibly large magnitudes, invalid station identifiers (including spreadsheet-formula prefixes), out-of-range coordinates, duplicate sites and mixed reference frames. UTF-8 BOM and comment lines are supported. These are **format checks**, not external verification of imported station measurements.
4. **Evidence-source honesty:** custom GNSS imports are now labelled independently unverified, not referred to as actual independently sourced observations. The USGS client also guards invalid provider timestamps and magnitudes before converting to dates.
5. **Keyboard/navigation:** the Evidence tablist supports Left/Right, Home and End keys, links its tabs to tabpanels, and maintains roving focus. The responsive chapter menu focuses its first link on opening and supports Escape-to-close with restored menu-button focus. Visible focus rings and reduced-motion scroll behavior are improved.
6. **CSV export reliability:** uses an attached temporary download anchor and delayed object-URL cleanup instead of immediately revoking the file URL. Downloaded CSV still retains station, coordinates, mm/year velocities, reference frame and epoch.
7. **Scientific graphics and presentation:** invisible overlapping stage labels were removed from the conceptual Time Machine SVG; the evidence atlas uses a compact point-detail summary; the public formation art no longer displays developer file-path instructions. Existing plate-slip/tectonic controls and scientifically explicit *not-to-scale / counterfactual* caveats are retained. Malaysia scenario stages now have regular 25% thresholds.
8. **Large-screen navigation:** top chapter tabs with rectangular hover/focus highlights are visible again at widths above 1320px (V3 hid them below 1620px despite ample room). The responsive menu remains below 1320px.
9. **Live word estimator:** a development-only footer estimate updates on clicks/changes rather than becoming stale after switching evidence tabs. It is intentionally hidden in production; the graded site should not display authoring diagnostics.
10. **Concise copy:** trimmed repeated labels and explanations without replacing user-owned scientific interpretations. This creates a small word-count buffer while retaining the required warnings and evidence interfaces.

## Verification matrix

| Check | Outcome | Meaning |
| --- | --- | --- |
| Source structure | **PASS** | Five ordered chapters and expected files present |
| GNSS parser regressions | **PASS** | Official v1.1.0 and older v1.0.1 fixtures, unit conversion, BOM, blanks, frame, duplicate and invalid data guards |
| Time Machine / Fault Lab motion regressions | **PASS** | Existing analytical geometry and motion assertions remain valid |
| V3 feature regressions | **PASS** | Map POIs, tabs, formation graphics, Malaysia model and upload slots still present |
| V4 source and syntax | **PASS** | 23 TS/TSX files parse; PostCSS parses stylesheet; ID scoping, keyboard handlers, source labels and mobile fixes asserted |
| Static Chromium layout | **PASS** | 360, 390, 768, 1024, 1440, 1920px: no unexpected viewport overflow in initial source-rendered screen |
| Static DOM ID uniqueness | **PASS** | 63 rendered `id` attributes; zero duplicates in the default source-rendered state |
| Alternate-state text estimate | **CONDITIONAL** | 1,062 default / 1,103 highest of 19 sampled source states, bibliography closed; *not* a cumulative final-word count |
| Full Next.js / React hydration | **NOT TESTED** | `npm install` failed because DNS for npm registry was unavailable (`EAI_AGAIN`); no lockfile or installed dependencies |
| Real user-interaction browser QA | **NOT TESTED** | Static TSX snapshot has inert click handlers; source assertions do not prove controls work at runtime |
| Live USGS / EarthScope transport | **NOT TESTED** | No end-to-end Next server test with working external endpoints |

The temporary HTML produced by `npm run qa:static` uses a minimal JSX renderer **solely for static layout**. It is *not* a deployable or interactive alternative to the Next.js project.

### Local commands

```bash
npm install                  # on a networked machine; commit the generated lockfile
npm run typecheck
npm run build
npm run check:source
npm run check:gnss
npm run check:motion
npm run check:v3
npm run check:qa           # includes 19-state word estimate and V4 source checks
npm run qa:static          # writes qa-static.html (not interactive)
python scripts/qa-static-browser.py  # optional; requires Python Playwright and Chromium
npm run dev                # then manually test real buttons, sliders, menus, downloads
```

For *real* browser acceptance, test at 360/390/768/1440px, tab and arrow-key navigation, both formation modes, three California sites, all fault-lab views, pause/replay/speed, GNSS CSV import with malformed and correctly sourced files, USGS offline/online responses, timeline drag/reveal, Malaysia actual/counterfactual scrub, references PDF viewer after user files are included, and prefers-reduced-motion. Check the developer console for hydration and network errors. Deploy, then open the link in a private window.

## Academic-compliance audit against the uploaded three SKTP 2613 files

- **Five chapters in order:** implemented. **Three or more genuine interactions:** present in source, but not production-browser validated.
- **Three independent empirical evidence streams:** seismicity uses a live USGS archive query (when online), GNSS includes two rounded published teaching stations and an official source adapter, geology remains a *conceptual* offset diagram linked to a published field study. A stylized sketch is **not itself a measured geological dataset**; full evidence synthesis remains student work.
- **Then/Now:** the visual time sequence is conceptual, *not* a georeferenced 100/200 Ma reconstruction. Independent validation of a scholarly reconstruction is still required if presented as one.
- **Peninsular Malaysia:** actual relatively stable Sunda-plate setting versus an explicitly hypothetical transform crossing; no claim of zero seismic hazard or an actual transform cutting the peninsula.
- **On-screen 1,200-word ceiling:** sampled default and variants fall below it **before** final student scientific analysis, extra media and expanded reference content. This does **not** certify the complete artefact under the rubric. The word audit is now a reproducible tool, not a completion claim.
- **Evidence/citations:** bibliography currently contains more than four pointers, including journal articles and a scientific book chapter. Journal status, page numbers, DOI resolution, specific figure permissions and inline attribution still require student verification. External source links and user-supplied images/PDFs are not certified here.
- **Student-authored scientific reasoning:** five `STUDENT ANALYSIS PENDING` slots remain in `src/content/story.ts`; do not submit them as completed work. Generative AI may assist layout/formatting under the assignment's rules but cannot substitute for the student's own geoscientific interpretation.
- **Other required deliverables:** final accessible shareable link or export, private-window access test, ≤60-second own-voice MP4 walkthrough, one-page cover sheet with signed AI-use declaration and student identifiers remain outstanding.

**Release status:** source fixes and static layout QA complete. Full build, deployed functionality, final word count, scientific interpretation and submission compliance **remain unverified**.
