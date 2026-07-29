export interface Temple {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  era: string;
  tagline: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  detailImage: string;
  detailImageAlt: string;
  /** [lng, lat] WGS84，地图标注用近似坐标 */
  coordinates: [number, number];
}

export const temples: Temple[] = [
  {
    id: "gongzhu",
    name: "公主寺",
    nameEn: "Gongzhu Temple",
    region: "山西·繁峙",
    era: "明代",
    tagline: "一座隐藏在人物与祥云之间的叙事剧场",
    description:
      "人物并不是随机排列的。身份、位置、服饰与动作，共同构成了一套可以被阅读的秩序。",
    keywords: ["人物关系", "水陆法会", "明代壁画"],
    image: "/images/temples/gongzhu.svg",
    imageAlt: "公主寺水陆壁画局部，人物排列有序",
    detailImage: "/images/temples/gongzhu-detail.svg",
    detailImageAlt: "公主寺水陆壁画全景细节",
    coordinates: [113.26, 39.18],
  },
  {
    id: "yanshan",
    name: "岩山寺",
    nameEn: "Yanshan Temple",
    region: "山西·繁峙",
    era: "金代",
    tagline: "文殊道场里的世俗故事与宫廷礼制",
    description:
      "岩山寺壁画以精细的线描与设色著称，将佛国叙事与当时社会生活交织在同一面墙。",
    keywords: ["金代壁画", "文殊信仰", "宫廷仪仗"],
    image: "/images/temples/yanshan.svg",
    imageAlt: "岩山寺壁画局部，金代设色与线描",
    detailImage: "/images/temples/yanshan-detail.svg",
    detailImageAlt: "岩山寺壁画全景",
    coordinates: [113.45, 39.05],
  },
  {
    id: "yongning",
    name: "永宁寺",
    nameEn: "Yongning Temple",
    region: "山西·稷山",
    era: "明代",
    tagline: "市井与神祇共处的墙面叙事",
    description:
      "永宁寺壁画保留了大量日常生活场景，从迎亲送嫁到宴饮游乐，是观察明代民间信仰的窗口。",
    keywords: ["世俗生活", "明代风俗", "宴饮场景"],
    image: "/images/temples/yongning.svg",
    imageAlt: "永宁寺壁画中的世俗生活场景",
    detailImage: "/images/temples/yongning-detail.svg",
    detailImageAlt: "永宁寺壁画全景细节",
    coordinates: [110.97, 35.60],
  },
  {
    id: "shuishen",
    name: "水神庙",
    nameEn: "Shuishen Temple",
    region: "山西·洪洞",
    era: "元代",
    tagline: "祈雨仪式与戏剧舞台的交汇",
    description:
      "水神庙壁画以元杂剧题材闻名，将戏曲表演、祭祀仪式与神话叙事绘制于同一空间。",
    keywords: ["元杂剧", "祈雨信仰", "戏剧壁画"],
    image: "/images/temples/shuishen.svg",
    imageAlt: "水神庙壁画中的戏剧表演场景",
    detailImage: "/images/temples/shuishen-detail.svg",
    detailImageAlt: "水神庙壁画全景",
    coordinates: [111.67, 36.25],
  },
  {
    id: "foguang",
    name: "佛光寺",
    nameEn: "Foguang Temple",
    region: "山西·五台",
    era: "唐代",
    tagline: "唐代遗风与早期佛教图像的珍贵见证",
    description:
      "佛光寺东大殿内的壁画与建筑同构，呈现唐代佛教艺术的庄重与简洁，是理解早期壁画的起点。",
    keywords: ["唐代壁画", "佛教建筑", "早期图像"],
    image: "/images/temples/foguang.svg",
    imageAlt: "佛光寺唐代壁画局部",
    detailImage: "/images/temples/foguang-detail.svg",
    detailImageAlt: "佛光寺壁画与建筑内部",
    coordinates: [113.44, 38.87],
  },
];

export const templeMap = Object.fromEntries(
  temples.map((t) => [t.id, t])
) as Record<string, Temple>;
