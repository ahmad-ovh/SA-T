# File 02 motion pass — technical and assignment compliance audit

Basis: the supplied **Assignment 1 - Interactive Tectonic Story (SKTP 2613)** (pp. 2–4), **Assignment 1 Rubrics (CLO-PLO mapped)** (pp. 1–4), **SKTP 2613 Assignment 1 Infographic** (p. 1), and `docs/LOCKED_SPEC.md` v1.2. This checklist describes **what has actually been implemented**, not a claim of full academic readiness.

## What changed in this release

- Replaced the prior transform lab's small, poorly legible trace motions with **two synchronized original SVG teaching diagrams**. Its plan-view landforms/marker positions are attached to independently translated Pacific and North American schematic blocks, not drawn from fabricated GIS observations. It starts aligned (0%) and separates smoothly up to an illustrative 100% endpoint.
- The surface study uses clipped moving marker halves, one fixed fault-zone trace, labeled plate identity, two opposite along-strike motion arrows, a matching-marker pair, and a readout tied to slider state. Clipping prevents plate content crossing the fault.
- The section illustrates why a vertical cross-fault slice should **not** show invented up/down motion: relative strike-slip is represented as movement **into the page (×) and out of the page (•)**. Horizontal subsurface horizons remain at the same depth. Motion symbols and their outline update with animation progress. Scale, depths, exact vectors and modeled offset are explicitly qualified.
- The default study is split/both; surface-only and depth-only views remain. Playback starts at zero, pauses at 100%, replays from zero, uses elapsed-time requestAnimationFrame (no time-step dependence), and respects 0.5–4× playback, manual scrub, keyboard arrows and reduced motion. The controls and instrument readout are visibly connected to the diagram.
- Mobile diagrams are horizontally scrollable/focusable for legibility, with a swipe hint rather than crushing scientific annotations into a tiny figure. Existing Chapter 04 deep-time controls, GNSS sourced teaching fallback and live adapters are preserved.
- File 05's qualitative design toggle now reveals connection/detailing symbols as a visual category change, without claiming engineering performance or numerical resistance.

## Requirement matrix

| Requirement (brief/rubric) | Verified implementation state | Still needed before submission |
|---|---|---|
| Five stages **in order** (assignment p. 2) | Five interactive chapter components are rendered in order: origin, tectonics, evidence, then/now, Malaysia | Student must complete the text/research in these chapters |
| At least **three meaningful interactions** (p. 2) | Earth layers, transform lab, earthquake filters/GNSS, deep-time timeline and comparison, and Malaysia controls | Test the deployment on mobile, keyboard and a private browser window |
| Earth formation/interior + rheology (p. 2; rubric A, p. 3) | Separate formation controls and composition/mechanical layer views | **Pending student-authored reasoning with scholarly citations** |
| Transform type, plates, at least two driving mechanisms and dominant mechanism (p. 2) | Plate identities and correct conceptual fault-plane movement are drawn | **Driving-force comparison/rationale is still a student research placeholder** |
| Three **independent empirical** evidence streams (p. 2; rubric B, p. 3) | USGS API-backed earthquake query and two EarthScope/UNAVCO teaching GNSS stations with NAM14 metadata; conceptual offset example | **Geological/field trace is not a verified GIS dataset**, and remote API access must be tested |
| Then and Now 100/200 Ma vs present (p. 2) | Interactive 200–0 Ma conceptual timeline and dragged comparison | **Not a published quantitative palaeogeographic reconstruction**; student must provide/attribute source model |
| Malaysia-specific consequences (p. 2; rubric B, p. 4) | Qualitative site/design comparison with explicit contrasting tectonic context | **Student-authored, Malaysia-specific interpretation and standard verification** |
| ≤1,200 on-screen words (p. 3) | Runtime footer has a visible-text estimator; separate conservative source scan exists | **NOT VERIFIED** across alternate states and reference archive; needs final browser audit |
| 4+ references, 2+ peer reviewed, consistently cited (p. 3) | Source registry contains 4 journal leads plus official datasets/standard links | Verify full APA and source-figure/data claim-by-claim attribution; student must review references |
| Accessible artefact link / export tested privately (pp. 2–3) | Complete Next.js source export in ZIP | **NOT VERIFIED**: needs dependency install, production build, online deployment/open access, private-window check |
| 60-second **own voice** walkthrough, signed one-page PDF cover sheet/AI disclosure (p. 2–3) | Instructions retained | **STUDENT DELIVERABLES NOT PRESENT**; do not misrepresent generative-code assistance as student-only implementation |

## Verified tests and limitations

- `node scripts/check-source.mjs` — chapter and module structure passed.
- `node scripts/test-fault-lab.mjs` — 10 positions; marker direction/coherence and clipping; section has into/out-of-page symbols but no vertical shifts; finite geometry and UI hooks passed.
- `node scripts/test-motion.mjs` — 9 deep-time epochs, monotonic reveal, ocean clipping, time controls and reduced-motion guards passed.
- `node scripts/test-gnss.mjs` — known teaching-record and official velocity-parser fixture checks passed.
- TypeScript/TSX syntax parsing checked on project source. This is **not full typechecking**.
- SVGs rendered directly from **the real `components/FaultLab.tsx` SVG trees**, inspected at 0%, 25%, 50%, 75%, and 100%; animated preview is a 41-frame illustration of that geometry. This is **not** a recording of an actual browser session.
- `npm install`, Next.js typecheck/build, cross-device playback and live USGS/EarthScope fetches remain **unverified** because npm registry DNS is unavailable in this environment. No lockfile is invented.
- The drawings are original explanatory diagrams. They do not reproduce scientific GIS figures or use measured offset rates. Geological reasoning, primary-data validation and submission declarations must be completed by the student under the university's AI-use rules.

## Running locally after networked install

```bash
npm install
npm run check:source
npm run check:gnss
npm run check:motion
npm run dev
npm run typecheck
npm run build
```

View Chapter 02 on desktop and mobile. Confirm 0→100% motion is continuous, scrub tracks marker halves, replays correctly, section symbols remain into/out-of-page and browser reduced-motion preference disables auto-play. Verify file permissions and references, complete written sections, and only then submit through the university portal.
