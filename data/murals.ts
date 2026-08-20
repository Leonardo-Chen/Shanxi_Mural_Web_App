import { coverElements, type CoverElement } from "./coverElements";
import { getAssignedCoverElements } from "@/lib/coverSession";
import {
  availableMurals,
  getElementByAssetFile,
  GROUP_TEMPLE_ID,
  murals as annotationMurals,
  type ManifestMural,
  type MuralElement,
} from "./muralData";

export type Mural = {
  id: string;
  title: string;
  displayTitle: string;
  templeId: string;
  templeName: string;
  image?: string;
  thumbnail?: string;
  alt: string;
  period?: string;
  hall?: string;
  location?: string;
  description?: string;
  detailedDescription?: string;
  readingGuide?: string[];
  locationPrecision?: string;
  figureLocation?: string;
  relationships?: string;
  storySequence?: string;
  colorNotes?: string;
};

export type Figure = {
  id: string;
  elementId?: string;
  name: string;
  displayName?: string;
  researchName?: string;
  image?: string;
  category?: string;
  note?: string;
  shortDescription?: string;
  introduction: string;
  visualClues: string[];
  correctMuralId: string;
  sourceMuralId?: string;
  imageAlt?: string;
};

export function toUiMural(mural: ManifestMural): Mural {
  return {
    id: mural.id,
    title: mural.title,
    displayTitle: mural.displayTitle,
    templeId: GROUP_TEMPLE_ID[mural.groupId] ?? mural.groupId,
    templeName: mural.temple,
    image: mural.imageSrc,
    thumbnail: mural.imageSrc,
    alt: mural.displayTitle,
    period: mural.dynasty,
    hall: mural.hall,
    location: mural.location,
    description: mural.summary,
    detailedDescription: mural.detailedDescription,
    readingGuide: mural.readingGuide,
    locationPrecision: mural.locationPrecision,
  };
}

export const allMurals: Mural[] = annotationMurals.map(toUiMural);
export const murals: Mural[] = availableMurals.map(toUiMural);
export const muralMap = new Map(allMurals.map((mural) => [mural.id, mural]));

export function getMuralsByTempleId(templeId: string): Mural[] {
  return allMurals.filter((mural) => mural.templeId === templeId);
}

export function templeHasMurals(templeId: string): boolean {
  return getMuralsByTempleId(templeId).some((mural) => Boolean(mural.image));
}

export function figureFromManifestElement(
  cover: CoverElement,
  element: MuralElement
): Figure {
  return {
    id: cover.id,
    elementId: element.id,
    name: element.displayName,
    displayName: element.displayName,
    researchName: element.researchName,
    image: cover.src || element.imageSrc,
    category: element.category,
    note: element.shortDescription,
    shortDescription: element.shortDescription,
    introduction: element.shortDescription,
    visualClues: [element.category],
    correctMuralId: element.sourceMuralId,
    sourceMuralId: element.sourceMuralId,
    imageAlt: element.displayName,
  };
}

/** Star / sticker identity for one picked cut-out, not the source mural. */
export function matchingProgressId(
  figure: Figure,
  cover?: CoverElement | null
): string {
  const raw = cover?.fileName || cover?.src || figure.image || figure.id;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function figureFromCoverElement(element: CoverElement): Figure {
  const matched = getElementByAssetFile(element.fileName);
  if (matched) return figureFromManifestElement(element, matched);

  return {
    id: element.id,
    name: element.alt,
    displayName: element.alt,
    image: element.src,
    introduction:
      "这位人物通过冠饰、衣纹、姿态与持物呈现身份。寻找完整壁画时，请比较人物朝向和周围队列的组织方式。",
    visualClues: ["比较冠饰、衣纹与人物朝向", "观察相邻人物和器物的组合"],
    correctMuralId: "",
  };
}

export const figures: Figure[] = coverElements.map((element) =>
  figureFromCoverElement(element)
);

export const figureMap = new Map(figures.map((figure) => [figure.id, figure]));

export function getFigure(figureId: string): Figure {
  const assigned = getAssignedCoverElements()?.find(
    (element) => element.id === figureId
  );
  if (assigned) return figureFromCoverElement(assigned);

  return (
    figureMap.get(figureId) ?? {
      id: figureId,
      name: "壁画人物",
      displayName: "壁画人物",
      introduction:
        "这位人物的身份需要通过冠饰、服装、动作与周围角色共同判断。请在完整壁画中寻找相同的视觉线索。",
      visualClues: ["观察人物轮廓和持物", "比较周围角色的朝向"],
      correctMuralId: "",
    }
  );
}
