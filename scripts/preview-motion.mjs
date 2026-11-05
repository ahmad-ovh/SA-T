/** Optional static visual-regression contact sheet from the actual TSX SVG source.
 * Needs TypeScript (a project devDependency). No scientific data is generated.
 * Usage: npm run preview:motion (creates motion-frames.html, ignored in ZIP).
 */
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require(process.env.TYPESCRIPT_MODULE || 'typescript');
const file=fs.readFileSync('components/TimeMachine.tsx','utf8');
const compiled=ts.transpileModule(file,{compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const React={createElement(type,props,...children){return {type,props:{...props,children}};}};
const module={exports:{}};
vm.runInNewContext(compiled,{React,module,exports:module.exports,require(name){if(name==='./useMotion') return {smoothstep(a,b,x){let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}}; return {};},window:{},console},{filename:'TimeMachine.cjs'});
const {TimeVisual}=module.exports;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function render(node){
 if(Array.isArray(node))return node.map(render).join('');
 if(node==null||typeof node==='boolean')return '';
 if(typeof node!=='object')return esc(node);
 if(typeof node.type==='function')return render(node.type(node.props));
 const props=node.props||{};
 const attrs=Object.entries(props).filter(([k,v])=>k!=='children'&&k!=='key'&&v!=null&&typeof v!=='function').map(([k,v])=>{
  const key=k==='className'?'class':k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
  return ` ${key}="${esc(v)}"`;
 }).join('');
 return `<${node.type}${attrs}>${render(props.children)}</${node.type}>`;
}
const frames=[200,100,73,30,0].map(ma=>`<figure><div>${render(TimeVisual({ma,id:`snapshot-${ma}`}))}</div><figcaption>${ma===0?'Present':`${ma} Ma`} / conceptual and not to scale</figcaption></figure>`).join('');
fs.writeFileSync('motion-frames.html',`<!doctype html><html><head><meta charset="utf-8"><style>html{background:#20211d;color:#e8deca;font-family:Arial}body{margin:0;padding:26px}h1{font:34px Georgia}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}figure{margin:0;padding:9px;border:1px solid #605d55;background:#2b2d27}figure>div{overflow:hidden}svg{display:block;width:100%;height:auto}figcaption{font:12px monospace;padding:12px 3px 6px;color:#d0b8a7}@media(max-width:750px){main{grid-template-columns:1fr}}</style></head><body><h1>Chapter 04 · static visual QA contact sheet</h1><p>These are renders of the revised TSX scene at five points; playback and controls belong to the actual Next.js app.</p><main>${frames}</main></body></html>`);
console.log('Rendered 200 / 100 / 73 / 30 / 0 Ma SVG frames from TimeVisual TSX.');
