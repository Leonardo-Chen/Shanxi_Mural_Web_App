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
  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 33) ^ payload.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
