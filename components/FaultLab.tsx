"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useAnimationClock, useReducedMotion } from "./useMotion";
import { SectionHeading, ResearchSlot, ScientificFigure, SourceLabel } from "./Shared";
import { story } from "@/src/content/story";

type View = "overhead" | "split" | "section";
const clamp = (value: number) => Math.min(100, Math.max(0, value));

/** A SCREEN-SPACE drawing model, not a measured distance or a fault-slip model.
 * Opposite translations preserve the same marker on either side of the trace.
 */
export function getFaultMotion(progress: number) {
  const p = clamp(Number.isFinite(progress) ? progress : 0);
  const move = p * 0.66;
  return { progress: p, leftY: 201 - move, rightY: 201 + move, relativeGap: move * 2 };
}

/** The dark, fixed fault trace divides two independently translated blocks. */
export function FaultPlan({ progress, layers }: { progress: number; layers: boolean }) {
  const { leftY, rightY, relativeGap } = getFaultMotion(progress);
  const leftMove = leftY - 201;
  const rightMove = rightY - 201;
  return <svg viewBox="0 0 840 398" className="fault-diagram fault-plan" role="img" aria-label={`Overhead, fault-aligned schematic of right-lateral motion. Pacific plate marker at vertical coordinate ${leftY.toFixed(0)}, North American marker at ${rightY.toFixed(0)}. Illustrative offset progress ${Math.round(progress)} percent; not to scale.`}>
    <defs>
      <linearGradient id="fault-pacific-tone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#60766b"/><stop offset="1" stopColor="#394f49"/></linearGradient>
      <linearGradient id="fault-na-tone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c1a98a"/><stop offset="1" stopColor="#937a61"/></linearGradient>
      <pattern id="fault-survey-grid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#f4ebd8" strokeOpacity=".13" strokeWidth=".9"/></pattern>
      <pattern id="fault-rock-hatch" width="21" height="21" patternUnits="userSpaceOnUse" patternTransform="rotate(26)"><path d="M0 0V21" stroke="#eee0c3" strokeOpacity=".14" strokeWidth="2"/></pattern>
      <clipPath id="fault-plate-pacific"><rect x="0" y="0" width="409" height="398"/></clipPath>
      <clipPath id="fault-plate-america"><rect x="431" y="0" width="409" height="398"/></clipPath>
    </defs>
    <rect width="840" height="398" fill="#343831"/>
    <rect x="0" width="409" height="398" fill="url(#fault-pacific-tone)"/>
    <rect x="431" width="409" height="398" fill="url(#fault-na-tone)"/>
    <rect x="0" width="840" height="398" fill="url(#fault-survey-grid)"/>
    <g clipPath="url(#fault-plate-pacific)">
      <g transform={`translate(0 ${leftMove})`} data-plate="pacific">
        <g className="fault-rock-markers" opacity={layers ? 1 : 0} fill="none" strokeLinecap="round">
          <path d="M-18 72C105 25 241 104 423 46M-24 91C111 45 255 124 426 66" stroke="#becfc0" strokeOpacity=".27" strokeWidth="5"/>
          <path d="M-24 292C126 241 272 313 428 266M-24 308C138 258 279 330 430 284" stroke="#becfc0" strokeOpacity=".27" strokeWidth="4"/>
          <path d="M-10 120C120 99 233 169 420 123M-10 342C125 306 272 368 420 332" stroke="#d6e2c9" strokeOpacity=".18" strokeWidth="2" strokeDasharray="4 8"/>
        </g>
        <path d="M-25 182Q88 159 161 180T318 194L420 201" stroke="#293c37" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M-25 182Q88 159 161 180T318 194L420 201" stroke="#dde5d1" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M-25 182Q88 159 161 180T318 194L420 201" stroke="#f9f1dd" strokeOpacity=".92" strokeWidth="2.3" strokeDasharray="3 9" fill="none"/>
        <g fill="#f2e7d0" stroke="#34443f" strokeWidth="2"><circle cx="150" cy="177" r="6"/><circle cx="338" cy="195" r="6"/></g>
        <path d="M390 190l12 11-12 11-12-11Z" fill="#f3bc94" stroke="#312e28" strokeWidth="2"/>
      </g>
    </g>
    <g clipPath="url(#fault-plate-america)">
      <g transform={`translate(0 ${rightMove})`} data-plate="north-american">
        <g className="fault-rock-markers" opacity={layers ? 1 : 0} fill="none" strokeLinecap="round">
          <path d="M422 62C568 8 710 112 855 59M421 82C572 32 705 131 855 77" stroke="#e9d6ba" strokeOpacity=".35" strokeWidth="5"/>
          <path d="M422 274C565 238 715 317 854 288M422 291C576 256 714 336 854 305" stroke="#eed9b9" strokeOpacity=".38" strokeWidth="4"/>
          <path d="M423 130C540 118 715 181 853 134M423 330C561 312 721 358 858 330" stroke="#f7e2c6" strokeOpacity=".25" strokeWidth="2" strokeDasharray="4 8"/>
        </g>
        <path d="M420 201Q523 209 609 193T862 189" stroke="#736550" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M420 201Q523 209 609 193T862 189" stroke="#f3e7c9" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M420 201Q523 209 609 193T862 189" stroke="#fff6e5" strokeWidth="2.3" strokeDasharray="3 9" fill="none"/>
        <g fill="#5f5143" stroke="#f2e2c6" strokeWidth="2"><circle cx="529" cy="203" r="6"/><circle cx="716" cy="188" r="6"/></g>
        <path d="M450 190l12 11-12 11-12-11Z" fill="#f3bc94" stroke="#312e28" strokeWidth="2"/>
      </g>
    </g>
    {/* The narrow shear corridor is fixed; all visible offset belongs to the plate blocks. */}
    <rect x="408" width="24" height="398" fill="#272b29"/>
    <path d="M420 0V398" stroke="#e9c4ad" strokeOpacity=".12" strokeWidth="15"/>
    <path d="M420 0V398" stroke="#c57968" strokeWidth="2.6" strokeDasharray="15 7"/>
    {relativeGap > 4 && <g data-offset-bracket="true" stroke="#f7caa8" strokeWidth="2" fill="none" opacity=".93">
      <path d={`M444 ${leftY}h17M444 ${rightY}h17M456 ${leftY}V${rightY}`}/>
      <path d={`m452 ${leftY + 5} 4 -5 4 5M452 ${rightY - 5}l4 5 4 -5`}/>
    </g>}
    <g fontFamily="monospace" fontWeight="700" letterSpacing="1.3">
      <g fill="#1d2d29" fillOpacity=".65"><rect x="16" y="15" width="242" height="60" rx="2"/><rect x="462" y="15" width="362" height="60" rx="2" fill="#efe3d1" fillOpacity=".86"/></g>
      <text x="29" y="38" fill="#f4ead9" fontSize="14">PACIFIC PLATE</text>
      <text x="29" y="58" fill="#cfe0cf" fontSize="10">MOVING NW · RELATIVE</text>
      <text x="477" y="38" fill="#3d3d34" fontSize="14">NORTH AMERICAN PLATE</text>
      <text x="477" y="58" fill="#625448" fontSize="10">MOVING SE · RELATIVE</text>
    </g>
    <g fill="none" stroke="#f1e9d7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M185 135V94m-12 12 12-12 12 12"/>
    </g>
    <g fill="none" stroke="#494136" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M650 93v42m-12-12 12 12 12-12"/>
    </g>
    <g fontFamily="monospace" fontSize="10" letterSpacing=".9">
      <rect x="14" y="347" width="314" height="35" fill="#26352f" fillOpacity=".92"/>
      <text x="25" y="361" fill="#f5ead7">MATCHING MARKER</text>
      <text x="25" y="376" fill="#bbd1c4">OFFSET GROWS AS YOU MOVE THE SLIDER</text>
      <rect x="489" y="347" width="338" height="35" fill="#eee4d4" fillOpacity=".92"/>
      <text x="500" y="360" fill="#4f493f">PLAN VIEW  /  STRIKE ALIGNED</text>
      <text x="500" y="375" fill="#625c51">ILLUSTRATIVE POSITION · NO DISTANCE SCALE</text>
    </g>
    <rect x="392" y="312" width="56" height="20" fill="#272b29"/>
    <text x="420" y="325" fill="#f1c4aa" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700">FAULT</text>
  </svg>;
}

