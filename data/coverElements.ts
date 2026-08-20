export type CoverElementCategory =
  | "figure"
  | "object"
  | "architecture"
  | "animal"
  | "cloud"
  | "banner";

export type ViewportTier = "desktop" | "tablet" | "mobile";

/**
 * 壁画素材容器。构图与交互始终作用在这个容器上。
 * `src` 为空时只显示占位状态；填入透明 PNG/WebP 后不需要改位置或动画。
 */
export type CoverElement = {
  id: string;
  category: CoverElementCategory;
  /** 真实素材路径。空值表示容器处于占位状态，不是最终卡片 UI。 */
  src?: string;
  alt: string;
  coverPosition: {
    x: number;
    y: number;
    width: number;
    aspectRatio: number;
    rotation?: number;
    zIndex?: number;
    mobileWidth?: number;
  };
  canvasPosition: {
    x: number;
    y: number;
    width: number;
    rotation?: number;
    zIndex?: number;
  };
  /** 封面汇聚节奏。方向在运行时指向「开始探索」按钮，不使用随机位移。 */
  motion: {
    driftX: number;
    driftY: number;
    duration: number;
    delay: number;
  };
  visibility: Record<ViewportTier, boolean>;
  tone: number;
  /** 素材文件名，随机分配后写入。 */
  fileName?: string;
  /** `public/images/objects` 下的子文件夹名，例如 duo_fu_si。 */
  folder?: string;
  /** 为 false 时只出现在无限画布，不出现在封面。 */
  showOnCover?: boolean;
};

export type SlotDisplayState = "placeholder" | "asset";

export function getSlotDisplayState(slot: CoverElement): SlotDisplayState {
  return slot.src ? "asset" : "placeholder";
}

export const COVER_CATEGORY_LABELS: Record<CoverElementCategory, string> = {
  figure: "人物",
  object: "法器",
  architecture: "建筑",
  animal: "瑞兽",
  cloud: "云纹",
  banner: "旗幡",
};

export const PLACEHOLDER_TONES = [
  "#C5BDB1",
  "#B7AFA3",
  "#CBC3B7",
  "#AFA79B",
  "#BEB6AA",
] as const;

/**
 * 预先设计的素材容器。位置与动效固定，图片在打开页面时随机填入。
 * coverPosition.x / y 为视口百分比（容器左上角）。
 * canvasPosition 为无限画布像素坐标。
 */
