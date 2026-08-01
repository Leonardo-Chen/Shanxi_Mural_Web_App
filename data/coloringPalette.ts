export interface PaletteColor {
  id: string;
  name: string;
  hex: string;
  source: string;
  /** 0–1, for UI texture preview */
  texture?: number;
}

/** 从永乐宫三清殿东壁原作提取的传统矿物色（留存状态） */
export const coloringPalette: PaletteColor[] = [
  {
    id: "shiqing",
    name: "石青",
    hex: "#167F91",
    source: "外层长袍主色，矿物蓝绿",
    texture: 0.35,
  },
  {
    id: "kongque",
    name: "孔雀蓝",
    hex: "#1A6B7A",
    source: "衣饰冷色层次",
    texture: 0.3,
  },
  {
    id: "shilv",
    name: "石绿",
    hex: "#3D7A5C",
    source: "内层与手持物",
    texture: 0.28,
  },
  {
    id: "qinghui",
    name: "青灰",
    hex: "#6B7F82",
    source: "阴影与退晕",
    texture: 0.25,
  },
  {
    id: "zhusha",
    name: "朱砂",
    hex: "#8B352E",
    source: "内层暖色衣饰",
    texture: 0.32,
  },
  {
    id: "anhong",
    name: "暗红",
    hex: "#6E2E28",
    source: "衣缘与深部",
    texture: 0.3,
  },
  {
    id: "zheshi",
    name: "赭石",
    hex: "#A2643E",
    source: "祥云与肤色基调",
    texture: 0.4,
  },
  {
    id: "tuhuang",
    name: "土黄",
    hex: "#C4A066",
    source: "云纹与高光",
    texture: 0.38,
  },
  {
    id: "fuse",
    name: "肤色",
    hex: "#D4B08C",
    source: "面部与手部",
    texture: 0.22,
  },
  {
    id: "yanmo",
    name: "烟墨",
    hex: "#3A3530",
    source: "发须与线描阴影",
    texture: 0.15,
  },
  {
    id: "qianbai",
    name: "铅白",
    hex: "#E8E2D4",
    source: "高光与留白",
    texture: 0.1,
  },
  {
    id: "canbi",
    name: "残壁灰",
    hex: "#9A9488",
    source: "老化与剥落痕迹",
    texture: 0.45,
  },
];

export const defaultColorId = "shiqing";
