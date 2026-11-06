#!/usr/bin/env node
/**
 * Defense-in-depth dependency check for the 2026-11 security update.
 * Passing without a lockfile verifies only package.json; --strict requires a
 * real npm lockfile and the installed Next/React packages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const exists = (rel) => fs.existsSync(path.join(root, rel));
const expectedDirect = { next: "15.5.29", react: "19.2.9", "react-dom": "19.2.9" };
const rscNames = [
  "react-server-dom-webpack",
  "react-server-dom-parcel",
  "react-server-dom-turbopack",
];
const expectedRsc = "19.2.9";
const issues = [];
const checks = [];
const manifest = readJSON("package.json");

function mustEqual(actual, expected, label) {
  if (actual !== expected) issues.push(`${label}: expected ${expected}, found ${actual ?? "missing"}`);
  else checks.push(`${label} ${expected}`);
}
for (const [name, version] of Object.entries(expectedDirect)) {
  mustEqual(manifest.dependencies?.[name], version, `manifest dependency ${name}`);
}
for (const name of rscNames) {
  if (Object.hasOwn(manifest.dependencies ?? {}, name)) {
    issues.push(`${name}: not used directly by this app; remove it from direct dependencies`);
  }
  mustEqual(manifest.overrides?.[name], expectedRsc, `manifest transitive override ${name}`);
}

const lockfile = "package-lock.json";
if (exists(lockfile)) {
  const lock = readJSON(lockfile);
  if (!lock.packages || !lock.packages[""]) {
    issues.push("package-lock.json is missing npm v7+ packages metadata; regenerate it");
  } else {
    for (const [name, version] of Object.entries(expectedDirect)) {
      mustEqual(lock.packages[""]?.dependencies?.[name], version, `lock root ${name}`);
      mustEqual(lock.packages[`node_modules/${name}`]?.version, version, `lock resolved ${name}`);
    }
    for (const [key, meta] of Object.entries(lock.packages)) {
      const packageName = key.split("/node_modules/").at(-1).replace(/^node_modules\//, "");
      if (rscNames.includes(packageName)) {
        mustEqual(meta?.version, expectedRsc, `lock resolved ${key}`);
      }
    }
  }
} else {
  const msg = "Missing package-lock.json: an installed dependency tree has NOT been security-verified.";
  if (strict) issues.push(msg);
  else console.warn(`NOTICE: ${msg} Run npm install and commit the generated lockfile.`);
}

for (const [name, version] of Object.entries(expectedDirect)) {
  const installed = path.join("node_modules", name, "package.json");
  if (exists(installed)) mustEqual(readJSON(installed).version, version, `installed ${name}`);
  else if (strict) issues.push(`Missing installed dependency: ${name}; run npm ci`);
}
for (const name of rscNames) {
  const installed = path.join("node_modules", name, "package.json");
  if (exists(installed)) mustEqual(readJSON(installed).version, expectedRsc, `installed ${name}`);
}

if (issues.length) {
  console.error("Security version policy FAILED:\n" + issues.map((s) => `- ${s}`).join("\n"));
  process.exit(1);
}
console.log(`Security version policy PASSED (${checks.length} checks).`);
if (!exists(lockfile)) console.log("Manifest only; npm audit and build must run after installation.");
else console.log("Lockfile version checks passed; run npm audit and a production build as separate checks.");
