import type { MuralOverlay, Pair } from "./pick";
import { yongleOverlays } from "./muralsOverlayYongle";

export const muralOverlays: Record<string, MuralOverlay> = {
  "lm-m01": {
    title: {
      en: "The Dragon Mother Leaves the Palace to Bring Rain",
      it: "La Madre Drago lascia il palazzo per portare la pioggia",
    },
    displayTitle: {
      en: "The Dragon Mother Leaves the Palace to Bring Rain",
      it: "La Madre Drago lascia il palazzo per portare la pioggia",
    },
    summary: {
      en: "Painted in the Qing dynasty on the east wall of the Hall of the Holy Mother at Guangling Shuishentang, this mural shows the Holy Mother of the Nine Rivers leaving the Crystal Palace to bring rain. Leigong, a mirror-bearing goddess, a wind-bag deity, dragon riders, officials and aquatic beings form an extensive celestial procession. Travellers, porters and animals below connect the divine action with everyday life on earth.",
      it: "Dipinto in epoca Qing sulla parete orientale della Sala della Santa Madre dello Shuishentang di Guangling, l’affresco mostra la Santa Madre dei Nove Fiumi mentre lascia il Palazzo di Cristallo per portare la pioggia. Leigong, una dea con specchi, una divinità con il sacco del vento, cavalieri di draghi, funzionari ed esseri acquatici formano un ampio corteo celeste. Nella parte inferiore, viandanti, portatori e animali collegano l’azione divina alla vita quotidiana.",
    },
    detailedDescription: {
      en: "The painting centres on the Holy Mother leaving the palace to bring rain. Above and in the middle unfolds a vast divine procession: the Dragon Mother with maids, crystal-palace furnishings and carriages, followed by Thunder Lord, the four-eyed rain-measuring god, the mirror-bearing goddess, the wind-bag deity, dragon-riding generals, officials, water spirits and mountain gods. Below, people travel by donkey and horse, carry loads, hold umbrellas and drive livestock—linking heaven’s rain-making to life on the ground. It is not only a parade of gods, but a continuous story from prayer and departure to the spreading of clouds and rain.",
      it: "Il dipinto ha al centro la Santa Madre che esce a portare la pioggia. In alto e al centro si apre un vasto corteo divino: la Madre Drago con ancelle, arredi del palazzo di cristallo e carri, seguita dal Signore del tuono, dal dio dai quattro occhi che misura la pioggia, dalla dea con gli specchi, dalla divinità del sacco di vento, dai generali a cavallo di draghi, dagli ufficiali e dagli spiriti delle acque. In basso viandanti, asini, cavalli e bestiame legano il rito celeste alla vita sulla terra. Non è solo una parata di dèi, ma una narrazione continua dalla preghiera alla pioggia.",
    },
    readingGuide: [
      {
        en: "First look at the Dragon Mother and the crystal-palace retinue",
        it: "Guarda prima la Madre Drago e il seguito del palazzo di cristallo",
      },
      {
        en: "Then pick out the weather gods of thunder, lightning, wind and rain",
        it: "Poi riconosci gli dèi del tuono, del lampo, del vento e della pioggia",
      },
      {
        en: "Finally watch how people and animals below respond to the rain",
        it: "Infine osserva come uomini e animali in basso reagiscono alla pioggia",
      },
    ],
    location: {
      en: "Water God Temple, Huquan, Guangling, Datong, Shanxi — east wall of the Holy Mother Hall",
      it: "Tempio del Dio dell'Acqua, Huquan, Guangling, Datong, Shanxi — parete est della Sala della Santa Madre",
    },
    locationPrecision: {
      en: "Hall and east wall are certain; some attendant deities remain candidate identifications.",
      it: "Sala e parete est sono certe; alcune divinità del seguito restano identificazioni candidate.",
    },
  },
  "lm-m02": {
    title: {
      en: "Return to the Palace after the Rain",
      it: "Ritorno al palazzo dopo la pioggia",
    },
    displayTitle: {
      en: "Return to the Palace after the Rain",
      it: "Ritorno al palazzo dopo la pioggia",
    },
    summary: {
      en: "When the rain is done, the Dragon Mother returns to the crystal palace with weather gods, dragon kings, water spirits and the retinue; the painting also shows farming, homecoming and harvest after the rain.",
      it: "Finita la pioggia, la Madre Drago rientra nel palazzo di cristallo con gli dèi del tempo, i re draghi e gli spiriti delle acque; il dipinto mostra anche lavoro nei campi, ritorno a casa e raccolto.",
    },
    detailedDescription: {
      en: "This mural shows the journey home after the rain. The Dragon Mother returns with mounted deities, Thunder Lord, the rain-measuring god, the recording official, rainbow children, water spirits and the retinue—calmer than the departure. Rainbows, harvest, porters and villagers going home show that rain has already blessed the land. A bound hybrid figure may relate to the drought demon Droughtghoul, but the identity still needs inscriptions or catalogues.",
      it: "L’affresco mostra il ritorno dopo la pioggia. La Madre Drago rientra con divinità a cavallo, il Signore del tuono, il dio che misura la pioggia, lo scriba, i fanciulli dell’arcobaleno e gli spiriti delle acque — più calma della partenza. Arcobaleni, raccolto e villaggi dicono che la pioggia ha già benedetto la terra. Una figura ibrida legata potrebbe alludere al demone della siccità, ma l’identità resta da confermare.",
    },
    readingGuide: [
      {
        en: "First find the returning Dragon Mother and her retinue",
        it: "Trova prima la Madre Drago che rientra e il suo seguito",
      },
      {
        en: "Watch the rainbow after rain and the weather gods drawing the storm to a close",
        it: "Osserva l’arcobaleno e gli dèi che chiudono la tempesta",
      },
      {
        en: "Finally read the farming, carrying and village homecoming",
        it: "Infine leggi il lavoro nei campi, i trasporti e il ritorno al villaggio",
      },
    ],
    location: {
      en: "Water God Temple, Huquan, Guangling, Datong, Shanxi — west wall of the Holy Mother Hall",
      it: "Tempio del Dio dell'Acqua, Huquan, Guangling, Datong, Shanxi — parete ovest della Sala della Santa Madre",
    },
    locationPrecision: {
      en: "Hall and west wall are certain; Droughtghoul, Wind Aunt and Lightning Mother remain candidate names.",
      it: "Sala e parete ovest sono certe; siccità, Zia del vento e Madre del lampo restano nomi candidati.",
    },
  },
  "df-m01": {
    title: { en: "Scene 52: The Demon Army Attacks the Buddha", it: "Scena 52: L’esercito demoniaco assale il Buddha" },
    displayTitle: { en: "52 · The Demon Army Attacks the Buddha", it: "52 · L’esercito demoniaco assale il Buddha" },
    summary: {
      en: "Māra leads his host with weapons, threats and chaos to stop the Buddha’s awakening; the Buddha sits unmoved, meeting motion with stillness.",
      it: "Māra guida la schiera con armi, minacce e caos per impedire il risveglio; il Buddha siede immobile e oppone la quiete al movimento.",
    },
    detailedDescription: {
      en: "As Siddhartha is about to awaken under the Bodhi tree, Māra leads many-armed demons, spear-bearers, flying demons and beast-headed imps to shake his will. The Buddha sits at the stable centre, cross-legged and still, while the host whirls around him in exaggerated poses and flying sashes. Stillness at the centre meets motion at the rim: the awakened one has already passed beyond fear, desire and temptation.",
      it: "Mentre Siddhartha sta per risvegliarsi sotto l’albero della Bodhi, Māra guida demoni dalle molte braccia, lancieri, demoni volanti e spiriti a testa di belva. Il Buddha siede al centro, fermo, mentre la schiera ruota intorno. La quiete del centro incontra il moto del bordo: il risvegliato ha già superato paura, desiderio e tentazione.",
    },
    readingGuide: [
      { en: "First look at the Buddha sitting still at the centre", it: "Guarda prima il Buddha fermo al centro" },
      { en: "Then pick out the different demons and weapons around him", it: "Poi distingui i demoni e le armi intorno" },
      { en: "Compare the Buddha’s stable outline with the spinning army", it: "Confronta il contorno stabile del Buddha con l’esercito in rotazione" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan, Shanxi — scene 52 of the Life of the Buddha in the Mahavira Hall",
      it: "Tempio Duofu, monte Juewei, Taiyuan, Shanxi — scena 52 della Vita del Buddha nella Sala Mahavira",
    },
    locationPrecision: {
      en: "Title and number are certain; this photograph does not record the exact wall coordinate.",
      it: "Titolo e numero sono certi; la foto non registra la coordinata esatta della parete.",
    },
  },
  "df-m02": {
    title: { en: "Scene 43: Meditation in the Snow Mountains", it: "Scena 43: Meditazione sulle montagne innevate" },
    displayTitle: { en: "43 · Meditation in the Snow Mountains", it: "43 · Meditazione sulle montagne innevate" },
    summary: {
      en: "After leaving the palace the prince meditates among pines, rocks and clouds in the snow mountains.",
      it: "Lasciato il palazzo, il principe medita tra pini, rocce e nubi sulle montagne innevate.",
    },
    detailedDescription: {
      en: "The prince leaves the palace to practise in the mountains, sitting in meditation among snow peaks and old pines. He looks small in the vast landscape, stressing solitude after court life. Rock, tree, cloud and figure are not decoration but the state of practice: the colder the scene, the sharper the inward focus.",
      it: "Il principe lascia il palazzo e siede in meditazione tra cime innevate e pini antichi. Nella vastità del paesaggio appare piccolo, a sottolineare la solitudine. Roccia, albero, nube e figura non sono decoro ma lo stato della pratica.",
    },
    readingGuide: [
      { en: "First read the setting through snow peaks and old pines", it: "Leggi prima l’ambiente dalle cime e dai pini" },
      { en: "Find the meditating figure in the landscape", it: "Trova la figura in meditazione nel paesaggio" },
      { en: "Notice how scale deepens the sense of solitude", it: "Nota come la scala rafforzi la solitudine" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 43 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 43 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m03": {
    title: { en: "Scene 64: The Fire Dragon’s Assault", it: "Scena 64: L’assalto del drago di fuoco" },
    displayTitle: { en: "64 · The Fire Dragon’s Assault", it: "64 · L’assalto del drago di fuoco" },
    summary: {
      en: "A fire dragon attacks the lodging Buddha; he remains in meditation and subdues the dragon with calm and spiritual power.",
      it: "Un drago di fuoco assale il Buddha ospite; egli resta in meditazione e lo sottomette con calma e potere spirituale.",
    },
    detailedDescription: {
      en: "Seeking lodging on his teaching journey, the Buddha enters a place held by a fire dragon. The dragon coils and spits flame; the Buddha stays seated and finally subdues it. Flame, body and cloud make violent motion; the seated Buddha is the unmoving centre—wisdom mastering anger and ignorance.",
      it: "In cerca di alloggio, il Buddha entra nel luogo del drago di fuoco. Il drago si avvolge e sputa fiamme; il Buddha resta seduto e alla fine lo sottomette. Fiamma e nubi sono moto violento; il Buddha seduto è il centro immobile: la saggezza vince ira e ignoranza.",
    },
    readingGuide: [
      { en: "First recognise the coiling, fire-breathing dragon", it: "Riconosci prima il drago avvolto che sputa fuoco" },
      { en: "Then see how the Buddha faces the attack", it: "Poi vedi come il Buddha affronta l’attacco" },
      { en: "Compare the motion of flame with the Buddha’s stable form", it: "Confronta il moto delle fiamme con la forma stabile del Buddha" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 64 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 64 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m04": {
    title: { en: "Scene 15: Learning Numbers at School", it: "Scena 15: Lo studio del calcolo a scuola" },
    displayTitle: { en: "15 · Learning Numbers at School", it: "15 · Lo studio del calcolo a scuola" },
    summary: {
      en: "Young Siddhartha enters a Chinese-style court school to learn classics, writing and calculation, showing his brilliance.",
      it: "Il giovane Siddhartha entra in una scuola di corte in stile cinese per imparare classici, scrittura e calcolo, segno del suo ingegno.",
    },
    detailedDescription: {
      en: "Young Siddhartha studies classics, writing and calculation. Ming painters recast the Indian story as a Chinese court study: a teacher sits, pupils work at desks, books, counting rods, brushes and railings take Chinese form. The tale shows the prince’s intelligence and lets viewers see Ming social life in furniture and tools of learning.",
      it: "Il giovane Siddhartha studia classici, scrittura e calcolo. I pittori Ming traducono la storia indiana in uno studio di corte cinese. Il racconto mostra l’ingegno del principe e la vita sociale Ming negli arredi e negli strumenti di studio.",
    },
    readingGuide: [
      { en: "First see the ranks of teacher and pupils", it: "Vedi prima i ranghi di maestro e allievi" },
      { en: "Pick out books, counting rods and inkstones", it: "Distingui libri, bacchette da calcolo e pietre per l’inchiostro" },
      { en: "Notice how the Buddha’s life is recast as a Ming school", it: "Nota come la vita del Buddha diventi una scuola Ming" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 15 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 15 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m05": {
    title: { en: "Scene 18: Martial Contest with the Southern Kingdom", it: "Scena 18: Gara marziale con il regno del Sud" },
    displayTitle: { en: "18 · Martial Contest with the Southern Kingdom", it: "18 · Gara marziale con il regno del Sud" },
    summary: {
      en: "The young prince contests southern warriors; riding, chase and formation show his martial skill.",
      it: "Il giovane principe gareggia con i guerrieri del Sud; cavalcata e inseguimento mostrano la sua abilità marziale.",
    },
    detailedDescription: {
      en: "Green-, red- and blue-robed riders on different horses chase, turn and gallop. Legs, sashes, weapons and clouds create speed. The prince has not only wisdom but extraordinary bodily power—later given up, contrasting with his choice to leave home.",
      it: "Cavalieri in vesti verdi, rosse e blu inseguono e galoppano. Zampe, fasce, armi e nubi creano velocità. Il principe ha saggezza e forza straordinaria, poi abbandonate nella scelta di lasciare la casa.",
    },
    readingGuide: [
      { en: "Read along the movement of the three groups of riders", it: "Segui il moto dei tre gruppi di cavalieri" },
      { en: "Compare robe colours with the colours of the horses", it: "Confronta i colori delle vesti con quelli dei cavalli" },
      { en: "Notice how sashes, hooves and clouds make speed", it: "Nota come fasce, zoccoli e nubi diano velocità" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 18 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 18 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m06": {
    title: { en: "Scene 68: The Birth of Rāhula", it: "Scena 68: La nascita di Rāhula" },
    displayTitle: { en: "68 · The Birth of Rāhula", it: "68 · La nascita di Rāhula" },
    summary: {
      en: "Lady Yaśodharā gives birth to Rāhula in the palace; maids come and go with vessels to attend her.",
      it: "La dama Yaśodharā dà alla luce Rāhula a palazzo; le ancelle vanno e vengono con vasi per assisterla.",
    },
    detailedDescription: {
      en: "Yaśodharā gives birth to Rāhula; maids carry trays, ewers and vessels. Chinese halls, green-blue roofs and court dress recast the story as Ming daily life. Related tales include Rāhula remaining long in the womb and Yaśodharā proving her virtue; this panel centres on the palace atmosphere after the birth.",
      it: "Yaśodharā dà alla luce Rāhula; le ancelle portano vassoi e vasi. Sale cinesi e vesti di corte traducono la storia in vita Ming. Questo pannello si concentra sull’atmosfera di palazzo dopo la nascita.",
    },
    readingGuide: [
      { en: "First find Yaśodharā seated in the palace", it: "Trova prima Yaśodharā seduta a palazzo" },
      { en: "Watch the household objects in the maids’ hands", it: "Osserva gli oggetti domestici in mano alle ancelle" },
      { en: "Read how architecture builds the court space", it: "Leggi come l’architettura costruisca lo spazio di corte" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 68 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 68 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m07": {
    title: { en: "Scene 17: Riding the Elephant and Galloping Horse", it: "Scena 17: L’elefante e il cavallo al galoppo" },
    displayTitle: { en: "17 · Riding the Elephant and Galloping Horse", it: "17 · L’elefante e il cavallo al galoppo" },
    summary: {
      en: "The prince rides a white elephant and a galloping horse, showing youthful strength, daring and mastery.",
      it: "Il principe guida un elefante bianco e un cavallo al galoppo, segno di forza, ardimento e padronanza giovanile.",
    },
    detailedDescription: {
      en: "The heavy, stable elephant and the stretching gallop of the horse together frame the prince’s extraordinary skill. The scene links to the later martial contest, proving his powers before he later gives up throne, strength and glory.",
      it: "L’elefante pesante e stabile e il galoppo teso del cavallo inquadrano l’abilità straordinaria del principe, prima che egli rinunci a trono, forza e gloria.",
    },
    readingGuide: [
      { en: "First compare the bulk of the white elephant and the horse", it: "Confronta prima la massa dell’elefante e del cavallo" },
      { en: "See how the figure stands or rides the animals", it: "Vedi come la figura sta o cavalca gli animali" },
      { en: "Link this panel to the martial contest that follows", it: "Collega questo pannello alla gara marziale che segue" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 17 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 17 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m08": {
    title: { en: "Scene 33: Questioning Brahmā", it: "Scena 33: Interrogare Brahmā" },
    displayTitle: { en: "33 · Questioning Brahmā", it: "33 · Interrogare Brahmā" },
    summary: {
      en: "Faced with old age, sickness and death, the prince asks Brahmā about rebirth and liberation, and his will to seek the path is set.",
      it: "Di fronte a vecchiaia, malattia e morte, il principe interroga Brahmā su rinascita e liberazione, e si rafforza la volontà di cercare la via.",
    },
    detailedDescription: {
      en: "After seeing ageing, illness and death, the prince asks Brahmā in the palace. Brahmā sits in the hall; the prince questions him with respect, while officials and warriors build a courtly space. The painting is not a violent event but a religious dialogue that turns him from palace life toward leaving home.",
      it: "Dopo aver visto vecchiaia, malattia e morte, il principe interroga Brahmā a palazzo. Non è un fatto violento, ma un dialogo religioso che lo volge dalla vita di corte all’uscita di casa.",
    },
    readingGuide: [
      { en: "First recognise Brahmā seated in the hall", it: "Riconosci prima Brahmā seduto nella sala" },
      { en: "Watch the prince’s gesture as he asks", it: "Osserva il gesto del principe che interroga" },
      { en: "Use the court distance to read the two roles", it: "Usa la distanza di corte per leggere i due ruoli" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 33 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 33 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m09": {
    title: { en: "Scene 11: Celestials Offering Incense", it: "Scena 11: I celesti offrono incenso" },
    displayTitle: { en: "11 · Celestials Offering Incense", it: "11 · I celesti offrono incenso" },
    summary: {
      en: "Celestial beings ride clouds to offer incense to young Siddhartha, foreshadowing his uncommon sacred rank.",
      it: "Esseri celesti sulle nubi offrono incenso al piccolo Siddhartha, prefigurando il suo rango sacro.",
    },
    detailedDescription: {
      en: "While Siddhartha is still a child, celestials descend on clouds with incense and trays. Heaven above and the court below form two layers: this is not an ordinary princely celebration but a omen in which the heavens confirm his identity. Ribbons, cloud seats and offering vessels are the visual clues.",
      it: "Ancora bambino, Siddhartha riceve incenso dai celesti sulle nubi. Cielo e corte formano due strati: non è una festa ordinaria, ma un segno in cui i cieli confermano la sua identità.",
    },
    readingGuide: [
      { en: "First separate the heavenly and earthly layers", it: "Separa prima lo strato celeste e quello terreno" },
      { en: "Find the incense-offering celestial and the tray-bearing goddess", it: "Trova il celeste che offre incenso e la dea col vassoio" },
      { en: "Use cloud seats, ribbons and vessels to read the omen", it: "Usa nubi, nastri e vasi per leggere il presagio" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scene 11 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scena 11 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
  "df-m10": {
    title: { en: "Scenes 29 and 31: Farewell and Seeking the Path", it: "Scene 29 e 31: Commiato e ricerca della via" },
    displayTitle: {
      en: "29 · Farewell to Yaśodharā · 31 · Chandaka’s Respectful Question",
      it: "29 · Commiato da Yaśodharā · 31 · La domanda rispettosa di Chandaka",
    },
    summary: {
      en: "The prince takes leave of Yaśodharā and tells Chandaka he will leave luxury to seek the path.",
      it: "Il principe si congeda da Yaśodharā e dice a Chandaka che lascerà il lusso per cercare la via.",
    },
    detailedDescription: {
      en: "The photograph holds two neighbouring stories. In the first the prince bids farewell to Yaśodharā in the garden; their gaze and restrained hands mark a family parting. In the second he tells Chandaka he is weary of splendour; Chandaka asks with respect. Together they mark the turn from inner decision to leaving the palace.",
      it: "La foto contiene due storie vicine. Nel primo il principe saluta Yaśodharā nel giardino; nel secondo dice a Chandaka di voler cercare la via. Insieme segnano il passaggio dalla decisione interiore all’uscita dal palazzo.",
    },
    readingGuide: [
      { en: "First distinguish the two story frames in the photograph", it: "Distingui prima i due riquadri nella fotografia" },
      { en: "In the farewell, watch the couple’s meeting gaze", it: "Nel commiato osserva lo sguardo della coppia" },
      { en: "In Chandaka’s question, watch the gestures of lord and attendant", it: "Nella domanda di Chandaka osserva i gesti di signore e attendente" },
    ],
    location: {
      en: "Duofu Temple, Juewei Mountain, Taiyuan — scenes 29 and 31 of the Life of the Buddha",
      it: "Tempio Duofu, monte Juewei, Taiyuan — scene 29 e 31 della Vita del Buddha",
    },
    locationPrecision: {
      en: "Title and number are certain; exact panel location awaits catalogue coordinates.",
      it: "Titolo e numero sono certi; la posizione esatta attende le coordinate del catalogo.",
    },
  },
};

Object.assign(muralOverlays, yongleOverlays);


