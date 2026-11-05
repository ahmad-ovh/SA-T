"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimationClock, useReducedMotion } from "./useMotion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { SectionHeading, ResearchSlot, ScientificFigure, SourceLabel } from "./Shared";
import { story } from "@/src/content/story";

type View = "overhead" | "split" | "section";
function Diagram({ displacement, view, layers }: { displacement: number; view: View; layers: boolean }) {
  const shift = (displacement - 50) * .75;
  const overhead = <svg viewBox="0 0 640 340" className="fault-diagram" role="img" aria-label="Illustrative right-lateral motion: Pacific side moves northwest relative to North American side"><defs><pattern id="fault-lines" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 18 18 0" stroke="#f0e7d4" strokeOpacity=".13"/></pattern></defs><rect width="318" height="340" fill="#7d8976"/><rect x="322" width="318" height="340" fill="#ae977e"/><g className="fault-rock-markers" opacity={layers ? 1 : 0}>
      <path d={`M20 ${84-shift} 210 ${110-shift} 318 ${155-shift}`} fill="none" stroke="#c8d3c3" strokeWidth="13"/>
      <path d={`M322 ${155+shift} 444 ${198+shift} 620 ${208+shift}`} fill="none" stroke="#e7d8bf" strokeWidth="13"/>
    </g>
    <path d="M320 0V340" stroke="#702f2b" strokeWidth="5"/><path d="M320 0V340" stroke="#e1c8b3" strokeDasharray="5 9" strokeWidth="1.4"/><g stroke="#efe8d7" strokeWidth="4" fill="none"><path d="M144 245V113l-11 17m11-17 11 17"/><path d="M490 110v133l-11-17m11 17 11-17"/></g><text x="20" y="36" className="svg-white">PACIFIC PLATE</text><text x="355" y="36" className="svg-dark">N. AMERICAN PLATE</text><text x="24" y="312" className="svg-white">RELATIVE NW</text><text x="365" y="312" className="svg-dark">RELATIVE SE</text><text x="329" y="166" className="svg-dark">FAULT</text></svg>;
  const section = <svg viewBox="0 0 640 245" className="fault-diagram" role="img" aria-label="Conceptual geological depth section through a vertical transform fault"><rect width="640" height="48" fill="#a0ac94"/><rect y="48" width="640" height="80" fill="#a28b72"/><rect y="128" width="640" height="117" fill="#6e776a"/><path className="fault-rock-markers" d="M0 69H640M0 140H640M0 187H640" stroke="#e2d2ba" strokeOpacity=".35" opacity={layers ? 1 : 0}/>
    <path d="M320 0V151" stroke="#8E3C32" strokeDasharray="7 6" strokeWidth="4"/><path d="M320 151v90" stroke="#e1d5bd" strokeWidth="2" strokeDasharray="2 7"/><text x="20" y="31" className="svg-dark">WEST / PACIFIC</text><text x="405" y="31" className="svg-dark">EAST / NORTH AMERICA</text><text x="20" y="103" className="svg-white">CRUST (SCHEMATIC)</text><text x="20" y="211" className="svg-white">DEEPER ROCK</text><text x="338" y="171" className="svg-white">FAULT ZONE (ILLUSTRATIVE)</text></svg>;
  return <div className="fault-views">{view!=="section"&&<div className="fault-view-pane">{overhead}<span className="view-caption">PLAN VIEW / NOT TO SCALE</span></div>}{view!=="overhead"&&<div className="fault-view-pane">{section}<span className="view-caption">SECTION / NOT TO SCALE</span></div>}</div>;
}
export function FaultLab() {
  const [view, setView] = useState<View>("split");
  const [playing,setPlaying] = useState(false);
  const [speed,setSpeed] = useState(1);
  const [displacement,setDisplacement] = useState(50);
  const [layers,setLayers] = useState(true);
  const reduced = useReducedMotion();
  const position = useRef(displacement);
  useEffect(() => { position.current = displacement; }, [displacement]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);
  useAnimationClock(playing && !reduced, speed, dt => {
    const next = Math.min(100, position.current + dt * 13);
    position.current = next;
    setDisplacement(next);
    if (next >= 100) setPlaying(false);
  });
  const setOffset = (next: number) => { position.current = next; setDisplacement(next); setPlaying(false); };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (reduced) return;
    if (position.current >= 99.99) { position.current = 0; setDisplacement(0); }
    setPlaying(true);
  };
  return <section id="tectonics" className="chapter chapter-dark" data-chapter><SectionHeading number="02" label="TRANSFORM KINEMATICS" title="Tectonic Setting" summary="Two plates pass sideways. Explore the movement from above and below the ground." />
    <div className="fault-layout"><div className="lab-main"><div className="panel-heading"><span>PLATE BOUNDARY LAB / INSTRUMENT 02</span><span>ILLUSTRATIVE MOTION ONLY</span></div><div className="lab-view-tabs" role="group" aria-label="Fault diagram view">{(["overhead","split","section"] as View[]).map(v=><button key={v} aria-pressed={v===view} className={v===view?"active":""} onClick={()=>setView(v)}>{v.toUpperCase()}</button>)}</div><ScientificFigure figure="02" description="Original right-lateral transform model. Displacement is a visual slider, not a velocity or earthquake forecast."><Diagram view={view} displacement={displacement} layers={layers}/></ScientificFigure></div>
      <div className="lab-sidebar"><p className="eyebrow">CASE 02 / SHEAR MARGIN</p><h3>Two plates.<br/><em>One boundary.</em></h3><p className="body-copy">Pacific and North American plates move laterally along a transform system. No magnitude or rupture time is calculated here.</p><SourceLabel id="atwater1970">TECTONIC CONTEXT</SourceLabel><div className="control-unit"><div className="control-label"><label htmlFor="fault-displacement">ILLUSTRATIVE OFFSET</label><output>{Math.round(displacement)}%</output></div><input id="fault-displacement" type="range" min="0" max="100" step="0.1" value={displacement} onChange={e=>setOffset(Number(e.target.value))}/></div><div className="control-unit"><label htmlFor="fault-speed">PLAYBACK SPEED</label><select id="fault-speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select></div><label className="check-row"><input type="checkbox" checked={layers} onChange={e=>setLayers(e.target.checked)}/> Show illustrative rock layers</label><div className="control-buttons"><button className="dark-action" disabled={reduced} onClick={togglePlay}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?"PAUSE":displacement>=99.99?"REPLAY":"ANIMATE"}</button><button className="outline-action" onClick={()=>setOffset(50)}><RotateCcw size={15}/> RESET</button></div>{reduced && <p className="motion-hint">Reduced motion enabled. Use the offset slider to inspect static positions.</p>}<div className="model-caution"><b>NOT AN EARTHQUAKE PREDICTION</b><p>Motion, scales and cross-section are demonstrative.</p></div></div></div><div className="bottom-research"><b>SCIENTIFIC EXPLANATION</b><ResearchSlot>{story.tectonics.mechanism}</ResearchSlot></div>
  </section>;
}
