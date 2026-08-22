import {
  coverElements,
  extraCanvasElements,
  CANVAS_ELEMENT_COUNT,
  type CoverElement,
} from "@/data/coverElements";
import { getElementByAssetFile, getSourceMural, muralById } from "@/data/muralData";

export type CoverAsset = {
  src: string;
  fileName: string;
  folder: string;
  alt: string;
};

const SKIP_NAME_PARTS = new Set([
  "出宫",
  "回宫",
  "补全版",
  "候选",
  "单体",
  "人物法器组合",
  "神龙旗幡组合",
  "马组合",
  "马伞盖随从组合",
]);

export function altFromFileName(fileName: string): string {
  const matched = getElementByAssetFile(fileName);
  if (matched) {
    const source = getSourceMural(matched);
    return source ? `${matched.name}，来自${source.temple}` : matched.name;
  }
  const stem = fileName.replace(/\.[^.]+$/, "");
  const parts = stem
    .split(/[_-]/)
    .map((part) => part.trim())
    .filter((part) => part && !SKIP_NAME_PARTS.has(part) && !/^\d+$/.test(part));
  return parts[parts.length - 1] || stem;
}

export function publicSrcFromRelativePath(relativePath: string): string {
  const encoded = relativePath
    .split(/[/\\]/)
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/images/objects/${encoded}`;
}

function cloneSlot(slot: CoverElement): CoverElement {
  return {
    ...slot,
    coverPosition: { ...slot.coverPosition },
    canvasPosition: { ...slot.canvasPosition },
    motion: { ...slot.motion },
    visibility: { ...slot.visibility },
  };
}

export function isMatchableCoverAsset(fileName?: string): boolean {
  const matched = getElementByAssetFile(fileName);
  if (!matched) return false;
  return Boolean(muralById[matched.sourceMuralId]?.imageSrc);
}

export function shuffleInPlace<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = items[index];
    items[index] = items[swap];
    items[swap] = current;
  }
  return items;
}

/**
 * 槽位位置与动效保持原排版；只随机决定用哪些图。
 * 封面填封面槽；剩余图继续随机补到画布槽，合计最多 20 个。
 */
export function assignCoverAssets(assets: CoverAsset[]): CoverElement[] {
  if (!assets.length) {
    return coverElements.map(cloneSlot);
  }

  const matchable = assets.filter((asset) =>
    isMatchableCoverAsset(asset.fileName)
  );
  const shuffled = shuffleInPlace([
    ...(matchable.length ? matchable : assets),
  ]);
  const coverCount = Math.min(coverElements.length, shuffled.length);
  const coverAssets = shuffled.slice(0, coverCount);
  const slotIndexes = shuffleInPlace(coverElements.map((_, index) => index))
    .slice(0, coverAssets.length)
    .sort((a, b) => a - b);

  const coverAssigned = slotIndexes.map((slotIndex, assetIndex) => {
    const asset = coverAssets[assetIndex];
    const slot = cloneSlot(coverElements[slotIndex]);
    slot.src = asset.src;
    slot.alt = asset.alt;
    slot.fileName = asset.fileName;
    slot.folder = asset.folder;
    slot.showOnCover = true;
    return slot;
  });

  const used = new Set(coverAssigned.map((element) => element.src));
  const remaining = shuffled.filter((asset) => !used.has(asset.src));
  const extraCount = Math.min(
    Math.max(0, CANVAS_ELEMENT_COUNT - coverAssigned.length),
    remaining.length,
    extraCanvasElements.length
  );

  const extras = extraCanvasElements.slice(0, extraCount).map((slot, index) => {
    const asset = remaining[index];
    const next = cloneSlot(slot);
    next.src = asset.src;
    next.alt = asset.alt;
    next.fileName = asset.fileName;
    next.folder = asset.folder;
    next.showOnCover = false;
    return next;
  });

  return [...coverAssigned, ...extras];
}
