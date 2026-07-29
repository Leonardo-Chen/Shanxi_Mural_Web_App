export type CardType = "temple" | "story" | "annotation";

export interface MuralCardBase {
  id: string;
  type: CardType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  depth: number;
  templeId?: string;
  priority?: "high" | "normal" | "low";
}

export interface TempleCardData extends MuralCardBase {
  type: "temple";
  templeId: string;
}

export interface StoryCardData extends MuralCardBase {
  type: "story";
  templeId: string;
  title: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  detailImage: string;
  detailImageAlt: string;
}

export interface AnnotationCardData extends MuralCardBase {
  type: "annotation";
  text: string;
}

export type MuralCardData =
  | TempleCardData
  | StoryCardData
  | AnnotationCardData;

export const muralCards: MuralCardData[] = [
  // ── 公主寺群落（中心） ──
  {
    id: "temple-gongzhu",
    type: "temple",
    templeId: "gongzhu",
    x: 1950,
    y: 1280,
    width: 320,
    height: 420,
    rotation: -1.5,
    depth: 0.9,
    priority: "high",
  },
  {
    id: "story-gongzhu-1",
    type: "story",
    templeId: "gongzhu",
    title: "他为什么站在画面中央？",
    description:
      "中央人物往往代表法会的主尊或关键叙事角色，位置即身份。",
    keywords: ["人物等级", "构图中心", "水陆法会"],
    image: "/images/stories/gongzhu-central.svg",
    imageAlt: "公主寺壁画中央人物",
    detailImage: "/images/stories/gongzhu-central-detail.svg",
    detailImageAlt: "公主寺中央人物壁画细节",
    x: 1680,
    y: 1180,
    width: 200,
    height: 260,
    rotation: 2.8,
    depth: 0.75,
    priority: "high",
  },
  {
    id: "story-gongzhu-2",
    type: "story",
    templeId: "gongzhu",
    title: "壁画里的人物也有等级",
    description:
      "体量、朝向与侍从数量，都在无声地标注着神祇与凡人的位阶。",
    keywords: ["身份标识", "服饰等级", "排列秩序"],
    image: "/images/stories/gongzhu-hierarchy.svg",
    imageAlt: "公主寺壁画中不同等级的人物",
    detailImage: "/images/stories/gongzhu-hierarchy-detail.svg",
    detailImageAlt: "公主寺人物等级细节",
    x: 2280,
    y: 1150,
    width: 180,
    height: 240,
    rotation: -3.2,
    depth: 0.7,
    priority: "normal",
  },
  {
    id: "story-gongzhu-3",
    type: "story",
    templeId: "gongzhu",
    title: "这片祥云正在指向哪里？",
    description:
      "祥云不仅是装饰，它引导视线从一个叙事段落过渡到下一个。",
    keywords: ["祥云纹样", "视觉引导", "空间叙事"],
    image: "/images/stories/gongzhu-cloud.svg",
    imageAlt: "公主寺壁画中的祥云纹样",
    detailImage: "/images/stories/gongzhu-cloud-detail.svg",
    detailImageAlt: "祥云纹样细节",
    x: 2100,
    y: 1580,
    width: 220,
    height: 160,
    rotation: 1.2,
    depth: 0.65,
    priority: "normal",
  },
  {
    id: "story-gongzhu-4",
    type: "story",
    templeId: "gongzhu",
    title: "缺失的部分，原来是什么？",
    description:
      "剥落的颜料与断裂的轮廓，仍能从残存线条中辨认出曾经的仪仗与建筑。",
    keywords: ["壁画修复", "残存痕迹", "颜料层"],
    image: "/images/stories/gongzhu-missing.svg",
    imageAlt: "公主寺壁画剥落与残存部分",
    detailImage: "/images/stories/gongzhu-missing-detail.svg",
    detailImageAlt: "壁画残存细节",
    x: 1820,
    y: 1480,
    width: 190,
    height: 200,
    rotation: -2.5,
    depth: 0.6,
    priority: "low",
  },

  // ── 岩山寺（左上） ──
  {
    id: "temple-yanshan",
    type: "temple",
    templeId: "yanshan",
    x: 820,
    y: 620,
    width: 300,
    height: 400,
    rotation: 2.0,
    depth: 0.85,
    priority: "high",
  },
  {
    id: "story-yanshan-1",
    type: "story",
    templeId: "yanshan",
    title: "宫廷仪仗如何进入佛国？",
    description:
      "岩山寺壁画将宋代宫廷礼制融入佛国叙事，仪仗队列即是权力的可视化。",
    keywords: ["宫廷仪仗", "金代", "线描"],
    image: "/images/stories/yanshan-procession.svg",
    imageAlt: "岩山寺壁画中的宫廷仪仗",
    detailImage: "/images/stories/yanshan-procession-detail.svg",
    detailImageAlt: "仪仗队列细节",
    x: 580,
    y: 780,
    width: 210,
    height: 280,
    rotation: -3.5,
    depth: 0.7,
    priority: "high",
  },
  {
    id: "story-yanshan-2",
    type: "story",
    templeId: "yanshan",
    title: "飞天衣袂上的风",
    description:
      "飞天的飘带与衣纹以极细的线描表现，是金代工笔的巅峰之一。",
    keywords: ["飞天", "线描技法", "衣纹"],
    image: "/images/stories/yanshan-apsara.svg",
    imageAlt: "岩山寺壁画中的飞天",
    detailImage: "/images/stories/yanshan-apsara-detail.svg",
    detailImageAlt: "飞天衣纹细节",
    x: 1050,
    y: 880,
    width: 170,
    height: 230,
    rotation: 3.0,
    depth: 0.65,
    priority: "normal",
  },
  {
    id: "story-yanshan-3",
    type: "story",
    templeId: "yanshan",
    title: "建筑如何框定故事？",
    description:
      "壁画中的楼阁与门阙不仅是背景，它们划分了叙事的空间层次。",
    keywords: ["建筑背景", "空间层次", "宋式营造"],
    image: "/images/stories/yanshan-architecture.svg",
    imageAlt: "岩山寺壁画中的建筑背景",
    detailImage: "/images/stories/yanshan-architecture-detail.svg",
    detailImageAlt: "建筑背景细节",
    x: 720,
    y: 1080,
    width: 200,
    height: 150,
    rotation: -1.8,
    depth: 0.55,
    priority: "low",
  },

  // ── 永宁寺（右上） ──
  {
    id: "temple-yongning",
    type: "temple",
    templeId: "yongning",
    x: 3100,
    y: 580,
    width: 290,
    height: 390,
    rotation: -2.2,
    depth: 0.85,
    priority: "high",
  },
  {
    id: "story-yongning-1",
    type: "story",
    templeId: "yongning",
    title: "宴饮场景里藏着什么？",
    description:
      "明代宴饮壁画不仅记录风俗，也映射出当时社会阶层与礼仪规范。",
    keywords: ["宴饮", "明代风俗", "世俗叙事"],
    image: "/images/stories/yongning-feast.svg",
    imageAlt: "永宁寺壁画宴饮场景",
    detailImage: "/images/stories/yongning-feast-detail.svg",
    detailImageAlt: "宴饮场景细节",
    x: 3380,
    y: 720,
    width: 200,
    height: 260,
    rotation: 2.5,
    depth: 0.7,
    priority: "high",
  },
  {
    id: "story-yongning-2",
    type: "story",
    templeId: "yongning",
    title: "服饰如何讲述身份？",
    description:
      "冠帽、袍服与佩饰的细微差异，是阅读壁画人物身份的第一把钥匙。",
    keywords: ["服饰", "身份", "明代"],
    image: "/images/stories/yongning-costume.svg",
    imageAlt: "永宁寺壁画人物服饰细节",
    detailImage: "/images/stories/yongning-costume-detail.svg",
    detailImageAlt: "服饰细节",
    x: 2850,
    y: 850,
    width: 180,
    height: 240,
    rotation: -3.0,
    depth: 0.65,
    priority: "normal",
  },
  {
    id: "story-yongning-3",
    type: "story",
    templeId: "yongning",
    title: "日常生活也能入画？",
    description:
      "从迎亲到游乐，永宁寺壁画将凡俗日常纳入寺庙空间，形成独特的叙事维度。",
    keywords: ["日常生活", "迎亲", "游乐"],
    image: "/images/stories/yongning-daily.svg",
    imageAlt: "永宁寺壁画日常生活场景",
    detailImage: "/images/stories/yongning-daily-detail.svg",
    detailImageAlt: "日常生活场景细节",
    x: 3200,
    y: 1020,
    width: 190,
    height: 200,
    rotation: 1.5,
    depth: 0.55,
    priority: "low",
  },

  // ── 水神庙（左下） ──
  {
    id: "temple-shuishen",
    type: "temple",
    templeId: "shuishen",
    x: 780,
    y: 1980,
    width: 300,
    height: 400,
    rotation: 1.8,
    depth: 0.85,
    priority: "high",
  },
  {
    id: "story-shuishen-1",
    type: "story",
    templeId: "shuishen",
    title: "戏台上的神祇",
    description:
      "水神庙壁画以元杂剧场景著称，戏曲表演与祭祀仪式在同一墙面交汇。",
    keywords: ["元杂剧", "戏曲", "祭祀"],
    image: "/images/stories/shuishen-opera.svg",
    imageAlt: "水神庙壁画戏曲场景",
    detailImage: "/images/stories/shuishen-opera-detail.svg",
    detailImageAlt: "戏曲场景细节",
    x: 520,
    y: 2120,
    width: 210,
    height: 270,
    rotation: -2.8,
    depth: 0.7,
    priority: "high",
  },
  {
    id: "story-shuishen-2",
    type: "story",
    templeId: "shuishen",
    title: "祈雨仪式如何被描绘？",
    description:
      "从求雨到酬神，壁画以连续场景记录了民间水神信仰的核心仪式。",
    keywords: ["祈雨", "水神信仰", "仪式"],
    image: "/images/stories/shuishen-ritual.svg",
    imageAlt: "水神庙壁画祈雨仪式",
    detailImage: "/images/stories/shuishen-ritual-detail.svg",
    detailImageAlt: "祈雨仪式细节",
    x: 1020,
    y: 2180,
    width: 180,
    height: 230,
    rotation: 3.2,
    depth: 0.65,
    priority: "normal",
  },
  {
    id: "story-shuishen-3",
    type: "story",
    templeId: "shuishen",
    title: "侍从与神祇的间距",
    description:
      "侍从的体量与位置关系，暗示了神祇与人之间的权力与信仰距离。",
    keywords: ["侍从", "神祇", "空间关系"],
    image: "/images/stories/shuishen-attendant.svg",
    imageAlt: "水神庙壁画侍从人物",
    detailImage: "/images/stories/shuishen-attendant-detail.svg",
    detailImageAlt: "侍从人物细节",
    x: 680,
    y: 1780,
    width: 170,
    height: 220,
    rotation: -1.5,
    depth: 0.55,
    priority: "low",
  },

  // ── 佛光寺（右下） ──
  {
    id: "temple-foguang",
    type: "temple",
    templeId: "foguang",
    x: 3180,
    y: 1920,
    width: 290,
    height: 400,
    rotation: -1.8,
    depth: 0.85,
    priority: "high",
  },
  {
    id: "story-foguang-1",
    type: "story",
    templeId: "foguang",
    title: "唐代壁画的留白",
    description:
      "佛光寺早期壁画以简练的线条与有限的设色，呈现不同于后世的审美。",
    keywords: ["唐代", "早期壁画", "简练"],
    image: "/images/stories/foguang-line.svg",
    imageAlt: "佛光寺唐代壁画线条",
    detailImage: "/images/stories/foguang-line-detail.svg",
    detailImageAlt: "唐代线条细节",
    x: 3450,
    y: 2080,
    width: 200,
    height: 260,
    rotation: 2.2,
    depth: 0.7,
    priority: "high",
  },
  {
    id: "story-foguang-2",
    type: "story",
    templeId: "foguang",
    title: "建筑与壁画如何对话？",
    description:
      "东大殿的结构与壁画构图相互呼应，建筑本身就是图像叙事的一部分。",
    keywords: ["建筑", "唐代", "空间"],
    image: "/images/stories/foguang-building.svg",
    imageAlt: "佛光寺建筑与壁画",
    detailImage: "/images/stories/foguang-building-detail.svg",
    detailImageAlt: "建筑与壁画关系",
    x: 2920,
    y: 2100,
    width: 190,
    height: 250,
    rotation: -3.0,
    depth: 0.65,
    priority: "normal",
  },
  {
    id: "story-foguang-3",
    type: "story",
    templeId: "foguang",
    title: "从残存颜色中寻找原貌",
    description:
      "唐代壁画的颜料层历经千年，残存的赭石与石青仍指向最初的辉煌。",
    keywords: ["颜料", "残存", "唐代"],
    image: "/images/stories/foguang-color.svg",
    imageAlt: "佛光寺壁画残存颜料",
    detailImage: "/images/stories/foguang-color-detail.svg",
    detailImageAlt: "残存颜料细节",
    x: 3280,
    y: 1780,
    width: 180,
    height: 200,
    rotation: 1.0,
    depth: 0.55,
    priority: "low",
  },

  // ── 探索提示 ──
  {
    id: "anno-1",
    type: "annotation",
    text: "拖动，继续寻找",
    x: 1500,
    y: 900,
    width: 160,
    height: 40,
    rotation: -2.0,
    depth: 0.3,
    priority: "low",
  },
  {
    id: "anno-2",
    type: "annotation",
    text: "点击人物，查看他的身份",
    x: 2600,
    y: 750,
    width: 200,
    height: 40,
    rotation: 1.5,
    depth: 0.3,
    priority: "low",
  },
  {
    id: "anno-3",
    type: "annotation",
    text: "一幅壁画，不只讲述一个故事",
    x: 1200,
    y: 1680,
    width: 240,
    height: 40,
    rotation: -1.0,
    depth: 0.3,
    priority: "low",
  },
  {
    id: "anno-4",
    type: "annotation",
    text: "从残存的颜色中寻找原来的画面",
    x: 2800,
    y: 1680,
    width: 260,
    height: 40,
    rotation: 2.0,
    depth: 0.3,
    priority: "low",
  },
  {
    id: "anno-5",
    type: "annotation",
    text: "你现在看到的，只是壁画的一部分",
    x: 2100,
    y: 2100,
    width: 260,
    height: 40,
    rotation: -1.5,
    depth: 0.3,
    priority: "low",
  },
];

export const muralCardMap = Object.fromEntries(
  muralCards.map((c) => [c.id, c])
) as Record<string, MuralCardData>;
