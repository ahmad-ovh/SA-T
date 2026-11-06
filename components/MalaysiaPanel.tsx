"use client";
import { useState } from "react";
import { SectionHeading, SourceLabel, ResearchSlot, ScientificFigure } from "./Shared";
import { story } from "@/src/content/story";

type Mode = "actual" | "counterfactual";
const stages = ["INITIAL CONDITIONS", "STRAIN ACCUMULATES", "FAULT SLIP ILLUSTRATED", "AFTER DISPLACEMENT"] as const;
export const getMalaysiaScenarioStage = (progress: number) => Math.min(3,Math.floor(Math.max(0, Math.min(100,progress)) / 25));

export function PeninsularSection({ mode, progress }: { mode: Mode; progress: number }) {
  const hypothetical = mode === "counterfactual";
  const p = hypothetical ? progress / 100 : 0;
  const shear = Math.min(1,p*1.5);
  // Cross-fault sections show horizontal vectors perpendicular to the paper, not vertical slip.
  return <svg viewBox="0 0 900 515" className="malaysia-section-svg" role="img" aria-label={hypothetical?`Hypothetical transform beneath Peninsular Malaysia: illustrative sequence position ${Math.round(progress)}%; horizontal motion enters and leaves the page, no vertical fault offset implied`:'Present-day conceptual section across Peninsular Malaysia: no major plate transform boundary crossing the peninsula; earthquakes can still occur'}>
    <defs><linearGradient id={`malay-ground-${mode}`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#c4a886"/><stop offset=".6" stopColor="#9e8466"/><stop offset="1" stopColor="#5c6058"/></linearGradient><pattern id={`malay-texture-${mode}`} width="26" height="24" patternUnits="userSpaceOnUse"><path d="M0 12q13-9 26 0M0 24q13-9 26 0" fill="none" stroke="#ead7b5" strokeOpacity=".26" strokeWidth="1.8"/></pattern></defs>
    <rect width="900" height="515" fill="#c8d4ca"/>
    <rect y="220" width="900" height="295" fill={`url(#malay-ground-${mode})`}/>
    <path d="M0 220Q100 198 195 219T370 214Q450 210 530 216T700 218T900 217" fill="none" stroke="#718268" strokeWidth="18"/>
    <rect y="246" width="900" height="269" fill={`url(#malay-texture-${mode})`}/>
    <path d="M0 328Q100 319 200 328T400 326T600 329T900 326" fill="none" stroke="#dfc5a2" strokeWidth="9" strokeOpacity=".68"/>
    <path d="M0 432Q120 418 220 430T520 424T900 432" fill="none" stroke="#d1ab83" strokeWidth="8" strokeOpacity=".7"/>
    {hypothetical && <>
      <path d="M442 213Q438 279 453 340T445 513" stroke="#4e332e" strokeWidth="24" fill="none"/>
      <path d="M442 213Q438 279 453 340T445 513" stroke="#cd7767" strokeWidth="3.5" strokeDasharray="12 7" fill="none"/>
      <ellipse cx="449" cy="345" rx={30+shear*87} ry={85+shear*35} fill="#aa715e" fillOpacity={shear*.11}/>
      <g transform="translate(266 359)" opacity={.25+shear*.75}>
        <circle r="45" fill="#465c51" stroke="#e9e0d0" strokeWidth="2"/><path d="M-19 -19L19 19M19 -19L-19 19" stroke="#fff2d6" strokeWidth="7" strokeLinecap="round"/>
        <text x="0" y="73" fill="#f9f0df" fontFamily="monospace" fontWeight="700" fontSize="19" textAnchor="middle">INTO PAGE ×</text>
      </g>
      <g transform="translate(655 359)" opacity={.25+shear*.75}>
        <circle r="45" fill="#82624f" stroke="#f3e4d0" strokeWidth="2"/><circle r="13" fill="#fff2d6"/>
        <text x="0" y="73" fill="#fff2df" fontFamily="monospace" fontWeight="700" fontSize="19" textAnchor="middle">OUT OF PAGE •</text>
      </g>
      <g opacity={shear}><path d="M431 204l-8 12 10 14" stroke="#aa4b3f" strokeWidth="3" fill="none"/><path d="M453 206l8 11-10 15" stroke="#aa4b3f" strokeWidth="3" fill="none"/></g>
    </>}
    {!hypothetical&&<g fill="#5a6559" opacity=".55"><path d="M150 230L135 274M580 246L562 280M744 258L729 281" stroke="#665946" strokeWidth="3"/><text x="40" y="472" fontFamily="monospace" fontSize="18">INTRAPLATE CRUST / CONCEPTUAL</text></g>}
    <g><rect x="0" y="0" width="900" height="86" fill="#35443f"/><text x="28" y="37" fill="#f0e6d6" fontSize="23" fontFamily="monospace" fontWeight="700">{hypothetical?"IF PENINSULAR MALAYSIA STRADDLED A TRANSFORM":"PENINSULAR MALAYSIA / PRESENT SETTING"}</text><text x="28" y="67" fill="#c3d0c1" fontSize="16" fontFamily="monospace">{hypothetical?"COUNTERFACTUAL / NOT A HAZARD FORECAST":"RELATIVELY STABLE SUNDA PLATE / NOT EARTHQUAKE-FREE"}</text></g>
    <g fill="#35463e" fontFamily="monospace" fontWeight="700" fontSize="19"><text x="28" y="169">{hypothetical?"HYPOTHETICAL BLOCK A":"SUNDALAND / INTRAPLATE"}</text><text x="585" y="169">{hypothetical?"HYPOTHETICAL BLOCK B":"CONTINENTAL CRUST"}</text></g>
    {hypothetical && <>
      <rect x="335" y="470" width="245" height="32" fill="#403b33"/><text x="457" y="491" textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill="#f4ddc4">CONCEPTUAL FAULT ZONE</text>
    </>}
    <g fontFamily="monospace" fontSize="14" fill="#f0dfc3"><text x="21" y="502">SCHEMATIC SECTION · NOT TO SCALE</text></g>
  </svg>;
}

export function MotionInset({ progress }: { progress: number }) {
 const delta = progress * .7;
 return <svg className="malaysia-motion-inset" viewBox="0 0 600 155" role="img" aria-label="Plan-view inset shows matching surface marker separating laterally in a hypothetical transform; no real Malaysian fault is implied">
   <rect width="600" height="155" fill="#b6baa7"/><rect x="0" width="288" height="155" fill="#789080"/><rect x="312" width="288" height="155" fill="#bda489"/><path d="M300 0L293 75L304 155" stroke="#5a372f" strokeWidth="19" fill="none"/><path d="M300 0L293 75L304 155" stroke="#d5a28d" strokeDasharray="11 7" strokeWidth="3" fill="none"/>
   <g transform={`translate(0 ${-delta})`}><path d="M0 76L290 76" stroke="#f1e4ce" strokeWidth="12"/><path d="M0 76L290 76" stroke="#635849" strokeWidth="2" strokeDasharray="8 8"/></g>
   <g transform={`translate(0 ${delta})`}><path d="M311 76L600 76" stroke="#f1e4ce" strokeWidth="12"/><path d="M311 76L600 76" stroke="#635849" strokeWidth="2" strokeDasharray="8 8"/></g>
   <g fontFamily="monospace" fontSize="17" fontWeight="700"><rect x="8" y="8" width="252" height="29" fill="#283e34"/><text x="19" y="28" fill="#f0e4ce">PLAN VIEW / INSET</text><rect x="349" y="8" width="245" height="29" fill="#eae0cd"/><text x="359" y="28" fill="#574c3d">DISPLACEMENT DEMO</text></g>
 </svg>;
}

export function MalaysiaPanel() {
 const [mode,setMode] = useState<Mode>("counterfactual");
 const [time,setTime] = useState(0);
 const stage=getMalaysiaScenarioStage(time);
 return <section id="malaysia" className="chapter chapter-paper" data-chapter><SectionHeading number="05" label="MALAYSIA / COUNTERFACTUAL" title="Why It Matters" summary="Peninsular Malaysia is relatively stable within Sunda. Explore a hypothetical transform crossing."/>
   <div className="malaysia-intro"><div><p className="eyebrow">OBSERVED SETTING</p><h3>Relatively stable.<br/><em>Not immune.</em></h3><p>Peninsular tremors and distant Sumatran earthquakes remain relevant. Relatively stable does not mean hazard-free.</p><SourceLabel id="peninsula-seismic">PENINSULAR STUDY</SourceLabel> <SourceLabel id="met-malaysia">METMALAYSIA</SourceLabel></div><div className="malaysia-stamp"><span>REALITY</span><b>≠</b><span>WHAT IF?</span><small>COMPARISON / NOT PREDICTION</small></div></div>
   <div className="malaysia-scenario"><div className="panel-heading"><span>05-A / CROSS-SECTION TIME EXPLORER</span><span>ILLUSTRATIVE SEQUENCE / NO CLOCK RATE</span></div>
    <div className="malaysia-mode-tabs" role="group" aria-label="Choose Malaysian geological scenario"><button aria-pressed={mode==="actual"} className={mode==="actual"?"selected":""} onClick={()=>setMode("actual")}>01 / PRESENT MALAYSIA</button><button aria-pressed={mode==="counterfactual"} className={mode==="counterfactual"?"selected":""} onClick={()=>setMode("counterfactual")}>02 / IF A TRANSFORM CROSSED IT</button></div>
    <ScientificFigure figure="05-A" description="Original hypothetical section and plan inset; no location, rate or recurrence implied."><PeninsularSection mode={mode} progress={time}/>{mode==="counterfactual"&&<MotionInset progress={time}/>}</ScientificFigure>
    <div className="malaysia-scrubber"><div className="control-label"><label htmlFor="malaysia-time">SCENARIO TIME / SCRUB TO EXPLORE</label><output>{mode==="actual"?"PRESENT-DAY SETTING":stages[stage]}</output></div><input type="range" id="malaysia-time" min="0" max="100" step="1" disabled={mode==="actual"} value={time} onChange={e=>setTime(Number(e.target.value))} aria-valuetext={`Hypothetical sequence ${Math.round(time)} percent; not calendar years`}/><div className="malaysia-stage-buttons">{stages.map((name,i)=><button key={name} type="button" aria-pressed={stage===i} disabled={mode==="actual"} onClick={()=>setTime(i===3?100:i*33)}><span>0{i+1}</span> {name}</button>)}</div><p className="scenario-note">{mode==="actual"?"The comparison is an actual tectonic setting, not a claim that Malaysia never experiences earthquakes.":"Counterfactual: opposite horizontal motion concentrates deformation near a fictional fault. The slider has no earthquake timing or measured rate."}</p></div>
   </div>
   <div className="two-up closing-notes"><div className="reading-panel"><p className="eyebrow">STUDENT ANALYSIS / WHAT CHANGES?</p><ResearchSlot>{story.malaysia.comparison}</ResearchSlot></div><div className="reading-panel conclusion"><p className="eyebrow">EVIDENCE-BASED CONCLUSION</p><ResearchSlot>{story.malaysia.conclusion}</ResearchSlot></div></div>
 </section>;
}
