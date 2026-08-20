import type { MuralOverlay, Pair } from "./pick";

const loc = (
  title: Pair,
  displayTitle: Pair,
  summary: Pair,
  detailedDescription: Pair,
  readingGuide: Pair[],
  location: Pair,
  locationPrecision: Pair
): MuralOverlay => ({
  title,
  displayTitle,
  summary,
  detailedDescription,
  readingGuide,
  location,
  locationPrecision,
});

const hall = {
  en: "Yongle Palace, Ruicheng, Shanxi — Chaoyuan mural, Hall of the Three Pure Ones",
  it: "Palazzo Yongle, Ruicheng, Shanxi — affresco Chaoyuan, Sala dei Tre Puri",
};

const pureYang = {
  en: "Yongle Palace, Ruicheng, Shanxi — Manifestations of Lü Dongbin, Hall of Pure Yang",
  it: "Palazzo Yongle, Ruicheng, Shanxi — Manifestazioni di Lü Dongbin, Sala del Puro Yang",
};

const waitCatalogue: Pair = {
  en: "The Three Pure Ones Hall and Chaoyuan mural are certain; exact wall position awaits the original panorama.",
  it: "La Sala dei Tre Puri e l’affresco Chaoyuan sono certi; la posizione esatta attende il panorama originale.",
};

