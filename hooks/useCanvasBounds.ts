"use client";

import { useCallback, useMemo } from "react";

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface UseCanvasBoundsOptions {
  canvasWidth: number;
  canvasHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  /** 允许超出边界的额外像素（产生阻力区） */
  overscroll?: number;
}

export function useCanvasBounds({
  canvasWidth,
  canvasHeight,
  viewportWidth,
  viewportHeight,
  overscroll = 80,
}: UseCanvasBoundsOptions) {
  const bounds = useMemo<Bounds>(() => {
    const minX = -(canvasWidth - viewportWidth) - overscroll;
    const maxX = overscroll;
    const minY = -(canvasHeight - viewportHeight) - overscroll;
    const maxY = overscroll;
    return { minX, maxX, minY, maxY };
  }, [canvasWidth, canvasHeight, viewportWidth, viewportHeight, overscroll]);

  const hardBounds = useMemo<Bounds>(() => {
    const minX = -(canvasWidth - viewportWidth);
    const maxX = 0;
    const minY = -(canvasHeight - viewportHeight);
    const maxY = 0;
    return { minX, maxX, minY, maxY };
  }, [canvasWidth, canvasHeight, viewportWidth, viewportHeight]);

  const clampPosition = useCallback(
    (x: number, y: number, useSoft = true): { x: number; y: number } => {
      const b = useSoft ? bounds : hardBounds;
      return {
        x: Math.min(b.maxX, Math.max(b.minX, x)),
        y: Math.min(b.maxY, Math.max(b.minY, y)),
      };
    },
    [bounds, hardBounds]
  );

  const applyEdgeResistance = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      let nx = x;
      let ny = y;

      if (x > hardBounds.maxX) {
        const over = x - hardBounds.maxX;
        nx = hardBounds.maxX + over * 0.35;
      } else if (x < hardBounds.minX) {
        const over = hardBounds.minX - x;
        nx = hardBounds.minX - over * 0.35;
      }

      if (y > hardBounds.maxY) {
        const over = y - hardBounds.maxY;
        ny = hardBounds.maxY + over * 0.35;
      } else if (y < hardBounds.minY) {
        const over = hardBounds.minY - y;
        ny = hardBounds.minY - over * 0.35;
      }

      return clampPosition(nx, ny, true);
    },
    [hardBounds, clampPosition]
  );

  const centerOn = useCallback(
    (pointX: number, pointY: number): { x: number; y: number } => {
      const x = -(pointX - viewportWidth / 2);
      const y = -(pointY - viewportHeight / 2);
      return clampPosition(x, y, false);
    },
    [viewportWidth, viewportHeight, clampPosition]
  );

  return {
    bounds,
    hardBounds,
    clampPosition,
    applyEdgeResistance,
    centerOn,
  };
}
