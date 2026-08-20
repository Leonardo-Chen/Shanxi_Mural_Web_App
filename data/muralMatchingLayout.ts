export type MuralMatchingPosition = {
  muralId: string;
  x: number;
  y: number;
  width: number;
  aspectRatio: number;
  rotation?: number;
  zIndex?: number;
};

const DESKTOP_TILE = { width: 300, height: 200, gap: 32, cols: 4 };
const DESKTOP_ORIGIN = { x: 1680, y: 980 };
const MOBILE_TILE = { width: 220, height: 146, gap: 28, cols: 2 };
const MOBILE_ORIGIN = { x: 760, y: 1180 };

function buildMatchingGrid(
  ids: readonly string[],
  origin: { x: number; y: number },
  tile: { width: number; height: number; gap: number; cols: number }
): MuralMatchingPosition[] {
  const aspectRatio = tile.width / tile.height;
  return ids.map((muralId, index) => {
    const col = index % tile.cols;
    const row = Math.floor(index / tile.cols);
    return {
      muralId,
      x: origin.x + col * (tile.width + tile.gap),
      y: origin.y + row * (tile.height + tile.gap),
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
    initialCenter: { x: 2160, y: 1280 },
  },
  mobile: {
    width: 2200,
    height: 2800,
    initialCenter: { x: 1100, y: 1680 },
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
  muralIds: readonly string[]
): MuralMatchingPosition[] {
  return buildMatchingGrid(
    muralIds,
    isMobile ? MOBILE_ORIGIN : DESKTOP_ORIGIN,
    isMobile ? MOBILE_TILE : DESKTOP_TILE
  );
}
