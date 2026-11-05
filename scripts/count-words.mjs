#!/usr/bin/env node
/** Conservative textual source inventory; the live footer reports visible DOM words. */
import fs from 'node:fs';
import path from 'node:path';
const names=['src/content/story.ts',...fs.readdirSync('components').filter(x=>x.endsWith('.tsx')).map(x=>`components/${x}`)];
const keep=[];
for (const n of names) {
  const raw=fs.readFileSync(n,'utf8');
  const matches=[...raw.matchAll(/"([^"\n]{3,})"|'([^'\n]{3,})'|>([^<>{}\n]{3,})</g)];
  keep.push(...matches.map(m=>m[1]||m[2]||m[3]).filter(Boolean));
}
const text=keep.join(' ').replace(/\b(className|aria-label|aria-current|onClick|data-chapter|viewBox|id|type|span|button|div|svg|role|width|height|stroke|fill|value|source|unknown|unknowns)\b/g,'');
const words=text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[];
console.log(`Conservative source text token scan: ${words.length} words (includes code strings, hidden alternate states, source IDs).`);
console.log('For authoritative count, use browser visible-text estimator and audit every alternate state + reference drawer.');
