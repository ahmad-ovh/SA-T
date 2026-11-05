#!/usr/bin/env node
/** Source-backed geometry and interaction regressions for File 02. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const ts=require(process.env.TYPESCRIPT_MODULE || 'typescript');
const source=fs.readFileSync('components/FaultLab.tsx','utf8');
const compiled=ts.transpileModule(source,{reportDiagnostics:true,fileName:'FaultLab.tsx',compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}});
assert.equal((compiled.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error).length,0,'File02 TSX valid syntax');
const React={createElement(type,props,...children){return {type,props:{...props,children}};}};
const module={exports:{}};
vm.runInNewContext(compiled.outputText,{React,module,exports:module.exports,require(){return {};}},{filename:'FaultLab.cjs'});
const {getFaultMotion,FaultPlan,FaultSection}=module.exports;
const flatten=node=>!node||typeof node!=='object'?[]:Array.isArray(node)?node.flatMap(flatten):[node,...flatten(node.props?.children)];
assert.equal(getFaultMotion(0).relativeGap,0,'initial reference markers aligned');
assert.equal(getFaultMotion(100).relativeGap,132,'illustrative offset fully visible');
assert.equal(getFaultMotion(-500).progress,0,'slider clamps low');
assert.equal(getFaultMotion(1000).progress,100,'slider clamps high');
assert.equal(getFaultMotion(NaN).progress,0,'invalid numbers are safe');
let gap=-1;
for(const p of [0,.5,2,5,10,25,50,75,99,100]){
 const model=getFaultMotion(p);
 assert.ok(model.leftY<=201&&model.rightY>=201,'opposite coherent along-fault directions');
 assert.ok(model.relativeGap>=gap,'illustrative relative slip never reverses');gap=model.relativeGap;
 const plan=FaultPlan({progress:p,layers:true});const section=FaultSection({progress:p,layers:true});
 const pn=flatten(plan),sn=flatten(section);
 const left=pn.find(n=>n.props?.['data-plate']==='pacific');
 const right=pn.find(n=>n.props?.['data-plate']==='north-american');
 assert.equal(left.props.transform,`translate(0 ${model.leftY-201})`,'Pacific block translates coherently');
 assert.equal(right.props.transform,`translate(0 ${model.rightY-201})`,'North America translates oppositely');
 assert.ok(pn.some(n=>n.type==='clipPath'&&n.props?.id==='fault-plate-pacific'));
 assert.ok(pn.some(n=>n.type==='clipPath'&&n.props?.id==='fault-plate-america'));
 assert.ok(sn.some(n=>n.props?.['data-vector']==='into-page'));
 assert.ok(sn.some(n=>n.props?.['data-vector']==='out-of-page'));
 assert.ok(!sn.some(n=>n.type==='g'&&/translate\(0\s+[-0-9]/.test(String(n.props?.transform||''))),'section does not invent vertical slip');
 for(const tree of [pn,sn]) assert.ok(!tree.some(n=>Object.values(n.props||{}).some(v=>typeof v==='number'&&!Number.isFinite(v))),`finite SVG geometry ${p}`);
}
assert.match(source,/onChange=\{e => setOffset\(Number\(e\.target\.value\)\)\}/,'direct responsive scrub');
assert.match(source,/useAnimationClock\(playing && !reduced/,'frame-independent clock and reduced-motion aware');
assert.match(source,/if \(position\.current >= 99\.99\)/,'replay starts at beginning');
assert.match(source,/aria-pressed=\{v === view\}/,'toggle controls indicate current view');
assert.match(source,/aria-valuetext=/,'accessible slider description');
assert.match(source,/setOffset\(0\)/,'reset returns markers to aligned start');
console.log('Fault Lab tests passed: 10 positions, marker registration, independent clipped plates, opposite in/out section, controls, motion and accessibility guards.');
