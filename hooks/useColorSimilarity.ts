"use client";

import { useMemo } from "react";
import type { ColoringRegion } from "@/data/coloringRegions";
import {
  computeRegionSimilarity,
  type RegionColorMap,
  type SimilarityResult,
} from "@/utils/coloringScore";

export function useColorSimilarity(
  regionColors: RegionColorMap,
  regions: ColoringRegion[],
  enabled: boolean
): SimilarityResult | null {
  return useMemo(() => {
    if (!enabled) return null;
    return computeRegionSimilarity(regionColors, regions);
  }, [enabled, regionColors, regions]);
}
