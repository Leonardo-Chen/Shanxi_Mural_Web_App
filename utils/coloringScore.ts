import type { ColoringRegion } from "@/data/coloringRegions";
import { rgbToLab } from "@/utils/colorConversion";
import {
  deltaE2000,
  regionSimilarityFromDeltaE,
  scoreToStars,
} from "@/utils/deltaE2000";

export type RegionColorMap = Record<string, string>;

export type SimilarityResult = {
  colorSimilarity: number;
  completion: number;
  finalScore: number;
  stars: number;
  incomplete: boolean;
};

export function computeRegionSimilarity(
  regionColors: RegionColorMap,
  regions: ColoringRegion[]
): SimilarityResult {
  let weightedSim = 0;
  let coloredWeight = 0;
  let totalWeight = 0;

  for (const region of regions) {
    totalWeight += region.weight;
    const userColor = regionColors[region.id];
    if (!userColor) continue;
    coloredWeight += region.weight;
    const deltaE = deltaE2000(
      rgbToLab(userColor),
      rgbToLab(region.referenceColor)
    );
    weightedSim += regionSimilarityFromDeltaE(deltaE) * region.weight;
  }

  const colorSimilarity = coloredWeight > 0 ? weightedSim / coloredWeight : 0;
  const completion = totalWeight > 0 ? coloredWeight / totalWeight : 0;
  const finalScore = Math.round(
    (colorSimilarity * 0.85 + completion * 0.15) * 100
  );

  return {
    colorSimilarity,
    completion,
    finalScore,
    stars: scoreToStars(finalScore),
    incomplete: completion < 0.6,
  };
}

export function usedPigmentValues(regionColors: RegionColorMap): Set<string> {
  return new Set(
    Object.values(regionColors).map((value) => value.toLowerCase())
  );
}

export function coloringDataHash(
  artworkId: string,
  regionColors: RegionColorMap
): string {
  const keys = Object.keys(regionColors).sort();
  const payload = `${artworkId}:${keys
    .map((key) => `${key}=${regionColors[key]}`)
    .join("|")}`;
  return hashString(payload);
}

export function hashString(payload: string): string {
  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 33) ^ payload.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`无法加载图片：${src}`));
    image.src = src;
  });
}

function rgbToHexByte(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/** 将用户涂抹与原壁画按同一构图采样比较（非像素级对齐修复）。 */
export async function computePaintSimilarity(
  paintCanvas: HTMLCanvasElement,
  originalUrl: string
): Promise<SimilarityResult> {
  const original = await loadImage(originalUrl);
  const width = paintCanvas.width;
  const height = paintCanvas.height;
  const sample = document.createElement("canvas");
  sample.width = width;
  sample.height = height;
  const sctx = sample.getContext("2d");
  const pctx = paintCanvas.getContext("2d");
  if (!sctx || !pctx) {
    return {
      colorSimilarity: 0,
      completion: 0,
      finalScore: 0,
      stars: 1,
      incomplete: true,
    };
  }

  sctx.fillStyle = "#EEE8DC";
  sctx.fillRect(0, 0, width, height);
  const scale = Math.min(width / original.naturalWidth, height / original.naturalHeight);
  const dw = original.naturalWidth * scale;
  const dh = original.naturalHeight * scale;
  sctx.drawImage(original, (width - dw) / 2, (height - dh) / 2, dw, dh);

  const paint = pctx.getImageData(0, 0, width, height);
  const orig = sctx.getImageData(0, 0, width, height);
  const step = Math.max(4, Math.floor(Math.min(width, height) / 120));
  let painted = 0;
  let total = 0;
  let simSum = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      total += 1;
      const i = (y * width + x) * 4;
      if (paint.data[i + 3] < 18) continue;
      painted += 1;
      const userLab = rgbToLab(
        rgbToHexByte(paint.data[i], paint.data[i + 1], paint.data[i + 2])
      );
      const origLab = rgbToLab(
        rgbToHexByte(orig.data[i], orig.data[i + 1], orig.data[i + 2])
      );
      simSum += regionSimilarityFromDeltaE(deltaE2000(userLab, origLab));
    }
  }

  const colorSimilarity = painted > 0 ? simSum / painted : 0;
  const completion = total > 0 ? Math.min(1, painted / (total * 0.18)) : 0;
  const finalScore = Math.round((colorSimilarity * 0.85 + completion * 0.15) * 100);

  return {
    colorSimilarity,
    completion,
    finalScore,
    stars: scoreToStars(finalScore),
    incomplete: completion < 0.6,
  };
}

export function checksumPaint(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "0";
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let hash = 2166136261;
  for (let i = 0; i < data.length; i += 97) {
    hash ^= data[i];
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
