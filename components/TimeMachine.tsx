"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Play, Pause, RotateCcw, FastForward, Rewind } from "lucide-react";
import { epochs } from "@/src/data/epochs";
import { story } from "@/src/content/story";
import { SectionHeading, SourceLabel, ScientificFigure, ResearchSlot } from "./Shared";
import { smoothstep, useAnimationClock, useReducedMotion } from "./useMotion";

const MILESTONES = [200, 100, 30, 0] as const;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** The geometry and relative displacement are graphic conventions, NOT a
 * rotation model, measured plate displacement, or an epoch-specific coastline.
 * Opacity and diagram transforms vary continuously in the timeline domain.
 */
export function TimeVisual({ ma, id, compact = false }: { ma: number; id: string; compact?: boolean }) {
  const elapsed = 200 - ma;
  const progress = elapsed / 200;
  // A fading oceanic margin, an illustrative ridge-trench contact, and a
  // progressively revealed transform *after* the late-margin transition.
  const subduction = 1 - smoothstep(140, 195, elapsed); // disappears toward today
  const ridgeApproach = smoothstep(45, 125, elapsed) * (1 - smoothstep(185, 200, elapsed));
  const transition = smoothstep(142, 170, elapsed) * (1 - smoothstep(182, 199, elapsed));
  const transform = smoothstep(169, 200, elapsed); // modern fault absent in Jurassic
  const oldMargin = 1 - transform;
  const oceanShift = progress * 130;
  const ridgeShift = -165 + progress * 380;
  const surfaceOffset = transform * 29;
  const trench = "M327 -20 C351 34 342 69 365 115 S352 194 384 232 S380 304 400 342 S402 380 412 414";
  const fault = "M357 -20 C381 34 372 69 395 115 S382 194 414 232 S410 304 430 342 S432 380 442 414";
  const faultLength = 520;
  return <svg viewBox="0 0 720 410" className="time-visual" role="img" aria-label={`Illustrative tectonic margin at ${ma <= .5 ? "present" : `${Math.round(ma)} million years before present`}. Schematic transition from oceanic subduction to a transform boundary; coastlines and motion are not georeferenced.`}>
    <defs>
      <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#708c8a"/><stop offset="1" stopColor="#344f53"/></linearGradient>
      <linearGradient id={`${id}-land`} x1="0" y1="0" x2="1" y2=".85"><stop stopColor="#e7d8bb"/><stop offset="1" stopColor="#ab9a7e"/></linearGradient>
      <pattern id={`${id}-grid`} width="33" height="33" patternUnits="userSpaceOnUse"><path d="M33 0H0V33" fill="none" stroke="#d5dfd4" strokeWidth=".65" opacity=".17"/></pattern>
      <pattern id={`${id}-contours`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><path d="M0 0V20" stroke="#e0d1b5" strokeWidth=".7" opacity=".29"/></pattern>
      <clipPath id={`${id}-ocean-clip`}><rect width="390" height="410"/></clipPath>
      <clipPath id={`${id}-water-shape`}><path d="M0 -20H341C368 34 359 69 382 115S369 194 401 232S397 304 417 342S419 380 429 414H0Z"/></clipPath>
    </defs>
    <rect width="720" height="410" fill={`url(#${id}-sea)`}/>
    <g clipPath={`url(#${id}-ocean-clip)`}>
      <g transform={`translate(${(oceanShift * .65).toFixed(2)} 0)`} opacity={.2 + .1 * oldMargin} stroke="#e1e7df" fill="none" strokeWidth="1">
        <path d="M-80 29C50 0 190 70 330 28M-80 79C50 50 190 120 330 78M-80 129C50 100 190 170 330 128M-80 179C50 150 190 220 330 178M-80 229C50 200 190 270 330 228M-80 279C50 250 190 320 330 278M-80 329C50 300 190 370 330 328M-80 379C50 350 190 420 330 378"/>
      </g>
    </g>
    <rect width="720" height="410" fill={`url(#${id}-grid)`}/>
    <path d="M341 -20C368 34 359 69 382 115S369 194 401 232S397 304 417 342S419 380 429 414H730V-20Z" fill={`url(#${id}-land)`} stroke="#796c5c" strokeWidth="2"/>
    <path d="M341 -20C368 34 359 69 382 115S369 194 401 232S397 304 417 342S419 380 429 414H730V-20Z" fill={`url(#${id}-contours)`} opacity=".65"/>
    <path d="M440 0C474 70 460 123 514 185S505 280 563 330M500 -10C536 74 531 133 581 187S568 271 635 364" stroke="#857660" strokeOpacity=".5" fill="none" strokeWidth="2"/>
    <g opacity={oldMargin}>
      <path d={trench} fill="none" stroke="#c5d7d1" strokeWidth="16" opacity=".28"/>
      <path d={trench} fill="none" stroke="#1f5358" strokeWidth="4" strokeDasharray="4 9" strokeLinecap="round"/>
      <path d="M321 104l23 2-18 17M349 276l23 2-18 17" stroke="#edf0e8" strokeWidth="2.5" fill="none"/>
    </g>
    <g opacity={oldMargin} transform={`translate(${(oceanShift * .48).toFixed(2)} 0)`}>
      <path d="M140 183H260m-19-12 19 12-19 12" stroke="#f8eedb" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M65 306H177m-18-11 18 11-18 11" stroke="#edf0e8" strokeOpacity=".65" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g clipPath={`url(#${id}-water-shape)`}>
      <g opacity={ridgeApproach} transform={`translate(${ridgeShift.toFixed(2)} 0)`}>
        <path d="M164 0C209 50 192 114 243 163S237 245 292 302S294 377 330 410" stroke="#ecd59f" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".48"/>
        <path d="M164 0C209 50 192 114 243 163S237 245 292 302S294 377 330 410" stroke="#f9e6b2" strokeWidth="2.5" strokeDasharray="8 8" fill="none"/>
      </g>
      <g opacity={transition}><circle cx="370" cy="226" r="18" fill="none" stroke="#f3dca9" strokeWidth="2" opacity=".65"/><circle cx="370" cy="226" r="5" fill="#edd5a0"/></g>
    </g>
    <g opacity={transform}>
      <g transform={`translate(0 ${(-surfaceOffset).toFixed(2)})`} stroke="#d7e1ce" strokeWidth="6" strokeOpacity=".75" fill="none"><path d="M105 279Q190 266 300 287"/></g>
      <g transform={`translate(0 ${surfaceOffset.toFixed(2)})`} stroke="#e5d3b2" strokeWidth="6" strokeOpacity=".9" fill="none"><path d="M411 285Q512 293 690 266"/></g>
      <path d={fault} fill="none" stroke="#332b29" strokeWidth="10" strokeOpacity=".32"/>
      <path d={fault} fill="none" stroke="#8e3c32" strokeWidth="5.5" strokeLinecap="round" strokeDasharray={`${faultLength} ${faultLength}`} strokeDashoffset={faultLength * (1-transform)}/>
      <g stroke="#f5e9d7" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${(-surfaceOffset * .3).toFixed(2)})`}>
        <path d="M206 272V130m-13 16 13-16 13 16"/>
      </g>
      <g stroke="#59463a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${(surfaceOffset * .3).toFixed(2)})`}>
        <path d="M555 130V272m-13-16 13 16 13-16"/>
      </g>
    </g>
    <g transform="translate(20 21)">
      <rect width="207" height="28" fill="#293d3d" opacity=".9"/>
      <text x="12" y="18" fontFamily="monospace" fontSize="10" letterSpacing="1.6" fill="#f1e6d4">{compact ? "CONCEPTUAL MARGIN" : "SCHEMATIC • NOT TO SCALE"}</text>
    </g>
    <g fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing=".5">
      <text x="30" y="82" fill="#f1e9d8" opacity={oldMargin}>FARALLON / OCEANIC</text>
      <text x="30" y="82" fill="#f1e9d8" opacity={transform}>PACIFIC PLATE</text>
      <text x="488" y="82" fill="#494137">NORTH AMERICA</text>
      <text x="30" y="386" fill="#f1e9d8" opacity={subduction}>CONVERGENT MARGIN</text>
      <text x="30" y="386" fill="#f1e9d8" opacity={transition}>RIDGE–TRENCH CONTACT</text>
      <text x="30" y="386" fill="#f1e9d8" opacity={transform}>RIGHT-LATERAL TRANSFORM</text>
    </g>
    <g transform="translate(450 332)"><rect width="249" height="54" fill="#e9dec7" fillOpacity=".9"/><text x="12" y="20" fill="#493e35" fontFamily="monospace" fontSize="11">INTERPRETIVE DIAGRAM</text><text x="12" y="38" fill="#645c4d" fontFamily="monospace" fontSize="10">NOT A PLATE ROTATION MODEL</text></g>
  </svg>;
}

