import type { Temple } from "./temples";
import { temples } from "./temples";

/** 地图上可点击的寺庙点位（不按行政区面点击进入） */
export const mapTempleIds = temples.map((t) => t.id);

export function getMapTemples(): Temple[] {
  return temples;
}

/**
 * 寺庙所属地级市（与 geojson.cn 山西 140000 市级要素 name 对齐）
 */
export const templePrefecture: Record<string, string> = {
  gongzhu: "忻州",
  yanshan: "忻州",
  foguang: "忻州",
  duofu: "太原",
  longquan: "太原",
  huayan: "大同",
  shanhua: "大同",
  yongan: "大同",
  chongfu: "朔州",
  sandaiwang: "朔州",
  yunlin: "晋中",
  yongning: "运城",
  yonglegong: "运城",
  shuishen: "大同",
};

/** 有寺庙分布的地市集合 */
export const prefecturesWithTemples = new Set(
  Object.values(templePrefecture)
);

/**
 * 各地市填充色（纸色体系内的低饱和区分色）
 * highlight 用于悬停高亮；side 用于伪 3D 挤出侧面
 */
export const prefectureColors: Record<
  string,
  { fill: string; highlight: string; side: string }
> = {
  太原: { fill: "#E8DCC8", highlight: "#F2E8D6", side: "#B8A890" },
  大同: { fill: "#D9CFC0", highlight: "#E8DFD2", side: "#A89E8E" },
  阳泉: { fill: "#D5D8C8", highlight: "#E4E6D8", side: "#9FA48E" },
  长治: { fill: "#E2D2BE", highlight: "#EEE2D0", side: "#B09A7E" },
  晋城: { fill: "#D8CBB5", highlight: "#E8DCC8", side: "#A6947A" },
  朔州: { fill: "#D2D6D0", highlight: "#E2E5E0", side: "#959A92" },
  晋中: { fill: "#E0D0B8", highlight: "#ECDFC8", side: "#B09A7C" },
  运城: { fill: "#E4C9B4", highlight: "#F0D9C4", side: "#B89278" },
  忻州: { fill: "#D4CFC4", highlight: "#E6E1D6", side: "#9E9788" },
  临汾: { fill: "#DCC6B0", highlight: "#EAD6C2", side: "#A8886E" },
  吕梁: { fill: "#CFD4C6", highlight: "#E0E4D8", side: "#929A88" },
};

export function getPrefectureColor(name: string) {
  return (
    prefectureColors[name] ?? {
      fill: "#E6DFD2",
      highlight: "#EEE8DC",
      side: "#A89E8E",
    }
  );
}
