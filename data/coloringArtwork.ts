export const coloringArtwork = {
  id: "sanqing-east-deity",
  title: "三清殿东壁·天神",
  titleEn: "COLOR THE MURAL",
  pageTitle: "为神明着色",
  temple: "永乐宫",
  templeId: "yonglegong",
  location: "山西永乐宫",
  lineArtSrc: "/images/coloring/sanqing-line.jpg",
  originalSrc: "/images/coloring/sanqing-original.jpg",
  /** 对比说明：白描与原作非像素对齐 */
  comparisonNote:
    "白描人物与原作局部为参考对应关系，非像素级修复对比。",
  deityIntro: {
    title: "东壁天神",
    body: "三清殿《朝元图》东壁绘诸天朝元仪仗。此天神身着石青长袍、内衬朱砂，冠冕珠帘与手持笏板标示其品级。色彩不仅装饰人物，也帮助观看者辨认身份与层次。",
  },
  muralLink: "/interactive/color-the-mural",
  templeLink: "/?temple=yonglegong",
  hints: [
    "石青常用于人物大面积衣袍，建立视觉上的主要身份。",
    "朱砂与赭石构成画面中的暖色层次，与冷色石青形成对照。",
    "壁画今天看到的颜色，已经经历了数百年的氧化与变化。",
    "颜色也可以帮助观看者辨认人物的品级与仪轨身份。",
    "冠冕珠帘、手持笏板往往是区分尊卑的重要线索。",
  ],
  completionThreshold: 0.6,
  autosaveKey: "shanxi-coloring-sanqing-v1",
} as const;