export function TimeMachine() {
  // Start at the oldest epoch so PLAY demonstrates, rather than hides, change.
  const [ma, setMa] = useState(200);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [compare, setCompare] = useState(54);
  const reduced = useReducedMotion();
  const maRef = useRef(ma);
  const tweenRef = useRef<number | null>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  useEffect(() => { maRef.current = ma; }, [ma]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  useEffect(() => () => { if (tweenRef.current !== null) window.cancelAnimationFrame(tweenRef.current); }, []);
  const stopTween = () => { if (tweenRef.current !== null) window.cancelAnimationFrame(tweenRef.current); tweenRef.current = null; };

  const seek = (target: number, animate = true) => {
    setPlaying(false);
    stopTween();
    target = clamp(target, 0, 200);
    if (!animate || reduced || Math.abs(maRef.current - target) < .01) {
      maRef.current = target;
      setMa(target);
      return;
    }
    const start = maRef.current;
    const duration = clamp(330 + Math.abs(start-target) * 3.1, 370, 950);
    let first: number | null = null;
    const tick = (now: number) => {
      if (first === null) first = now;
      const t = clamp((now-first)/duration, 0, 1);
      const eased = t * t * (3 - 2 * t);
      maRef.current = start + (target-start)*eased;
      setMa(maRef.current);
      if (t < 1) tweenRef.current = window.requestAnimationFrame(tick);
      else tweenRef.current = null;
    };
    tweenRef.current = window.requestAnimationFrame(tick);
  };
  useAnimationClock(playing && !reduced, speed, dt => {
    const next = Math.max(0, maRef.current - dt * 10); // 200 Ma across 20 s at 1×
    maRef.current = next;
    setMa(next);
    if (next === 0) setPlaying(false); // never jump unexpectedly to 200 Ma
  });

  const keyframe = useMemo(() => epochs.reduce<(typeof epochs)[number]>((best, p) => Math.abs(p.ma-ma) < Math.abs(best.ma-ma) ? p : best, epochs[0]), [ma]);
  const exactEpoch = epochs.some(p => Math.abs(p.ma-ma) < .02);
  const shownMa = Math.round(ma);
  function step(direction: -1 | 1) {
    const destination = direction === 1
      ? MILESTONES.find(p => p < maRef.current - .1) ?? 0
      : [...MILESTONES].reverse().find(p => p > maRef.current + .1) ?? 200;
    seek(destination);
  }
  function togglePlay() {
    stopTween();
    if (playing) { setPlaying(false); return; }
    if (reduced) return;
    if (maRef.current <= .01) { maRef.current = 200; setMa(200); }
    setPlaying(true);
  }
  function positionCompare(clientX: number) {
    const rect = compareRef.current?.getBoundingClientRect();
    if (rect?.width) setCompare(Math.round(clamp(((clientX - rect.left)/rect.width)*100, 0, 100)));
  }

  return <section id="deep-time" className="chapter chapter-dark" data-chapter>
    <SectionHeading number="04" label="RECONSTRUCTION RECORD" title="Then & Now" summary="A boundary is not timeless. Follow the changing tectonic regime over 200 million years."/>
    <div className="time-main">
      <div className="panel-heading"><span>PALEOGEOGRAPHIC READER / FILE 04</span><span>CONCEPTUAL ANIMATED DIAGRAM</span></div>
      <div className="time-display"><TimeVisual ma={ma} id="time-main"/>
        <div className="time-float"><span>GEOLOGICAL TIME</span><strong>{shownMa === 0 ? "PRESENT" : `${shownMa} Ma`}</strong><span>{exactEpoch ? "SCHEMATIC REFERENCE EPOCH" : "ILLUSTRATIVE TRANSITION"}</span></div>
        <div className="time-progress" aria-hidden="true"><span style={{width:`${(200-ma)/2}%`}} /></div>
      </div>
      <div className="time-controls">
        <div className="control-label"><label htmlFor="time-position">TIME POSITION</label><output>{shownMa} Ma before present</output></div>
        <input id="time-position" type="range" min="0" max="200" step="1" value={200-shownMa} style={{"--range-progress":`${(200-ma)/2}%`} as CSSProperties} onChange={e=>seek(200-Number(e.target.value),false)} aria-valuetext={`${shownMa} million years before present`}/>
        <div className="time-keyframes">{epochs.map(p=><button key={p.ma} aria-pressed={Math.abs(ma-p.ma)<.5} onClick={()=>seek(p.ma)}>{p.ma===0?"NOW":`${p.ma} Ma`}</button>)}</div>
        <div className="playback-controls">
          <button className="outline-action" aria-label="Previous schematic time marker" onClick={()=>step(-1)} disabled={ma>=199.9}><Rewind size={17}/> PREVIOUS</button>
          <button className="dark-action" disabled={reduced} onClick={togglePlay}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?"PAUSE":ma<=.01?"REPLAY":"PLAY"}</button>
          <button className="outline-action" aria-label="Next schematic time marker" onClick={()=>step(1)} disabled={ma<=.01}>NEXT <FastForward size={17}/></button>
          <select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}>{[.5,1,2,4].map(v=><option key={v} value={v}>{v}×</option>)}</select>
          <button className="icon-action" aria-label="Return to 200 million years ago" onClick={()=>seek(200)}><RotateCcw size={18}/></button>
        </div>
        {reduced && <p className="motion-hint">Reduced motion enabled. Use the slider or time markers to explore static stages.</p>}
      </div>
    </div>
    <div className="time-notes">
      <div className="reading-panel" aria-live="off"><p className="eyebrow">CLOSEST SCHEMATIC EPOCH</p><h3>{keyframe.title} / {keyframe.label}</h3><p>{keyframe.regime} · {keyframe.plate}</p><SourceLabel id="atwater1970">ATWATER / GEOLOGICAL CONTEXT</SourceLabel></div>
      <div className="reading-panel"><p className="eyebrow">MODEL INTEGRITY</p><h3>What this can—and cannot—show.</h3><p>This is a conceptual transition, not a published coordinate reconstruction. The moving plate outlines and intervening dates are illustrative; the modern fault is absent in older stages.</p><ResearchSlot>{story.time.interpretation}</ResearchSlot></div>
    </div>
    <div className="comparison-unit">
      <div className="panel-heading"><span>THEN / NOW COMPARISON</span><span>DRAG ON IMAGE OR USE SLIDER</span></div>
      <ScientificFigure figure="04" description="Original schematic comparison, using interpretive plate outlines rather than measured palaeogeographic coordinates.">
        <div className="time-compare" ref={compareRef} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);positionCompare(e.clientX);}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))positionCompare(e.clientX);}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}>
          <div className="compare-layer"><TimeVisual ma={200} id="compare-then" compact/></div>
          <div className="compare-layer compare-top" style={{clipPath:`inset(0 ${100-compare}% 0 0)`}}><TimeVisual ma={0} id="compare-now" compact/></div>
          <div className="compare-line" style={{left:`${compare}%`}}><span className="compare-grip" aria-hidden="true">↔</span></div>
          <span className="comparison-label before">THEN · 200 Ma</span><span className="comparison-label after">NOW · 0 Ma</span>
        </div>
      </ScientificFigure>
      <label className="visually-hidden" htmlFor="compare-slider">Then versus now reveal position</label>
      <input id="compare-slider" type="range" min="0" max="100" value={compare} onChange={e=>setCompare(Number(e.target.value))} aria-valuetext={`${compare} percent present-day view revealed`}/>
    </div>
  </section>;
}
