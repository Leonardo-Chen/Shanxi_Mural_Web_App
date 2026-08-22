import type { Locale } from "./locales";
import { locPair, pickL, pickTerm, type Pair } from "./pick";
import {
  categories,
  coloringRegions,
  coverCategories,
  eras,
  halls,
  muralTemples,
  pigments,
  places,
  postcards,
  prefectures,
} from "./terms";
import { templesI18n } from "./templesI18n";
import { muralOverlays } from "./muralsOverlay";
import { elementOverlays } from "./elementsOverlay";
import type { Temple } from "@/data/temples";
import type { Figure, Mural } from "@/data/murals";
import type { AnnotationElement, ManifestMural } from "@/data/muralData";
import type { CoverElementCategory } from "@/data/coverElements";

export function locRegion(locale: Locale, region: string): string {
  return region
    .split(/[·•]/)
    .map((part) => pickTerm(locale, places, part.trim()))
    .join(" · ");
}

export function locRegionShort(locale: Locale, region: string): string {
  return locRegion(locale, region).replace(/^(山西|Shanxi)\s*[·•]\s*/i, "");
}

export function locEra(locale: Locale, era: string): string {
  return pickTerm(locale, eras, era);
}

export function locPrefecture(locale: Locale, name: string): string {
  return pickTerm(locale, prefectures, name);
}

export function locHall(locale: Locale, hall: string): string {
  return pickTerm(locale, halls, hall);
}

export function locMuralTemple(locale: Locale, name: string): string {
  return pickTerm(locale, muralTemples, name);
}

export function locCategory(locale: Locale, category: string): string {
  return pickTerm(locale, categories, category);
}

export function locCoverCategory(
  locale: Locale,
  category: CoverElementCategory
): string {
  return pickL(locale, coverCategories[category], category);
}

export function locPigment(locale: Locale, id: string, fallback: string): string {
  return pickL(locale, pigments[id], fallback);
}

export function locColoringRegion(
  locale: Locale,
  id: string,
  fallback: string
): string {
  return pickL(locale, coloringRegions[id], fallback);
}

export function locPostcardTitle(
  locale: Locale,
  id: string,
  fallback: string
): string {
  return pickL(locale, postcards[id], fallback);
}

export function locTemple(locale: Locale, temple: Temple): Temple {
  const copy = templesI18n[temple.id];
  return {
    ...temple,
    name: copy ? pickL(locale, copy.name, temple.name) : temple.name,
    region: locRegion(locale, temple.region),
    era: locEra(locale, temple.era),
    tagline: copy ? pickL(locale, copy.tagline, temple.tagline) : temple.tagline,
    description: copy
      ? pickL(locale, copy.description, temple.description)
      : temple.description,
    imageAlt: copy ? pickL(locale, copy.name, temple.imageAlt) : temple.imageAlt,
    detailImageAlt: copy
      ? pickL(locale, copy.name, temple.detailImageAlt)
      : temple.detailImageAlt,
  };
}

export function locMural(locale: Locale, mural: Mural): Mural {
  const o = muralOverlays[mural.id];
  return {
    ...mural,
    title: locPair(locale, mural.title, o?.title),
    templeName: locMuralTemple(locale, mural.templeName),
    period: mural.period ? locEra(locale, mural.period) : mural.period,
    location: mural.location ? locHall(locale, mural.location) : mural.location,
    description:
      locPair(locale, mural.description ?? "", o?.summary) || mural.description,
    alt: locPair(locale, mural.alt, o?.title),
  };
}

export function locAnnotationMural(
  locale: Locale,
  mural: ManifestMural
): ManifestMural {
  const o = muralOverlays[mural.id];
  return {
    ...mural,
    title: locPair(locale, mural.title, o?.title),
    displayTitle: locPair(
      locale,
      mural.displayTitle ?? mural.title,
      o?.displayTitle ?? o?.title
    ),
    temple: locMuralTemple(locale, mural.temple),
    hall: locHall(locale, mural.hall),
    dynasty: locEra(locale, mural.dynasty),
    summary: locPair(locale, mural.summary, o?.summary),
    detailedDescription: locPair(
      locale,
      mural.detailedDescription,
      o?.detailedDescription
    ),
    readingGuide: mural.readingGuide.map((step, i) =>
      locPair(locale, step, o?.readingGuide?.[i])
    ),
    location: locPair(locale, mural.location, o?.location),
    locationPrecision: locPair(
      locale,
      mural.locationPrecision,
      o?.locationPrecision
    ),
  };
}

export function locElement(
  locale: Locale,
  element: AnnotationElement
): AnnotationElement {
  const o = elementOverlays[element.id];
  return {
    ...element,
    displayName: locPair(locale, element.displayName, o?.name),
    category: locCategory(locale, element.category),
    shortDescription: locPair(locale, element.shortDescription, o?.desc),
  };
}

export function locCoverAlt(locale: Locale, id: string, alt: string): string {
  const o = elementOverlays[id] ?? coverAltOverlay[id];
  return locPair(locale, alt, o?.name);
}

const coverAltOverlay: Record<string, { name: Pair }> = {
  "figure-longmu": {
    name: { en: "Dragon Mother", it: "Madre Drago" },
  },
  "figure-official-hu": {
    name: { en: "Official with a tablet", it: "Ufficiale con tavoletta" },
  },
  "figure-leigong": {
    name: { en: "Thunder Lord", it: "Signore del tuono" },
  },
  "figure-simu-depart": {
    name: {
      en: "Four-eyed rain-measuring god, departing",
      it: "Dio dai quattro occhi che misura la pioggia, in partenza",
    },
  },
  "figure-simu-return": {
    name: {
      en: "Four-eyed rain-measuring god, returning",
      it: "Dio dai quattro occhi che misura la pioggia, al ritorno",
    },
  },
  "figure-dragon-banner-04": {
    name: {
      en: "Mounted deity with dragon banners",
      it: "Divinità a cavallo con stendardi del drago",
    },
  },
  "figure-dragon-banner-02": {
    name: {
      en: "Mounted deity with a divine dragon",
      it: "Divinità a cavallo con drago divino",
    },
  },
  "figure-horse-05": {
    name: { en: "Mounted deity and mount", it: "Divinità e cavalcatura" },
  },
  "figure-horse-canopy": {
    name: {
      en: "Mounted deity, horse and canopy attendants",
      it: "Divinità a cavallo, cavallo e attendenti col baldacchino",
    },
  },
  "figure-scribe": {
    name: { en: "Recording official", it: "Ufficiale registratore" },
  },
  "canvas-extra-01": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-02": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-03": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-04": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-05": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-06": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-07": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-08": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-09": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
  "canvas-extra-10": { name: { en: "Mural figure", it: "Figura dell'affresco" } },
};

export function locCollectedTitle(
  locale: Locale,
  id: string,
  fallback: string
): string {
  if (postcards[id]) return pickL(locale, postcards[id], fallback);
  return locCoverAlt(locale, id, fallback);
}

export function locFigure(locale: Locale, figure: Figure) {
  const overlayId = figure.elementId ?? figure.id;
  const o = elementOverlays[overlayId] ?? coverAltOverlay[figure.id];
  const zhName = figure.name;
  const zhDesc = figure.note ?? figure.introduction;
  return {
    displayName: locPair(locale, zhName, o?.name),
    researchName: locPair(locale, zhName, o?.name),
    category: figure.category
      ? locCategory(locale, figure.category)
      : figure.category,
    shortDescription: locPair(locale, zhDesc, o?.desc),
    imageAlt: locPair(locale, figure.imageAlt ?? zhName, o?.name),
  };
}
