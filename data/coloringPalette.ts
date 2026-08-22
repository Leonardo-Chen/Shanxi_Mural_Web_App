export type PigmentColor = {
  id: string;
  nameZh: string;
  nameEn: string;
  value: string;
};

/** 矿物颜料色板：用于着色交互，不是整页 UI 主题色。 */
export const coloringPalette: PigmentColor[] = [
  {
    id: "cinnabar",
    nameZh: "朱砂",
    nameEn: "Cinnabar Red",
    value: "#A64B3C",
  },
  {
    id: "stone-blue",
    nameZh: "石青",
    nameEn: "Stone Blue",
    value: "#405E6B",
  },
  {
    id: "stone-green",
    nameZh: "石绿",
    nameEn: "Stone Green",
    value: "#596D5A",
  },
  {
    id: "earth-yellow",
    nameZh: "土黄",
    nameEn: "Earth Yellow",
    value: "#C49A5C",
  },
  {
    id: "ink-black",
    nameZh: "烟墨",
    nameEn: "Ink Black",
    value: "#23211E",
  },
  {
    id: "wall-white",
    nameZh: "铅白",
    nameEn: "Wall White",
    value: "#EDE6D8",
  },
  {
    id: "ochre",
    nameZh: "赭石",
    nameEn: "Ochre",
    value: "#A2643E",
  },
  {
    id: "faded-teal",
    nameZh: "青绿",
    nameEn: "Faded Teal",
    value: "#5E7A72",
  },
  {
    id: "smoke-gray",
    nameZh: "烟灰",
    nameEn: "Smoke Gray",
    value: "#8D8A82",
  },
  {
    id: "skin",
    nameZh: "肤色",
    nameEn: "Skin Tone",
    value: "#D5A07A",
  },
];

export const defaultColorId = "cinnabar";

export function getPigmentById(id: string): PigmentColor | undefined {
  return coloringPalette.find((color) => color.id === id);
}

export function getPigmentByValue(value: string): PigmentColor | undefined {
  const normalized = value.toLowerCase();
  return coloringPalette.find((color) => color.value.toLowerCase() === normalized);
}
