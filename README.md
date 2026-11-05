# PROJECT SAN ANDREAS — The Ground Beneath Us

**Implementation handoff derived from the user's Gemini RAR v0.** This is a Next.js App Router / TypeScript / Tailwind educational exhibit, not a finished university submission. The original v0 (vanilla HTML/CSS/JavaScript) is preserved under `legacy-v0/` for audit. `docs/LOCKED_SPEC.md` governs the implementation and takes precedence over claims in `legacy-v0/README` (the original v0 README is retained only in Git history).

## Getting started

Requirements: Node.js 20+ and npm with network access to npm registry.

```bash
npm install
npm run dev
# visit http://localhost:3000
npm run typecheck
npm run build
npm run start
npm run check:source
npm run check:gnss
npm run check:words
```

The project is intended to deploy to Vercel as a normal Next.js App Router project. Server-side USGS and EarthScope API access requires outbound HTTPS from the deployment. No secrets, backend database, sign-in, or API keys are required.

**Dependency caveat:** This handoff environment could not resolve `registry.npmjs.org` (`EAI_AGAIN`) and therefore could not install dependencies, generate a valid npm lockfile, or execute the Next.js build. `npm install` on a networked machine should create `package-lock.json`; commit that lockfile before formal deployment. Static TSX syntax inspection and structural tests were performed. Do not represent this release as build-verified.

## Modules / edit points

- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`: route, metadata and archive visual identity.
- `components/ArchiveShell.tsx`: chapter navigation, progress, modal references and a live DOM word estimator.
- `components/ArchiveHero.tsx`: conceptual California region locator (not a georeferenced map).
- `components/EarthInterior.tsx`: formation steps, compositional vs mechanical layer selection.
- `components/FaultLab.tsx`: right-lateral demonstrative map + depth diagram, view/speed/offset/playback/overlay controls. **Not a forecast or physical prediction.**
- `components/EvidenceDesk.tsx`: USGS earthquake map/depth histogram, **preloaded EarthScope-sourced GNSS velocities** with official-source refresh and CSV downloads, and conceptual geologic offset.
- `components/TimeMachine.tsx`: 200–0 Ma schematic timeline, time control, epoch markers and comparison slider. **No unverified model state is portrayed as a published reconstruction.**
- `components/MalaysiaPanel.tsx`: illustrative soil/rock and structural detailing comparisons.
- `components/ReferenceArchive.tsx`: bibliography drawer (not a sixth chapter).
- `src/content/story.ts`: **student-authored interpretation placeholders** and copy.
- `src/data/sources.ts`: references, DOI/source links and dataset caveats.
- `src/data/evidence.ts`: data contracts, USGS search window and GNSS CSV validation.
- `src/data/gnss-teaching.ts`, `public/data/earthscope-california-teaching-nam14-2022.csv`: cited, offline two-station EarthScope/UNAVCO classroom estimates (SBCC and BEMT; **approximate**, not a current official network solution).
- `src/data/earthscope-vel.ts`: UNAVCO .vel v1.1.0 and v1.0.1 parsers, frame and uncertainty checks and m/yr → mm/yr conversion.
- `app/api/gnss/route.ts`: server adapter for EarthScope `cwu.final_nam14.vel` published velocity product; transparent unavailable response when not accessible.
- `scripts/test-gnss.mjs`: executable parser regression tests including both documented .vel layouts, station CSV, units, region, sigma and frame guards.
- `src/data/epochs.ts`: conceptual epoch labels, NOT a geospatial reconstruction dataset.
- `app/api/earthquakes/route.ts`: verified USGS ComCat adapter, not proxying fabricated data.
- `docs/RESEARCH_INTAKE_TEMPLATE.md`: fill in verified research and provenance before replacing text.

## Data and scientific integrity

### Seismicity

The regional quake viewer requests data on the **server** from the U.S. Geological Survey's ANSS ComCat using the publicly documented FDSN event query endpoint. Current query is **2025-01-01 through 2025-12-31, latitude 32–41°N, longitude 125–115°W, M2+**, with at most 500 most recent events; it does not assert that every catalog event is on the San Andreas fault. The exact upstream URL and retrieval timestamp are visible in the UI after a successful fetch. Event location, magnitude and depth are taken from the provider; no synthetic fallback coordinates, earthquake events or magnitude predictions are provided. If the API is offline, the viewer shows an explicit unavailable state. A **bundled dated snapshot is not yet included**, as one could not be retrieved and verified in the development environment.

### GNSS / GPS — measurements are present by default

**The site no longer starts with an empty GPS station map and does not require the student to obtain the starter data.** On first render it displays a bundled, cited EarthScope/UNAVCO teaching example containing two real California stations from the teacher guide *Exploring plate motion and deformation in California with GPS*, version **14 May 2022**, pp. 5–6:

| Station | Latitude (°N) | Longitude (°E) | East (mm/yr) | North (mm/yr) | Frame |
| --- | ---: | ---: | ---: | ---: | --- |
| SBCC | 33.553 | -117.661 | approximately -26.1 | approximately 27.3 | NAM14 |
| BEMT | 34.001 | -115.998 | approximately -4.0 | approximately 4.6 | NAM14 |

*Original source:* https://cdn.serc.carleton.edu/files/NAGTWorkshops/geodesy/activities/california-teacher-guide.v2.pdf (teacher answer pages 5–6); the guide explicitly uses **N. America, NAM14, UNAVCO**. These are **rounded classroom time-series slope estimates**, **not** modern final-network solutions. The date is the **publication/revision date of the lesson**; its station-processing/reference epoch and uncertainties **are not reported**. That caveat is visible in the application, in the CSV's `epoch` text and in the reference archive. Do **not** report 2022-05-14 as the GNSS measurement epoch.

In parallel, when the exhibit runs on a server with outbound HTTPS access, the new `/api/gnss` server route attempts to download EarthScope's **official CWU final NAM14 velocity product**:

https://data.earthscope.org/archive/gnss/products/velocity/cwu.final_nam14.vel

If it responds with a valid velocity file, the app automatically replaces the two-station demonstration with a regional, uncertainty-screened sample of the **actual official station solutions**, showing per-station first/last observation epochs, file release date, retrieval time, east and north mm/yr and N/E standard errors. The parser supports the **2013+ v1.1.0 format with 30 columns** and historical **v1.0.1 with 27 columns**. Source velocities/uncertainties in **m/yr** are explicitly multiplied by 1,000. Coordinates are normalized for 0–360° longitude, limited to 32–41°N and 125–115°W, and filtered to ≤2 mm/yr per horizontal standard error, reflecting the viewer's filter. To limit SVG DOM size, at most 240 deduplicated station rows are rendered in a deterministic subsample; the complete unmodified network file remains at the source URL.

If EarthScope cannot be contacted, the **two measured example stations remain visible**, alongside a transparent archive-unavailable warning. No scientific measurements are invented. This environment's DNS/network restriction meant **the production file could not be retrieved and an end-to-end live API test was not possible**; the parser has fixture-based regression tests but deployment still needs a live check.

You can display/download loaded stations, refresh the official product, or import a separately verified station file with the same frame and schema:

`site,lat,lon,ve_mm_yr,vn_mm_yr,reference_frame,epoch`

Import validates seven columns, numeric values, coordinates, duplicate station IDs and common reference frame; it does **not** independently authenticate a user-supplied CSV. Arrow lengths are diagrammatically scaled, but values retain their real units. The bundled snapshot is also directly accessible at `public/data/earthscope-california-teaching-nam14-2022.csv`. The source data should be attributed in accordance with EarthScope/NGF's data terms.

### Geological / topographic evidence

The field-offset slider is a **conceptual teaching illustration**, not georeferenced USGS GIS, measured Walllace Creek imagery or a survey caliper. Linked authoritative research includes Sieh & Jahns (1984) and the USGS Quaternary Fault and Fold Database. Import and cite a licensed figure or documented GIS trace to complete this evidence stream.

### Deep time

The 200, 100, 30 and 0 Ma graphics are **not valid tectonic coordinate reconstructions**; they are qualitative cartoons, annotated as such in the UI. They must not be used to infer plate position, timing or speed. A published reconstruction model/version and verified supporting datasets are required before treating this as scientific evidence; specifically, today's San Andreas fault is not drawn at 200 Ma.

### Malaysia comparison

Structural response is schematic, with no calculated amplification, acceleration, hazard equivalence, certification, engineering compliance or seismic design predictions. Final Malaysia context should cite primary Malaysian geological/hazard evidence and relevant national standards.

## Academic submission blockers

1. Fill out **all** `[INSERT YOUR VERIFIED RESEARCH HERE: ...]` slots in `src/content/story.ts` with **student-authored** geological interpretation, including parenthetical author–year citations.
2. The GNSS panel now includes two verified **approximate teaching-guide** velocities and an automatic official EarthScope adapter. Before academic submission, verify the live CWU NAM14 download on the deployment, record the chosen official file release and observation epochs, archive a reproducible full GNSS snapshot if needed, and supply verified geological GIS data and figure permissions. Consider bundling a dated USGS quake snapshot with its exact query. Explain observed vs model-based vs illustrative.
3. Verify and finalize APA 7 references, figure credits/permission and any data values. There are four peer-reviewed pointers and multiple provider sources in the registry, but it still needs the student's full reference review.
4. Audit **all visible and alternate-state** text plus the reference drawer against the assignment's **1,200-word ceiling**. The footer reports the visible DOM estimate for current chapter state; `npm run check:words` reports a conservative source-string inventory, **not** a certification that the ceiling is met.
5. Independently complete and sign the university PDF cover sheet and AI declaration, and record the required 60-second narration. Confirm the permitted extent of AI-generated code with the lecturer; do not claim all scientific text was student-written until reviewed.
6. Install dependencies and run build, keyboard, reduced-motion, mobile, API-error and browser checks on a machine that can reach npm, USGS and the EarthScope archive. `npm run check:gnss` runs the parser regression suite.

## Applying the delivery patch

The **original v0→Next.js conversion patch** was generated against the exact extracted `New folder/` contents of `san andrease gemini output.rar`. To reconstruct the converted project rather than use the full ZIP:

```bash
# from the root containing the original app.js, index.html, README.md and styles.css
# choose the correct patch path if downloaded elsewhere
git apply --check project-san-andreas.patch
git apply project-san-andreas.patch
npm install
npm run build
```

The patch includes moves into `legacy-v0/`, all new Next.js project files and this README. The complete converted ZIP is an alternative to applying the patch. **Never apply this patch over a different v0 export.**

## GNSS correction / incremental handoff (5 November 2026)

The earlier Next.js ZIP incorrectly left the GNSS panel empty. This correction modifies that handoff, adds an offline source-backed sample, integrates a server-side official EarthScope data adapter, preserves the bibliography and adds parser checks. To apply **`project-san-andreas-gnss-fix.patch`**, start from the **earlier `project-san-andreas-nextjs-handoff.zip`**, not the original Gemini vanilla-JS RAR; or simply use the latest complete `project-san-andreas-gnss-fixed.zip` archive.

```bash
# Run from the root of the EARLIER Next.js handoff (not the Gemini v0)
git apply --check project-san-andreas-gnss-fix.patch
git apply project-san-andreas-gnss-fix.patch
npm install
npm run check:gnss
npm run build
```

## Chapter 04 motion refinement / 5 November 2026

This update builds directly on **`project-san-andreas-gnss-fixed.zip`**. It retains the sourced GNSS fallback, EarthScope adapter, five-chapter order, and unchanged student-research placeholders.

- The timeline now begins at 200 Ma and advances continuously (frame-rate independent) to 0 Ma. Playback ends at the present without snapping back to 200 Ma. PLAY/PAUSE, REPLAY, 0.5–4×, marker jumps, drag-to-scrub and reset work through real React state.
- The conceptual oceanic trench gradually gives way to a ridge-approach and ridge–trench interaction before a modern right-lateral transform trace emerges. This is **not** a plate-coordinate reconstruction: rendered coastline, offsets and timing of graphic fades are **purely illustrative**, not measurable paleogeographic positions. The ridge line remains clipped to the oceanic side.
- The Then/Now comparison can be dragged **on the image itself** with a pointer/touch device; the separate native range control remains accessible to keyboards and assistive technology.
- The transform-fault offset animation uses a single `requestAnimationFrame` clock with consistent elapsed-time rate, no interval stepping or sudden 100%→0% loop. Illustrative layers fade in/out rather than pop in/out.
- The engineering comparison eases **only** when a selector is changed; it does not continuously shake buildings or imply calculated earthquake response. Formation selectors and evidence tab changes use restrained editorial fades.
- Reduced-motion preferences stop automatic animation and keep all manually scrubbed states usable. Animations suspend naturally in background tabs and cap elapsed-time deltas so tab switching does not cause giant jumps.

Local validation and preview commands after `npm install`:

```bash
npm run check:source
npm run check:gnss
npm run check:motion
npm run preview:motion  # writes motion-frames.html, a static 5-era contact sheet
npm run typecheck
npm run build
npm run dev
```

**Important distinction:** `motion-frames.html` is a contact sheet produced from the **actual TSX SVG renderer**; it is not a running Next.js site. The independent snapshot review covers 200/100/73/30/0 Ma. Browser interaction, production build and deployment still require an environment with dependencies installed.

**Before submission:** The attached 2026 assignment brief and rubric require (1) five chapters in order, (2) three independent evidence sources, (3) three genuinely explanatory interactions, (4) 1,200 on-screen words maximum, (5) at least four cited sources, including two peer-reviewed works, (6) a 60-second user-narrated MP4 and (7) a signed one-page cover sheet with an honest AI declaration. The current conceptual animation and verification placeholders are **not substitutes for the student's own scientific reasoning, validation, or a cited reconstruction**. Run the alternate-state word audit and test a live share link in an incognito browser before submission.

### Applying this motion patch

The incremental `project-san-andreas-motion-fix.patch` is for the **GNSS-fixed Next.js ZIP**, not the earlier Next.js handoff or the Gemini v0 archive. Alternatively, use the complete `project-san-andreas-motion-polished.zip`.

```bash
# In an extracted copy of project-san-andreas-gnss-fixed.zip

