#!/usr/bin/env node
/** Pure visual-model regression checks. Requires the project's TypeScript dev dep. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require(process.env.TYPESCRIPT_MODULE || 'typescript');
const source = fs.readFileSync('components/TimeMachine.tsx','utf8');
const compiled = ts.transpileModule(source,{reportDiagnostics:true,fileName:'TimeMachine.tsx',compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}});
assert.equal((compiled.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,'TimeMachine.tsx parses');
const React={createElement(type,props,...children){return {type,props:{...props,children}};}};
const module={exports:{}};
const smoothstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
vm.runInNewContext(compiled.outputText,{React,module,exports:module.exports,require(name){return name==='./useMotion'?{smoothstep}:{};}},{filename:'TimeMachine.cjs'});
const {TimeVisual}=module.exports;
function flatten(node){if(!node||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(flatten);return [node,...flatten(node.props?.children)];}
const samples=[200,175,100,73,50,30,20,10,0];
let previousOffset=Infinity;
for(const ma of samples){
 const svg=TimeVisual({ma,id:`qa-${ma}`});
 assert.equal(svg.type,'svg');
 const nodes=flatten(svg);
 const red=nodes.find(n=>n.type==='path'&&n.props.stroke==='#8e3c32'&&Number(n.props.strokeWidth)===5.5);
 assert.ok(red,`fault geometry at ${ma} Ma`);
 assert.ok(Number.isFinite(red.props.strokeDashoffset));
 assert.ok(red.props.strokeDashoffset<=previousOffset+1e-9,`fault trace does not reverse at ${ma} Ma`);
 previousOffset=red.props.strokeDashoffset;
 const clip=nodes.find(n=>n.type==='g'&&String(n.props.clipPath||'').includes('water-shape'));
 assert.ok(clip,`ridge remains ocean-clipped at ${ma} Ma`);
 assert.ok(!nodes.some(n=>Object.values(n.props||{}).some(v=>typeof v==='number'&&!Number.isFinite(v))),`no NaN/Infinity at ${ma} Ma`);
}
assert.equal(previousOffset,0,'modern fault complete at present');
assert.equal(TimeVisual({ma:200,id:'qa'}).props.viewBox,'0 0 720 410');
const ref=fs.readFileSync('components/useMotion.ts','utf8');
assert.match(ref,/document\.hidden/,'clock suspends in background tabs');
assert.match(ref,/prefers-reduced-motion/,'reduced-motion support');
assert.match(source,/setPointerCapture/,'comparison drags on image');
assert.match(source,/onChange=\{e=>seek\(200-Number\(e\.target\.value\),false\)\}/,'timeline scrubbing remains direct');
console.log('Motion model checks passed: 9 eras, continuous fault reveal, ocean clipping, finite geometry, tab pause, reduced-motion, scrub and drag.');
