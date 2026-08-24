export type MuralMatchingPosition = {
  muralId: string;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  rotation?: number;
  zIndex?: number;
};

const TILE_ASPECT = 3 / 2;
const TITLE_EXTRA = 40;

export function getMatchingInsets(isMobile: boolean) {
  return isMobile
    ? { left: 20, right: 20, top: 88, bottom: 96 }
    : { left: 328, right: 56, top: 88, bottom: 96 };
}

function matchingTile(
  isMobile: boolean,
  count: number,
  viewport: { width: number; height: number }
) {
  const insets = getMatchingInsets(isMobile);
  const cols = isMobile ? 2 : 4;
  const rows = Math.max(1, Math.ceil(count / cols));
  const colGap = isMobile ? 20 : 28;
  const rowGap = isMobile ? 56 : 64;
  const availW = Math.max(200, viewport.width - insets.left - insets.right);
  const availH = Math.max(200, viewport.height - insets.top - insets.bottom);
  const widthLimit = (availW - (cols - 1) * colGap) / cols;
  const heightLimit =
    ((availH - (rows - 1) * rowGap - TITLE_EXTRA) / rows) * TILE_ASPECT;
  const maxTileW = isMobile ? 200 : 280;
  const width = Math.max(120, Math.min(maxTileW, widthLimit, heightLimit));
  const height = width / TILE_ASPECT;
  const gridW = cols * width + (cols - 1) * colGap;
  const gridH = rows * height + (rows - 1) * rowGap + TITLE_EXTRA;
  return {
    width,
    height,
    colGap,
    rowGap,
    cols,
    origin: {
      x: Math.round(insets.left + Math.max(0, availW - gridW) / 2),
      y: Math.round(insets.top + Math.max(0, availH - gridH) / 2),
    },
  };
}

function buildMatchingGrid(
  ids: readonly string[],
  origin: { x: number; y: number },
  tile: { width: number; height: number; colGap: number; rowGap: number; cols: number }
): MuralMatchingPosition[] {
  const aspectRatio = tile.width / tile.height;
  return ids.map((muralId, index) => {
    const col = index % tile.cols;
    const row = Math.floor(index / tile.cols);
    return {
      muralId,
      x: origin.x + col * (tile.width + tile.colGap),
      y: origin.y + row * (tile.height + tile.rowGap),
      width: tile.width,
      aspectRatio,
      rotation: 0,
      zIndex: 1,
    };
  });
}

export const muralMatchingCanvas = {
  desktop: {
    width: 3600,
    height: 2400,
    initialCenter: { x: 1800, y: 1200 },
  },
  mobile: {
    width: 2200,
    height: 2800,
    initialCenter: { x: 1100, y: 1400 },
  },
} as const;

const MATCHING_MURAL_COUNT = 12;

export function shuffleIds<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swap];
    next[swap] = current;
  }
  return next;
}

/** 最多 12 张；来源壁画若已上传则一定入选，其余随机。 */
export function pickMatchingMuralIds(
  availableIds: readonly string[],
  requiredId?: string,
  count = MATCHING_MURAL_COUNT
): string[] {
  const unique = [...new Set(availableIds)];
  const required =
    requiredId && unique.includes(requiredId) ? requiredId : undefined;
  const pool = shuffleIds(unique.filter((id) => id !== required));
  const picked = required
    ? [required, ...pool.slice(0, Math.max(0, count - 1))]
    : pool.slice(0, count);
  return shuffleIds(picked);
}

export function getMatchingLayout(
  isMobile: boolean,
  muralIds: readonly string[],
  viewport: { width: number; height: number } = { width: 1280, height: 800 }
): MuralMatchingPosition[] {
  const tile = matchingTile(isMobile, muralIds.length, viewport);
  return buildMatchingGrid(muralIds, tile.origin, tile);
}

export function getMatchingViewCenter(viewport: {
  width: number;
  height: number;
}) {
  return {
    x: Math.max(1, viewport.width) / 2,
    y: Math.max(1, viewport.height) / 2,
  };
}