/** A vertical cross-fault section, viewed perpendicular to local strike. Along-strike motion is
 * perpendicular to this paper: × recedes; • approaches.
 * The rock layers deliberately do not slide up or down.
 */
export function FaultSection({ progress, layers }: { progress: number; layers: boolean }) {
  const p = clamp(progress) / 100;
  return <svg viewBox="0 0 840 243" className="fault-diagram fault-section" role="img" aria-label={`Vertical section across the fault. Fault is vertical. Pacific side moves into the page, North American side moves out of the page. This is horizontal shear, not vertical slip. Illustrative progression ${Math.round(progress)} percent.`}>
    <defs>
      <linearGradient id="fault-depth-left" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#748071"/><stop offset=".5" stopColor="#4b6059"/><stop offset="1" stopColor="#37443d"/></linearGradient>
      <linearGradient id="fault-depth-right" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#beaa90"/><stop offset=".5" stopColor="#9a856e"/><stop offset="1" stopColor="#746d5f"/></linearGradient>
      <pattern id="fault-depth-hatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><path d="M0 0V22" stroke="#eee5d5" strokeOpacity=".14" strokeWidth="3"/></pattern>
    </defs>
    <rect width="840" height="243" fill="#282d29"/>
    <rect y="0" width="840" height="32" fill="#c7c1a9"/>
    <path d="M0 32Q130 26 250 32T420 32T630 30T840 32V43H0Z" fill="#7a856b"/>
    <rect x="0" y="43" width="418" height="200" fill="url(#fault-depth-left)"/>
    <rect x="422" y="43" width="418" height="200" fill="url(#fault-depth-right)"/>
    <g className="fault-rock-markers" opacity={layers ? 1 : 0}>
      <rect x="0" y="43" width="840" height="200" fill="url(#fault-depth-hatch)"/>
      <path d="M0 106H418M422 106H840M0 176H418M422 176H840" stroke="#dfd4bb" strokeOpacity=".34" strokeWidth="2"/>
      <path d="M0 139q80-7 164 0t254 0M422 139q90-5 178 0t240 0" stroke="#e2d6c4" strokeOpacity=".2" strokeWidth="2" fill="none"/>
    </g>
    <rect x="411" y="32" width="18" height="211" fill="#352d2b" opacity=".92"/>
    <path d="M420 32V196" stroke="#c98876" strokeWidth="3" strokeDasharray="10 6"/>
    <path d="M420 196V241" stroke="#d3a592" strokeWidth="2" strokeDasharray="2 7" opacity=".54"/>
    <g fontFamily="monospace" letterSpacing="1.1" fontWeight="700">
      <text x="21" y="22" fontSize="10" fill="#393c35">SURFACE</text>
      <text x="572" y="22" fontSize="10" fill="#393c35">VERTICAL SECTION · ACROSS FAULT</text>
      <text x="20" y="225" fontSize="10" fill="#d8e4d6">CRUST / DEEPER ROCK: SCHEMATIC</text>
      <text x="569" y="225" fontSize="10" fill="#f3e8d4">NOT A DEPTH SCALE</text>
    </g>
    {/* These symbols change presentation with progress without implying fault-normal or vertical slip. */}
    <g data-vector="into-page" transform="translate(238 133)">
      <circle r={33 + p * 7} fill="#30463e" stroke="#c2d2c0" strokeOpacity={.3 + p * .55} strokeWidth="2.5"/>
      <circle r="28" fill="#273d36" stroke="#f3e7d0" strokeWidth="2"/>
      <path d="M-12-12 12 12M12-12-12 12" stroke="#f7ead6" strokeWidth="5" strokeLinecap="round"/>
      <text x="0" y="-59" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill="#f4e9d7">PACIFIC</text>
      <text x="0" y="62" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#f4e9d7">INTO PAGE  ×</text>
    </g>
    <g data-vector="out-of-page" transform="translate(606 133)">
      <circle r={33 + p * 7} fill="#756653" stroke="#f3dec0" strokeOpacity={.3 + p * .55} strokeWidth="2.5"/>
      <circle r="28" fill="#6c5948" stroke="#f7e8d0" strokeWidth="2"/>
      <circle r="7" fill="#f7ead6"/>
      <text x="0" y="-59" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill="#f5e6d1">NORTH AMERICA</text>
      <text x="0" y="62" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#f7e8d0">OUT OF PAGE  •</text>
    </g>
    <g transform="translate(431 63)" fontFamily="monospace" fontSize="10" fontWeight="700"><rect x="0" y="0" width="108" height="22" fill="#282d29"/><text x="9" y="15" fill="#f1b7a6">FAULT ZONE</text></g>
  </svg>;
}

