import manifestJson from "./mural-element-manifest.json";
import annotationsJson from "./mural-content-annotations.json";
import { elementImageSrc, muralImageSrc } from "./assetPathMap";

export type ManifestMural = {
  id: string;
  groupId: string;
  temple: string;
  hall: string;
  dynasty: string;
  title: string;
  assetFile: string;
  summary: string;
  imageSrc?: string;
  displayTitle: string;
  detailedDescription: string;
  readingGuide: string[];
  location: string;
  locationPrecision: string;
};

export type MuralElement = {
  id: string;
  name: string;
  category: string;
  assetFile: string;
  sourceMuralId: string;
  note: string;
  aliases?: string[];
  imageSrc?: string;
  displayName: string;
  researchName?: string;
  shortDescription: string;
};

export type AnnotationElement = MuralElement;

type ManifestFile = {
  schemaVersion: string;
  murals: Array<
    Omit<
      ManifestMural,
      | "imageSrc"
      | "displayTitle"
      | "detailedDescription"
      | "readingGuide"
      | "location"
      | "locationPrecision"
    >
  >;
  elements: Array<
    Omit<MuralElement, "imageSrc" | "displayName" | "researchName" | "shortDescription">
  >;
};

type AnnotationFile = {
  murals: Array<{
    id: string;
    displayTitle?: string;
    summary?: string;
    detailedDescription?: string;
    readingGuide?: string[];
    location?: string;
    locationPrecision?: string;
  }>;
  elements: Array<{
    id: string;
    displayName?: string;
    researchName?: string;
    shortDescription?: string;
    aliases?: string[];
  }>;
};

const manifest = manifestJson as ManifestFile;
const annotations = annotationsJson as AnnotationFile;
const muralNotes = Object.fromEntries(
  (annotations.murals ?? []).map((item) => [item.id, item])
);
const elementNotes = Object.fromEntries(
  (annotations.elements ?? []).map((item) => [item.id, item])
);

export const murals: ManifestMural[] = manifest.murals.map((mural) => {
  const note = muralNotes[mural.id];
  return {
    ...mural,
    imageSrc: muralImageSrc(mural.groupId, mural.assetFile),
    displayTitle: note?.displayTitle ?? mural.title,
    summary: note?.summary ?? mural.summary,
    detailedDescription: note?.detailedDescription ?? note?.summary ?? mural.summary,
    readingGuide: note?.readingGuide ?? [],
    location: note?.location ?? `${mural.temple}，${mural.hall}`,
    locationPrecision: note?.locationPrecision ?? "",
  };
});

export const elements: MuralElement[] = manifest.elements.map((element) => {
  const source = manifest.murals.find((mural) => mural.id === element.sourceMuralId);
  const note = elementNotes[element.id];
  return {
    ...element,
    imageSrc: source
      ? elementImageSrc(source.groupId, element.assetFile)
      : undefined,
    displayName: note?.displayName ?? element.name,
    researchName: note?.researchName,
    shortDescription: note?.shortDescription ?? element.note,
    aliases: note?.aliases ?? element.aliases,
  };
});

export const muralById: Record<string, ManifestMural> = Object.fromEntries(
  murals.map((mural) => [mural.id, mural])
);

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
  .map((mural) => ({ id: mural.id, title: mural.title, assetFile: mural.assetFile }));

export const missingElementAssets = elements
  .filter((element) => !element.imageSrc)
  .map((element) => ({
    id: element.id,
    name: element.name,
    assetFile: element.assetFile,
  }));

export function getSourceMural(element: MuralElement): ManifestMural | undefined {
  return muralById[element.sourceMuralId];
}

export function isCorrectMatch(
  selectedElement: Pick<MuralElement, "sourceMuralId">,
  selectedMural: Pick<ManifestMural, "id">
): boolean {
  return selectedElement.sourceMuralId === selectedMural.id;
}

export function getElementByAssetFile(fileName?: string): MuralElement | undefined {
  if (!fileName) return undefined;
  const exact = elementByAssetFile.get(fileName);
  if (exact) return exact;
  const stem = fileName.replace(/\.[^.]+$/, "");
  const byStem = elementByAssetFile.get(stem);
  if (byStem) return byStem;
  return elements.find((element) => {
    const wanted = element.assetFile.replace(/\.[^.]+$/, "");
    return stem === wanted;
  });
}

export function isIdentityUnderResearch(element: {
  displayName?: string;
  researchName?: string;
  shortDescription?: string;
  note?: string;
}): boolean {
  const text = [
    element.displayName,
    element.researchName,
    element.shortDescription,
    element.note,
  ]
    .filter(Boolean)
    .join(" ");
  return /候选|待核|可能是|可能属于|待进一步|待图录|待题榜|身份仍/.test(text);
}

export const GROUP_TEMPLE_ID: Record<string, string> = {
  "guangling-water-god-temple": "shuishen",
  "duofu-temple": "duofu",
  "yongle-palace": "yonglegong",
};

export function getAvailableMuralsForTemple(templeId: string): ManifestMural[] {
  return availableMurals.filter(
    (mural) => (GROUP_TEMPLE_ID[mural.groupId] ?? mural.groupId) === templeId
  );
}
