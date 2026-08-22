import { coloringRegions } from "@/data/coloringRegions";
import { rgbToLab } from "@/utils/colorConversion";
import {
  deltaE2000,
  regionSimilarityFromDeltaE,
} from "@/utils/deltaE2000";

export interface ScoreResult {
  colorSimilarity: number;
  completion: number;
  finalScore: number;
  regionScores: {
    id: string;
    name: string;
    similarity: number;
    covered: boolean;
    deltaE: number;
  }[];
  bestRegion: { id: string; name: string; similarity: number } | null;
  worstRegion: { id: string; name: string; similarity: number } | null;
  evaluation: string;
}

export function computeColorScore(
  paintData: Uint8ClampedArray,
  masks: Uint8Array[],
  width: number,
  height: number
): ScoreResult {
  const regionScores: ScoreResult["regionScores"] = [];
  let weightedSim = 0;
  let totalWeight = 0;
  let coveredArea = 0;
  let totalArea = 0;

  coloringRegions.forEach((region, i) => {
    const mask = masks[i];
    if (!mask) return;

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;
    let area = 0;

    for (let p = 0; p < mask.length; p++) {
      if (!mask[p]) continue;
      area++;
      const a = paintData[p * 4 + 3];
      if (a < 12) continue;
      rSum += paintData[p * 4];
      gSum += paintData[p * 4 + 1];
      bSum += paintData[p * 4 + 2];
      count++;
    }

    totalArea += area;
    if (count > area * 0.08) coveredArea += area;

    const covered = count > area * 0.08;
    let similarity = 0;
    let deltaE = 100;

    if (covered && count > 0) {
      const userLab = rgbToLab(
        `#${[rSum / count, gSum / count, bSum / count]
          .map((v) => Math.round(v).toString(16).padStart(2, "0"))
          .join("")}`
      );
      deltaE = deltaE2000(userLab, rgbToLab(region.referenceColor));
      similarity = regionSimilarityFromDeltaE(deltaE);
      weightedSim += similarity * region.weight;
      totalWeight += region.weight;
    }

    regionScores.push({
      id: region.id,
      name: region.name,
      similarity: Math.round(similarity * 100),
      covered,
      deltaE,
    });
  });

  const colorSimilarity =
    totalWeight > 0 ? (weightedSim / totalWeight) * 100 : 0;
  const completion = totalArea > 0 ? (coveredArea / totalArea) * 100 : 0;
  const finalScore = Math.round(
    colorSimilarity * 0.85 + completion * 0.15
  );

  const coveredRegions = regionScores.filter((r) => r.covered);
  const best = coveredRegions.reduce(
    (a, b) => (b.similarity > a.similarity ? b : a),
    coveredRegions[0] ?? null
  );
  const worst = coveredRegions.reduce(
    (a, b) => (b.similarity < a.similarity ? b : a),
    coveredRegions[0] ?? null
  );

  let evaluation = "你选择了属于自己的色彩节奏。";
  if (colorSimilarity >= 75) {
    evaluation =
      "你准确捕捉了石青、朱砂和赭石之间的主要关系，人物层次清晰可辨。";
  } else if (colorSimilarity >= 50) {
    evaluation =
      "部分区域接近原作留存色，整体冷暖关系已有雏形，可继续细读衣饰与配饰。";
  } else {
    evaluation =
      "你的配色形成了独特的观看方式；对照原作，可留意石青长袍与朱砂内层的对照。";
  }

  return {
    colorSimilarity: Math.round(colorSimilarity),
    completion: Math.round(completion),
    finalScore,
    regionScores,
    bestRegion: best
      ? { id: best.id, name: best.name, similarity: best.similarity }
      : null,
    worstRegion: worst
      ? { id: worst.id, name: worst.name, similarity: worst.similarity }
      : null,
    evaluation,
  };
}
