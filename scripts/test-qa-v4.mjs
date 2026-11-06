#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ts=require(process.env.TYPESCRIPT_MODULE||'typescript');
const postcss=require('postcss');
const read=f=>fs.readFileSync(f,'utf8');
const files=[];
function scan(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const f=path.join(dir,ent.name);
  if(ent.isDirectory())scan(f);else if(/\.tsx?$/.test(ent.name))files.push(f);
}}
for(const root of ['app','components','src'])scan(root);
for(const file of files){
 const result=ts.transpileModule(read(file),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
 const errors=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
 assert.equal(errors.length,0,`TS/TSX syntax errors in ${file}: ${errors.map(x=>x.messageText).join(', ')}`);
}
const css=read('app/globals.css');
postcss.parse(css,{from:'app/globals.css'});
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/\.formation-details \.stage-note b\{white-space:normal/,'mobile formation overflow correction missing');
assert.match(css,/\.fault-view-pane \.fault-pane-head\{min-width:0/,'mobile fault header correction missing');
assert.match(css,/focus-visible/);
const atlas=read('components/CaliforniaAtlas.tsx');
assert.match(atlas,/const instanceId = useId\(\)/);
assert.match(atlas,/aria-pressed=\{chosen\}/);
assert.match(atlas,/aria-controls=\{detailId\}/);
for(const fragment of ['id={gridId}','id={clipId}','id={landId}','url(#${gridId})','url(#${clipId})','url(#${landId})'])assert(atlas.includes(fragment),`Atlas unique ID use missing ${fragment}`);
const desk=read('components/EvidenceDesk.tsx');
assert.match(desk,/id=\{`evidence-tab-\$\{t\}`\}/);
assert.match(desk,/ArrowRight/);assert.match(desk,/aria-labelledby="evidence-tab-geodesy"/);
assert.match(desk,/user-imported CSV; independently unverified/);
assert.match(desk,/window\.setTimeout\(\(\)=>URL\.revokeObjectURL\(url\),1000\)/);
const nav=read('components/ArchiveShell.tsx');
assert.match(nav,/menuRef\.current\?\.focus\(\)/);
assert.match(nav,/aria-controls="chapter-navigation"/);
assert.match(nav,/root\.addEventListener\("change",schedule\)/);
const data=read('src/data/evidence.ts');
assert.match(data,/Blank GNSS numeric cell/);assert.match(data,/Invalid station ID/);
const stage=read('components/MalaysiaPanel.tsx');
assert.match(stage,/\/ 25\)/);
const wordAudit=JSON.parse(read('docs/QA_WORD_AUDIT.json'));
assert(wordAudit.states.some(x=>x.state==='evidence / geodesy'));
assert(wordAudit.peakSampledVisibleWords>=wordAudit.defaultWords);
assert(wordAudit.peakSampledVisibleWords<=1200,`Sampled on-screen word count ${wordAudit.peakSampledVisibleWords} exceeds 1200. Reserve space for student interpretation.`);
console.log(`QA V4 source checks PASS: ${files.length} TypeScript files, PostCSS, SVG ID safety, mobile, import validation, keyboard tabs, menu focus, data provenance and word-state audit.`);
