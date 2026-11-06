#!/usr/bin/env node
/** Static source-derived QA: renders actual TSX SVG React trees; no synthetic geology numbers. */
import fs from 'node:fs';import vm from 'node:vm';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const ts=require(process.env.TYPESCRIPT_MODULE||'typescript');
const React={createElement(type,props,...children){return {type,props:{...props,children}};},useState(x){return [x,()=>{}]},useMemo(f){return f()},useEffect(){},useRef(x){return {current:x}}};
function component(path){const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{fileName:path,compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};vm.runInNewContext(code,{React,module,exports:module.exports,require(name){if(name==='react')return React;return {};},console},{filename:path});return module.exports;}
const attrs={className:'class',strokeWidth:'stroke-width',strokeLinecap:'stroke-linecap',strokeLinejoin:'stroke-linejoin',strokeDasharray:'stroke-dasharray',strokeOpacity:'stroke-opacity',fillOpacity:'fill-opacity',clipPath:'clip-path',fontFamily:'font-family',fontWeight:'font-weight',fontSize:'font-size',textAnchor:'text-anchor',letterSpacing:'letter-spacing',stopColor:'stop-color',pointerEvents:'pointer-events'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
function markup(n){if(n==null||typeof n==='boolean')return '';if(Array.isArray(n))return n.map(markup).join('');if(typeof n!=='object')return esc(n);if(typeof n.type==='function')return markup(n.type(n.props));const {children,...p}=n.props||{};const a=Object.entries(p).filter(([k,v])=>k!=='key'&&typeof v!=='function'&&v!=null&&v!==false&&k!=='dangerouslySetInnerHTML').map(([k,v])=>` ${attrs[k]||k}="${esc(v)}"`).join('');return `<${n.type}${a}>${markup(children)}</${n.type}>`;}
const california=component('components/CaliforniaAtlas.tsx');const form=component('components/FormationArt.tsx');const malaysia=component('components/MalaysiaPanel.tsx');const fault=component('components/FaultLab.tsx');
const div=(title,tree)=>`<section><h2>${title}</h2><div class="frame">${markup(tree)}</div></section>`;
const sections=[div('CALIFORNIA / FIELD ATLAS',california.CaliforniaAtlas({events:[]}))];
for(let i=0;i<3;i++)sections.push(div(`FORMATION / ${i+1}`,form.FormationDrawing({stage:i})));
for(const p of [0,25,50,75,100])sections.push(div(`FILE 02 / ${p}%`,fault.FaultPlan({progress:p,layers:true})));
for(const p of [0,35,70,100])sections.push(div(`MALAYSIA / COUNTERFACTUAL / ${p}%`,malaysia.PeninsularSection({mode:'counterfactual',progress:p})));
sections.push(div('MALAYSIA / ACTUAL',malaysia.PeninsularSection({mode:'actual',progress:0})));
const head=`<!doctype html><html><head><meta charset="UTF-8"><style>html{background:#181d1a;color:#e8dac5;font-family:Arial}body{margin:0;padding:25px}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}h1{font-size:32px}h2{font-size:18px}.frame{background:#c8bda4;padding:8px;border:1px solid #8f8170}svg{width:100%;display:block;height:auto}section{min-width:0}.atlas-poi-label{font-family:monospace;font-size:14px;fill:#6d2d28;paint-order:stroke;stroke:#f2e6d1;stroke-width:4px}.atlas-poi-detail{background:#eee2ca;color:#302d27;padding:12px;font-size:16px}.atlas-poi-detail b{display:block}.atlas-poi-detail p{margin:4px 0}@media(max-width:840px){main{grid-template-columns:1fr}}</style></head><body><h1>V3 / rendered actual-component contact sheet</h1><main>`;
fs.writeFileSync('v3-preview.html',head+sections.join('')+'</main></body></html>');
console.log(`Preview created with ${sections.length} source-component states.`);
