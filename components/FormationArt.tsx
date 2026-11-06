"use client";
import { useState } from "react";
import { formationImageFiles } from "@/src/data/user-media";
type Stage = 0 | 1 | 2;
export const formationAssets = ["/assets/formation-nebula.jpg", "/assets/formation-accretion.jpg", "/assets/formation-differentiation.jpg"] as const;
export function FormationDrawing({ stage }: { stage: Stage }) {
  const dust = Array.from({length:70},(_,i)=>{const a=i*2.3999632;const r=22+Math.sqrt(i)*26;return {x:370+Math.cos(a)*r*1.45,y:205+Math.sin(a)*r*.64,s:1.8+(i%5),opacity:.35+(i%6)*.08};});
  const chunks = Array.from({length:16},(_,i)=>{const a=i*2.39996,r=42+Math.sqrt(i)*40;return {x:365+Math.cos(a)*r,y:215+Math.sin(a)*r*.66,s:7+(i%4)*5};});
  return <svg className="formation-art-svg" viewBox="0 0 720 420" role="img" aria-label={stage===0?"Conceptual rotating protoplanetary disk of gas and dust":stage===1?"Illustrative growth of a rocky planet from colliding bodies":"Cross-section showing differentiated core and mantle"}>
    <defs><radialGradient id="form-cosmos"><stop stopColor="#425c58"/><stop offset="1" stopColor="#1f2928"/></radialGradient><radialGradient id="form-planet"><stop stopColor="#ead3aa"/><stop offset=".75" stopColor="#967459"/><stop offset="1" stopColor="#3f514b"/></radialGradient></defs>
    <rect width="720" height="420" fill="url(#form-cosmos)"/>
    <g stroke="#9da9a3" opacity=".15" strokeWidth="1">{[100,210,320].map(y=><path key={y} d={`M0 ${y}H720`}/>)}{[120,240,360,480,600].map(x=><path key={x} d={`M${x} 0V420`}/>)}</g>
    {stage===0&&<g><ellipse cx="366" cy="211" rx="298" ry="108" fill="none" stroke="#d6bb96" strokeWidth="22" strokeOpacity=".25" transform="rotate(-15 366 211)"/><ellipse cx="366" cy="211" rx="248" ry="73" fill="none" stroke="#f4d4a7" strokeWidth="11" strokeOpacity=".35" transform="rotate(-15 366 211)"/>{dust.map((d,i)=><circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#e8d3b2" opacity={d.opacity}/>)}<circle cx="360" cy="213" r="40" fill="#f8d899"/><circle cx="360" cy="213" r="56" fill="none" stroke="#f8d899" strokeOpacity=".24" strokeWidth="13"/></g>}
    {stage===1&&<g>{chunks.map((c,i)=><g key={i}><circle cx={c.x} cy={c.y} r={c.s} fill={i%2?"#b5a58b":"#81958a"} stroke="#eee0be" strokeWidth="2"/><path d={`M${c.x-5} ${c.y}l12 -7`} stroke="#415148" strokeWidth="2"/></g>)}<circle cx="365" cy="214" r="92" fill="url(#form-planet)" stroke="#d5c6a9" strokeWidth="2"/><g fill="none" stroke="#d4b995" strokeWidth="5" strokeOpacity=".8"><path d="M319 158q45-14 95 6M302 220q38-20 62 22t75-4M326 271q40-20 67 3"/></g></g>}
    {stage===2&&<g><circle cx="362" cy="209" r="157" fill="#d3ac78" stroke="#f3dfb9" strokeWidth="3"/><circle cx="362" cy="209" r="140" fill="#9e7554"/><circle cx="362" cy="209" r="91" fill="#cc895b"/><circle cx="362" cy="209" r="48" fill="#f2d098"/><path d="M362 52V366" stroke="#fff1ce" strokeOpacity=".25" strokeDasharray="6 8"/><g fill="#f4e5c9" fontFamily="monospace" fontSize="14"><text x="541" y="116">MANTLE</text><path d="M531 121L454 150" stroke="#ebd8b8"/><text x="532" y="247">CORE</text><path d="M519 240L409 215" stroke="#ebd8b8"/></g></g>}
    <g fontFamily="monospace" fill="#f0e3ca" fontSize="16"><text x="28" y="35">FORMATION / 0{stage+1}</text><text x="28" y="393" fontSize="13">ORIGINAL TEACHING SCHEMATIC • NOT TO SCALE</text></g>
  </svg>;
}
export function FormationArt({ stage }: { stage: Stage }) {
 const [failed, setFailed] = useState<Record<number,boolean>>({});
 const [available, setAvailable] = useState<Record<number,boolean>>({});
 const src = formationImageFiles[stage];
 return <div className="formation-art" key={stage}>
  {/* Students can replace this art with their own image file at the documented path. */}
  <FormationDrawing stage={stage}/>
  {src&&!failed[stage]&&<img alt={`Student-supplied visual for formation stage ${stage+1}`} src={src} onLoad={()=>setAvailable(v=>({...v,[stage]:true}))} onError={()=>setFailed(v=>({...v,[stage]:true}))} className={`formation-supplied ${available[stage]?"loaded":""}`}/>}
  <div className="formation-art-caption"><span>{src&&available[stage]?"STUDENT IMAGE · CITE SOURCE":"ORIGINAL TEACHING SCHEMATIC"}</span></div>
 </div>;
}
