import { coverElements, type CoverElement } from "./coverElements";
import { getAssignedCoverElements } from "@/lib/coverSession";
import {
  availableMurals,
  getElementByAssetFile,
  getSourceMural,
  GROUP_TEMPLE_ID,
  type ManifestMural,
  type MuralElement,
} from "./muralData";

export type Mural = {
  id: string;
  title: string;
  templeId: string;
  templeName: string;
  image?: string;
  thumbnail?: string;
  alt: string;
  period?: string;
  location?: string;
  description?: string;
  figureLocation?: string;
  relationships?: string;
  storySequence?: string;
  colorNotes?: string;
};

export type Figure = {
  id: string;
  elementId?: string;
  name: string;
  image?: string;
  category?: string;
  note?: string;
  temple?: string;
  dynasty?: string;
  introduction: string;
  visualClues: string[];
  correctMuralId: string;
  sourceMuralId?: string;
  imageAlt?: string;
};

export function toUiMural(mural: ManifestMural): Mural {
  return {
    id: mural.id,
    title: mural.displayTitle ?? mural.title,
    templeId: GROUP_TEMPLE_ID[mural.groupId] ?? mural.groupId,
    templeName: mural.temple,
    image: mural.imageSrc,
    thumbnail: mural.imageSrc,
    alt: `${mural.displayTitle ?? mural.title}，来自${mural.temple}`,
    period: mural.dynasty,
    location: mural.hall,
    description: mural.summary,
  };
}

export const murals: Mural[] = availableMurals.map(toUiMural);
export const muralMap = new Map(murals.map((mural) => [mural.id, mural]));

export function getMuralsByTempleId(templeId: string): Mural[] {
  return murals.filter((mural) => mural.templeId === templeId);
}

export function templeHasMurals(templeId: string): boolean {
  return murals.some((mural) => mural.templeId === templeId);
}

export function figureFromManifestElement(
  cover: CoverElement,
  element: MuralElement
): Figure {
  const source = getSourceMural(element);
  const alt = source
    ? `${element.name}，来自${source.temple}`
    : element.name;
  return {
    id: cover.id,
    elementId: element.id,
    name: element.displayName ?? element.name,
    image: cover.src || element.imageSrc,
    category: element.category,
    note: element.shortDescription ?? element.note,
    temple: source?.temple,
    dynasty: source?.dynasty,
    introduction: element.note,
    visualClues: [element.category],
    correctMuralId: element.sourceMuralId,
    sourceMuralId: element.sourceMuralId,
    imageAlt: alt,
  };
}

export function figureFromCoverElement(element: CoverElement): Figure {
  const matched = getElementByAssetFile(element.fileName);
  if (matched) return figureFromManifestElement(element, matched);

  return {
    id: element.id,
    name: element.alt,
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
      introduction:
        "这位人物的身份需要通过冠饰、服装、动作与周围角色共同判断。请在完整壁画中寻找相同的视觉线索。",
      visualClues: ["观察人物轮廓和持物", "比较周围角色的朝向"],
      correctMuralId: "",
    }
  );
}

function decodeAssetName(value?: string): string | undefined {
  if (!value) return undefined;
  const name = value.split(/[/\\]/).pop();
  if (!name) return undefined;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/**
 * 星星按人物素材计，不按来源壁画去重。
 * 同一剪影只给一颗星；雷公和电母同属出宫图，仍各给一颗。
 */
export function getFigureAwardIdentity(
  figure: Figure,
  cover?: CoverElement | null
): { id: string; aliases: string[] } {
  const fileName = decodeAssetName(cover?.fileName) ?? decodeAssetName(figure.image);
  const id = fileName
    ? `file:${fileName}`
    : figure.elementId
      ? `element:${figure.elementId}`
      : `figure:${figure.id}`;
  const aliases = [figure.elementId, fileName].filter(
    (item): item is string => Boolean(item) && item !== id
  );
  return { id, aliases };
}
