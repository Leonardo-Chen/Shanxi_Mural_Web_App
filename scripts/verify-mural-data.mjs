import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const data = require("../data/mural-content-annotations.json");

const samples = [
  ["lm-e48", "lm-m01"],
  ["lm-e42", "lm-m02"],
  ["df-e11", "df-m03"],
  ["df-e13", "df-m04"],
  ["yl-e06", "yl-m10"],
  ["yl-e11", "yl-m14"],
];

const muralById = Object.fromEntries(
  data.murals.map((mural) => [mural.id, mural])
);

const errors = [];
const muralIds = new Set();
const elementIds = new Set();

if (data.murals.length !== 29) {
  errors.push(`murals count ${data.murals.length} !== 29`);
}
if (data.elements.length !== 94) {
  errors.push(`elements count ${data.elements.length} !== 94`);
}

for (const mural of data.murals) {
  if (muralIds.has(mural.id)) errors.push(`duplicate mural id ${mural.id}`);
  muralIds.add(mural.id);
  for (const key of [
    "displayTitle",
    "dynasty",
    "location",
    "detailedDescription",
    "readingGuide",
    "locationPrecision",
  ]) {
    if (mural[key] == null || mural[key] === "") {
      errors.push(`${mural.id} missing ${key}`);
    }
  }
}

const invalidElements = data.elements.filter(
  (element) => !muralById[element.sourceMuralId]
);
if (invalidElements.length > 0) {
  errors.push("Invalid mural references");
  console.error("Invalid mural references", invalidElements);
}

for (const element of data.elements) {
  if (elementIds.has(element.id)) errors.push(`duplicate element id ${element.id}`);
  elementIds.add(element.id);
  if (element.sourceMuralId !== muralById[element.sourceMuralId]?.id) {
    errors.push(`${element.id} source mismatch`);
  }
  for (const key of ["displayName", "category", "shortDescription", "sourceMuralId"]) {
    if (!element[key]) errors.push(`${element.id} missing ${key}`);
  }
}

for (const [elementId, muralId] of samples) {
  const element = data.elements.find((item) => item.id === elementId);
  if (!element) {
    errors.push(`missing sample element ${elementId}`);
    continue;
  }
  if (element.sourceMuralId !== muralId) {
    errors.push(`${elementId} expected ${muralId}, got ${element.sourceMuralId}`);
  }
}

console.log("annotation murals:", data.murals.length);
console.log("annotation elements:", data.elements.length);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("id uniqueness and sample correspondences: ok");

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => !name.startsWith("."));
}

function stem(fileName) {
  return fileName.replace(/\.[^.]+$/, "");
}

function matchExistingFile(wantedFile, existing) {
  if (existing.includes(wantedFile)) return wantedFile;
  const wanted = stem(wantedFile);
  const byStem = existing.find((file) => stem(file) === wanted);
  if (byStem) return byStem;
  const wantedIsPrefix = existing.find((file) => stem(file).startsWith(wanted));
  if (wantedIsPrefix) return wantedIsPrefix;
  const existingIsPrefix = existing.find((file) => wanted.startsWith(stem(file)));
  return existingIsPrefix;
}

const GROUP_MURAL_DIR = {
  "guangling-water-god-temple": "shui_shen_tang_murals",
  "duofu-temple": "duo_fu_si_murals",
  "yongle-palace": "yong_le_gong_murals",
};

const GROUP_ELEMENT_DIR = {
  "guangling-water-god-temple": "shui_shen_tang",
  "duofu-temple": "duo_fu_si",
  "yongle-palace": "yong_le_gong",
};

const muralFilesByGroup = Object.fromEntries(
  Object.entries(GROUP_MURAL_DIR).map(([groupId, dir]) => [
    groupId,
    listFiles(path.join(process.cwd(), "public", "images", "murals", dir)),
  ])
);

const elementFilesByGroup = Object.fromEntries(
  Object.entries(GROUP_ELEMENT_DIR).map(([groupId, dir]) => [
    groupId,
    listFiles(path.join(process.cwd(), "public", "images", "objects", dir)),
  ])
);

const missingMurals = data.murals.filter(
  (mural) => !matchExistingFile(mural.assetFile, muralFilesByGroup[mural.groupId] ?? [])
);
const missingElements = data.elements.filter((element) => {
  const source = muralById[element.sourceMuralId];
  if (!source) return true;
  return !matchExistingFile(
    element.assetFile,
    elementFilesByGroup[source.groupId] ?? []
  );
});
console.log("murals with local image:", data.murals.length - missingMurals.length);
console.log("elements with local image:", data.elements.length - missingElements.length);
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
console.log("hotspots recorded: 0");
console.log("elements needing hotspot coordinates:", data.elements.length);
