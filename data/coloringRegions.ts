import { rgbToLab } from "@/utils/colorConversion";

export type RegionShape =
  | { type: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { type: "rect"; x: number; y: number; w: number; h: number };

export interface ColoringRegion {
  id: string;
  name: string;
  maskImage?: string;
  shape?: RegionShape;
  referenceColor: string;
  referenceLab: [number, number, number];
  weight: number;
  culturalNote: string;
  optionalParentRegion?: string;
}

function lab(hex: string): [number, number, number] {
  return rgbToLab(hex);
}

/**
 * 区域顺序：数组靠前 = 绘制层级越上 = 点击命中优先（小脸、手、笏板等在前）
 * 坐标为归一化 0–1，对应 716×1024 白描人物
 */
export const coloringRegions: ColoringRegion[] = [
  {
    id: "face",
    name: "面部",
    shape: { type: "ellipse", cx: 0.5, cy: 0.255, rx: 0.065, ry: 0.048 },
    referenceColor: "#D4B08C",
    referenceLab: lab("#D4B08C"),
    weight: 0.07,
    culturalNote: "肤色经数百年氧化，呈现暖褐调。",
  },
  {
    id: "hands",
    name: "双手",
    shape: { type: "ellipse", cx: 0.5, cy: 0.395, rx: 0.1, ry: 0.048 },
    referenceColor: "#D4B08C",
    referenceLab: lab("#D4B08C"),
    weight: 0.05,
    culturalNote: "持笏之手，肤色略深于面部。",
  },
  {
    id: "tablet",
    name: "笏板",
    shape: { type: "rect", x: 0.465, y: 0.355, w: 0.07, h: 0.125 },
    referenceColor: "#3D7A5C",
    referenceLab: lab("#3D7A5C"),
    weight: 0.05,
    culturalNote: "石绿笏板，象征朝元仪轨身份。",
  },
  {
    id: "crown_beads",
    name: "冠冕珠帘",
    shape: { type: "ellipse", cx: 0.5, cy: 0.215, rx: 0.14, ry: 0.048 },
    referenceColor: "#C4A066",
    referenceLab: lab("#C4A066"),
    weight: 0.05,
    culturalNote: "珠帘垂于冠前后，强化仪轨感。",
  },
  {
    id: "crown_board",
    name: "冕冠板",
    shape: { type: "rect", x: 0.38, y: 0.125, w: 0.24, h: 0.045 },
    referenceColor: "#3D7A5C",
    referenceLab: lab("#3D7A5C"),
    weight: 0.04,
    culturalNote: "平顶冕冠，标示天神品级。",
  },
  {
    id: "beard",
    name: "胡须",
    shape: { type: "ellipse", cx: 0.5, cy: 0.305, rx: 0.075, ry: 0.065 },
    referenceColor: "#3A3530",
    referenceLab: lab("#3A3530"),
    weight: 0.05,
    culturalNote: "烟墨长须，与面部形成层次。",
  },
  {
    id: "hair",
    name: "发髻",
    shape: { type: "ellipse", cx: 0.5, cy: 0.195, rx: 0.055, ry: 0.035 },
    referenceColor: "#3A3530",
    referenceLab: lab("#3A3530"),
    weight: 0.03,
    culturalNote: "发髻收拢于冠下。",
  },
  {
    id: "inner_robe",
    name: "内层衣饰",
    shape: { type: "ellipse", cx: 0.5, cy: 0.48, rx: 0.12, ry: 0.14 },
    referenceColor: "#8B352E",
    referenceLab: lab("#8B352E"),
    weight: 0.1,
    culturalNote: "朱砂内层，与外层石青形成冷暖对照。",
  },
  {
    id: "collar",
    name: "衣领",
    shape: { type: "ellipse", cx: 0.5, cy: 0.355, rx: 0.09, ry: 0.035 },
    referenceColor: "#6E2E28",
    referenceLab: lab("#6E2E28"),
    weight: 0.04,
    culturalNote: "暗红衣领勾勒颈部层次。",
  },
  {
    id: "sash",
    name: "腰带绶带",
    shape: { type: "ellipse", cx: 0.5, cy: 0.575, rx: 0.11, ry: 0.038 },
    referenceColor: "#C4A066",
    referenceLab: lab("#C4A066"),
    weight: 0.04,
    culturalNote: "土黄绶带与流苏点缀腰间。",
  },
  {
    id: "robe_trim",
    name: "衣缘纹样",
    shape: { type: "ellipse", cx: 0.5, cy: 0.56, rx: 0.22, ry: 0.26 },
    referenceColor: "#6E2E28",
    referenceLab: lab("#6E2E28"),
    weight: 0.06,
    culturalNote: "衣缘暗红勾边，强化衣纹结构。",
    optionalParentRegion: "outer_robe_body",
  },
  {
    id: "outer_robe_body",
    name: "长袍主体",
    shape: { type: "ellipse", cx: 0.5, cy: 0.56, rx: 0.2, ry: 0.22 },
    referenceColor: "#167F91",
    referenceLab: lab("#167F91"),
    weight: 0.14,
    culturalNote: "石青长袍构成人物最主要视觉身份。",
  },
  {
    id: "sleeve_left",
    name: "左袖",
    shape: { type: "ellipse", cx: 0.32, cy: 0.48, rx: 0.1, ry: 0.18 },
    referenceColor: "#167F91",
    referenceLab: lab("#167F91"),
    weight: 0.06,
    culturalNote: "宽大左袖，石青主色。",
  },
  {
    id: "sleeve_right",
    name: "右袖",
    shape: { type: "ellipse", cx: 0.68, cy: 0.48, rx: 0.1, ry: 0.18 },
    referenceColor: "#167F91",
    referenceLab: lab("#167F91"),
    weight: 0.06,
    culturalNote: "宽大右袖，与左袖对称。",
  },
  {
    id: "robe_hem",
    name: "袍摆",
    shape: { type: "ellipse", cx: 0.5, cy: 0.72, rx: 0.18, ry: 0.055 },
    referenceColor: "#1A6B7A",
    referenceLab: lab("#1A6B7A"),
    weight: 0.04,
    culturalNote: "袍摆折线处色深，形成体积感。",
  },
  {
    id: "shoes",
    name: "鞋履",
    shape: { type: "ellipse", cx: 0.5, cy: 0.795, rx: 0.13, ry: 0.04 },
    referenceColor: "#6B7F82",
    referenceLab: lab("#6B7F82"),
    weight: 0.03,
    culturalNote: "青灰鞋面，与长袍冷色呼应。",
  },
  {
    id: "canopy",
    name: "仪仗华盖",
    shape: { type: "rect", x: 0.58, y: 0.08, w: 0.06, h: 0.55 },
    referenceColor: "#6B7F82",
    referenceLab: lab("#6B7F82"),
    weight: 0.03,
    culturalNote: "身后仪仗垂杆，标示朝元队列。",
  },
  {
    id: "clouds_center",
    name: "中央祥云",
    shape: { type: "ellipse", cx: 0.5, cy: 0.885, rx: 0.22, ry: 0.055 },
    referenceColor: "#A2643E",
    referenceLab: lab("#A2643E"),
    weight: 0.05,
    culturalNote: "赭石祥云承托天神。",
  },
  {
    id: "clouds_left",
    name: "左侧祥云",
    shape: { type: "ellipse", cx: 0.28, cy: 0.9, rx: 0.16, ry: 0.05 },
    referenceColor: "#C4A066",
    referenceLab: lab("#C4A066"),
    weight: 0.04,
    culturalNote: "土黄云纹，画面暖色基座。",
  },
  {
    id: "clouds_right",
    name: "右侧祥云",
    shape: { type: "ellipse", cx: 0.72, cy: 0.9, rx: 0.16, ry: 0.05 },
    referenceColor: "#C4A066",
    referenceLab: lab("#C4A066"),
    weight: 0.04,
    culturalNote: "与左侧云纹对称，稳定构图。",
  },
];

export const regionCount = coloringRegions.length;

export function regionIdToRgb(index: number): [number, number, number] {
  return [(index + 1) & 0xff, ((index + 1) >> 8) & 0xff, 0];
}

export function rgbToRegionId(r: number, g: number, b: number): number | null {
  if (b !== 0) return null;
  const id = r + (g << 8) - 1;
  if (id < 0 || id >= coloringRegions.length) return null;
  return id;
}

export function getRegionName(index: number | null): string | null {
  if (index == null || index < 0 || index >= coloringRegions.length) return null;
  return coloringRegions[index].name;
}
