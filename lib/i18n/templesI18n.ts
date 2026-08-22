import type { LText } from "./pick";

export type TempleCopy = {
  name: LText;
  tagline: LText;
  description: LText;
};

export const templesI18n: Record<string, TempleCopy> = {
  gongzhu: {
    name: { zh: "公主寺", en: "Gongzhu Temple", it: "Tempio Gongzhu" },
    tagline: {
      zh: "一座隐藏在人物与祥云之间的叙事剧场",
      en: "A narrative theatre hidden among figures and auspicious clouds",
      it: "Un teatro narrativo tra figure e nuvole fauste",
    },
    description: {
      zh: "人物并不是随机排列的。身份、位置、服饰与动作，共同构成了一套可以被阅读的秩序。",
      en: "The figures are not placed at random. Rank, position, costume and gesture form a readable order.",
      it: "Le figure non sono disposte a caso. Grado, posizione, abito e gesto formano un ordine leggibile.",
    },
  },
  yanshan: {
    name: { zh: "岩山寺", en: "Yanshan Temple", it: "Tempio Yanshan" },
    tagline: {
      zh: "文殊道场里的世俗故事与宫廷礼制",
      en: "Court ritual and worldly stories in a Manjusri sanctuary",
      it: "Rito di corte e storie terrene in un santuario di Manjusri",
    },
    description: {
      zh: "岩山寺壁画以精细的线描与设色著称，将佛国叙事与当时社会生活交织在同一面墙。",
      en: "Yanshan’s murals are famed for fine line and colour, weaving Buddhist narrative with the social life of their time.",
      it: "Gli affreschi di Yanshan sono noti per linea e colore fini, e intrecciano la narrazione buddhista con la vita sociale del tempo.",
    },
  },
  foguang: {
    name: { zh: "佛光寺", en: "Foguang Temple", it: "Tempio Foguang" },
    tagline: {
      zh: "唐代遗风与早期佛教图像的珍贵见证",
      en: "A rare witness to Tang style and early Buddhist imagery",
      it: "Una rara testimonianza dello stile Tang e delle prime immagini buddhiste",
    },
    description: {
      zh: "佛光寺东大殿内的壁画与建筑同构，呈现唐代佛教艺术的庄重与简洁，是理解早期壁画的起点。",
      en: "In the East Hall, mural and architecture share one structure: the gravity and economy of Tang Buddhist art.",
      it: "Nella Sala Est affresco e architettura condividono la stessa struttura: gravità ed essenzialità dell’arte buddhista Tang.",
    },
  },
  duofu: {
    name: { zh: "多福寺", en: "Duofu Temple", it: "Tempio Duofu" },
    tagline: {
      zh: "崛围山间的明代佛传与经变图像",
      en: "Ming paintings of the Buddha’s life in the Juewei hills",
      it: "Dipinti Ming della vita del Buddha sui colli Juewei",
    },
    description: {
      zh: "多福寺值得一看，是因为它把佛传故事画进明代中国式的宫室、学堂与山林。大雄宝殿东、西、北三壁的佛传图以题名编号明确，线条劲健、设色古雅。当前照片尚未记录每一铺的精确墙面坐标，具体铺位仍待图录核对。",
      en: "Duofu Temple is worth seeing because the life of the Buddha is recast in Ming Chinese palaces, schools and mountains. The numbered scenes on the Mahavira Hall walls are clearly titled, with vigorous line and antique colour. Precise wall coordinates for each scene remain to be checked against the catalogue.",
      it: "Il Tempio Duofu merita una visita perché la vita del Buddha è tradotta in palazzi, scuole e monti cinesi di epoca Ming. Le scene numerate nella Sala Mahavira hanno titoli chiari, linea vigorosa e colore antico. Le coordinate precise di ogni riquadro restano da verificare sul catalogo.",
    },
  },
  longquan: {
    name: { zh: "龙泉寺", en: "Longquan Temple", it: "Tempio Longquan" },
    tagline: {
      zh: "太山悬塑与壁画交织的观音道场",
      en: "A Guanyin sanctuary where hanging sculpture meets mural",
      it: "Un santuario di Guanyin dove scultura sospesa e affresco si incontrano",
    },
    description: {
      zh: "太山龙泉寺观音堂以悬塑闻名，堂内壁画与立体造像相互呼应，形成极具层次感的宗教视觉空间。",
      en: "The Guanyin hall of Longquan on Taishan is famed for hanging sculpture; mural and statue answer each other in layered space.",
      it: "La sala di Guanyin a Longquan è celebre per le sculture sospese; affresco e statua si rispondono in uno spazio a strati.",
    },
  },
  huayan: {
    name: { zh: "华严寺", en: "Huayan Temple", it: "Tempio Huayan" },
    tagline: {
      zh: "辽金巨构下的彩塑与壁画遗存",
      en: "Painted sculpture and mural remains under Liao–Jin halls",
      it: "Sculture dipinte e resti di affresco sotto le sale Liao–Jin",
    },
    description: {
      zh: "华严寺薄伽教藏殿与大雄宝殿内保存大量辽金彩塑，部分殿宇仍留明代重修壁画，见证大同作为辽金陪都的佛教盛景。",
      en: "Huayan preserves Liao–Jin painted sculpture; some halls still hold Ming restored murals, witnessing Datong as a Buddhist capital.",
      it: "Huayan conserva sculture dipinte Liao–Jin; alcune sale tengono ancora affreschi restaurati in epoca Ming, memoria di Datong capitale buddhista.",
    },
  },
  shanhua: {
    name: { zh: "善化寺", en: "Shanhua Temple", it: "Tempio Shanhua" },
    tagline: {
      zh: "古城南门外的辽金佛寺壁画",
      en: "Liao–Jin temple murals beyond the south gate of the old city",
      it: "Affreschi del tempio Liao–Jin oltre la porta sud della città antica",
    },
    description: {
      zh: "善化寺大雄宝殿内清代重修壁画规模可观，与辽金建筑本体相映，呈现大同古城长期的宗教艺术层累。",
      en: "Qing restorations in Shanhua’s Mahavira Hall sit within Liao–Jin architecture, layering Datong’s long religious art history.",
      it: "I restauri Qing nella Sala Mahavira di Shanhua convivono con l’architettura Liao–Jin, stratificando la storia religiosa di Datong.",
    },
  },
  yongan: {
    name: { zh: "永安寺", en: "Yong'an Temple", it: "Tempio Yong'an" },
    tagline: {
      zh: "传法罗汉与十大明王的元代壁画",
      en: "Yuan murals of arhats transmitting the dharma and the Ten Bright Kings",
      it: "Affreschi Yuan di arhat e dei Dieci Re Luminosi",
    },
    description: {
      zh: "永安寺传法殿内元代壁画以十大明王与十八罗汉著称，构图满密、色彩浓烈，是山西元代寺观壁画的代表之作。",
      en: "The Yuan murals in Yong’an’s Transmission Hall are famed for the Ten Bright Kings and Eighteen Arhats: dense, intense, a Shanxi masterpiece.",
      it: "Gli affreschi Yuan nella Sala della Trasmissione di Yong’an sono celebri per i Dieci Re Luminosi e i diciotto arhat: densi, intensi, un capolavoro dello Shanxi.",
    },
  },
  chongfu: {
    name: { zh: "崇福寺", en: "Chongfu Temple", it: "Tempio Chongfu" },
    tagline: {
      zh: "塞上名刹中的金代壁画遗存",
      en: "Jin-dynasty mural remains in a famous frontier monastery",
      it: "Resti di affresco Jin in un famoso monastero di frontiera",
    },
    description: {
      zh: "崇福寺弥陀殿内金代壁画与彩塑同存，题材涵盖佛本生故事，是朔州地区现存最重要的古代寺观壁画之一。",
      en: "Jin murals and painted sculpture survive together in Chongfu’s Amitabha Hall, among Shuozhou’s most important temple paintings.",
      it: "Affreschi Jin e sculture dipinte convivono nella Sala di Amitabha a Chongfu, tra i dipinti templari più importanti di Shuozhou.",
    },
  },
  sandaiwang: {
    name: { zh: "三大王庙", en: "Sandaiwang Temple", it: "Tempio Sandaiwang" },
    tagline: {
      zh: "桑干河畔的拓跋大王描金壁画",
      en: "Gilded murals of the Tuoba kings beside the Sanggan River",
      it: "Affreschi dorati dei re Tuoba lungo il fiume Sanggan",
    },
    description: {
      zh: "吉庄三大王庙大王殿内描金壁画将拓跋三王与仪仗队列绘于壁间，汉化的人物形象与云水纹样构成独特的民间信仰图像。",
      en: "Gilded murals in the Kings’ Hall paint the three Tuoba kings and their retinue: Sinicised figures and cloud-and-water patterns of folk faith.",
      it: "Gli affreschi dorati nella Sala dei Re dipingono i tre re Tuoba e il seguito: figure sinizzate e motivi di nubi e acque della fede popolare.",
    },
  },
  yunlin: {
    name: { zh: "云林寺", en: "Yunlin Temple", it: "Tempio Yunlin" },
    tagline: {
      zh: "双林胜境中的彩塑与壁绘",
      en: "Painted sculpture and mural in the Shuanglin precinct",
      it: "Scultura dipinta e affresco nel recinto di Shuanglin",
    },
    description: {
      zh: "云林寺即平遥双林寺，以千佛殿、菩萨殿等处的悬塑与少量明代壁画著称，彩塑与建筑空间浑然一体。",
      en: "Yunlin is Pingyao’s Shuanglin Temple, famed for hanging sculpture and a few Ming murals fused with architectural space.",
      it: "Yunlin è il Tempio Shuanglin di Pingyao, noto per sculture sospese e pochi affreschi Ming fusi con lo spazio architettonico.",
    },
  },
  yongning: {
    name: { zh: "永宁寺", en: "Yongning Temple", it: "Tempio Yongning" },
    tagline: {
      zh: "市井与神祇共处的墙面叙事",
      en: "Street life and deities sharing the same wall",
      it: "Vita di piazza e divinità sulla stessa parete",
    },
    description: {
      zh: "永宁寺壁画保留了大量日常生活场景，从迎亲送嫁到宴饮游乐，是观察明代民间信仰的窗口。",
      en: "Yongning’s murals keep daily life—weddings, banquets, play—as a window onto Ming popular belief.",
      it: "Gli affreschi di Yongning conservano la vita quotidiana — nozze, banchetti, giochi — come finestra sulla fede popolare Ming.",
    },
  },
  yonglegong: {
    name: { zh: "永乐宫", en: "Yongle Palace", it: "Palazzo Yongle" },
    tagline: {
      zh: "道教三清殿里的《朝元图》巨制",
      en: "The monumental Chaoyuan assembly in the Daoist Hall of the Three Pure Ones",
      it: "La monumentale assemblea Chaoyuan nella Sala daoista dei Tre Puri",
    },
    description: {
      zh: "永乐宫值得一看，是因为它保存了中国现存最完整的道教宫观壁画群之一。三清殿《朝元图》满壁神祇朝向元始天尊；纯阳殿则把吕洞宾的显化故事画进市井、寺院与院落。精确墙面方位仍需对照原始全景图核对，部分局部主尊不宜仅凭冠服定名。",
      en: "Yongle Palace is worth seeing as one of China’s most complete surviving Daoist mural cycles. Chaoyuan Tu fills the Hall of the Three Pure Ones with deities processing toward the Primordial Heavenly Worthy; the Hall of Pure Yang tells Lü Dongbin’s manifestations in streets, monasteries and courtyards. Exact wall positions still need the original panorama, and some principal figures should not be named from costume alone.",
      it: "Il Palazzo Yongle merita una visita come uno dei cicli murali daoisti più completi conservati in Cina. Il Chaoyuan Tu riempie la Sala dei Tre Puri di divinità in corteo verso il Venerabile Celeste Primordiale; la Sala del Puro Yang racconta le manifestazioni di Lü Dongbin in strade, monasteri e cortili. Le posizioni esatte delle pareti restano da confrontare con il panorama originale, e alcuni protagonisti non vanno nominati solo dall’abito.",
    },
  },
  shuishen: {
    name: {
      zh: "广灵水神堂",
      en: "Guangling Shuishentang (Water God Temple)",
      it: "Shuishentang di Guangling (Tempio del Dio dell’Acqua)",
    },
    tagline: {
      zh: "圣母殿东西两壁，画龙母出宫布雨与雨后归宫。",
      en: "On the east and west walls of the Hall of the Holy Mother, the Dragon Mother leaves to bring rain, then returns.",
      it: "Sulle pareti est e ovest della Sala della Santa Madre, la Madre Drago parte per portare la pioggia e poi rientra.",
    },
    description: {
      zh: "广灵县壶泉镇壶山水神堂值得一看，是因为它把祈雨写成连续的两壁故事。清代壁画保存在圣母殿：东壁《龙母出宫降雨图》写九江圣母率仪仗出宫；西壁《雨后回宫图》写降雨之后的归程与人间收获。殿宇和墙面位置已经确认；部分随从神祇的身份仍是候选名称。",
      en: "Guangling Shuishentang is worth seeing because rain-making is told across two facing walls. Qing murals survive in the Hall of the Holy Mother: the east wall shows the Holy Mother of the Nine Rivers leaving the Crystal Palace; the west wall follows the return after rain and the harvest below. The hall and wall positions are confirmed; some attendant deities remain proposed identifications.",
      it: "Lo Shuishentang di Guangling merita una visita perché la preghiera per la pioggia si legge su due pareti contrapposte. Gli affreschi Qing restano nella Sala della Santa Madre: a est la Santa Madre dei Nove Fiumi lascia il Palazzo di Cristallo; a ovest si vede il ritorno dopo la pioggia e il raccolto in terra. Sala e pareti sono confermate; alcune identità del seguito restano attribuzioni proposte.",
    },
  },
};
