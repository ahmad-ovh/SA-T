"use client";
import { useEffect, useState } from "react";
import { BookOpen, Menu, X, ArrowUpRight, ChevronUp } from "lucide-react";
import { story } from "@/src/content/story";
import { ArchiveHero } from "./ArchiveHero";
import { EarthInterior } from "./EarthInterior";
import { FaultLab } from "./FaultLab";
import { EvidenceDesk } from "./EvidenceDesk";
import { TimeMachine } from "./TimeMachine";
import { MalaysiaPanel } from "./MalaysiaPanel";
import { ReferenceArchive } from "./ReferenceArchive";

export function ArchiveShell() {
  const [active,setActive] = useState("origin");const [progress,setProgress] = useState(0);const [archiveOpen,setArchiveOpen] = useState(false);const [menuOpen,setMenuOpen]=useState(false);const [wordCount,setWordCount]=useState(0);
  useEffect(()=>{
    const onScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max>0?Math.round(window.scrollY/max*100):0);const chapters=story.chapters.map(s=>document.getElementById(s.id));for(const el of [...chapters].reverse()){if(el&&el.getBoundingClientRect().top<window.innerHeight*.48){setActive(el.id);break;}}};
    onScroll();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll)};
  },[]);
  useEffect(()=>{const timer=window.setTimeout(()=>{const root=document.querySelector<HTMLElement>("[data-story-root]");if(root){const text=root.innerText;setWordCount((text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length);}},300);return()=>window.clearTimeout(timer);},[active]);
  return <><a className="skip-link" href="#origin">Skip to investigation</a><div className="top-ribbon"><span>PROJECT SAN ANDREAS</span><span>EDUCATIONAL RECONSTRUCTION / FICTIONAL ARCHIVE</span><span>SKTP 2613 · BASIC GEOSCIENCE</span></div>
    <div className="progress-track" aria-hidden="true"><div style={{width:`${progress}%`}} /></div><header className="site-header"><a className="logo-lockup" href="#top" aria-label="Project San Andreas, back to top"><span className="logo-mark">S<span>/</span>A</span><span>THE GROUND<br/>BENEATH US</span></a><nav className={menuOpen?"chapter-nav open":"chapter-nav"} aria-label="Chapters">{story.chapters.map(ch=><a key={ch.id} href={`#${ch.id}`} aria-current={active===ch.id?"location":undefined} className={active===ch.id?"active":""} onClick={()=>setMenuOpen(false)}><span>{ch.n}</span>{ch.title}</a>)}</nav><button className="reference-trigger" onClick={()=>setArchiveOpen(true)}><BookOpen size={17}/> <span>REFERENCES</span> <ArrowUpRight size={15}/></button><button className="mobile-menu" aria-label={menuOpen?"Close chapter menu":"Open chapter menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={23}/>:<Menu size={23}/>}</button></header>
    <main id="top" data-story-root><ArchiveHero/><EarthInterior/><FaultLab/><EvidenceDesk/><TimeMachine/><MalaysiaPanel/></main>
    <footer className="site-footer"><div className="footer-wordmark">PROJECT <em>SAN ANDREAS</em><span>A FICTIONAL GEOLOGICAL ARCHIVE</span></div><div><p>Five chapters. Three evidence streams. One question: what does the ground tell us?</p><p className="footer-note">Student scientific interpretation and dataset verification remain pending. Illustration is not measurement.</p></div><div className="footer-actions"><button onClick={()=>setArchiveOpen(true)}>OPEN REFERENCES ↗</button><a href="#top">RETURN TO TOP <ChevronUp size={16}/></a><span>VISIBLE WORD ESTIMATE: {wordCount}</span></div></footer><ReferenceArchive open={archiveOpen} onClose={()=>setArchiveOpen(false)}/>
  </>;
}
