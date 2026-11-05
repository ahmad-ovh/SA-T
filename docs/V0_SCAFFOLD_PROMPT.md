# Paste everything below this line into v0

Build a COMPLETE, RUNNABLE Next.js App Router + TypeScript + Tailwind CSS single-page prototype for an interactive educational scientific exhibit entitled **PROJECT SAN ANDREAS — The Ground Beneath Us**.

**IMPORTANT:** This prototype is only the VISUAL FOUNDATION for a subsequent development pass. I will export the entire generated codebase as a ZIP, and an engineer will generate a Git patch against the *exact ZIP*. So produce clean, modular, syntactically correct, maintainable source files; no inaccessible/no-code dependencies and no loose snippets. Maintain clear component boundaries and stable IDs. All assets must be in the project or from clearly documented permitted sources. Use v0's standard stack, shadcn/ui and lucide-react where appropriate; target deployment to Vercel.

## Art direction
- Fictional Cold War-era geological intelligence archive meets premium natural-history museum exhibit and Veritasium-style visual explanation.
- Editorial and restrained, NOT a futuristic cyberpunk command center. Aged cream paper, archival charcoal, muted geological green, restrained classified red, subtle gridlines and fine annotation leaders.
- Palette: archive charcoal #20211D; paper #E8DECA; classified red #8E3C32; geological green #64736A; warm sand/brass details.
- Typography: editorial serif display headings, elegant sans body text, monospace reference labels and coordinate/measurement instrumentation.
- Responsive desktop-first (optimized for 1440px laptop and projection), usable on mobile. Accessible contrast, focus indicators and reduced-motion support.
- Clearly label the fictional archive as an educational artifact, not an actual government website. No real agency seals/logos.

## Experience
One long, immersive scroll story with persistent sticky chapter navigation, clear chapter progress, and a subtle accessible 'Reference Archive' drawer or overlay. Section transitions should feel like turning dossier pages, but animation should be purposeful and subtle. Present the intro hero and these FIVE mandatory chapters IN EXACT ORDER, each a visually distinct scroll-stop:

0. INTRO / HERO: split view. Left: archival cover, PROJECT SAN ANDREAS, a small declassified classification stamp, short placeholder subtitle and an 'Open Investigation' anchor. Right: stylized scientific locator map of California showing an indicative San Andreas corridor and instrument-style metadata UI (use labels as placeholders, do not invent measurements or source citations). The map must be marked conceptual if not georeferenced.
1. ORIGIN & INTERIOR: Earth formation three-stage strip (nebular hypothesis / accretion / differentiation) plus an interactive Earth cross-section with selectable compositional vs mechanical/rheological layers. Clicking layers changes a right-hand explanatory placeholder card.
2. TECTONIC SETTING: a large interactive 2.5D fault lab with synchronized overhead and cross-sectional views of a right-lateral TRANSFORM fault, plate labels, layered depth, gentle parallax. Controls for overhead/split/section, animation start/pause/reset, playback speed, displacement/scrubbing, and geological layer visibility. Use a clean scientific SVG/Canvas diagram and clearly state 'Illustrative model — not live measurements'. DO NOT add earthquake prediction, stress or friction forecasting widgets. Include placeholders for a scientific explanation of driving forces and dominant mechanism.
3. THE EVIDENCE LAYER: investigation desk with three data tabs/overlay switches: (i) seismicity epicentres and hypocentre depths (magnitude/depth filters), (ii) GPS/geodetic plate velocity vectors (station selector/vector toggle), and (iii) mapped geological fault trace/topographic evidence. Design an interactive graph/map workspace and evidence cards. Actual values must remain EMPTY or clearly labeled as interface placeholders, never invented or misrepresented as observed. Show source/provider, data timestamp, DOI/reference placeholders. Build strong empty/loading/error states and keep controls responsive to selection; no simulated figures disguised as real data.
4. THEN & NOW: visually compelling deep-time reconstruction panel with timeline from 200 Ma to 0 Ma, draggable scrubber, Play/Pause, Rewind, Fast-forward, 0.5x/1x/2x/4x speed controls, labeled keyframes, and comparison slider. The visuals can be illustrated placeholders with clear labels 'Reconstruction placeholder' and 'Illustrative interpolation — verified reconstruction to be integrated'. Do NOT show today's San Andreas as present at 200 Ma. Separate keyframe metadata from rendered graphics so real published reconstructions can be integrated later.
5. WHY IT MATTERS — MALAYSIA: a comparison-oriented educational panel connecting Californian fault studies to Malaysian earthquake engineering. Provide conceptual side-by-side building diagrams with a functional 'Compare' toggle and editable explanatory placeholders; do not claim hazard equivalence or make unsupported code compliance claims. Finish with a clearly visible conclusion placeholder.

## Must-have interactivity in the v0 prototype
Ensure core click and selection UI works immediately (real React state): layer switching; fault view switching and at least one moving plate animation; evidence tab and filter selection with honest missing-data states; timeline scrubbing and working playback controls on an illustrative timeline; Malaysia scenario comparison. These interactions are scaffolds and will be scientifically upgraded later. No decorative fake buttons.

## Scholarly and content rules
- All long-form scientific explanations are EMPTY PLACEHOLDERS for student-authored research to be supplied later, e.g. '[INSERT YOUR VERIFIED RESEARCH HERE: ...]'. Do not write plausible-sounding geological interpretations as if confirmed.
- Structure text and citations centrally under `src/content/` (or `content/` if your project omits src), and dataset metadata separately under `src/data/`; make later substitution simple.
- Create reusable components for inline APA author-year citations, full source entries/DOI links, figures with source captions, scientific-data provenance blocks, and on-screen word budget utility. No fabricated bibliography entries, dataset values, GPS speeds, earthquakes or lat/long coordinates. We require a minimum of 4 verified references eventually (2 peer-reviewed); aim for 6–8 once sources are supplied. Do not cite Wikipedia, blogs or AI tools as scientific references.
- Plan for maximum 1,200 on-screen words across all chapters (including labels, captions and reference text, as appropriate). Use tight, low-density copy placeholders and emphasize visual storytelling.
- Distinguish hypothetical visual animation vs observed data vs published geodynamic reconstructions.

## Implementation details
- Use Next.js App Router, TypeScript, Tailwind, shadcn/ui and lucide-react. Keep dependency count low. Use client components only where interactivity actually needs them. Prefer SVG and CSS for the diagram scaffold; avoid heavyweight WebGL unless absolutely necessary.
- Create components such as ArchiveHeader, ChapterNav, ArchiveHero, EarthInteriorExplorer, FaultLab, EvidenceDesk, TimeMachine, MalaysiaEngineeringPanel, ReferenceArchive, ScientificFigure, SourceLabel. Put components under separate files; no huge one-file page.
- Make all links and buttons semantic and usable by keyboard, add `aria-label` to non-text controls, honor prefers-reduced-motion, provide mobile stacked views.
- No authentication, payments, admin panel or invented backend. Do not assume environment variables or API keys. Optional live USGS integration may be left as a clearly labeled connector point for the next pass.
- Include README documenting start/build commands and where research text, datasets and references will be plugged in.
- Provide the actual FULL PROJECT files for export, including package.json, lockfile, app/, components/, content/data and any public assets. No screenshots or static mockup-only responses.

### Success criterion
A polished, buildable and navigable museum-grade archive prototype with the five sections and clear working **interactive scaffolds**. It should be sufficiently modular and complete that the next engineering step can replace placeholder science and strengthen the visualizations via a single Git patch against this ZIP.
