#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const required=['app/page.tsx','app/layout.tsx','app/globals.css','app/api/earthquakes/route.ts','src/content/story.ts','src/data/sources.ts','src/data/evidence.ts','components/ArchiveShell.tsx','components/EarthInterior.tsx','components/FaultLab.tsx','components/EvidenceDesk.tsx','components/TimeMachine.tsx','components/MalaysiaPanel.tsx','components/ReferenceArchive.tsx'];
const missing=required.filter(x=>!fs.existsSync(x));
for(const name of required){if(fs.existsSync(name)&&fs.statSync(name).size===0)missing.push(name+' (empty)');}
const content=fs.readFileSync('src/content/story.ts','utf8');
const chapterIds=['origin','tectonics','evidence','deep-time','malaysia'];
const missingIds=chapterIds.filter(id=>!content.includes(`id: "${id}"`));
if(missing.length||missingIds.length){console.error({missing,missingIds});process.exit(1);}
console.log('Source structure check passed: five chapters, fourteen required project files present.');
