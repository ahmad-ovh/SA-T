# PROJECT SAN ANDREAS — LOCKED SPECIFICATION v1.2

Status: DECISION LOCKED. Implementation baseline pending user's v0 ZIP.

## Purpose
A desktop-first, responsive Next.js educational interactive infographic for the SKTP 2613 Basic Geoscience interactive tectonic story. Theme: a *fictional* Cold War-era classified geological intelligence archive with museum-grade, Veritasium-style explanatory graphics. Title: PROJECT SAN ANDREAS / The Ground Beneath Us.

## Non-negotiable assignment requirements
- Exactly five mandatory chapters, in this order, each a distinct scroll-stop / section: (1) Origin & Interior; (2) Tectonic Setting; (3) The Evidence Layer; (4) Then & Now; (5) Why It Matters, explicitly in the context of Malaysia.
- More than three genuine interactions; committed design has five systems below.
- At least three **independent** San Andreas evidence streams: seismicity epicentres/depth distributions, GPS/geodetic velocity vectors, and geological/topographic observations. Optional palaeomagnetism or bathymetry only if relevant and properly sourced.
- Verified real-world data and source provenance; never fabricate measured values, earthquake events, reconstructions, citations or figure sources.
- Minimum four sources; two must be peer-reviewed journal articles or scientific book chapters; target six to eight sources. APA 7th edition throughout; cite every scientific claim and data value; fully caption borrowed figures and check licensing. No Wikipedia, blogs, or AI chat outputs as cited evidence.
- Total on-screen text no more than 1,200 words, including relevant annotation, labels, visible alternate states, captions and source content; create a word-count reporting/check routine where feasible.
- Scientific interpretation, geological reasoning, and narration are authored and verified by the student. The brief expressly allows declared brainstorming, formatting, language editing and layout assistance, but does not explicitly authorize wholesale AI-coded implementation; the student should confirm the permitted extent of code generation with the lecturer and accurately declare all tool use. Use editable placeholders for all student-authored reasoning until supplied. A 60-second self-narrated walkthrough and a one-page signed PDF cover sheet are separate student-controlled deliverables; do not invent those.

