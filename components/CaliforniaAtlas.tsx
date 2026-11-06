"use client";
import { useId, useState } from "react";
import type { Quake } from "@/src/data/evidence";

/** Indexed cartographic illustration. POI coordinates are sourced; the coast, state edge
 * and simplified San Andreas trace are NOT survey-grade GIS geometry. */
export const californiaPoi = [
  { id: "wallace", name: "Wallace Creek", place: "Carrizo Plain", lat: 35.2711, lon: -119.8271, note: "A displaced channel records repeated right-lateral movement.", source: "https://pubs.usgs.gov/of/1999/of99-014/" },
  { id: "palmdale", name: "Palmdale Roadcut", place: "Antelope Valley", lat: 34.5586, lon: -118.1332, note: "Exposed deformed strata beside the fault near Highway 14.", source: "https://clui.org/ludb/site/san-andreas-fault-cross-section-palmdale" },
  { id: "oasis", name: "Thousand Palms Oasis", place: "Coachella Valley", lat: 33.8372, lon: -116.3092, note: "A southern fault-zone field site with paleoseismic evidence.", source: "https://pubs.usgs.gov/publication/70024230" }
] as const;

export const mapX = (lon: number) => 43 + (lon + 125.5) * 66;
export const mapY = (lat: number) => 40 + (42.4 - lat) * 54;
const xy = (pts: number[][]) => pts.map(([lon,lat]) => `${mapX(lon).toFixed(1)},${mapY(lat).toFixed(1)}`).join(" ");
const stateOutline = [
  [-124.41,42],[-120.0,42],[-120.0,39.0],[-119.99,38.9],[-119.1,37.7],[-118.3,36.65],[-117.35,35.6],[-114.98,35.0],[-114.73,34.78],[-114.71,32.72],[-116.11,32.53],[-117.13,32.53],[-117.28,32.9],[-117.6,33.4],[-118.1,33.7],[-118.55,34.0],[-119.1,34.3],[-120.45,34.45],[-120.75,35.18],[-121.35,35.8],[-121.94,36.5],[-122.42,37.77],[-122.95,38.3],[-123.75,39.25],[-124.32,40.26],[-124.41,42]
];
// Simplified orientation trace, deliberately NOT described as surveyed fault geometry.
const fault = [
  [-124.18,40.66],[-123.05,39.35],[-122.82,38.35],[-122.58,37.85],[-122.26,37.30],[-121.51,36.84],[-120.96,36.36],[-120.43,35.90],[-119.8271,35.2711],[-119.26,35.10],[-118.85,34.83],[-118.45,34.67],[-118.1332,34.5586],[-117.62,34.35],[-117.20,34.17],[-116.75,33.99],[-116.3092,33.8372],[-115.97,33.3]
];
const cities = [
  {name:"SACRAMENTO",lon:-121.49,lat:38.58},
  {name:"SAN FRANCISCO",lon:-122.42,lat:37.77},
  {name:"LOS ANGELES",lon:-118.24,lat:34.05},
] as const;

