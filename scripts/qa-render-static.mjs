#!/usr/bin/env node
/** Layout-only QA render: transpiles the current TSX with a tiny React element stub.
 * Components render their default state; event handlers do NOT run. This is not
 * a Next.js build or a substitute for interactive browser testing.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ts = require(process.env.TYPESCRIPT_MODULE || 'typescript');
const override = JSON.parse(process.env.QA_STATE || '{}');
let currentComponent = '', hookIndex = 0, useIdCounter = 0;
const React = {
  Fragment: 'qa-fragment',
  createElement(type, props, ...children) {return {type, props:{...props, children}};},
  useState(initial) { const index = hookIndex++; const original = typeof initial==='function' ? initial() : initial; return [Object.hasOwn(override[currentComponent]||{},index)?override[currentComponent][index]:original,()=>{}]; },
  useMemo(fn) {return fn();}, useCallback(fn) {return fn;}, useEffect(){},
  useRef(initial) {return {current:initial};}, useId() {return `qa-id-${++useIdCounter}`;}
};
const lucide = new Proxy({}, {get(_,name){return function Icon(){return React.createElement('span',{'aria-hidden':true,className:'qa-icon'},'◆');};}});
const cache = new Map();
function load(file) {
  let full = path.resolve(file);
  for(const ext of ['','.tsx','.ts','.js']) if(fs.existsSync(full+ext) && fs.statSync(full+ext).isFile()) {full+=ext;break;}
  if(cache.has(full)) return cache.get(full);
  const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{fileName:full,compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module = {exports:{}};
  cache.set(full,module.exports);
  vm.runInNewContext(code,{React, module, exports:module.exports, require(name){
    if(name==='react')return React;
    if(name==='lucide-react')return lucide;
    if(name.startsWith('@/'))return load(path.join(process.cwd(),name.slice(2)));
    if(name.startsWith('.'))return load(path.join(path.dirname(full),name));
    throw new Error(`Unknown dependency ${name} from ${full}`);
  }, console, window:{},document:{},process:{env:{NODE_ENV:"production"}}},{filename:full});
  cache.set(full,module.exports);
  return module.exports;
}
const escaped=(s)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const htmlAttr = (key,svg)=> {
  if(key==='className') return 'class'; if(key==='htmlFor')return 'for';
  if(key==='tabIndex')return 'tabindex'; if(key==='aria-label' || key.startsWith('aria-')||key.startsWith('data-'))return key;
  if(svg && !['viewBox','preserveAspectRatio','gradientUnits','gradientTransform'].includes(key))return key.replace(/[A-Z]/g,ch=>'-'+ch.toLowerCase());
  return key;
};
const cssValue=(prop,v)=>`${prop.replace(/[A-Z]/g,ch=>'-'+ch.toLowerCase())}:${String(v)}`;
const voids=new Set(['input','img','source','hr','meta','link','br']);
function render(node, level=0, inSvg=false) {
  if(level>200)throw new Error('Unexpected render recursion');
  if(node===null||node===undefined||typeof node==='boolean')return '';
  if(Array.isArray(node))return node.map(x=>render(x,level+1,inSvg)).join('');
  if(typeof node==='string'||typeof node==='number')return escaped(node);
  if(typeof node.type==='function') {
    const previous=currentComponent,prevIndex=hookIndex;
    currentComponent = node.type.name || 'Anonymous'; hookIndex=0;
    const result = node.type(node.props);
    const content = render(result,level+1,inSvg);
    currentComponent=previous;hookIndex=prevIndex;
    return content;
  }
  if(!node.type||node.type==='qa-fragment')return render(node.props.children,level+1,inSvg);
  let tag=node.type, svg=inSvg||tag==='svg';
  const attrs=Object.entries(node.props||{}).flatMap(([key,value])=>{
    if(key==='children'||key==='key'||key==='ref'||key.startsWith('on')||value==null||typeof value==='function')return [];
    if(typeof value==='boolean') {
      if(key.startsWith('aria-')||key.startsWith('data-'))return [`${htmlAttr(key,svg)}="${value}"`];
      return value?(['disabled','checked','selected','required','multiple'].includes(key)?[`${key}`]:[]):[];
    }
    if(key==='style'&&typeof value==='object')return [`style="${escaped(Object.entries(value).map(([k,v])=>cssValue(k,v)).join(';'))}"`];
    if(typeof value==='object')return [];
    return [`${htmlAttr(key,svg)}="${escaped(value)}"`];
  }).join(' ');
  const open=`<${tag}${attrs?' '+attrs:''}>`;
  if(voids.has(tag))return open;
  return `${open}${render(node.props?.children,level+1,svg)}</${tag}>`;
}
const content = render(React.createElement(load('components/ArchiveShell.tsx').ArchiveShell,{}));
const css=fs.readFileSync('app/globals.css','utf8').replaceAll(/@tailwind (?:base|components|utilities);/g,'');
const output=process.argv[2]||'qa-static.html';
const html=`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>QA STATIC STATE / NOT AN INTERACTIVE BUILD</title><style>${css}\n.qa-icon{font-size:.7em;opacity:.65}</style></head><body><div style="position:fixed;right:8px;bottom:8px;z-index:100;background:#fff4cf;color:#27221c;padding:4px 9px;font:11px monospace">STATIC LAYOUT QA · CONTROLS INERT</div>${content}</body></html>`;
fs.writeFileSync(output,html);
console.log(`Wrote ${output}: ${html.length} bytes (layout-only snapshot)`);
