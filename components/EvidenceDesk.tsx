"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, RefreshCw, Upload, Activity, Navigation2, Mountain } from "lucide-react";
import { earthquakeArchive, gnssCsvHeader, parseGnssCsv, type GnssRecord, type Quake } from "@/src/data/evidence";
import { story } from "@/src/content/story";
import { earthscopeTeachingRows, earthscopeTeachingMetadata } from "@/src/data/gnss-teaching";
import { earthscopeNam14Url } from "@/src/data/earthscope-vel";
import { SectionHeading, SourceLabel, ResearchSlot, FieldStatus, ScientificFigure } from "./Shared";
import { CaliforniaAtlas } from "./CaliforniaAtlas";

type Tab = "seismicity" | "geodesy" | "geology";
type CatalogState = "loading" | "ready" | "unavailable";
function GeographicGrid({ children }: { children: React.ReactNode }) {
  return <svg className="geo-grid" viewBox="0 0 700 390" role="img" aria-label="Longitude latitude scatterplot for verified sourced observations"><rect width="700" height="390" fill="#ded7c7"/>{Array.from({length:11},(_,i)=><g key={i}><line x1={45+i*60} x2={45+i*60} y1="27" y2="355" stroke="#afa793" strokeDasharray="2 5"/><text className="geo-label" x={38+i*60} y="377">{(-125+i).toFixed(0)}°</text></g>)}{Array.from({length:10},(_,i)=><g key={i}><line x1="45" x2="645" y1={355-i*36.44} y2={355-i*36.44} stroke="#afa793" strokeDasharray="2 5"/><text className="geo-label" x="8" y={359-i*36.44}>{32+i}°</text></g>)}<rect x="45" y="27" width="600" height="328" fill="none" stroke="#7f796e"/>{children}</svg>;
}
const projectX = (lon: number) => 45+(lon+125)*60;
const projectY = (lat: number) => 355-(lat-32)*(328/9);
export function EvidenceDesk() {
  const [tab,setTab] = useState<Tab>("seismicity"); const [catalog,setCatalog] = useState<CatalogState>("loading");const [quakes,setQuakes] = useState<Quake[]>([]);const [retrievedAt,setRetrievedAt] = useState("");const [requestUrl,setRequestUrl] = useState("");
  const [mag,setMag] = useState(3);const [depth,setDepth] = useState(40);const [gnss,setGnss] = useState<GnssRecord[]>(earthscopeTeachingRows);
  const [gnssError,setGnssError]=useState("");const [showVectors,setShowVectors]=useState(true);const [chosenSite,setChosenSite]=useState("SBCC");
  const [gnssSource,setGnssSource] = useState<"snapshot"|"archive"|"imported">("snapshot");
  const [gnssLoading,setGnssLoading] = useState(false);
  const [archiveRelease,setArchiveRelease] = useState("");
  const [archiveRetrieved,setArchiveRetrieved] = useState("");
  const [archiveTotal,setArchiveTotal] = useState(0);
  const importedOverride = useRef(false);const [offset,setOffset]=useState(48);
  const loadQuakes = useCallback(async () => {
    setCatalog("loading");
    try {
      const response=await fetch("/api/earthquakes",{cache:"no-store"});
      const body=await response.json();
      if(!response.ok || !body.data?.features || !Array.isArray(body.data.features))throw new Error("Catalog unavailable");
      const parsed:Quake[] = body.data.features.flatMap((feature: unknown)=>{
        if(!feature||typeof feature!=="object")return [];
        const v=feature as {id?:unknown; geometry?:{coordinates?:unknown};properties?:{mag?:unknown;time?:unknown;place?:unknown}};
        const coords=v.geometry?.coordinates;
        if(!Array.isArray(coords)||coords.length<3||coords.slice(0,3).some(x=>typeof x!=="number"||!Number.isFinite(x))||typeof v.properties?.mag!=="number"||typeof v.properties?.time!=="number"||!Number.isFinite(v.properties.time)||!Number.isFinite(v.properties.mag)||Number.isNaN(new Date(v.properties.time).getTime()))return [];
        return [{id:String(v.id||"unknown"),lon:coords[0],lat:coords[1],depth:coords[2],magnitude:v.properties.mag,time:new Date(v.properties.time).toISOString(),place:String(v.properties.place||"Region unknown")}];
      });
      setQuakes(parsed);setRetrievedAt(String(body.retrievedAt || ""));setRequestUrl(String(body.requestUrl || ""));setCatalog("ready");
    } catch {setQuakes([]);setCatalog("unavailable");}
  },[]);
  useEffect(()=>{void loadQuakes();},[loadQuakes]);
  const filtered=useMemo(()=>quakes.filter(q=>q.magnitude>=mag && q.depth>=0 && q.depth<=depth && q.lon>=-125&&q.lon<=-115&&q.lat>=32&&q.lat<=41),[quakes,mag,depth]);
  const loadOfficialGnss = useCallback(async () => {
    importedOverride.current = false;
    setGnssLoading(true);setGnssError("");
    try {
      const response = await fetch("/api/gnss",{cache:"no-store"});
      const payload = await response.json();
      if(!response.ok || !Array.isArray(payload.rows) || !payload.rows.length || payload.referenceFrame!=="NAM14")
        throw new Error(payload.error || "EarthScope NAM14 source unavailable");
      if(!importedOverride.current) {
        const rows = payload.rows as GnssRecord[];
        if(rows.some(r=>r.referenceFrame!=="NAM14" || !Number.isFinite(r.ve) || !Number.isFinite(r.vn)))
          throw new Error("Invalid official station values");
        setGnss(rows);setChosenSite(rows[0].site);setGnssSource("archive");
        setArchiveRelease(payload.releaseDate);setArchiveRetrieved(payload.retrievedAt);setArchiveTotal(payload.allRegionalSites);
      }
    } catch (error) {
      if(!importedOverride.current)
        setGnssError(`EarthScope archive inaccessible; the published 2022 two-station teaching snapshot remains available. ${error instanceof Error?error.message:""}`);
    } finally { setGnssLoading(false); }
  },[]);
  useEffect(()=>{void loadOfficialGnss();},[loadOfficialGnss]);
  async function loadGnssFile(file?:File) {
    if(!file)return;
    setGnssError("");
    try {const rows=parseGnssCsv(await file.text());importedOverride.current=true;setGnss(rows);setChosenSite(rows[0].site);setGnssSource("imported");} catch(e){setGnssError(e instanceof Error?e.message:"Unreadable file");}
  }
  function downloadCsv(text: string, filename: string) {
    const blob = new Blob([text], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href=url;link.download=filename;
    document.body.appendChild(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function downloadTemplate(){downloadCsv(gnssCsvHeader+"\n","gnss-verified-stations-template.csv");}
  function downloadLoadedGnss() {
    const lines=[gnssCsvHeader,...gnss.map(r=>[r.site,r.lat,r.lon,r.ve,r.vn,r.referenceFrame,r.epoch].join(","))];
    downloadCsv(lines.join("\n")+"\n",`gnss-${gnssSource}-${selectedGnss?.referenceFrame?.toLowerCase()||"stations"}.csv`);
  }
  const selectedGnss=gnss.find(r=>r.site===chosenSite)||gnss[0];
  return <section id="evidence" className="chapter chapter-paper" data-chapter><SectionHeading number="03" label="OBSERVATION VS MODEL" title="The Evidence Layer" summary="Three independent evidence streams; measurements remain distinct from schematics."/>
    <div className="evidence-tabs" role="tablist" aria-label="Evidence datasets">{(["seismicity","geodesy","geology"] as Tab[]).map((t,i)=><button key={t} id={`evidence-tab-${t}`} role="tab" type="button" tabIndex={tab===t?0:-1} aria-controls={`evidence-panel-${t}`} aria-selected={tab===t} className={tab===t?"active":""} onClick={()=>setTab(t)} onKeyDown={e=>{
      if(!["ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;
      e.preventDefault();const names:Tab[]=["seismicity","geodesy","geology"];
      const next=e.key==="Home"?0:e.key==="End"?2:(i+(e.key==="ArrowRight"?1:2))%3;
      setTab(names[next]);
      const nextTab=document.getElementById(`evidence-tab-${names[next]}`);
      nextTab?.focus();
    }}>{i===0?<Activity size={17}/>:i===1?<Navigation2 size={17}/>:<Mountain size={17}/>}<span>0{i+1}</span>{t==="seismicity"?"SEISMICITY":t==="geodesy"?"GPS / GEODESY":"GEOLOGICAL TRACES"}</button>)}</div>
    {tab==="seismicity"&&<div id="evidence-panel-seismicity" aria-labelledby="evidence-tab-seismicity" role="tabpanel" tabIndex={0} className="evidence-body"><div className="evidence-visual"><div className="panel-heading"><span>USGS / CALIFORNIA REGIONAL CATALOG</span>{catalog==="ready"?<FieldStatus kind="good">DATA RECEIVED</FieldStatus>:catalog==="loading"?<FieldStatus>FETCHING CATALOG</FieldStatus>:<FieldStatus kind="warn">OFFLINE / UNAVAILABLE</FieldStatus>}</div><ScientificFigure figure="03-A" description="USGS ComCat epicentres on schematic California atlas; fault trace is approximate."><CaliforniaAtlas compact events={filtered}/></ScientificFigure><div className="dataset-footer"><span>{catalog==="ready"?`${filtered.length} of ${quakes.length} returned events visible`:"No measurements shown without a valid source response"}</span><SourceLabel id="usgs-comcat">DATA PROVENANCE</SourceLabel></div></div>
      <aside className="evidence-sidebar"><p className="eyebrow">STREAM 01 / SEISMICITY</p><h3>Where the Earth breaks.</h3><p className="body-copy">Filter an archived earthquake sample by magnitude and depth.</p><div className="control-unit"><div className="control-label"><label htmlFor="quake-magnitude">MINIMUM MAGNITUDE</label><output>M {mag.toFixed(1)}</output></div><input id="quake-magnitude" type="range" min="2" max="6" step=".5" value={mag} onChange={e=>setMag(Number(e.target.value))}/></div><div className="control-unit"><div className="control-label"><label htmlFor="quake-depth">MAXIMUM DEPTH</label><output>{depth} km</output></div><input id="quake-depth" type="range" min="5" max="100" step="5" value={depth} onChange={e=>setDepth(Number(e.target.value))}/></div><div className="depth-distribution" aria-label="Observed depth distribution by ten-kilometre bins"><b>DEPTH DISTRIBUTION / OBSERVED EVENTS</b><svg viewBox="0 0 300 90" role="img" aria-label="Histogram of catalog depths for the current magnitude filter">{Array.from({length:10},(_,i)=>{const count=quakes.filter(q=>q.magnitude>=mag && q.depth>=i*10 && q.depth<(i+1)*10).length;const max=Math.max(1,...Array.from({length:10},(_,j)=>quakes.filter(q=>q.magnitude>=mag && q.depth>=j*10 && q.depth<(j+1)*10).length));return <g key={i}><rect x={8+i*29} y={74-(count/max)*60} width="20" height={(count/max)*60} fill={i*10<depth?"#8E3C32":"#aaa18d"}><title>{`${i*10}–${(i+1)*10} km: ${count} reported events`}</title></rect><text x={8+i*29} y="86" fontSize="8" fill="#756c60">{i*10}</text></g>})}</svg><small>Depth (km); catalog sample, not a regional census.</small></div><div className="dataset-metadata"><b>DATA WINDOW</b><span>{earthquakeArchive.start} — {earthquakeArchive.end}</span><b>RETRIEVED (UTC)</b><span>{retrievedAt||"Awaiting source"}</span><b>QUERY</b><span>32–41°N, 125–115°W · up to {earthquakeArchive.maximumResults} newest events</span></div><button className="outline-action" onClick={()=>void loadQuakes()}><RefreshCw size={14}/> RETRY SOURCE</button>{requestUrl&&<a className="small-link" href={requestUrl} target="_blank" rel="noreferrer">Open exact query ↗</a>}{catalog==="unavailable"&&<p className="data-error" role="status">The USGS API could not be reached. No artificial events were substituted.</p>}</aside></div>}
    {tab==="geodesy"&&<div id="evidence-panel-geodesy" aria-labelledby="evidence-tab-geodesy" role="tabpanel" tabIndex={0} className="evidence-body">
      <div className="evidence-visual">
        <div className="panel-heading"><span>GNSS / NORTH AMERICA-FIXED NAM14</span><FieldStatus kind={gnssSource==="archive"?"good":"warn"}>{gnssSource==="archive"?"EARTHSCOPE FINAL PRODUCT":gnssSource==="snapshot"?"PUBLISHED TEACHING SNAPSHOT":"CUSTOM CSV IMPORT"}</FieldStatus></div>
        <ScientificFigure figure="03-B" description={`Station velocity arrows (${gnssSource==="snapshot"?"published rounded 2022 NAM14 estimates":gnssSource==="archive"?"EarthScope CWU final NAM14 velocity file":"user-imported CSV; independently unverified"}); direction follows measured N/E components. Vector length is screen-scaled, not geographic distance.`}>
          <GeographicGrid>{gnss.map(r=>{const x=projectX(r.lon);const y=projectY(r.lat);const dx=Math.max(-65,Math.min(65,r.ve*1.15));const dy=Math.max(-65,Math.min(65,-r.vn*1.15));return <g key={r.site}><circle cx={x} cy={y} r="4.5" fill="#536c61" stroke="#f1ebdf" strokeWidth="1"/>{showVectors&&<><path d={`M${x} ${y} l${dx} ${dy}`} stroke="#8E3C32" strokeWidth="2.6" fill="none" strokeLinecap="round"/><circle cx={x+dx} cy={y+dy} r="2.5" fill="#8E3C32"/></>}{(gnssSource==="snapshot"||gnss.length<=35)&&<text x={x+8} y={y-7} fontSize="11" fill="#253f36">{r.site}</text>}<title>{`${r.site}: E ${r.ve}, N ${r.vn} mm/yr; ${r.referenceFrame}; ${r.epoch}${r.estimated?" (rounded published estimate)":""}`}</title></g>;})}</GeographicGrid>
        </ScientificFigure>
        <div className="dataset-footer"><span>{gnss.length} station rows {gnssSource==="archive"?`(subsample of ${archiveTotal} regional quality-filtered sites)` : gnssSource==="snapshot"?"(rounded from EarthScope teaching guide)":"(user-imported; origin not independently verified)"}</span><SourceLabel id={gnssSource==="snapshot"?"earthscope-teaching":"earthscope"}>EARTHSCOPE SOURCE</SourceLabel></div>
      </div>
      <aside className="evidence-sidebar"><p className="eyebrow">STREAM 02 / GEODESY</p><h3>Measure the slow motion.</h3>
        <p className="body-copy">NAM14 measures station movement relative to stable North America. Official archive records load automatically when available; a dated published two-station example is bundled offline.</p>
        <button className="outline-action" onClick={()=>void loadOfficialGnss()} disabled={gnssLoading}><RefreshCw size={14}/> {gnssLoading?"CONTACTING EARTHSCOPE…":"REFRESH OFFICIAL NAM14"}</button>
        <button className="outline-action" onClick={downloadLoadedGnss}><Download size={14}/> DOWNLOAD DISPLAYED STATIONS</button>
        <label className="upload-control"><Upload size={16}/> IMPORT ANOTHER VERIFIED CSV<input type="file" accept=".csv,text/csv" onChange={e=>void loadGnssFile(e.target.files?.[0])}/></label>
        <button className="outline-action" onClick={downloadTemplate}><Download size={14}/> DOWNLOAD CSV TEMPLATE</button>
        <label className="check-row"><input type="checkbox" checked={showVectors} onChange={e=>setShowVectors(e.target.checked)}/> Velocity vectors</label>
        <label className="control-unit">STATION<select value={chosenSite} onChange={e=>setChosenSite(e.target.value)}>{gnss.map(r=><option key={r.site} value={r.site}>{r.site}</option>)}</select></label>
        {selectedGnss&&<div className="dataset-metadata"><b>VE / VN · MM/YR</b><span>{selectedGnss.ve.toFixed(2)} / {selectedGnss.vn.toFixed(2)} {selectedGnss.estimated?"(approx.)":""}</span><b>HORIZONTAL SPEED</b><span>{Math.hypot(selectedGnss.ve,selectedGnss.vn).toFixed(1)} mm/yr</span><b>REFERENCE FRAME</b><span>{selectedGnss.referenceFrame}</span><b>DATA EPOCH / VERSION</b><span>{selectedGnss.epoch}</span>{selectedGnss.northSigmaMmYr!==undefined&&<><b>N / E 1σ</b><span>{selectedGnss.northSigmaMmYr} / {selectedGnss.eastSigmaMmYr} mm/yr</span></>}{gnssSource==="archive"&&<><b>FILE RELEASE / UTC RETRIEVAL</b><span>{archiveRelease} / {archiveRetrieved}</span></>}{gnssSource==="snapshot"&&<><b>PUBLICATION DATE</b><span>{earthscopeTeachingMetadata.published}; values rounded from teaching plots</span></>}</div>}
        <a className="small-link" href={gnssSource==="snapshot"?earthscopeTeachingMetadata.sourceUrl:gnssSource==="archive"?earthscopeNam14Url:"https://www.unavco.org/data/gps-gnss/derived-products/derived-products.html"} target="_blank" rel="noreferrer">Open the source documentation ↗</a>
        {gnssError&&<p className="data-error" role="status">{gnssError}</p>}
        <div className="model-caution"><b>PROVENANCE / INTERPRETATION</b><p>{gnssSource==="snapshot"?"Two published EarthScope/UNAVCO classroom slope estimates (14 May 2022), rounded to about 0.1 mm/yr. They are not a current official velocity solution; no processing epoch or formal uncertainty was supplied in the guide.":gnssSource==="archive"?"EarthScope CWU final NAM14 network; N/E values converted from metres/year to millimetres/year. Horizontal uncertainty screening ≤ 2 mm/yr. Do not compare with IGS14 without frame transformation.":"Imported values have passed format checks, not source authentication. Keep the frame, collection interval, processing version and citation alongside the CSV."}</p></div>
      </aside>
    </div>}
    {tab==="geology"&&<div id="evidence-panel-geology" aria-labelledby="evidence-tab-geology" role="tabpanel" tabIndex={0} className="evidence-body"><div className="evidence-visual"><div className="panel-heading"><span>WALLACE CREEK / OFFSET DEMONSTRATION</span><FieldStatus>ILLUSTRATIVE / NO GIS IMPORT</FieldStatus></div><ScientificFigure figure="03-C" description="Original stylized stream-offset illustration inspired by published field observations, not a survey image or measured caliper."><svg className="offset-illustration" viewBox="0 0 700 390" role="img" aria-label="Conceptual right-lateral displacement of stream crossing the fault"><rect width="700" height="390" fill="#d3c8ac"/><path d="M0 118 140 105 270 154 350 146 465 101 700 142" stroke="#8d977e" strokeWidth="48" fill="none" opacity=".48"/><path d={`M32 ${105+(offset-50)*1.25} C140 ${128+(offset-50)*1.25} 210 ${95+(offset-50)*1.25} 340 ${178+(offset-50)*1.25}`} stroke="#567a79" strokeWidth="16" fill="none"/><path d={`M360 ${178-(offset-50)*1.25} C455 ${250-(offset-50)*1.25} 540 ${236-(offset-50)*1.25} 675 ${305-(offset-50)*1.25}`} stroke="#567a79" strokeWidth="16" fill="none"/><path d="M350 0V390" stroke="#8E3C32" strokeDasharray="11 7" strokeWidth="4"/><g className="geo-label"><text x="25" y="34">SCHEMATIC STREAM</text><text x="384" y="34">ILLUSTRATIVE OFFSET</text><text x="354" y="365">FAULT</text></g></svg></ScientificFigure><div className="dataset-footer"><span>Actual mapped traces must come from USGS GIS or a cited survey.</span><SourceLabel id="usgs-faults">USGS FAULT DATABASE</SourceLabel></div></div><aside className="evidence-sidebar"><p className="eyebrow">STREAM 03 / FIELD GEOLOGY</p><h3>The landscape keeps a record.</h3><p className="body-copy">Offset channels and mapped faults offer a geological line of evidence, independent of earthquake catalogs.</p><SourceLabel id="sieh1984">WALLACE CREEK / SIEH &amp; JAHNS</SourceLabel><div className="control-unit"><div className="control-label"><label htmlFor="geology-offset">VISUAL ALIGNMENT</label><output>DEMO ONLY</output></div><input type="range" id="geology-offset" min="0" max="100" value={offset} onChange={e=>setOffset(Number(e.target.value))}/></div><div className="model-caution"><b>NOT A MEASUREMENT</b><p>Slider units are arbitrary. No displacement age or slip rate is inferred.</p></div></aside></div>}
    <div className="bottom-research"><b>STUDENT EVIDENCE SYNTHESIS</b><ResearchSlot>{story.evidence.synthesis}</ResearchSlot></div>
  </section>;
}