export function CaliforniaAtlas({ events = [], compact = false }: { events?: Quake[]; compact?: boolean }) {
  const instanceId = useId().replace(/:/g, "");
  const gridId = `${instanceId}-atlas-grid`;
  const clipId = `${instanceId}-atlas-california-clip`;
  const landId = `${instanceId}-atlas-land`;
  const detailId = `${instanceId}-atlas-detail`;
  const [selected,setSelected] = useState<(typeof californiaPoi)[number]["id"]>("wallace");
  const poi = californiaPoi.find(p=>p.id===selected)!;
  return <div className={`california-atlas ${compact ? "atlas-compact" : ""}`}>
    <svg className="california-map" viewBox="0 0 860 650" role="group" aria-label="California fault atlas with selectable Wallace Creek, Palmdale Roadcut and Thousand Palms Oasis markers">
      <defs><pattern id={gridId} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#8b968e" strokeOpacity=".2" strokeWidth="1"/></pattern><clipPath id={clipId}><polygon points={xy(stateOutline)}/></clipPath><linearGradient id={landId} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e9dbc0"/><stop offset="1" stopColor="#cab898"/></linearGradient></defs>
      <rect width="860" height="650" fill="#b3c5bd"/>
      <rect width="860" height="650" fill={`url(#${gridId})`}/>
      <path d="M0 0H860V650H0Z" fill="#7ca19e" opacity=".2"/>
      <polygon points={xy(stateOutline)} fill={`url(#${landId})`} stroke="#5a6259" strokeWidth="3" strokeLinejoin="round"/>
      <g clipPath={`url(#${clipId})`} fill="none" stroke="#a59577" strokeOpacity=".42" strokeWidth="3">
        <path d={`M${xy([[-121.0,41.7],[-121.2,39.7],[-120.7,38.4],[-119.8,37.1],[-118.9,36.2],[-118.4,35.1],[-117.7,33.8]]).replaceAll(' ', 'L')}`}/>
        <path d={`M${xy([[-122.7,39.7],[-122.0,38.3],[-121.0,37.3],[-120.25,36.4],[-119.4,35.4]]).replaceAll(' ', 'L')}`}/>
        <path d={`M${xy([[-119.6,40.0],[-118.5,38.1],[-117.4,36.4],[-116.2,35.1]]).replaceAll(' ', 'L')}`}/>
      </g>
      <g fill="#48675f" opacity=".28" clipPath={`url(#${clipId})`}>
        <path d="M354 55Q405 140 453 207T536 400L575 505 555 518Q517 420 476 343T392 166Z"/>
      </g>
      <polyline points={xy(fault)} fill="none" stroke="#fff0d2" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity=".92"/>
      <polyline points={xy(fault)} fill="none" stroke="#a4473a" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={xy(fault)} fill="none" stroke="#e4afa0" strokeWidth="1.4" strokeDasharray="6 7"/>
      {events.filter(e=>e.lon>=-125.5&&e.lon<=-113&&e.lat>=32&&e.lat<=42.4).map(q=><circle key={q.id} cx={mapX(q.lon)} cy={mapY(q.lat)} r={Math.min(10,2+Math.max(0,q.magnitude-2)*1.15)} fill="#283a36" fillOpacity=".65" stroke="#f8e2c5" strokeWidth=".8"><title>{`M${q.magnitude} / ${q.depth} km / ${q.place}`}</title></circle>)}
      <g fontFamily="monospace" fontWeight="700" fontSize="14" letterSpacing=".6" fill="#46594e">
        <text x="73" y="375" transform="rotate(-90 73 375)" fill="#ebf4e9">PACIFIC OCEAN</text>
        <text x="439" y="156" textAnchor="middle">SIERRA NEVADA</text>
        <text x="743" y="173" textAnchor="middle">NEVADA</text>
        <text x="333" y="307" fill="#5a6757">CALIFORNIA</text>
      </g>
      {cities.map(city=><g key={city.name} transform={`translate(${mapX(city.lon)} ${mapY(city.lat)})`}><circle r="3" fill="#50534a"/><text x="10" y="-11" fill="#41443c" fontFamily="monospace" fontSize="11" fontWeight="700">{city.name}</text></g>)}
      {californiaPoi.map((item,i)=>{
        const x=mapX(item.lon),y=mapY(item.lat),chosen=selected===item.id;
        return <g key={item.id} role="button" tabIndex={0} aria-label={`Show ${item.name}, ${item.place}`} aria-pressed={chosen} aria-controls={detailId} onClick={()=>setSelected(item.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(item.id)}}} className={`atlas-poi ${chosen?"selected":""}`}>
          <circle cx={x} cy={y} r={chosen?16:13} fill="#f2e7d1" stroke="#a4473a" strokeWidth={chosen?4:2}/>
          <circle cx={x} cy={y} r="5.5" fill="#953c32"/>
          <path d={item.id==="wallace"?`M${x-12} ${y}L${x-36} ${y-51}H${x-60}`:item.id==="palmdale"?`M${x+12} ${y}L${x+26} ${y-50}H${x+38}`:`M${x-10} ${y+10}L${x-23} ${y+42}H${x-32}`} stroke="#702c28" strokeWidth="2" fill="none"/>
          {item.id==="oasis"?<text x={x-34} y={y+48} textAnchor="end" className="atlas-poi-label" fontWeight={chosen?"800":"600"}><tspan x={x-34}>03. THOUSAND PALMS</tspan><tspan x={x-34} dy="19">OASIS / COACHELLA</tspan></text>:<text x={item.id==="wallace"?x-65:x+40} y={item.id==="wallace"?y-59:y-54} textAnchor={item.id==="wallace"?"end":"start"} className="atlas-poi-label" fontWeight={chosen?"800":"600"}>{String(i+1).padStart(2,"0")}. {item.name.toUpperCase()}</text>}
        </g>;
      })}
      <g fontFamily="monospace" fontSize="13" fill="#2b403e"><rect x="21" y="21" width="277" height="63" fill="#efe5d1" opacity=".92"/><text x="35" y="48" fontWeight="700">SAN ANDREAS / FAULT ATLAS</text><text x="35" y="68">SCHEMATIC TRACE + SOURCED SITES</text></g>
      <g transform="translate(790 50)" fill="none" stroke="#344c46" strokeWidth="3"><path d="M0 43V0m-10 13L0 0l10 13"/></g><text x="783" y="40" fill="#344c46" fontFamily="monospace" fontSize="15">N</text>
      <g fontFamily="monospace" fontSize="11" fill="#4d5148"><rect x="17" y="607" width="827" height="28" fill="#eee4d1" opacity=".9"/><text x="29" y="625">FAULT TRACE SIMPLIFIED · SITE POINTS APPROXIMATE · NOT FOR HAZARD OR NAVIGATION USE</text></g>
    </svg>
    <div id={detailId} className={`atlas-poi-detail ${compact ? "atlas-poi-detail-compact" : ""}`} aria-live="polite" aria-atomic="true"><div>{!compact&&<span>FIELD LOCATION / {californiaPoi.findIndex(p=>p.id===selected)+1} OF 3</span>}<b>{poi.name} <small>· {poi.place}</small></b>{!compact&&<p>{poi.note}</p>}</div><a href={poi.source} target="_blank" rel="noopener noreferrer">FIELD SOURCE ↗</a></div>
  </div>;
}
