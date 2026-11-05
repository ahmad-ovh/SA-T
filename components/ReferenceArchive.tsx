"use client";
import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { sources } from "@/src/data/sources";
export function ReferenceArchive({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;if(open&&!el.open)el.showModal();else if(!open&&el.open)el.close();},[open]);
  return <dialog className="reference-dialog" ref={ref} onClose={onClose} onClick={e=>{if(e.target===ref.current)onClose();}} aria-labelledby="reference-title"><div className="reference-content"><div className="reference-header"><div><p className="eyebrow">ARCHIVE SUPPLEMENT / ACCESSIBLE ON DEMAND</p><h2 id="reference-title">Reference Archive</h2></div><button className="icon-action" onClick={onClose} aria-label="Close reference archive"><X size={22}/></button></div><p className="reference-intro">Bibliography pointers and dataset provenance. Verify bibliographic completeness, exact figure permission, and dataset access dates before submission.</p><ol className="references">{sources.map((s,i)=><li key={s.id}><span className="ref-sequence">{String(i+1).padStart(2,"0")}</span><div><span className="ref-kind">{s.kind}</span><p>{s.apa}</p><a href={s.url} target="_blank" rel="noopener noreferrer">View publication / source <ExternalLink size={13}/></a>{s.note&&<small>{s.note}</small>}</div></li>)}</ol><div className="reference-caveat"><b>Academic integrity</b><p>Student is responsible for final authored scientific reasoning, academic citations, AI declaration, cover sheet and self-recorded walkthrough.</p></div></div></dialog>;
}
