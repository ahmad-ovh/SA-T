import { ArrowDownRight, ArrowUpRight, ChevronDown, Crosshair } from "lucide-react";
import { story } from "@/src/content/story";
import { ScientificFigure } from "./Shared";
import { CaliforniaAtlas } from "./CaliforniaAtlas";


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
  </div><div className="hero-visual"><div className="map-title"><span>MAP SHEET / 001-A</span><span>CALIFORNIA FIELD ATLAS</span></div><ScientificFigure figure="00" description="Original schematic atlas; sourced field sites, illustrative fault trace."><CaliforniaAtlas /></ScientificFigure><div className="hero-instruments"><div><span>BOUNDARY TYPE</span><b>CONTINENTAL TRANSFORM</b></div><div><span>RELATIVE MOTION</span><b><ArrowUpRight size={16} aria-hidden="true" /> RIGHT-LATERAL</b></div></div></div>
    <a className="scroll-cue" href="#origin" aria-label="Go to chapter one"><ChevronDown size={20}/></a>
  </section>;
}
