import { coloringPalette, type PigmentColor } from "@/data/coloringPalette";
import {
  demoColoringRegions,
  type ColoringRegion,
} from "@/data/coloringRegions";

export type ColoringArtwork = {
  id: string;
  title: string;
  figureName: string;
  templeName: string;
  lineArtUrl: string;
  originalUrl: string;
  textureUrl?: string;
  regions: ColoringRegion[];
  palette: PigmentColor[];
};

export type ColoringArtworkPair = {
  id: string;
  lineFileName: string;
  originalFileName: string;
  lineArtUrl: string;
  originalUrl: string;
};

const ARTWORK_META: Record<
  string,
  { title: string; figureName: string; templeName: string }
> = {
  sanqing: {
    title: "三清殿东壁人物",
    figureName: "天神",
    templeName: "永乐宫",
  },
};

export function stemFromFileName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "");
  return base.replace(/[-_](lineart|line|original|mural)$/i, "").toLowerCase();
}

export function labelFromStem(stem: string): string {
  const meta = ARTWORK_META[stem];
  if (meta) return meta.title;
  return stem.replace(/[-_]+/g, " ").trim() || "壁画人物";
}

export function buildArtworkFromPair(
  pair: ColoringArtworkPair
): ColoringArtwork {
  const meta = ARTWORK_META[pair.id];
  return {
    id: pair.id,
    title: meta?.title ?? labelFromStem(pair.id),
    figureName: meta?.figureName ?? "壁画人物",
    templeName: meta?.templeName ?? "山西寺观",
    lineArtUrl: pair.lineArtUrl,
    originalUrl: pair.originalUrl,
    regions: demoColoringRegions,
    palette: coloringPalette,
  };
}

export const FALLBACK_ARTWORK_PAIR: ColoringArtworkPair = {
  id: "sanqing",
  lineFileName: "sanqing-line.jpg",
  originalFileName: "sanqing-original.jpg",
  lineArtUrl: "/images/coloring/masks/line/sanqing-line.jpg",
  originalUrl: "/images/coloring/masks/original/sanqing-original.jpg",
};

export const FALLBACK_ARTWORK = buildArtworkFromPair(FALLBACK_ARTWORK_PAIR);

/** 兼容旧页面引用。 */
export const coloringArtwork = {
  id: FALLBACK_ARTWORK.id,
  title: FALLBACK_ARTWORK.title,
  titleEn: "COLOR THE MURAL",
  pageTitle: "为神明着色",
  temple: FALLBACK_ARTWORK.templeName,
  templeId: "yonglegong",
  location: `山西${FALLBACK_ARTWORK.templeName}`,
  lineArtSrc: FALLBACK_ARTWORK.lineArtUrl,
  originalSrc: FALLBACK_ARTWORK.originalUrl,
  comparisonNote:
    "白描人物与原作局部为参考对应关系，非像素级修复对比。",
  deityIntro: {
    title: FALLBACK_ARTWORK.figureName,
    body: "三清殿《朝元图》东壁绘诸天朝元仪仗。色彩不仅装饰人物，也帮助观看者辨认身份与层次。",
  },
  muralLink: "/interactive/color-the-mural",
  templeLink: "/?temple=yonglegong",
  hints: [
    "石青常用于人物大面积衣袍，建立视觉上的主要身份。",
    "朱砂与赭石构成画面中的暖色层次，与冷色石青形成对照。",
    "壁画今天看到的颜色，已经经历了数百年的氧化与变化。",
  ],
  completionThreshold: 0.6,
  autosaveKey: "jin-museum-coloring-sanqing",
} as const;
