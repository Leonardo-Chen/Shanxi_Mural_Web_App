import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const manifest = require("../data/mural-element-manifest.json");

const samples = [
  ["lm-e48", "lm-m01"],
  ["lm-e53", "lm-m02"],
  ["df-e11", "df-m03"],
  ["df-e20", "df-m08"],
  ["yl-e06", "yl-m10"],
  ["yl-e11", "yl-m14"],
];

const muralIds = new Set();
const elementIds = new Set();
const errors = [];

if (manifest.murals.length !== 29) {
  errors.push(`murals count ${manifest.murals.length} !== 29`);
}
if (manifest.elements.length !== 94) {
  errors.push(`elements count ${manifest.elements.length} !== 94`);
}

for (const mural of manifest.murals) {
  if (muralIds.has(mural.id)) errors.push(`duplicate mural id ${mural.id}`);
  muralIds.add(mural.id);
}

for (const element of manifest.elements) {
  if (elementIds.has(element.id)) errors.push(`duplicate element id ${element.id}`);
  elementIds.add(element.id);
  if (!muralIds.has(element.sourceMuralId)) {
    errors.push(`${element.id} sourceMuralId ${element.sourceMuralId} missing`);
  }
}

for (const [elementId, muralId] of samples) {
  const element = manifest.elements.find((item) => item.id === elementId);
  if (!element) {
    errors.push(`missing sample element ${elementId}`);
    continue;
  }
  if (element.sourceMuralId !== muralId) {
    errors.push(`${elementId} expected ${muralId}, got ${element.sourceMuralId}`);
  }
}

console.log("manifest murals:", manifest.murals.length);
console.log("manifest elements:", manifest.elements.length);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("id uniqueness and sample correspondences: ok");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(entry.name);
  }
  return acc;
}

const imageRoot = path.join(process.cwd(), "public", "images");
const existingNames = new Set(walk(imageRoot));

function hasAsset(assetFile) {
  if (existingNames.has(assetFile)) return true;
  const wanted = assetFile.replace(/\.[^.]+$/, "");
  for (const name of existingNames) {
    const stem = name.replace(/\.[^.]+$/, "");
    if (stem === wanted || stem.startsWith(wanted) || wanted.startsWith(stem)) {
      return true;
    }
  }
  return false;
}

const missingMurals = manifest.murals.filter((mural) => !hasAsset(mural.assetFile));
const missingElements = manifest.elements.filter((element) => !hasAsset(element.assetFile));
console.log("murals with local image:", manifest.murals.length - missingMurals.length);
console.log("elements with local image:", manifest.elements.length - missingElements.length);
if (missingMurals.length) {
  console.log("missing mural files:");
  for (const mural of missingMurals) {
    console.log(`  ${mural.id} ${mural.assetFile}`);
  }
}
if (missingElements.length) {
  console.log("missing element files:");
  for (const element of missingElements) {
    console.log(`  ${element.id} ${element.assetFile}`);
  }
}
