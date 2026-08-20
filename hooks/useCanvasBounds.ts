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
  scale?: number;
}

function scaledBounds(
  canvasWidth: number,
  canvasHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  scale: number,
  overscroll: number
): Bounds {
  const width = canvasWidth * scale;
  const height = canvasHeight * scale;

  if (width <= viewportWidth) {
    const x = (viewportWidth - width) / 2;
    const y =
      height <= viewportHeight ? (viewportHeight - height) / 2 : overscroll;
    return {
      minX: x,
      maxX: x,
      minY: height <= viewportHeight ? y : viewportHeight - height - overscroll,
      maxY: height <= viewportHeight ? y : overscroll,
    };
  }

  if (height <= viewportHeight) {
    const y = (viewportHeight - height) / 2;
    return {
      minX: viewportWidth - width - overscroll,
      maxX: overscroll,
      minY: y,
      maxY: y,
    };
  }

  return {
    minX: viewportWidth - width - overscroll,
    maxX: overscroll,
    minY: viewportHeight - height - overscroll,
    maxY: overscroll,
  };
}

export function useCanvasBounds({
  canvasWidth,
  canvasHeight,
  viewportWidth,
  viewportHeight,
  overscroll = 80,
  scale = 1,
}: UseCanvasBoundsOptions) {
  const bounds = useMemo<Bounds>(
    () =>
      scaledBounds(
        canvasWidth,
        canvasHeight,
        viewportWidth,
        viewportHeight,
        scale,
        overscroll
      ),
    [canvasWidth, canvasHeight, viewportWidth, viewportHeight, overscroll, scale]
  );

  const hardBounds = useMemo<Bounds>(
    () =>
      scaledBounds(
        canvasWidth,
        canvasHeight,
        viewportWidth,
        viewportHeight,
        scale,
        0
      ),
    [canvasWidth, canvasHeight, viewportWidth, viewportHeight, scale]
  );

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
      const x = viewportWidth / 2 - pointX * scale;
      const y = viewportHeight / 2 - pointY * scale;
      return clampPosition(x, y, false);
    },
    [viewportWidth, viewportHeight, scale, clampPosition]
  );

  const clampForScale = useCallback(
    (x: number, y: number, nextScale: number, useSoft = true) => {
      const b = scaledBounds(
        canvasWidth,
        canvasHeight,
        viewportWidth,
        viewportHeight,
        nextScale,
        useSoft ? overscroll : 0
      );
      return {
        x: Math.min(b.maxX, Math.max(b.minX, x)),
        y: Math.min(b.maxY, Math.max(b.minY, y)),
      };
    },
    [canvasWidth, canvasHeight, viewportWidth, viewportHeight, overscroll]
  );

  return {
    bounds,
    hardBounds,
    clampPosition,
    applyEdgeResistance,
    centerOn,
    clampForScale,
  };
}
