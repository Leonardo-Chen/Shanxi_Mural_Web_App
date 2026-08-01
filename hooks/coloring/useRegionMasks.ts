"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildRegionIdMap,
  extractRegionMasks,
} from "@/utils/maskProcessing";
import { rgbToRegionId } from "@/data/coloringRegions";

export function useRegionMasks(width: number, height: number, ready: boolean) {
  const regionIdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const masksRef = useRef<Uint8Array[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ready || width <= 0 || height <= 0) return;
    let cancelled = false;

    buildRegionIdMap(width, height).then(({ canvas, ctx }) => {
      if (cancelled) return;
      regionIdCanvasRef.current = canvas;
      masksRef.current = extractRegionMasks(ctx, width, height);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [width, height, ready]);

  const hitTest = (x: number, y: number): number | null => {
    const canvas = regionIdCanvasRef.current;
    if (!canvas || x < 0 || y < 0 || x >= width || y >= height) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return rgbToRegionId(p[0], p[1], p[2]);
  };

  return {
    loaded,
    masksRef,
    regionIdCanvasRef,
    hitTest,
  };
}
