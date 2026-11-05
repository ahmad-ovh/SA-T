#!/usr/bin/env node
/** Render the ACTUAL FaultLab.tsx SVG tree to six portable SVG review frames. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const ts=require(process.env.TYPESCRIPT_MODULE||'typescript');
const source=fs.readFileSync('components/FaultLab.tsx','utf8');
const js=ts.transpileModule(source,{fileName:'FaultLab.tsx',compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const React={createElement(type,props,...children){return {type,props:{...props,children}};}};
const module={exports:{}};
vm.runInNewContext(js,{React,module,exports:module.exports,require(){return {};}}, {filename:'FaultLab.cjs'});
const {FaultPlan,FaultSection}=module.exports;
const attrMap={className:'class',strokeWidth:'stroke-width',strokeLinecap:'stroke-linecap',strokeLinejoin:'stroke-linejoin',strokeDasharray:'stroke-dasharray',strokeOpacity:'stroke-opacity',fillOpacity:'fill-opacity',fillRule:'fill-rule',clipPath:'clip-path',fontFamily:'font-family',fontWeight:'font-weight',fontSize:'font-size',textAnchor:'text-anchor',letterSpacing:'letter-spacing',strokeDashoffset:'stroke-dashoffset',stopColor:'stop-color',stopOpacity:'stop-opacity',shapeRendering:'shape-rendering',pointerEvents:'pointer-events'};
const escape=v=>String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function serialize(node){if(node===undefined||node===null||typeof node==='boolean')return '';if(Array.isArray(node))return node.map(serialize).join('');if(typeof node==='string'||typeof node==='number')return escape(node);if(typeof node.type==='function')return serialize(node.type(node.props));const {children,...props}=node.props||{};const attrs=Object.entries(props).filter(([k,v])=>k!=='key'&&!k.startsWith('on')&&v!==false&&v!==undefined&&v!==null).map(([k,v])=>` ${attrMap[k]||k}="${escape(v)}"`).join('');return `<${node.type}${attrs}>${serialize(children)}</${node.type}>`;}
const dest=process.argv[2]||'/mnt/data/sa-fault-svg';fs.mkdirSync(dest,{recursive:true});
const step=Number(process.env.FAULT_PREVIEW_STEP||25);
if(!Number.isInteger(step)||step<1||100%step!==0)throw new Error("FAULT_PREVIEW_STEP must divide 100");
for(const p of Array.from({length:100/step+1},(_,i)=>i*step)){for(const mode of ['plan','section']){const tree=mode==='plan'?FaultPlan({progress:p,layers:true}):FaultSection({progress:p,layers:true});const rendered=serialize(tree).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');fs.writeFileSync(path.join(dest,`fault-${mode}-${p}.svg`),rendered);}}
console.log(`Actual component SVGs exported to ${dest}`);