function Diagram({ displacement, view, layers }: { displacement: number; view: View; layers: boolean }) {
  return <div className={`fault-views ${view === "split" ? "fault-dual" : "fault-single"}`}>
    {view !== "section" && <div className="fault-view-pane" key="plan" tabIndex={0} aria-label="Scrollable surface fault diagram"><div className="fault-pane-head"><span>01 / SURFACE</span><span>PLAN / STRIKE ALIGNED</span></div><FaultPlan progress={displacement} layers={layers}/></div>}
    {view !== "overhead" && <div className="fault-view-pane" key="section" tabIndex={0} aria-label="Scrollable fault depth section"><div className="fault-pane-head"><span>02 / BELOW GROUND</span><span>VERTICAL SECTION / ACROSS FAULT</span></div><FaultSection progress={displacement} layers={layers}/></div>}
  </div>;
}

export function FaultLab() {
  const [view, setView] = useState<View>("split");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [displacement, setDisplacement] = useState(0);
  const [layers, setLayers] = useState(true);
  const reduced = useReducedMotion();
  const position = useRef(displacement);
  useEffect(() => { position.current = displacement; }, [displacement]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  useAnimationClock(playing && !reduced, speed, dt => {
    const next = Math.min(100, position.current + dt * 15); // ≈ 6.7 seconds at 1×
    position.current = next;
    setDisplacement(next);
    if (next >= 100) setPlaying(false);
  });
  const setOffset = (next: number) => { const p = clamp(next); position.current = p; setDisplacement(p); setPlaying(false); };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (reduced) return;
    if (position.current >= 99.99) { position.current = 0; setDisplacement(0); }
    setPlaying(true);
  };
  const stateLabel = displacement < 2 ? "ALIGNED MARKERS" : displacement > 98 ? "MAXIMUM ILLUSTRATED OFFSET" : "MARKERS SEPARATING ALONG STRIKE";
  return <section id="tectonics" className="chapter chapter-dark" data-chapter>
    <SectionHeading number="02" label="TRANSFORM KINEMATICS" title="Tectonic Setting" summary="Two plates pass sideways. Explore the movement from above and below the ground." />
    <div className="fault-layout">
      <div className="lab-main">
        <div className="panel-heading"><span>PLATE BOUNDARY LAB / INSTRUMENT 02</span><span>ILLUSTRATIVE MOTION ONLY</span></div>
        <div className="fault-command-strip"><span className="fault-signal" aria-hidden="true"/><b>RIGHT-LATERAL / TRANSFORM</b><span>PACIFIC ↖ · NORTH AMERICA ↘</span></div>
        <div className="lab-view-tabs" role="group" aria-label="Fault diagram view">{(["overhead","split","section"] as View[]).map(v => <button type="button" key={v} aria-pressed={v === view} className={v === view ? "active" : ""} onClick={() => setView(v)}>{v === "overhead" ? "01 / SURFACE" : v === "split" ? "BOTH VIEWS" : "02 / DEPTH"}</button>)}</div>
        <ScientificFigure figure="02" description="Original schematic: plate markers translate along the fault; the depth section shows motion perpendicular to the page. Displacement is not measured distance, velocity or a forecast.">
          <Diagram view={view} displacement={displacement} layers={layers}/>
        </ScientificFigure>
        <div className="fault-readout" aria-live="off"><span>OBSERVATION /</span><strong>{stateLabel}</strong><span className="fault-readout-value">{Math.round(displacement).toString().padStart(3,"0")} / 100</span></div>
      </div>
      <aside className="lab-sidebar" aria-label="Fault motion controls">
        <p className="eyebrow">CASE 02 / SHEAR MARGIN</p><h3>Two plates.<br/><em>One boundary.</em></h3>
        <p className="body-copy">Pacific and North American plates slide past one another. Use the marker to follow their relative motion.</p>
        <SourceLabel id="atwater1970">TECTONIC CONTEXT</SourceLabel>
        <div className="control-unit fault-scrub"><div className="control-label"><label htmlFor="fault-displacement">ILLUSTRATIVE OFFSET</label><output htmlFor="fault-displacement" aria-live="off">{Math.round(displacement)}%</output></div>
          <input id="fault-displacement" type="range" min="0" max="100" step="0.5" value={displacement} onChange={e => setOffset(Number(e.target.value))} aria-valuetext={`${Math.round(displacement)} percent of schematic motion, not a measured distance`} style={{"--fault-progress":`${displacement}%`} as CSSProperties}/>
          <div className="fault-range-ends"><span>ALIGNED</span><span>SEPARATED</span></div>
        </div>
        <div className="control-unit"><label htmlFor="fault-speed">PLAYBACK SPEED</label><select id="fault-speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></div>
        <label className="check-row"><input type="checkbox" checked={layers} onChange={e => setLayers(e.target.checked)}/> Show illustrative rock textures</label>
        <div className="control-buttons"><button className="dark-action" type="button" disabled={reduced} onClick={togglePlay}>{playing ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>} {playing ? "PAUSE" : displacement >= 99.99 ? "REPLAY" : "ANIMATE"}</button><button className="outline-action" type="button" onClick={() => setOffset(0)}><RotateCcw size={15} aria-hidden="true"/> RESET</button></div>
        {reduced && <p className="motion-hint">Reduced motion is active. Inspect positions with the slider or keyboard arrows.</p>}
        <div className="fault-key"><span className="fault-key-chip">×</span>Into page <span className="fault-key-chip dot">•</span>Out of page</div>
        <div className="model-caution"><b>NOT AN EARTHQUAKE PREDICTION</b><p>Not to scale. The section shows horizontal motion into/out of the page—not vertical slip.</p></div>
      </aside>
    </div>
    <div className="bottom-research"><b>SCIENTIFIC EXPLANATION</b><ResearchSlot>{story.tectonics.mechanism}</ResearchSlot></div>
  </section>;
}