## Visual and information design
- Archival black/charcoal (#20211D), aged paper (#E8DECA), classified red (#8E3C32), geological green (#64736A); understated brass/sand accents.
- Editorial serif headlines; sans-serif explanatory text; monospace instrumentation and reference labels. Vintage classified stamps, gridlines and a dossier feel; no actual government impersonation or misleading official seals. Clearly identify as a fictional educational archive.
- Museum-grade, restrained motion and documentary clarity; no excessive glitch animations, no gratuitous spectacle.
- A split-screen hero: California San Andreas region locator/map + tectonic instrumentation, plus entrance into the scroll story.
- Sticky/persistent chapter navigation, progress indicator, data references access, keyboard accessibility and reduced motion. Responsive layout; desktop presentation prioritized with functional mobile fallback.

## Five committed major interactive systems
1. **Origin & Interior Explorer**: interactive cutaway of compositional Earth layers and toggle to mechanical/rheological view; click-to-reveal editable content slots. Include nebular hypothesis → accretion → differentiation placeholder sequence.
2. **2.5D Transform Fault Lab**: synchronized overhead map and labeled depth section (right-lateral transform movement accurately represented); view modes overhead/split/section, animated displacement, speed, start/pause/reset, geological layer overlays, clearly marked illustrative scales. **No earthquake prediction and no required speculative friction/stress controls.**
3. **Evidence Investigation Desk**: filterable earthquake locations and hypocentre depths; GPS station velocity vectors; geological/topographic fault traces or documented offsets, all using verified timestamped datasets with provenance. Show interactive map overlays and evidence cards. Optional live USGS mode with failure/offline state, dated snapshot as fallback. Do not use fake sample numbers.
4. **Deep Time Machine**: 200 Ma to present; playback, pause, fast-forward, rewind, time scrubber, speed selector, geological epoch markers, Then/Now comparison. Historical tectonic states from identified reconstruction model/datasets; clearly label interpolated animation between evidence-supported epochs as illustrative. Do not depict the modern San Andreas fault as existing throughout 200 Ma.
5. **Malaysia Engineering Comparison**: interactively compare illustrative structural response/design concepts, using user's authored analysis and sourced Malaysian engineering context, while acknowledging California and Malaysia differ in tectonic setting and hazard. No quantitative engineering design certification or unsupported structural claims.

## Chapter layouts
- **Intro hero** (not counted as a sixth required chapter): archive cover, locator and instrument cluster, Begin Investigation.
- **01 Origin & Interior**: formation stage selector and Earth interior explorer.
- **02 Tectonic Setting**: plate identity and boundary label with editable authored rationale; transform 2.5D lab.
- **03 Evidence Layer**: seismicity/geodesy/geological evidence desk, explanatory cards and author's synthesis placeholder.
- **04 Then & Now**: reconstructed time travel 200 Ma–present, separate keyframe and interpolation semantics.
- **05 Why It Matters**: engineering implication comparison tied to Malaysia and author's concluding interpretation.
- **Reference Archive**: accessible as drawer/overlay/footer, not an extra mandatory chapter; support full APA bibliographies, source URLs/DOIs, datasets, dates, source/figure attribution and images' licenses.

## Content management and integrity
- Put all student-authored text into structured editable content modules (JSON/TS/Markdown) rather than burying in visual components.
- Placeholders clearly state `[INSERT YOUR VERIFIED RESEARCH HERE: …]`; also placeholders for inline author-year references, figure captions, and dataset provenance.
- Distinguish observed measurements vs published/model reconstructions vs simplified demonstrative animations. Never label illustrative simulation outputs as measured data.
- Captions for adapted/reproduced figures must include source and permissible use. Original custom diagrams cite the originating data/model where scientific.
- AI-use statement details tools, tasks and verification steps; student to complete and sign declaration independently.

## Technical architecture
- React/TypeScript with Next.js App Router, Tailwind CSS, preferably existing v0 shadcn/ui components and lucide-react; npm/pnpm lockfile preserved; Vercel deployable.
- Component modules separated by chapter, shared layout/design tokens, visualization controls, evidence provider/data adapters, content and bibliographic metadata.
- Prefer efficient SVG/Canvas with CSS transforms over heavyweight 3D for 2.5D; additional libraries only when justified by v0 baseline.
- Use static/verified datasets as reproducible defaults; optional live USGS layer as enhancement; handle loading, offline, errors.
- Semantic HTML, focus-visible controls, functional keyboard actions, accessible labels, reduced-motion preference, responsive behavior.
- No secret keys in client, no invented backend credentials, no fake government marks, no stock illustrative data masquerading as factual evidence.

## Handoff and deliverables
- User first generates full v0 Next.js prototype and uploads its ZIP as the immutable baseline. Exclude node_modules, .next, .git, .vercel.
- Then implement full website by modifying baseline, and deliver complete updated project ZIP plus a Git patch generated from that **exact** original ZIP; verify patch applicability using `git apply --check` against clean baseline. Patch must include new files. Deliver README for run/build/Vercel/data/references and test findings.
- Current authorization: User said 'proceed. lock it all down and proceed.' This locks specification and authorizes preparing the next handoff. No patch can exist before baseline ZIP is provided. Do not request a new design approval unless baseline reveals a genuine blocker.

## Time and scope constraints
- Assignment due Friday 6 November 2026 at 23:59 Malaysia time per supplied PDFs.
- Priority: functional five-section experience and substantive interactions; real evidence and accurate references; performance and clarity. Decorative enhancements optional.
- Until student's research is supplied, code may be technically complete but final student-authored scientific content / complete academic submission necessarily remains pending.
