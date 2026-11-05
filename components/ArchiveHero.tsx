import { ArrowDownRight, ArrowUpRight, ChevronDown, Crosshair } from "lucide-react";
import { story } from "@/src/content/story";
import { ScientificFigure } from "./Shared";

function Locator() {
  return <svg className="hero-map" viewBox="0 0 600 520" role="img" aria-label="Conceptual schematic of California and the Pacific–North America transform margin; not georeferenced">
    <defs><pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#9d9786" strokeOpacity=".18" strokeWidth=".8" /></pattern><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.04"/></feComponentTransfer></filter></defs>
    <rect width="600" height="520" fill="#ccc1aa" /><rect width="600" height="520" fill="url(#map-grid)" /><rect width="600" height="520" fill="#3d312c" filter="url(#paper-grain)"/>
    <path d="M185 0 180 50 203 115 191 174 217 230 230 288 262 344 276 395 301 440 355 491 367 520 600 520 600 0Z" fill="#ddd2b8" stroke="#8b806b" strokeWidth="2"/>
    <path d="M180 50 204 114 190 170 222 227 233 288 267 342 278 395 306 447 365 512" fill="none" stroke="#475b57" strokeWidth="6" strokeLinecap="round" opacity=".56"/>
    <path d="M200 51 225 120 216 180 244 244 255 292 289 356 302 408 338 463 391 503" fill="none" stroke="#8E3C32" strokeWidth="3" strokeDasharray="8 5"/>
    <g stroke="#8E3C32" strokeWidth="3" fill="none" strokeLinecap="round"><path d="m208 207 -11 -24m11 24 6 -25"/><path d="m278 328 11 26m-11 -26 -6 27"/></g>
    <g fontFamily="monospace" fontSize="11" fill="#47483f"><text x="48" y="92">PACIFIC PLATE</text><text x="351" y="95">NORTH AMERICAN</text><text x="351" y="112">PLATE</text><text x="32" y="485">WESTERN NORTH AMERICA</text><text x="408" y="484">NOT TO SCALE</text></g>
    <g fill="#8E3C32"><circle cx="216" cy="179" r="5"/><circle cx="302" cy="408" r="5"/></g><g fontFamily="monospace" fontSize="11" fill="#8E3C32"><text x="242" y="170">FAULT CORRIDOR</text><text x="323" y="398">TRANSFORM</text></g>
    <g stroke="#48473d" strokeWidth="2"><path d="M552 69V34m0 0-7 12m7 -12 7 12"/></g><text x="546" y="26" fontSize="12" fontFamily="monospace" fill="#48473d">N</text>
  </svg>;
}

export function ArchiveHero() {
  return <section className="hero" aria-label="Exhibit introduction"><div className="hero-copy">
    <div className="file-index"><span>EXHIBIT NO. 001</span><span>OPEN ACCESS / EDUCATIONAL</span></div>
    <div className="stamp">RELEASED FOR STUDY <span>FICTIONAL ARCHIVE</span></div>
    <p className="eyebrow">GEOLOGICAL INTELLIGENCE / CASE STUDY: CALIFORNIA</p>
    <h1>PROJECT<br/><em>SAN ANDREAS</em></h1>
    <h3>{story.subtitle}</h3>
    <p className="hero-lead">{story.hero}</p>
    <p className="archive-disclaimer">{story.disclaimer}</p>
    <a className="primary-action" href="#origin">OPEN INVESTIGATION <ArrowDownRight size={17} aria-hidden="true" /></a>
    <div className="hero-bottom"><span>05 INVESTIGATION FILES</span><span><Crosshair size={14} aria-hidden="true" /> CALIFORNIA / MALAYSIA</span></div>
  </div><div className="hero-visual"><div className="map-title"><span>MAP SHEET / 001-A</span><span>SCHEMATIC LOCATOR</span></div><ScientificFigure figure="00" description="Conceptual continental margin diagram. Positions are illustrative, not measured GIS coordinates."><Locator /></ScientificFigure><div className="hero-instruments"><div><span>BOUNDARY TYPE</span><b>CONTINENTAL TRANSFORM</b></div><div><span>RELATIVE MOTION</span><b><ArrowUpRight size={16} aria-hidden="true" /> RIGHT-LATERAL</b></div></div></div>
    <a className="scroll-cue" href="#origin" aria-label="Go to chapter one"><ChevronDown size={20}/></a>
  </section>;
}
