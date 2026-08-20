export type WorldRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * 由内容包围盒计算缩放范围：
 * 最小 — 全部元素（含边距）落入视口；
 * 最大 — 最大的那个元素约占满屏幕。
 */
export function computeContentZoomRange(
  rects: WorldRect[],
  viewport: { width: number; height: number },
  padding = 72
): { minZoom: number; maxZoom: number } {
  const vw = Math.max(1, viewport.width);
  const vh = Math.max(1, viewport.height);

  if (!rects.length) {
    return { minZoom: 0.25, maxZoom: 4 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let largestWidth = 1;
  let largestHeight = 1;
  let largestArea = 0;

  for (const rect of rects) {
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + width);
    maxY = Math.max(maxY, rect.y + height);

    const area = width * height;
    if (area >= largestArea) {
      largestArea = area;
      largestWidth = width;
      largestHeight = height;
    }
  }

  const contentWidth = Math.max(1, maxX - minX + padding * 2);
  const contentHeight = Math.max(1, maxY - minY + padding * 2);
  const minZoom = Math.min(vw / contentWidth, vh / contentHeight);
  const fillSide = Math.min(largestWidth, largestHeight);
  const maxZoom = (Math.min(vw, vh) * 0.9) / fillSide;

  if (maxZoom <= minZoom) {
    return { minZoom, maxZoom: minZoom * 1.35 };
  }

  return { minZoom, maxZoom };
}