git apply --check project-san-andreas-motion-fix.patch
git apply project-san-andreas-motion-fix.patch
npm install
npm run check:motion
npm run build
```

## File 02 transform motion rebuild / 5 November 2026

This incremental release is built on the prior **motion-polished Next.js ZIP** (not the initial Gemini RAR). It replaces the unsatisfying transform-kinematics model with a coherent split-view motion instrument. The plan has two independently clipped moving plates with a shared matching marker; the static fault trace and moving lines no longer slip across one another incorrectly. The lower cross-fault depth section uses **into-the-page/out-of-the-page** symbols because motion is along strike: vertical displacement would be misleading. Both diagram modes share one percent-progress **illustrative** state; it is neither millimetres, slip rate, stress nor rupture forecast.

- Both / surface / depth modes; 0–100% slider, smooth frame-rate-independent playback, pause/replay, 0.5–4× speed, reset, overlays, mobile horizontal pan and reduced-motion support.
- Small additional UI-only polish in Chapter 05 adds connection symbols for the detailing selector. It does not calculate strength, sway response, safety or code compliance.
- `npm run check:motion` now covers both the palaeogeographic timeline and transform-lab motion; `npm run preview:fault` exports representative vector frames for visual inspection. See `docs/FILE02_RELEASE_AUDIT.md` for a requirement-by-requirement accounting of **what is implemented versus not submission-ready**.

This is still **not** a fully compliant submitted academic artefact until the student's independently verified analysis, real geological trace, reconstruction/source data, figure citation checks, all-states word-count audit, deployment test, self-recorded narration and signed AI-use declaration are completed. Do not describe the illustrations as empirical evidence. See the preceding verification notes and the assignment PDFs.
