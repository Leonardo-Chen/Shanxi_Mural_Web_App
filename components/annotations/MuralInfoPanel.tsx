"use client";

import { useState } from "react";
import type { AnnotationElement, ManifestMural } from "@/data/muralData";
import ReadingGuide from "./ReadingGuide";
import ResearchStatusNote from "./ResearchStatusNote";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locAnnotationMural, locElement } from "@/lib/i18n/localize";

type MuralInfoPanelProps = {
  mural: ManifestMural;
  relatedElements?: AnnotationElement[];
};

export default function MuralInfoPanel({
  mural,
  relatedElements = [],
}: MuralInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const { locale, t } = useLocale();
  const copy = locAnnotationMural(locale, mural);
  const figures = relatedElements.map((element) => locElement(locale, element));
  const storyId = `mural-story-${copy.id}`;

  return (
    <div className="min-w-0">
      <p className="font-sans text-[10px] tracking-[0.16em] text-stone/70">
        {copy.temple}
        {copy.hall ? ` / ${copy.hall}` : ""}
      </p>
      <h2 className="mt-1.5 font-serif text-2xl text-stone md:text-3xl">
        {copy.displayTitle}
      </h2>
      <p className="mt-1 font-sans text-[11px] text-stone/60">{copy.dynasty}</p>

      <section className="mt-6" aria-labelledby={`${storyId}-heading`}>
        <h3
          id={`${storyId}-heading`}
          className="font-sans text-[10px] tracking-[0.18em] text-stone"
        >
          {t("detail.whatPainted")}
        </h3>
        <p
          className={`mt-2 font-serif text-sm leading-7 text-ink/70 ${
            expanded ? "" : "line-clamp-6"
          }`}
        >
          {copy.detailedDescription}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 min-h-9 font-sans text-[11px] tracking-wide text-cinnabar hover:text-[#7a2e28] focus:outline-none focus-visible:underline"
          aria-expanded={expanded}
        >
          {expanded ? t("detail.collapse") : t("detail.readMore")}
        </button>
      </section>

      <section className="mt-6" aria-labelledby={`${storyId}-guide`}>
        <h3
          id={`${storyId}-guide`}
          className="mb-2 font-sans text-[10px] tracking-[0.18em] text-stone"
        >
          {t("detail.howToRead")}
        </h3>
        <ReadingGuide steps={copy.readingGuide} />
      </section>

      {figures.length > 0 && (
        <section className="mt-6" aria-labelledby={`${storyId}-figures`}>
          <h3
            id={`${storyId}-figures`}
            className="font-sans text-[10px] tracking-[0.18em] text-stone"
          >
            {t("detail.figures")}
          </h3>
          <ul className="mt-2 space-y-1">
            {figures.map((element) => (
              <li
                key={element.id}
                className="font-serif text-sm leading-relaxed text-ink/70"
              >
                {element.displayName}
                <span className="ml-2 font-sans text-[10px] tracking-wide text-stone/55">
                  {element.category}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 border-t border-stone/15 pt-4">
        <h3 className="mb-2 font-sans text-[10px] tracking-[0.18em] text-stone">
          {t("detail.research")}
        </h3>
        <ResearchStatusNote text={copy.locationPrecision} />
        <p className="mt-2 font-sans text-[10px] leading-relaxed text-stone/55">
          {copy.location}
        </p>
      </section>
    </div>
  );
}
