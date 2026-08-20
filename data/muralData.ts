import annotationsJson from "./mural-content-annotations.json";
import { elementImageSrc, muralImageSrc } from "./assetPathMap";

export type AnnotationMural = {
  id: string;
  groupId: string;
  temple: string;
  hall: string;
  dynasty: string;
  title: string;
  assetFile: string;
  summary: string;
  displayTitle: string;
  location: string;
  detailedDescription: string;
  readingGuide: string[];
  locationPrecision: string;
  imageSrc?: string;
};

export type AnnotationElement = {
  id: string;
  displayName: string;
  researchName: string;
  category: string;
  assetFile: string;
  sourceMuralId: string;
  shortDescription: string;
  aliases?: string[];
  provenanceText: string;
  imageSrc?: string;
};

/** 与现有匹配流程兼容：name / note 对应展示名与简介。 */
export type ManifestMural = AnnotationMural;
export type MuralElement = AnnotationElement & {
  name: string;
  note: string;
};

export type Hotspot = {
  elementId: string;
  muralId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type AnnotationFile = {
  schemaVersion: string;
  murals: AnnotationMural[];
  elements: AnnotationElement[];
};

const data = annotationsJson as AnnotationFile;

export const muralById: Record<string, ManifestMural> = Object.fromEntries(
  data.murals.map((mural) => [mural.id, mural])
);

export const elementsByMuralId = data.elements.reduce<
  Record<string, AnnotationElement[]>
>((result, element) => {
  (result[element.sourceMuralId] ??= []).push(element);
  return result;
}, {});

const invalidElements = data.elements.filter(
  (element) => !muralById[element.sourceMuralId]
);

if (invalidElements.length > 0) {
  console.error("Invalid mural references", invalidElements);
}

const duplicateMuralIds = data.murals
  .map((mural) => mural.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
const duplicateElementIds = data.elements
  .map((element) => element.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

if (duplicateMuralIds.length > 0) {
  console.error("Duplicate mural ids", duplicateMuralIds);
}
if (duplicateElementIds.length > 0) {
  console.error("Duplicate element ids", duplicateElementIds);
}

export const murals: ManifestMural[] = data.murals.map((mural) => ({
  ...mural,
  imageSrc: muralImageSrc(mural.groupId, mural.assetFile),
}));

export const elements: MuralElement[] = data.elements.map((element) => {
  const source = muralById[element.sourceMuralId];
  return {
    ...element,
    name: element.displayName,
    note: element.shortDescription,
    imageSrc: source
      ? elementImageSrc(source.groupId, element.assetFile)
      : undefined,
  };
});

for (const mural of murals) {
  muralById[mural.id] = mural;
}

export const elementById: Record<string, MuralElement> = Object.fromEntries(
  elements.map((element) => [element.id, element])
);

const elementByAssetFile = new Map<string, MuralElement>();
for (const element of elements) {
  elementByAssetFile.set(element.assetFile, element);
  elementByAssetFile.set(element.assetFile.replace(/\.[^.]+$/, ""), element);
}

export const availableMurals = murals.filter((mural) => mural.imageSrc);
export const availableElements = elements.filter((element) => element.imageSrc);

export const missingMuralAssets = murals
  .filter((mural) => !mural.imageSrc)
  .map((mural) => ({
    id: mural.id,
    title: mural.displayTitle,
    assetFile: mural.assetFile,
  }));

export const missingElementAssets = elements
  .filter((element) => !element.imageSrc)
  .map((element) => ({
    id: element.id,
    name: element.displayName,
    assetFile: element.assetFile,
  }));

export const missingMuralAssetFiles = missingMuralAssets.map(
  (item) => item.assetFile
);
export const missingElementAssetFiles = missingElementAssets.map(
  (item) => item.assetFile
);

/** 标注包没有像素热点；全部元素仍需人工标定。 */
export const ELEMENT_HOTSPOTS: Hotspot[] = [];
export const elementsNeedingHotspots = elements.map((element) => ({
  id: element.id,
  displayName: element.displayName,
  sourceMuralId: element.sourceMuralId,
}));

export function getSourceMural(element: Pick<MuralElement, "sourceMuralId">) {
  return muralById[element.sourceMuralId];
}

export function isCorrectMatch(
  selectedElement: Pick<MuralElement, "sourceMuralId">,
  selectedMural: Pick<ManifestMural, "id">
): boolean {
  return selectedElement.sourceMuralId === selectedMural.id;
}

export function isIdentityUnderResearch(
  element: Pick<
    AnnotationElement,
    "displayName" | "researchName" | "shortDescription" | "aliases"
  >
): boolean {
  const haystack = [
    element.displayName,
    element.researchName,
    element.shortDescription,
    ...(element.aliases ?? []),
  ].join(" ");
  return haystack.includes("候选");
}

export function getElementByAssetFile(
  fileName?: string
): MuralElement | undefined {
  if (!fileName) return undefined;
  const exact = elementByAssetFile.get(fileName);
  if (exact) return exact;
  const stem = fileName.replace(/\.[^.]+$/, "");
  const byStem = elementByAssetFile.get(stem);
  if (byStem) return byStem;
  return elements.find((element) => {
    const wanted = element.assetFile.replace(/\.[^.]+$/, "");
    return stem === wanted || stem.startsWith(wanted) || wanted.startsWith(stem);
  });
}

export const GROUP_TEMPLE_ID: Record<string, string> = {
  "guangling-water-god-temple": "shuishen",
  "duofu-temple": "duofu",
  "yongle-palace": "yonglegong",
};

export const ANNOTATION_STATS = {
  murals: murals.length,
  elements: elements.length,
  invalidSourceRefs: invalidElements.length,
  duplicateMuralIds: duplicateMuralIds.length,
  duplicateElementIds: duplicateElementIds.length,
  missingMuralAssets: missingMuralAssets.length,
  missingElementAssets: missingElementAssets.length,
} as const;
