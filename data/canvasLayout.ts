export interface CanvasSize {
  width: number;
  height: number;
}

export interface ViewportPosition {
  x: number;
  y: number;
}

export interface CanvasConnection {
  from: string;
  to: string;
}

export interface CanvasLayout {
  desktop: CanvasSize;
  mobile: CanvasSize;
  initialViewport: ViewportPosition;
  mobileInitialViewport: ViewportPosition;
  connections: CanvasConnection[];
}

/** 桌面端 4200×2800，移动端 2400×3200；初始视口对准公主寺区域 */
export const canvasLayout: CanvasLayout = {
  desktop: { width: 4200, height: 2800 },
  mobile: { width: 2400, height: 3200 },
  initialViewport: { x: 1950, y: 1280 },
  mobileInitialViewport: { x: 1100, y: 1450 },
  connections: [
    { from: "gongzhu", to: "yanshan" },
    { from: "gongzhu", to: "yongning" },
    { from: "gongzhu", to: "shuishen" },
    { from: "gongzhu", to: "foguang" },
    { from: "yanshan", to: "shuishen" },
    { from: "yongning", to: "foguang" },
  ],
};

/** 封面素材进入无限画布后的画布尺寸与中心（与寺庙卡片画布相互独立） */
export const elementCanvasLayout = {
  desktop: { width: 5600, height: 3800, center: { x: 2800, y: 1900 } },
  tablet: { width: 5600, height: 3800, center: { x: 2800, y: 1900 } },
  mobile: { width: 2400, height: 3200, center: { x: 1200, y: 1600 } },
} as const;

/** 寺庙在画布上的锚点，用于绘制淡连接线与 Minimap */
export const templeAnchors: Record<string, ViewportPosition> = {
  gongzhu: { x: 2110, y: 1490 },
  yanshan: { x: 970, y: 820 },
  yongning: { x: 3245, y: 775 },
  shuishen: { x: 930, y: 2180 },
  foguang: { x: 3325, y: 2120 },
};
