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
  {
    id: "duofu",
    name: "多福寺",
    nameEn: "Duofu Temple",
    region: "山西·太原",
    era: "明代",
    tagline: "崛围山间的明代佛传与经变图像",
    description:
      "多福寺壁画以佛传故事与经变题材为主，线条劲健、设色古雅，与晋阳地区的佛教信仰紧密相连。",
    keywords: ["佛传故事", "经变画", "崛围山"],
    image: "/images/temples/duofu.svg",
    imageAlt: "多福寺壁画局部",
    detailImage: "/images/temples/duofu-detail.svg",
    detailImageAlt: "多福寺壁画全景",
      coordinates: [112.429, 37.966],
  },
  {
    id: "longquan",
    name: "龙泉寺",
    nameEn: "Longquan Temple",
    region: "山西·太原",
    era: "明代",
    tagline: "太山悬塑与壁画交织的观音道场",
    description:
      "太山龙泉寺观音堂以悬塑闻名，堂内壁画与立体造像相互呼应，形成极具层次感的宗教视觉空间。",
    keywords: ["悬塑", "观音堂", "明代壁画"],
    image: "/images/temples/longquan.svg",
    imageAlt: "龙泉寺观音堂悬塑与壁画",
    detailImage: "/images/temples/longquan-detail.svg",
    detailImageAlt: "龙泉寺观音堂全景",
    coordinates: [112.436, 37.751],
  },
  {
    id: "huayan",
    name: "华严寺",
    nameEn: "Huayan Temple",
    region: "山西·大同",
    era: "辽金",
    tagline: "辽金巨构下的彩塑与壁画遗存",
    description:
      "华严寺薄伽教藏殿与大雄宝殿内保存大量辽金彩塑，部分殿宇仍留明代重修壁画，见证大同作为辽金陪都的佛教盛景。",
    keywords: ["辽金彩塑", "薄伽教藏殿", "大同"],
    image: "/images/temples/huayan.svg",
    imageAlt: "华严寺殿内彩塑与壁画",
    detailImage: "/images/temples/huayan-detail.svg",
    detailImageAlt: "华严寺大殿全景",
    coordinates: [113.288, 40.091],
  },
  {
    id: "shanhua",
    name: "善化寺",
    nameEn: "Shanhua Temple",
    region: "山西·大同",
    era: "辽金",
    tagline: "古城南门外的辽金佛寺壁画",
    description:
      "善化寺大雄宝殿内清代重修壁画规模可观，与辽金建筑本体相映，呈现大同古城长期的宗教艺术层累。",
    keywords: ["辽金建筑", "清代壁画", "大同古城"],
    image: "/images/temples/shanhua.svg",
    imageAlt: "善化寺大雄宝殿壁画",
    detailImage: "/images/temples/shanhua-detail.svg",
    detailImageAlt: "善化寺大殿全景",
    coordinates: [113.294, 40.086],
  },
  {
    id: "yongan",
    name: "永安寺",
    nameEn: "Yong'an Temple",
    region: "山西·浑源",
    era: "元代",
    tagline: "传法罗汉与十大明王的元代壁画",
    description:
      "永安寺传法殿内元代壁画以十大明王与十八罗汉著称，构图满密、色彩浓烈，是山西元代寺观壁画的代表之作。",
    keywords: ["元代壁画", "十大明王", "浑源"],
    image: "/images/temples/yongan.svg",
    imageAlt: "永安寺传法殿壁画",
    detailImage: "/images/temples/yongan-detail.svg",
    detailImageAlt: "永安寺传法殿全景",
    coordinates: [113.686, 39.701],
  },
  {
    id: "chongfu",
    name: "崇福寺",
    nameEn: "Chongfu Temple",
    region: "山西·朔州",
    era: "金代",
    tagline: "塞上名刹中的金代壁画遗存",
    description:
      "崇福寺弥陀殿内金代壁画与彩塑同存，题材涵盖佛本生故事，是朔州地区现存最重要的古代寺观壁画之一。",
    keywords: ["金代壁画", "弥陀殿", "朔州"],
    image: "/images/temples/chongfu.svg",
    imageAlt: "崇福寺弥陀殿壁画",
    detailImage: "/images/temples/chongfu-detail.svg",
    detailImageAlt: "崇福寺弥陀殿全景",
    coordinates: [112.426, 39.313],
  },
  {
    id: "sandaiwang",
    name: "三大王庙",
    nameEn: "Sandaiwang Temple",
    region: "山西·朔州",
    era: "明清",
    tagline: "桑干河畔的拓跋大王描金壁画",
    description:
      "吉庄三大王庙大王殿内描金壁画将拓跋三王与仪仗队列绘于壁间，汉化的人物形象与云水纹样构成独特的民间信仰图像。",
    keywords: ["描金壁画", "拓跋大王", "桑干河"],
    image: "/images/temples/sandaiwang.svg",
    imageAlt: "三大王庙描金壁画局部",
    detailImage: "/images/temples/sandaiwang-detail.svg",
    detailImageAlt: "三大王庙大王殿壁画",
    coordinates: [112.574, 39.389],
  },
  {
    id: "yunlin",
    name: "云林寺",
    nameEn: "Yunlin Temple",
    region: "山西·平遥",
    era: "明代",
    tagline: "双林胜境中的彩塑与壁绘",
    description:
      "云林寺即平遥双林寺，以千佛殿、菩萨殿等处的悬塑与少量明代壁画著称，彩塑与建筑空间浑然一体。",
    keywords: ["双林寺", "悬塑", "明代壁画"],
    image: "/images/temples/yunlin.svg",
    imageAlt: "云林寺彩塑与壁画",
    detailImage: "/images/temples/yunlin-detail.svg",
    detailImageAlt: "云林寺殿内全景",
    coordinates: [112.125, 37.171],
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
    coordinates: [110.97, 35.6],
  },
  {
    id: "yonglegong",
    name: "永乐宫",
    nameEn: "Yongle Palace",
    region: "山西·芮城",
    era: "元代",
    tagline: "道教三清殿里的《朝元图》巨制",
    description:
      "永乐宫三清殿内《朝元图》满壁神祇朝元，纯阳、重阳诸殿亦存元代壁画，是中国现存最完整的道教宫观壁画群之一。",
    keywords: ["朝元图", "道教壁画", "吕洞宾"],
    image: "/images/temples/yonglegong.svg",
    imageAlt: "永乐宫三清殿朝元图壁画局部",
    detailImage: "/images/temples/yonglegong-detail.svg",
    detailImageAlt: "永乐宫三清殿壁画全景",
    coordinates: [110.688, 34.722],
  },
  {
    id: "shuishen",
    name: "广灵水神堂",
    nameEn: "Guangling Shuishentang",
    region: "山西·广灵",
    era: "清代",
    tagline: "圣母殿东西两壁，画龙母出宫布雨与雨后归宫。",
    description:
      "广灵县壶泉镇壶山水神堂把祈雨写成连续的两壁故事。清代壁画保存在圣母殿：东壁《龙母出宫降雨图》写九江圣母率仪仗出宫；西壁《雨后回宫图》写降雨之后的归程与人间收获。",
    keywords: ["祈雨", "龙母出宫", "清代壁画"],
    image: "/images/temples/shuishen.svg",
    imageAlt: "广灵水神堂圣母殿祈雨壁画",
    detailImage: "/images/temples/shuishen-detail.svg",
    detailImageAlt: "广灵水神堂壁画全景",
    coordinates: [114.279, 39.761],
  },
];

export const templeMap = Object.fromEntries(
  temples.map((t) => [t.id, t])
) as Record<string, Temple>;