export const coverElements: CoverElement[] = [
  {
    id: "figure-longmu",
    category: "figure",
    alt: "龙母",
    coverPosition: {
      x: 1.6,
      y: 60.8,
      width: 142,
      aspectRatio: 0.698,
      rotation: -2,
      zIndex: 4,
      mobileWidth: 112,
    },
    canvasPosition: { x: 2029, y: 1682, width: 300, rotation: -2, zIndex: 4 },
    motion: { driftX: 14, driftY: 9, duration: 18, delay: 0.2 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 0,
  },
  {
    id: "figure-official-hu",
    category: "figure",
    alt: "持笏文官",
    coverPosition: {
      x: 76.8,
      y: 14.8,
      width: 118,
      aspectRatio: 0.765,
      rotation: 2,
      zIndex: 4,
      mobileWidth: 100,
    },
    canvasPosition: { x: 3311, y: 1258, width: 260, rotation: 2, zIndex: 4 },
    motion: { driftX: -16, driftY: 8, duration: 20, delay: 0.5 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 2,
  },
  {
    id: "figure-leigong",
    category: "figure",
    alt: "雷公",
    coverPosition: {
      x: 0.8,
      y: 8.5,
      width: 154,
      aspectRatio: 0.763,
      rotation: 1.2,
      zIndex: 5,
      mobileWidth: 120,
    },
    canvasPosition: { x: 2737, y: 1696, width: 310, rotation: 1, zIndex: 5 },
    motion: { driftX: 18, driftY: -7, duration: 16, delay: 0.1 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 1,
  },
  {
    id: "figure-simu-depart",
    category: "object",
    alt: "四目神与量雨尺",
    coverPosition: {
      x: 15.8,
      y: -4,
      width: 168,
      aspectRatio: 0.85,
      rotation: -1,
      zIndex: 3,
      mobileWidth: 128,
    },
    canvasPosition: { x: 2503, y: 1240, width: 320, rotation: -1, zIndex: 3 },
    motion: { driftX: 10, driftY: 12, duration: 22, delay: 0.8 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 3,
  },
  {
    id: "figure-simu-return",
    category: "object",
    alt: "回宫四目神与量雨尺",
    coverPosition: {
      x: 69.8,
      y: 69.5,
      width: 128,
      aspectRatio: 0.666,
      rotation: 1.4,
      zIndex: 3,
      mobileWidth: 108,
    },
    canvasPosition: { x: 2743, y: 2166, width: 270, rotation: 2, zIndex: 3 },
    motion: { driftX: -12, driftY: -10, duration: 19, delay: 0.3 },
    visibility: { desktop: true, tablet: true, mobile: false },
    tone: 0,
  },
  {
    id: "figure-dragon-banner-04",
    category: "animal",
    alt: "骑乘神祇与神龙旗幡",
    coverPosition: {
      x: 59.2,
      y: -6,
      width: 188,
      aspectRatio: 0.967,
      rotation: -0.8,
      zIndex: 3,
      mobileWidth: 142,
    },
    canvasPosition: { x: 2887, y: 1242, width: 360, rotation: -1, zIndex: 3 },
    motion: { driftX: -14, driftY: 11, duration: 17, delay: 0.6 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 4,
  },
  {
    id: "figure-dragon-banner-02",
    category: "animal",
    alt: "骑乘神祇与神龙",
    coverPosition: {
      x: 28.4,
      y: 77.2,
      width: 198,
      aspectRatio: 1,
      rotation: 0.5,
      zIndex: 3,
      mobileWidth: 148,
    },
    canvasPosition: { x: 2309, y: 2176, width: 370, rotation: 1, zIndex: 3 },
    motion: { driftX: 11, driftY: 8, duration: 15, delay: 0.4 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 2,
  },
  {
    id: "figure-horse-05",
    category: "figure",
    alt: "骑乘神祇与坐骑",
    coverPosition: {
      x: 81.8,
      y: 41,
      width: 192,
      aspectRatio: 0.908,
      rotation: -1.4,
      zIndex: 4,
      mobileWidth: 140,
    },
    canvasPosition: { x: 3111, y: 1706, width: 350, rotation: -2, zIndex: 4 },
    motion: { driftX: -10, driftY: 13, duration: 21, delay: 0.15 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 1,
  },
  {
    id: "figure-horse-canopy",
    category: "figure",
    alt: "骑乘神祇、马与伞盖随从",
    coverPosition: {
      x: 35,
      y: -8.5,
      width: 206,
      aspectRatio: 1,
      rotation: 0.4,
      zIndex: 2,
      mobileWidth: 150,
    },
    canvasPosition: { x: 2059, y: 1238, width: 380, rotation: 0, zIndex: 2 },
    motion: { driftX: -13, driftY: -8, duration: 16, delay: 0.9 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 3,
  },
  {
    id: "figure-scribe",
    category: "figure",
    alt: "书判记录官",
    coverPosition: {
      x: 16.2,
      y: 38.8,
      width: 116,
      aspectRatio: 0.875,
      rotation: -0.8,
      zIndex: 5,
      mobileWidth: 100,
    },
    canvasPosition: { x: 2393, y: 1728, width: 280, rotation: -1, zIndex: 5 },
    motion: { driftX: 9, driftY: 14, duration: 23, delay: 0.35 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 0,
  },
];

/** 点击「开始探索」后补到无限画布上的槽位，与封面槽合计 20 个。 */
export const extraCanvasElements: CoverElement[] = [
  {
    id: "canvas-extra-01",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 160, aspectRatio: 0.84, rotation: -1.2, zIndex: 3, mobileWidth: 120 },
    canvasPosition: { x: 1660, y: 820, width: 310, rotation: -1, zIndex: 3 },
    motion: { driftX: 8, driftY: 6, duration: 17, delay: 0.2 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 1,
  },
  {
    id: "canvas-extra-02",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 160, aspectRatio: 0.8, rotation: 0.8, zIndex: 3, mobileWidth: 120 },
    canvasPosition: { x: 2280, y: 740, width: 300, rotation: 1, zIndex: 3 },
    motion: { driftX: -7, driftY: 9, duration: 19, delay: 0.4 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 2,
  },
  {
    id: "canvas-extra-03",
    category: "animal",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 160, aspectRatio: 0.88, rotation: -0.6, zIndex: 2, mobileWidth: 120 },
    canvasPosition: { x: 2980, y: 720, width: 320, rotation: -1, zIndex: 2 },
    motion: { driftX: 10, driftY: -5, duration: 16, delay: 0.15 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 3,
  },
  {
    id: "canvas-extra-04",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 150, aspectRatio: 0.76, rotation: 1.4, zIndex: 4, mobileWidth: 118 },
    canvasPosition: { x: 3700, y: 1080, width: 290, rotation: 1, zIndex: 4 },
    motion: { driftX: -9, driftY: 7, duration: 21, delay: 0.5 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 0,
  },
  {
    id: "canvas-extra-05",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 150, aspectRatio: 0.9, rotation: -1, zIndex: 3, mobileWidth: 118 },
    canvasPosition: { x: 3720, y: 1680, width: 300, rotation: -1, zIndex: 3 },
    motion: { driftX: 6, driftY: 11, duration: 18, delay: 0.25 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 4,
  },
  {
    id: "canvas-extra-06",
    category: "object",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 155, aspectRatio: 0.82, rotation: 0.5, zIndex: 3, mobileWidth: 118 },
    canvasPosition: { x: 3480, y: 2280, width: 310, rotation: 1, zIndex: 3 },
    motion: { driftX: -8, driftY: -6, duration: 20, delay: 0.35 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 1,
  },
  {
    id: "canvas-extra-07",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 145, aspectRatio: 0.74, rotation: -1.5, zIndex: 2, mobileWidth: 116 },
    canvasPosition: { x: 2920, y: 2720, width: 280, rotation: -2, zIndex: 2 },
    motion: { driftX: 9, driftY: 8, duration: 17, delay: 0.1 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 2,
  },
  {
    id: "canvas-extra-08",
    category: "animal",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 160, aspectRatio: 0.92, rotation: 1.1, zIndex: 3, mobileWidth: 120 },
    canvasPosition: { x: 2180, y: 2680, width: 320, rotation: 1, zIndex: 3 },
    motion: { driftX: -6, driftY: 10, duration: 19, delay: 0.45 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 3,
  },
  {
    id: "canvas-extra-09",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 150, aspectRatio: 0.78, rotation: -0.4, zIndex: 4, mobileWidth: 118 },
    canvasPosition: { x: 1540, y: 2160, width: 300, rotation: 0, zIndex: 4 },
    motion: { driftX: 11, driftY: -7, duration: 16, delay: 0.3 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 0,
  },
  {
    id: "canvas-extra-10",
    category: "figure",
    alt: "壁画人物",
    showOnCover: false,
    coverPosition: { x: 0, y: 0, width: 150, aspectRatio: 0.86, rotation: 1.2, zIndex: 3, mobileWidth: 118 },
    canvasPosition: { x: 1480, y: 1420, width: 290, rotation: 1, zIndex: 3 },
    motion: { driftX: -10, driftY: 8, duration: 22, delay: 0.55 },
    visibility: { desktop: true, tablet: true, mobile: true },
    tone: 4,
  },
];

export const CANVAS_ELEMENT_COUNT = coverElements.length + extraCanvasElements.length;

export function getViewportTier(width: number): ViewportTier {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function getVisibleCoverElements(
  width: number,
  elements: CoverElement[] = coverElements
): CoverElement[] {
  const tier = getViewportTier(width);
  return elements.filter((element) => element.visibility[tier]);
}

/** 封面构图按 Figma 1440 画板书写，其他宽度按比例缩放。 */
const COVER_ARTBOARD_WIDTH = 1440;

/**
 * 封面不绘制顶栏，但为左上 Logo 及其右侧顶区留白。
 * 数值对应 header 的 p-5/p-6 + Logo 高度 + 一点空隙。
 */
export function getCoverChromeInset(viewportWidth: number): { top: number } {
  const padding = viewportWidth >= 768 ? 24 : 20;
  const logo = viewportWidth >= 768 ? 48 : 44;
  return { top: padding + logo + 16 };
}

export function getCoverWidth(element: CoverElement, width: number): number {
  if (width < 768 && element.coverPosition.mobileWidth) {
    return element.coverPosition.mobileWidth;
  }
  const scale = Math.min(1.06, Math.max(0.7, width / COVER_ARTBOARD_WIDTH));
  return Math.round(element.coverPosition.width * scale);
}

export function getCoverScreenOrigin(
  element: CoverElement,
  viewport: { width: number; height: number },
  coverWidth = getCoverWidth(element, viewport.width)
): { x: number; y: number } {
  const x = (element.coverPosition.x / 100) * viewport.width;
  let y = (element.coverPosition.y / 100) * viewport.height;
  const chromeTop = getCoverChromeInset(viewport.width).top;
  if (y < chromeTop) {
    y = chromeTop;
  }
  return { x, y };
}

export function coverPositionToCanvas(
  element: CoverElement,
  viewport: { width: number; height: number },
  canvasCenter: { x: number; y: number },
  coverWidth: number
): { x: number; y: number; scale: number } {
  const origin = getCoverScreenOrigin(element, viewport, coverWidth);
  const canvasWidth = getCanvasWidth(element, viewport.width);

  return {
    x: origin.x + canvasCenter.x - viewport.width / 2,
    y: origin.y + canvasCenter.y - viewport.height / 2,
    scale: coverWidth / canvasWidth,
  };
}

export function getCanvasWidth(element: CoverElement, viewportWidth: number): number {
  if (viewportWidth < 768) {
    return Math.round(element.canvasPosition.width * (2400 / 4200) * 1.2);
  }
  return element.canvasPosition.width;
}

export function getCanvasPoint(
  element: CoverElement,
  viewportWidth: number,
  canvasSize: { width: number; height: number }
): { x: number; y: number } {
  if (viewportWidth < 768) {
    return {
      x: element.canvasPosition.x * (canvasSize.width / 5600),
      y: element.canvasPosition.y * (canvasSize.height / 3800),
    };
  }
  return { x: element.canvasPosition.x, y: element.canvasPosition.y };
}

/** 「开始探索」按钮相对视口中心略偏下，与封面中央构图对齐。 */
export const COVER_BUTTON_OFFSET_Y = 0.08;

export function getConvergenceDelta(
  element: CoverElement,
  pose: { x: number; y: number },
  coverWidth: number,
  viewportHeight: number,
  canvasCenter: { x: number; y: number }
): { x: number; y: number } {
  const coverHeight = coverWidth / element.coverPosition.aspectRatio;
  const slotCenterX = pose.x + coverWidth / 2;
  const slotCenterY = pose.y + coverHeight / 2;
  const buttonX = canvasCenter.x;
  const buttonY = canvasCenter.y + viewportHeight * COVER_BUTTON_OFFSET_Y;
  const dx = buttonX - slotCenterX;
  const dy = buttonY - slotCenterY;
  const dist = Math.hypot(dx, dy) || 1;
  const amplitude = Math.min(
    48,
    Math.max(28, Math.hypot(element.motion.driftX, element.motion.driftY) * 2.2)
  );

  return {
    x: (dx / dist) * amplitude,
    y: (dy / dist) * amplitude,
  };
}
