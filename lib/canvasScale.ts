import { canvasLayout, templeAnchors } from "@/data/canvasLayout";
import type { MuralCardData } from "@/data/muralCards";

const DESKTOP = canvasLayout.desktop;
const MOBILE = canvasLayout.mobile;

/** 寺庙画布统一卡片尺寸（桌面坐标） */
export const GRID_CARD = { width: 240, height: 320 } as const;
export const GRID_GAP = { x: 56, y: 56 } as const;

/** 寺庙无限画布（桌面坐标）；卡片在视口附近虚拟生成 */
export const TEMPLE_INFINITE_CANVAS = { width: 24000, height: 24000 } as const;
export const TEMPLE_INFINITE_CENTER = {
  x: TEMPLE_INFINITE_CANVAS.width / 2,
  y: TEMPLE_INFINITE_CANVAS.height / 2,
} as const;

const CELL_W = GRID_CARD.width + GRID_GAP.x;
const CELL_H = GRID_CARD.height + GRID_GAP.y;

export function getCanvasScale(isMobile: boolean) {
  if (!isMobile) return { scaleX: 1, scaleY: 1 };
  return {
    scaleX: MOBILE.width / DESKTOP.width,
    scaleY: MOBILE.height / DESKTOP.height,
  };
}

export function scaleCards(
  cards: MuralCardData[],
  isMobile: boolean
): MuralCardData[] {
  if (!isMobile) return cards;
  const { scaleX, scaleY } = getCanvasScale(true);
  return cards.map((card) => ({
    ...card,
    x: Math.round(card.x * scaleX),
    y: Math.round(card.y * scaleY),
    width: Math.round(card.width * scaleX),
    height: Math.round(card.height * scaleY),
  }));
}

export function scaleSize(
  size: { width: number; height: number },
  isMobile: boolean
) {
  if (!isMobile) return size;
  const { scaleX, scaleY } = getCanvasScale(true);
  return {
    width: Math.round(size.width * scaleX),
    height: Math.round(size.height * scaleY),
  };
}

export function scalePoint(
  point: { x: number; y: number },
  isMobile: boolean
) {
  if (!isMobile) return point;
  const { scaleX, scaleY } = getCanvasScale(true);
  return {
    x: Math.round(point.x * scaleX),
    y: Math.round(point.y * scaleY),
  };
}

export function scaleAnchors(isMobile: boolean) {
  if (!isMobile) return templeAnchors;
  const { scaleX, scaleY } = getCanvasScale(true);
  return Object.fromEntries(
    Object.entries(templeAnchors).map(([id, pos]) => [
      id,
      { x: pos.x * scaleX, y: pos.y * scaleY },
    ])
  );
}

function priorityRank(priority?: string) {
  if (priority === "high") return 0;
  if (priority === "normal") return 1;
  return 2;
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * 寺庙卡片模板：等大、排序后的原型（不含坐标）
 */
export function getTempleCardTemplates(
  cards: MuralCardData[],
  templeId: string
): MuralCardData[] {
  return cards
    .filter((c) => c.type !== "annotation" && c.templeId === templeId)
    .sort((a, b) => {
      if (a.type === "temple" && b.type !== "temple") return -1;
      if (b.type === "temple" && a.type !== "temple") return 1;
      return priorityRank(a.priority) - priorityRank(b.priority);
    })
    .map((card) => ({
      ...card,
      width: GRID_CARD.width,
      height: GRID_CARD.height,
      rotation: 0,
      depth: 0.8,
    }));
}

/**
 * 视口附近的无限网格卡片。
 * isMobile 时坐标与尺寸按移动端画布比例缩放。
 */
export function getVisibleInfiniteTempleCards(
  templates: MuralCardData[],
  opts: {
    viewLeft: number;
    viewTop: number;
    viewWidth: number;
    viewHeight: number;
    buffer?: number;
    isMobile?: boolean;
    originX?: number;
    originY?: number;
  }
): MuralCardData[] {
  if (templates.length === 0) return [];

  const isMobile = opts.isMobile ?? false;
  const { scaleX, scaleY } = getCanvasScale(isMobile);
  const cardW = Math.round(GRID_CARD.width * scaleX);
  const cardH = Math.round(GRID_CARD.height * scaleY);
  const gapX = Math.round(GRID_GAP.x * scaleX);
  const gapY = Math.round(GRID_GAP.y * scaleY);
  const cellW = cardW + gapX;
  const cellH = cardH + gapY;

  const center = scalePoint(TEMPLE_INFINITE_CENTER, isMobile);
  const originX = opts.originX ?? center.x - cardW / 2;
  const originY = opts.originY ?? center.y - cardH / 2;

  const buffer = opts.buffer ?? Math.max(cellW, cellH) * 1.5;
  const minX = opts.viewLeft - buffer;
  const maxX = opts.viewLeft + opts.viewWidth + buffer;
  const minY = opts.viewTop - buffer;
  const maxY = opts.viewTop + opts.viewHeight + buffer;

  const colStart = Math.floor((minX - originX) / cellW);
  const colEnd = Math.ceil((maxX - originX) / cellW);
  const rowStart = Math.floor((minY - originY) / cellH);
  const rowEnd = Math.ceil((maxY - originY) / cellH);

  const result: MuralCardData[] = [];
  const n = templates.length;

  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      const template = templates[mod(col + row * 3, n)];
      result.push({
        ...template,
        id: `${template.id}__${col}_${row}`,
        x: Math.round(originX + col * cellW),
        y: Math.round(originY + row * cellH),
        width: cardW,
        height: cardH,
        rotation: 0,
        depth: 0.8,
      });
    }
  }

  return result;
}

/** 从无限卡片 id 还原原始 mural card id */
export function resolveTempleCardId(cardId: string): string {
  const sep = cardId.indexOf("__");
  return sep === -1 ? cardId : cardId.slice(0, sep);
}

/**
 * 有限整齐网格（兼容旧用法）
 */
export function layoutTempleGrid(
  cards: MuralCardData[],
  templeId: string,
  _isMobile = false
): MuralCardData[] {
  const templates = getTempleCardTemplates(cards, templeId);
  if (templates.length === 0) return [];

  const cols = Math.min(3, templates.length);
  const rows = Math.ceil(templates.length / cols);
  const gridW = cols * GRID_CARD.width + (cols - 1) * GRID_GAP.x;
  const gridH = rows * GRID_CARD.height + (rows - 1) * GRID_GAP.y;

  const anchor = templeAnchors[templeId] ?? TEMPLE_INFINITE_CENTER;
  const startX = Math.round(anchor.x - gridW / 2);
  const startY = Math.round(anchor.y - gridH / 2);

  return templates.map((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      ...card,
      x: startX + col * CELL_W,
      y: startY + row * CELL_H,
    };
  });
}

export function getTempleGridCenter(templeId: string): { x: number; y: number } {
  return templeAnchors[templeId] ?? {
    x: DESKTOP.width / 2,
    y: DESKTOP.height / 2,
  };
}
