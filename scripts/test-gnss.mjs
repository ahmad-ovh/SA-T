#!/usr/bin/env node
// Parser regression tests, including the published v1.1.0 and historical v1.0.1
// UNAVCO .vel layouts. TEST ONLY: rows below are fabricated parser fixtures,
// not scientific measurements and are never included in the browser dataset.
import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require=createRequire(import.meta.url);
const ts=require("typescript");
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
function loadTs(relativePath) {
  const file=path.join(root,relativePath);
  const src=fs.readFileSync(file,"utf8");
  const {outputText,diagnostics}=ts.transpileModule(src, {
    fileName:file, reportDiagnostics:true,
    compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022}
  });
  assert.equal(diagnostics?.length,0,`TS syntax: ${relativePath}`);
  const m=new Module(file);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));
  m._compile(outputText,file);
  return m.exports;
}
const {parseEarthscopeVelocityField}=loadTs("src/data/earthscope-vel.ts");
const {parseGnssCsv}=loadTs("src/data/evidence.ts");
const csv=fs.readFileSync(path.join(root,"public/data/earthscope-california-teaching-nam14-2022.csv"),"utf8");
const sample=parseGnssCsv(csv);
assert.equal(sample.length,2);
assert.equal(sample[0].site,"SBCC");
assert.equal(sample[0].ve,-26.1);
assert.equal(sample[0].vn,27.3);
assert.equal(sample[1].site,"BEMT");
assert.equal(sample[1].vn,4.6);
assert.equal(sample[0].referenceFrame,"NAM14");
assert.match(sample[0].epoch,/not reported/);
assert.throws(()=>parseGnssCsv(csv.replace("BEMT,","SBCC,")),/Duplicate/);
assert.throws(()=>parseGnssCsv(csv.replace("BEMT,34.001,-115.998,-4.0,4.6,NAM14,","BEMT,34.001,-115.998,-4.0,4.6,IGS14,")),/Do not mix/);

// Format v1.1.0 columns: site name refEpoch refJday X Y Z lat lon height
// dX dY dZ SX SY SZ Rxy Rxz Ryz dN dE dU SN SE SU Rne Rnu Reu first last.
function modernRow(site, {lat=34.5, lon=240.3, north="0.01230",east="-0.02450",sigma="0.00030",last="20241001120000"}={}) {
  const fields=[site,"ParserFixture", "20240101120000","60000.5000","-1","-2","3",String(lat),String(lon),"10", "0","0","0","0.0001","0.0001","0.0001","0","0","0",north,east,"0",sigma,"0.00040","0.00090","0","0","0","20200101120000",last];
  assert.equal(fields.length,30);return fields.join(" ");
}
const header="PBO Velocity file from CWU_Archive Reference Frame : NOAM_I14\nFormat Version: 1.1.0\nRelease Date  : 20241002000000\nStart Field Description\n";
const modern= parseEarthscopeVelocityField(header+modernRow("TST1")+"\n"+modernRow("TST2",{lat:45})+"\n"+modernRow("TST3",{sigma:"0.00300"}));
assert.equal(modern.rows.length,1,"out-of-area and >2 mm/yr sigma excluded");
assert.equal(modern.rows[0].site,"TST1");
assert.equal(modern.rows[0].lat,34.5);
assert.ok(Math.abs(modern.rows[0].lon+119.7)<1e-10);
assert.equal(modern.rows[0].ve,-24.5);
assert.equal(modern.rows[0].vn,12.3);
assert.equal(modern.rows[0].northSigmaMmYr,0.3);
assert.equal(modern.rows[0].eastSigmaMmYr,0.4);
assert.equal(modern.rows[0].epoch,"2020-01-01 to 2024-10-01");
assert.equal(modern.releaseDate,"2024-10-02");
assert.equal(modern.allRegionalSites,1);
const later=parseEarthscopeVelocityField(header+modernRow("TST1")+"\n"+modernRow("TST1",{north:"0.015",last:"20251001120000"}));
assert.equal(later.rows.length,1); assert.equal(later.rows[0].vn,15);
assert.throws(()=>parseEarthscopeVelocityField(header.replace("NOAM_I14","IGS14")+modernRow("TST1")),/other than NAM14/);
assert.throws(()=>parseEarthscopeVelocityField("<html>Access denied</html>"),/did not return/);

// Historical v1.0.1: site name epoch mjd lat lon height XYZ(3) cov(6)
// dN dE dU sigmaN sigmaE sigmaU corr(3) first last (27 fields).
const historicFields=["TST4","TestHistoric","20230101,000000","59945","36.0","-120.0","100","0","0","0","0","0","0","0","0","0","0.009","-0.011","0","0.0002","0.0003","0.0008","0","0","0","20200101,000000","20230930,235959"];
assert.equal(historicFields.length,27);
const historic=parseEarthscopeVelocityField("PBO Network Velocity Field\nRelease date: 20240122 153743\n"+historicFields.join(" "));
assert.equal(historic.rows.length,1); assert.equal(historic.rows[0].vn,9); assert.equal(historic.rows[0].ve,-11);
assert.equal(historic.rows[0].northSigmaMmYr,0.2);
console.log("GNSS parser tests passed: 2022 teaching CSV, modern .vel, legacy .vel, units, duplicate, frame, coordinate, uncertainty, date and invalid-file guards.");