export const yongleOverlays: Record<string, MuralOverlay> = {
  "yl-m01": loc(
    { en: "Chaoyuan, part 1: The celestial ranks assemble", it: "Chaoyuan, parte 1: Le schiere celesti si radunano" },
    { en: "Chaoyuan · the celestial ranks", it: "Chaoyuan · le schiere celesti" },
    { en: "Gods of the three realms line up by rank to pay homage to the Primordial Heavenly Worthy, showing the court of heaven and cosmic order.", it: "Gli dèi dei tre reami si schierano per grado in omaggio al Cielo Primordiale, mostrando la corte celeste e l’ordine cosmico." },
    { en: "This fragment shows many Daoist deities walking toward one goal. Caps, haloes, tablets and banners differ, yet shared direction and stacked ranks make one assembly. Chaoyuan as a whole is the homage of the three realms; this photograph is a stretch of that host, not a separate story.", it: "Il frammento mostra molte divinità daoiste verso un unico fine. Copricapi e tavolette differiscono, ma direzione e ranghi fanno un’unica assemblea. Chaoyuan è l’omaggio dei tre reami; questa foto è un tratto di quella schiera, non una storia a sé." },
    [
      { en: "Read along the shared direction of the figures", it: "Leggi lungo la direzione comune delle figure" },
      { en: "Compare haloes, caps and audience tablets", it: "Confronta aureole, copricapi e tavolette" },
      { en: "Place the fragment back in the whole Chaoyuan assembly", it: "Rimetti il frammento nell’assemblea Chaoyuan intera" },
    ],
    { en: `${hall.en}, part 1`, it: `${hall.it}, parte 1` },
    waitCatalogue
  ),
  "yl-m02": loc(
    { en: "Chaoyuan, part 2: The emperor-god and the offering table", it: "Chaoyuan, parte 2: L’imperatore-dio e la tavola delle offerte" },
    { en: "Chaoyuan · emperor-god and offering table", it: "Chaoyuan · imperatore-dio e tavola delle offerte" },
    { en: "An emperor-rank deity with offering table and attendants forms the ceremonial core of the heavenly court.", it: "Una divinità di rango imperiale con tavola delle offerte e attendenti forma il nucleo cerimoniale della corte celeste." },
    { en: "Throne and offering table make a stable centre; immortals, attendants and banners form a ceremonial ring. Vessels on the table mark sacrifice and homage. Without wall coordinates the deity should not be named from costume alone; rank can still be read from scale, throne, halo and the number of attendants.", it: "Trono e tavola delle offerte formano un centro stabile. Senza coordinate di parete la divinità non va nominata solo dall’abito; il rango si legge da scala, trono, aureola e numero di attendenti." },
    [
      { en: "First see the centre made by throne and table", it: "Vedi prima il centro di trono e tavola" },
      { en: "Then the scale difference between attendants and the main deity", it: "Poi la differenza di scala tra attendenti e divinità" },
      { en: "Use cap, halo and banners to read rank", it: "Usa copricapo, aureola e stendardi per leggere il rango" },
    ],
    { en: `${hall.en}, part 2`, it: `${hall.it}, parte 2` },
    waitCatalogue
  ),
  "yl-m03": loc(
    { en: "Chaoyuan, part 3: The crowned deity and ministers", it: "Chaoyuan, parte 3: La divinità coronata e i ministri" },
    { en: "Chaoyuan · crowned deity and ministers", it: "Chaoyuan · divinità coronata e ministri" },
    { en: "An emperor- or empress-rank deity stands with immortal officials, a sign of heavenly rule, rank and ritual.", it: "Una divinità di rango imperiale sta con ufficiali immortali, segno di governo celeste, grado e rito." },
    { en: "The crowned deity stands frontally or slightly turned, ministers around. Crown, robes, scale and subordinates mark imperial rank. The point is not action but how standing, dress and hierarchy organise the Daoist heaven like a human court.", it: "La divinità coronata sta di fronte o di tre quarti, i ministri intorno. Il punto non è l’azione, ma come postura, veste e gerarchia organizzano il cielo daoista come una corte umana." },
    [
      { en: "First recognise the crowned deity", it: "Riconosci prima la divinità coronata" },
      { en: "Compare the scale of deity and ministers", it: "Confronta la scala di divinità e ministri" },
      { en: "See how standing forms heavenly rank", it: "Vedi come la postura formi il rango celeste" },
    ],
    { en: `${hall.en}, part 3`, it: `${hall.it}, parte 3` },
    waitCatalogue
  ),
  "yl-m04": loc(
    { en: "Chaoyuan, part 4: The canopy deity", it: "Chaoyuan, parte 4: La divinità sotto il baldacchino" },
    { en: "Chaoyuan · the canopy deity", it: "Chaoyuan · la divinità sotto il baldacchino" },
    { en: "Canopy, halo and attendants stress the high rank of the main deity in the assembly.", it: "Baldacchino, aureola e attendenti sottolineano l’alto rango della divinità principale." },
    { en: "The deity stands under a great canopy and halo, framed by immortals, jade maidens and banners. The canopy acts like an architectural dome, lifting the figure from the dense host. The main god stays still while attendants, ribbons and vessels make a slight flow of ceremony.", it: "La divinità sta sotto un grande baldacchino e un’aureola. Il baldacchino agisce come una cupola e la solleva dalla schiera densa. Il dio resta fermo mentre attendenti e nastri danno un lieve flusso cerimoniale." },
    [
      { en: "Use the canopy to locate the main deity", it: "Usa il baldacchino per localizzare la divinità" },
      { en: "Watch halo, costume and attendants", it: "Osserva aureola, costume e attendenti" },
      { en: "Compare the deity’s stillness with the motion of ribbons", it: "Confronta la quiete della divinità con il moto dei nastri" },
    ],
    { en: `${hall.en}, part 4`, it: `${hall.it}, parte 4` },
    waitCatalogue
  ),
  "yl-m05": loc(
    { en: "Chaoyuan, part 5: Star officials in ranks", it: "Chaoyuan, parte 5: Ufficiali stellari in fila" },
    { en: "Chaoyuan · star officials in ranks", it: "Chaoyuan · ufficiali stellari in fila" },
    { en: "Star officials, immortal clerks and attendants line up by rank for the Chaoyuan rite.", it: "Ufficiali stellari, chierici immortali e attendenti si allineano per grado nel rito Chaoyuan." },
    { en: "The fragment densely arrays star officials and attendants, distinguished by tablets, caps, haloes and colours. It is a magnified stretch of heavenly bureaucracy: each face and gesture is individual, yet all obey the assembly’s direction. The task is to find small differences in the crowd.", it: "Il frammento dispone in folla ufficiali stellari e attendenti. È un tratto ingrandito della burocrazia celeste: ogni volto è individuale, tutti obbediscono alla direzione dell’assemblea." },
    [
      { en: "First see the overall direction of the ranks", it: "Vedi prima la direzione complessiva delle file" },
      { en: "Then compare different caps and tablets", it: "Poi confronta copricapi e tavolette" },
      { en: "Look for expressions and small gestures in the crowd", it: "Cerca espressioni e piccoli gesti nella folla" },
    ],
    { en: `${hall.en}, part 5`, it: `${hall.it}, parte 5` },
    waitCatalogue
  ),
  "yl-m06": loc(
    { en: "Chaoyuan, part 6: Immortal mountains and regalia", it: "Chaoyuan, parte 6: Montagne immortali e insegne" },
    { en: "Chaoyuan · immortal mountains and regalia", it: "Chaoyuan · montagne immortali e insegne" },
    { en: "Immortal mountains, divine hosts and ceremonial objects mark space and rank in the Chaoyuan procession.", it: "Montagne immortali, schiere divine e oggetti cerimoniali segnano spazio e rango nel corteo Chaoyuan." },
    { en: "A large ceremonial fan painted with islands-in-the-sea is the landmark, with gods and attendants moving around it. The landscape on the fan compresses a Penglai-like paradise into one ritual object. Read the regalia as a system of heavenly identity, not mere ornament.", it: "Un grande ventaglio cerimoniale con isole nel mare è il segno, con dèi e attendenti intorno. Il paesaggio sul ventaglio comprime un paradiso alla Penglai in un oggetto rituale." },
    [
      { en: "First find the large mountain-scene ceremonial fan", it: "Trova prima il grande ventaglio con le montagne" },
      { en: "Look at the landscape painted inside the fan", it: "Guarda il paesaggio dipinto nel ventaglio" },
      { en: "Then the relation of the bearer to the surrounding host", it: "Poi la relazione tra chi lo porta e la schiera intorno" },
    ],
    { en: `${hall.en}, part 6`, it: `${hall.it}, parte 6` },
    waitCatalogue
  ),
  "yl-m07": loc(
    { en: "Chaoyuan, part 7: Jade maiden offering treasure", it: "Chaoyuan, parte 7: Fanciulla di giada che offre tesori" },
    { en: "Chaoyuan · jade maiden offering treasure", it: "Chaoyuan · fanciulla di giada che offre tesori" },
    { en: "A jade maiden holds treasure or offering vessels, serving the main deity in heavenly ritual.", it: "Una fanciulla di giada tiene tesori o vasi di offerta, al servizio della divinità nel rito celeste." },
    { en: "The female immortal holds a flame-shaped vessel; long skirt, scarves and crown form an elegant curve. She belongs to the offering maidens of Chaoyuan: the action is presenting, not walking. Gesture, vessel and facing show her ritual relation to the main deity.", it: "L’immortale tiene un vaso a forma di fiamma. Appartiene alle ancelle dell’offerta: l’azione è presentare, non camminare." },
    [
      { en: "First see the vessel held in both hands", it: "Vedi prima il vaso tenuto con entrambe le mani" },
      { en: "Follow scarves and folds to read the pose", it: "Segui nastri e pieghe per leggere la posa" },
      { en: "Use her facing to infer the deity she serves", it: "Usa lo sguardo per intuire la divinità che serve" },
    ],
    { en: `${hall.en}, part 7`, it: `${hall.it}, parte 7` },
    waitCatalogue
  ),
  "yl-m08": loc(
    { en: "Chaoyuan, part 8: Heavenly warriors", it: "Chaoyuan, parte 8: Guerrieri celesti" },
    { en: "Chaoyuan · heavenly warriors", it: "Chaoyuan · guerrieri celesti" },
    { en: "Armed heavenly guards open the way, keep watch and expel evil, forming the assembly’s martial dignity.", it: "Guardie armate celesti aprono la via, vigilano e scacciano il male, formando la dignità marziale dell’assemblea." },
    { en: "Two guards with blades or staves stand together—build, weapons, short robes and tense poses unlike officials or maidens. They belong to the armed guard of heaven. Overlapping figures and crossed weapons make a tight pair, so they are kept as a two-person group.", it: "Due guardie con lame o aste stanno insieme, diverse da ufficiali e ancelle. Appartengono alla guardia armata del cielo. Le armi incrociate ne fanno una coppia stretta." },
    [
      { en: "First see weapons and martial dress", it: "Vedi prima armi e veste marziale" },
      { en: "Compare the turning direction of the two guards", it: "Confronta la direzione dei due guardiani" },
      { en: "Understand their guarding role in the Chaoyuan host", it: "Comprendi il loro ruolo di guardia nella schiera Chaoyuan" },
    ],
    { en: `${hall.en}, part 8`, it: `${hall.it}, parte 8` },
    waitCatalogue
  ),
  "yl-m09": loc(
    { en: "Chaoyuan, part 9: Haloed female immortal", it: "Chaoyuan, parte 9: Immortale femminile con aureola" },
    { en: "Chaoyuan · haloed female immortal", it: "Chaoyuan · immortale femminile con aureola" },
    { en: "A star goddess or female immortal with a halo joins Chaoyuan; without the original wall position her name is not forced.", it: "Una dea stellare o immortale con aureola partecipa al Chaoyuan; senza la posizione originale della parete il nome non è imposto." },
    { en: "The goddess stands out by a large halo, rich crown and layered robes. She may be a star goddess or high female official, but the photograph lacks a complete wall relation, so the label stays descriptive. Watch how halo, crown and clouds build sacred identity.", it: "La dea emerge per aureola, corona e vesti a strati. Può essere una dea stellare, ma la foto non dà una relazione di parete completa: l’etichetta resta descrittiva." },
    [
      { en: "Use the halo to find the visual centre", it: "Usa l’aureola per trovare il centro visivo" },
      { en: "Watch the rank of crown and robes", it: "Osserva il rango di corona e vesti" },
      { en: "Do not force a divine name without wall position", it: "Non imporre un nome divino senza la posizione di parete" },
    ],
    { en: `${hall.en}, part 9`, it: `${hall.it}, parte 9` },
    waitCatalogue
  ),
  "yl-m10": loc(
    { en: "Chaoyuan, part 10: Azure Dragon Star Lord", it: "Chaoyuan, parte 10: Signore stellare del Drago Azzurro" },
    { en: "Chaoyuan · Azure Dragon Star Lord", it: "Chaoyuan · Signore stellare del Drago Azzurro" },
    { en: "The eastern guardian Azure Dragon Star Lord holds a sword and appears with an azure dragon.", it: "Il guardiano orientale, il Signore stellare del Drago Azzurro, tiene una spada e compare con un drago azzurro." },
    { en: "An armed general stands with a sword, an azure dragon at his side—the eastern guardian of the Chaoyuan host. Armour, sword, ribbons and dragon make a diagonal movement of both march and watch. Azure Dragon and White Tiger usually appear as a pair, east and west, the clearest image of directional protection.", it: "Un generale armato sta con la spada e un drago azzurro al fianco: il guardiano orientale. Drago Azzurro e Tigre Bianca compaiono di solito in coppia, est e ovest." },
    [
      { en: "First find the azure dragon beside the general", it: "Trova prima il drago azzurro accanto al generale" },
      { en: "Watch sword and armour", it: "Osserva spada e armatura" },
      { en: "Read him as a pair with the White Tiger Star Lord", it: "Leggilo in coppia con il Signore stellare della Tigre Bianca" },
    ],
    { en: `${hall.en}, Azure Dragon Star Lord`, it: `${hall.it}, Signore stellare del Drago Azzurro` },
    { en: "The azure-dragon identity is fairly certain; exact wall coordinates await the original panorama.", it: "L’identità del drago azzurro è abbastanza certa; le coordinate esatte attendono il panorama originale." }
  ),
  "yl-m11": loc(
    { en: "Chaoyuan, part 11: White Tiger Star Lord", it: "Chaoyuan, parte 11: Signore stellare della Tigre Bianca" },
    { en: "Chaoyuan · White Tiger Star Lord", it: "Chaoyuan · Signore stellare della Tigre Bianca" },
    { en: "The western guardian White Tiger Star Lord appears as a warrior with a white tiger.", it: "Il guardiano occidentale, il Signore stellare della Tigre Bianca, appare come guerriero con una tigre bianca." },
    { en: "A red-faced armed general stands with banner or weapon, a white tiger beside him—the western guardian. Tiger, armour and banner stress martial power and the warding-off of evil. With the Azure Dragon he forms a directional pair of protectors.", it: "Un generale dal volto rosso sta con stendardo o arma e una tigre bianca: il guardiano occidentale. Con il Drago Azzurro forma una coppia direzionale di protettori." },
    [
      { en: "First find the white tiger beside the general", it: "Trova prima la tigre bianca accanto al generale" },
      { en: "Watch banner, armour and the red face", it: "Osserva stendardo, armatura e il volto rosso" },
      { en: "Read him as a pair with the Azure Dragon Star Lord", it: "Leggilo in coppia con il Signore stellare del Drago Azzurro" },
    ],
    { en: `${hall.en}, White Tiger Star Lord`, it: `${hall.it}, Signore stellare della Tigre Bianca` },
    { en: "The white-tiger identity is fairly certain; exact wall coordinates await the original panorama.", it: "L’identità della tigre bianca è abbastanza certa; le coordinate esatte attendono il panorama originale." }
  ),
  "yl-m12": loc(
    { en: "Lü Dongbin cycle: selling ink, testing Zhao, healing Di Qing, the pregnant nun", it: "Ciclo di Lü Dongbin: vendere inchiostro, mettere alla prova Zhao, curare Di Qing, la monaca incinta" },
    { en: "Selling ink · Testing Zhao · Healing Di Qing · The pregnant nun", it: "Vendere inchiostro · Mettere alla prova Zhao · Curare Di Qing · La monaca incinta" },
    { en: "Four neighbouring stories: Lü Dongbin sells ink, tests a man, gives medicine and takes the form of a pregnant nun to test compassion.", it: "Quattro storie vicine: Lü Dongbin vende inchiostro, mette alla prova un uomo, dà medicina e assume le sembianze di una monaca incinta per saggiare la compassione." },
    { en: "This wide photograph holds four adjacent tales. Lü sometimes appears as an ordinary ink-seller; sometimes he tests Lord Zhao with a straw sandal and talk of becoming immortal; he also gives medicine to the general Di Qing and takes the form of a nun in labour seeking lodging, vanishing to test whether a monastery has true compassion. Marketplace, monastery, dialogue and gods on orange clouds share one continuous space.", it: "Questa foto ampia contiene quattro racconti. Lü appare come venditore d’inchiostro, mette alla prova il signor Zhao, cura Di Qing e si fa monaca incinta per saggiare la compassione. Mercato, monastero e nubi arancio condividono uno spazio continuo." },
    [
      { en: "First use the inscriptions to separate the four story zones", it: "Usa prima le iscrizioni per separare le quattro zone" },
      { en: "Watch how an ordinary person turns into an immortal manifestation", it: "Osserva come una persona ordinaria diventi una manifestazione immortale" },
      { en: "Treat the orange-cloud host as a clue to the supernatural", it: "Tratta la schiera sulle nubi arancio come indizio del soprannaturale" },
    ],
    { en: `${pureYang.en} — neighbouring story group`, it: `${pureYang.it} — gruppo di storie vicine` },
    { en: "The Pure Yang Hall and the four story titles are certain; this photograph is a wide combination of neighbouring scenes.", it: "La Sala del Puro Yang e i quattro titoli sono certi; la foto è un’ampia combinazione di scene vicine." }
  ),
  "yl-m13": loc(
    { en: "Auspicious Birth at Yongle", it: "Nascita fausta a Yongle" },
    { en: "Auspicious Birth at Yongle", it: "Nascita fausta a Yongle" },
    { en: "Lü Dongbin is born at Yongle; a white crane arrives and strange fragrance fills the house; the courtyard shows family, infant and visiting guests.", it: "Lü Dongbin nasce a Yongle; arriva una gru bianca e un profumo strano riempie la casa; il cortile mostra famiglia, infante e ospiti." },
    { en: "The story is Lü’s birth omen at Yongle. People tend mother and infant; guests arrive on horseback; a white crane appears among roofs. The painter sets an immortal birth inside a Chinese courtyard so viewers first see a family event, then read crane and fragrance as signs of a more-than-human identity.", it: "La storia è il presagio di nascita di Lü a Yongle. Ospiti a cavallo, una gru bianca tra i tetti. Il pittore colloca una nascita immortale in un cortile cinese: prima un fatto di famiglia, poi gru e profumo come segni di un’identità più che umana." },
    [
      { en: "Enter the inner court along the gate", it: "Entra nel cortile interno lungo il portale" },
      { en: "Find the infant, the family and the visiting guests", it: "Trova l’infante, la famiglia e gli ospiti" },
      { en: "Finally confirm the birth theme through the white crane and other omens", it: "Infine conferma il tema della nascita con la gru bianca e altri presagi" },
    ],
    { en: `${pureYang.en} — Auspicious Birth at Yongle`, it: `${pureYang.it} — Nascita fausta a Yongle` },
    { en: "The story title is certain; exact wall coordinates await the Pure Yang panorama.", it: "Il titolo della storia è certo; le coordinate esatte attendono il panorama del Puro Yang." }
  ),
  "yl-m14": loc(
    { en: "Raising the Pagoda at Wuzhou", it: "Sollevare la pagoda a Wuzhou" },
    { en: "Raising the Pagoda at Wuzhou", it: "Sollevare la pagoda a Wuzhou" },
    { en: "Refused lodging, Lü Dongbin lifts or splits a pagoda by spiritual power until the monks awaken, then restores it.", it: "Rifiutato l’alloggio, Lü Dongbin solleva o spezza una pagoda con potere spirituale finché i monaci si destano, poi la ristabilisce." },
    { en: "At dusk Lü asks lodging at a Wuzhou monastery and is turned away. To wake monks who keep form without compassion, he makes the pagoda rise or break; when they repent it is restored. Green-blue towers, corridors and upturned faces make the building itself the protagonist of the miracle.", it: "Al crepuscolo Lü chiede alloggio e viene respinto. Per destare monaci senza compassione fa sollevare o spezzare la pagoda; pentiti, essa si ricompone. Le torri verde-azzurre sono protagoniste del miracolo." },
    [
      { en: "First look at the green-blue pagoda that fills the centre", it: "Guarda prima la pagoda verde-azzurra al centro" },
      { en: "Then find the monks and Lü’s position", it: "Poi trova i monaci e la posizione di Lü" },
      { en: "Read the miracle through upturned faces and the changing tower", it: "Leggi il miracolo nei volti alzati e nella torre che cambia" },
    ],
    { en: `${pureYang.en} — Raising the Pagoda at Wuzhou`, it: `${pureYang.it} — Sollevare la pagoda a Wuzhou` },
    { en: "The story title is certain; exact wall coordinates await the Pure Yang panorama.", it: "Il titolo della storia è certo; le coordinate esatte attendono il panorama del Puro Yang." }
  ),
  "yl-m15": loc(
    { en: "Healing Di Qing and the pregnant nun", it: "Curare Di Qing e la monaca incinta" },
    { en: "Healing Di Qing · The pregnant nun", it: "Curare Di Qing · La monaca incinta" },
    { en: "One scene shows Lü giving medicine to avert disaster; the other shows him as a nun in labour testing whether a monastery has true compassion.", it: "Una scena mostra Lü che dà medicina per allontanare il pericolo; l’altra lo mostra come monaca in travaglio che saggia se il monastero ha vera compassione." },
    { en: "The photograph mainly takes two adjacent tales. In one, Di Qing on campaign is saved by Lü’s medicine or counsel. In the other Lü becomes a nun about to give birth, is refused lodging, a child cries in the night, and mother and infant vanish at dawn—a test of compassion. The flame-shaped palanquin and the watching crowd are the strongest visual marks.", it: "La foto riprende due racconti. In uno Di Qing è salvato dalla medicina di Lü; nell’altro Lü si fa monaca in travaglio, viene rifiutata e all’alba madre e infante spariscono. Il palanchino a fiamma e la folla sono i segni visivi più forti." },
    [
      { en: "First use inscriptions to separate left and right stories", it: "Usa prima le iscrizioni per separare sinistra e destra" },
      { en: "Look for giving medicine, seeking lodging and the watching crowd", it: "Cerca il dare medicina, la richiesta d’alloggio e la folla" },
      { en: "Use the flame palanquin as the landmark of this photograph", it: "Usa il palanchino a fiamma come segno di questa fotografia" },
    ],
    { en: `${pureYang.en} — neighbouring lower-register stories`, it: `${pureYang.it} — storie vicine del registro inferiore` },
    { en: "The two neighbouring titles are fairly certain; narrative details of the palanquin should still be checked against a high-resolution inscription.", it: "I due titoli vicini sono abbastanza certi; i dettagli del palanchino vanno ancora confrontati con un’iscrizione ad alta risoluzione." }
  ),
  "yl-m16": loc(
    { en: "Selling ink at Dingzhou and testing Lord Zhao", it: "Vendere inchiostro a Dingzhou e mettere alla prova il signor Zhao" },
    { en: "Selling ink at Dingzhou · Testing Lord Zhao", it: "Vendere inchiostro a Dingzhou · Mettere alla prova il signor Zhao" },
    { en: "Lü appears as an ordinary Daoist selling ink, then tests Lord Zhao with a straw sandal and talk of becoming immortal.", it: "Lü appare come daoista ordinario che vende inchiostro, poi mette alla prova il signor Zhao con un sandalo di paglia e il discorso sull’immortalità." },
    { en: "In the first tale Lü sells ink at Dingzhou in ordinary clothes; people judge him by looks and price, then recognise the immortal from a poem or miracle. In the second he asks ten gold pieces for a straw sandal that would make the wearer immortal, testing whether Zhao can see true immortal affinity. The murals set immortal tests in the marketplace and everyday talk.", it: "Nel primo racconto Lü vende inchiostro in abiti ordinari; nel secondo chiede dieci pezzi d’oro per un sandalo di paglia. Gli affreschi pongono le prove immortali nel mercato e nel parlare quotidiano." },
    [
      { en: "First separate the ink-selling and sandal centres", it: "Separa prima i centri della vendita d’inchiostro e del sandalo" },
      { en: "Watch how people face an ordinary-looking Daoist", it: "Osserva come le persone affrontano un daoista dall’aspetto ordinario" },
      { en: "See how Lü uses everyday objects to test insight", it: "Vedi come Lü usi oggetti quotidiani per saggiare l’intuito" },
    ],
    { en: `${pureYang.en} — neighbouring upper-register stories`, it: `${pureYang.it} — storie vicine del registro superiore` },
    { en: "The two story titles are fairly certain; exact wall coordinates await the Pure Yang panorama.", it: "I due titoli sono abbastanza certi; le coordinate esatte attendono il panorama del Puro Yang." }
  ),
  "yl-m17": loc(
    { en: "Healing Liu and playing at Luofu", it: "Curare Liu e giocare a Luofu" },
    { en: "Healing Liu · Playing at Luofu", it: "Curare Liu · Giocare a Luofu" },
    { en: "Lü heals Liu’s lameness with five-coloured stone, then at Mount Luofu cures a novice’s eyes with leftover wine and paints a mural as a manifestation.", it: "Lü guarisce la zoppia di Liu con pietra pentacolore, poi a Monte Luofu cura gli occhi di un novizio con il vino rimasto e dipinge un affresco come manifestazione." },
    { en: "In Healing Liu, a poor man lame for years is told to dig five-coloured stone, grind and drink it; seeking his benefactor he finds only Lü’s portrait on a wall. In Playing at Luofu, Lü visits the Zhuming Abbey, heals a novice’s eyes with leftover wine, paints landscape with a riddle of the character Lü, and vanishes into the picture or into the air. Both tales bind walls, images and immortal appearance.", it: "In Curare Liu, un povero zoppo scava pietra pentacolore e poi trova solo il ritratto di Lü sul muro. A Luofu Lü cura un novizio col vino rimasto, dipinge un paesaggio e scompare nell’immagine. Entrambi i racconti legano pareti, immagini e apparizione immortale." },
    [
      { en: "First use inscriptions to separate the healing and Luofu stories", it: "Usa prima le iscrizioni per separare guarigione e Luofu" },
      { en: "Find the five-coloured stone, the wine and the mural", it: "Trova la pietra pentacolore, il vino e l’affresco" },
      { en: "Notice how living people turn into images on the wall", it: "Nota come le persone vive diventino immagini sul muro" },
    ],
    { en: `${pureYang.en} — neighbouring stories`, it: `${pureYang.it} — storie vicine` },
    { en: "The two titles and main plots are certain; exact wall coordinates await the Pure Yang panorama.", it: "I due titoli e le trame principali sono certi; le coordinate esatte attendono il panorama del Puro Yang." }
  ),
};
