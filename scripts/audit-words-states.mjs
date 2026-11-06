#!/usr/bin/env node
/** Audit alternate React states, not only the default screen.
 * Computes the visible-text *potential* of source-rendered states, excluding
 * closed bibliography dialog and CSS text-hidden subtrees. This is not a
 * substitute for a production-browser + student's final-content count.
 */
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const ts=require(process.env.TYPESCRIPT_MODULE||'typescript');
let overrides={},component='',index=0;
const React={
 createElement(type,props,...children){return {type,props:{...props,children}};},
 useState(init){const i=index++;return [Object.hasOwn(overrides[component]||{},i)?overrides[component][i]:(typeof init==='function'?init():init),()=>{}];},
 useMemo(f){return f()},useCallback(f){return f},useEffect(){},useRef(x){return {current:x}},useId(){return 'audit-id'},
};
const lucide=new Proxy({}, {get(){return () => null}}); const cache=new Map();
function load(file){let full=path.resolve(file);for(const ext of ['','.tsx','.ts','.js'])if(fs.existsSync(full+ext)&&fs.statSync(full+ext).isFile()){full+=ext;break;}if(cache.has(full))return cache.get(full);const source=ts.transpileModule(fs.readFileSync(full,'utf8'),{fileName:full,compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};cache.set(full,m.exports);vm.runInNewContext(source,{React,module:m,exports:m.exports,require(name){if(name==='react')return React;if(name==='lucide-react')return lucide;if(name.startsWith('@/'))return load(path.join(process.cwd(),name.slice(2)));if(name.startsWith('.'))return load(path.join(path.dirname(full),name));throw new Error(name)},window:{},document:{},process:{env:{NODE_ENV:"production"}},console},{filename:full});cache.set(full,m.exports);return m.exports;}
function strings(node,depth=0){
 if(depth>150)throw new Error('Render recursion');
 if(node==null||typeof node==='boolean')return [];
 if(Array.isArray(node))return node.flatMap(n=>strings(n,depth+1));
 if(typeof node==='string'||typeof node==='number')return [String(node)];
 if(typeof node.type==='function'){
  const prev=component,idx=index; component=node.type.name||'anonymous';index=0;
  const result=strings(node.type(node.props),depth+1);
  component=prev;index=idx;return result;
 }
 if(['style','script','title'].includes(node.type))return [];
 const props=node.props||{};
 if(props['aria-hidden']===true||props.hidden===true||props.className==='visually-hidden')return [];
 if(node.type==='dialog'&&!props.open)return [];
 return strings(props.children,depth+1);
}
const shell=load('components/ArchiveShell.tsx').ArchiveShell;
function getCount(state={}){
 overrides=state;
 const nodes=strings(React.createElement(shell,{}));
 const text=nodes.join(' ').replace(/\s+/g,' ').trim();
 const words=text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[];
 return {words:words.length,text};
}
const cases = [
 ['default',{}],
 ...(['seismicity','geodesy','geology'].map(value=>[`evidence / ${value}`,{EvidenceDesk:{0:value}}])),
 ...([0,1,2].map(value=>[`formation / ${value+1}`,{EarthInterior:{0:value}}])),
 ...(['composition','mechanics'].map(value=>[`interior / ${value}`,{EarthInterior:{1:value,2:0}}])),
 ...(['actual','counterfactual'].map(value=>[`malaysia / ${value}`,{MalaysiaPanel:{0:value}}])),
 ...([200,100,73,30,0].map(value=>[`timeline / ${value} Ma`,{TimeMachine:{0:value}}])),
 ...(['wallace','palmdale','oasis'].map(value=>[`POI / ${value}`,{CaliforniaAtlas:{0:value}}])),
];
const results=cases.map(([name,states])=>({state:name,visibleWords:getCount(states).words}));
const peak=Math.max(...results.map(v=>v.visibleWords));
const defaultWords=results[0].visibleWords;
const output={defaultWords,peakSampledVisibleWords:peak,allOptionsCount:results.length,referenceDrawerIncluded:false,states:results,conclusion:peak>1200?'FAIL: sampled alternate state exceeds 1,200 words. This does not include all states or a completed student narrative.':'NOT CERTIFIED: sampled states <=1,200, but full cumulative alternatives, references and final student work are not fully audited.'};
fs.writeFileSync('docs/QA_WORD_AUDIT.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));
