"use client";

import { useEffect, useRef } from "react";
import BoundedMuralViewer from "./BoundedMuralViewer";
import { isIdentityUnderResearch } from "@/data/muralData";
import MuralInfoPanel from "@/components/annotations/MuralInfoPanel";
import ProvenanceBadge from "@/components/annotations/ProvenanceBadge";
import type { Figure, Mural } from "@/data/murals";
import { elementsByMuralId, muralById } from "@/data/muralData";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locFigure, locMural } from "@/lib/i18n/localize";

interface MuralDetailOverlayProps {
  mural: Mural;
  figure: Figure;
  isMobile: boolean;
  onClose: () => void;
  onOpenTemple: (templeId: string) => void;
  onSeeOtherElements: () => void;
}

export default function MuralDetailOverlay({
  mural,
  figure,
  isMobile,
  onClose,
  onOpenTemple,
  onSeeOtherElements,
}: MuralDetailOverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { locale, t } = useLocale();
  const muralCopy = locMural(locale, mural);
  const figureCopy = locFigure(locale, figure);
  const image = muralCopy.image || muralCopy.thumbnail;
  const annotated = muralById[mural.id];
  const relatedElements = elementsByMuralId[mural.id] ?? [];
  const displayName = figureCopy.displayName;
  const elementLabelId = `overlay-element-${figure.id}`;
  const shortDescription = figureCopy.shortDescription;
  const underResearch = isIdentityUnderResearch({
    displayName,
    researchName: figureCopy.researchName,
    shortDescription,
    aliases: [],
  });

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[80] flex bg-ink/45 ${
        isMobile
          ? "items-end"
          : "items-center justify-center px-6 pb-6 pt-24 md:pt-28"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.muralAria", {
        title: annotated?.displayTitle ?? muralCopy.displayTitle,
      })}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className={`relative flex w-full overflow-hidden bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[calc(100svh-6rem)] flex-col rounded-t-md"
            : "h-[min(calc(100svh-8.5rem),40rem)] max-w-5xl flex-row"
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("detail.closeMural")}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-rice/90 text-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
        >
          ×
        </button>

        <div
          className={`relative min-h-0 shrink-0 bg-[#B8B0A4] ${
            isMobile ? "h-52 w-full" : "h-full w-[54%]"
          }`}
        >
          {image ? (
            <BoundedMuralViewer
              src={image}
              alt={annotated?.displayTitle ?? muralCopy.alt}
              describedBy="mural-detail-copy"
              resetKey={mural.id}
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}
        </div>

        <div
          id="mural-detail-copy"
          className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8"
        >
          <p className="font-sans text-[10px] tracking-[0.22em] text-cinnabar/80">
            {t("detail.eyebrow")}
          </p>

          {annotated ? (
            <MuralInfoPanel
              mural={annotated}
              relatedElements={relatedElements}
            />
          ) : (
            <div className="mt-3">
              <h2 className="font-serif text-2xl text-stone">
                {muralCopy.displayTitle}
              </h2>
              <p className="mt-1 font-sans text-[11px] text-stone/60">
                {muralCopy.templeName}
                {muralCopy.hall ? ` / ${muralCopy.hall}` : ""}
                {muralCopy.period ? ` · ${muralCopy.period}` : ""}
              </p>
              {muralCopy.detailedDescription || muralCopy.description ? (
                <p className="mt-5 font-serif text-sm leading-7 text-ink/70">
                  {muralCopy.detailedDescription ?? muralCopy.description}
                </p>
              ) : null}
            </div>
          )}

          <section className="mt-8 border-t border-stone/15 pt-5">
            <p className="font-sans text-[10px] tracking-[0.18em] text-stone">
              {t("detail.foundElement")}
            </p>
            <h3
              id={elementLabelId}
              className="mt-1 font-serif text-lg text-stone"
            >
              {displayName}
            </h3>
            {figure.category && (
              <p className="mt-0.5 font-sans text-[10px] tracking-[0.12em] text-stone/55">
                {figureCopy.category}
              </p>
            )}
            {underResearch && (
              <p className="mt-2 inline-block border border-stone/20 px-2 py-0.5 font-sans text-[9px] tracking-[0.08em] text-stone/70">
                {t("detail.underResearch")}
              </p>
            )}
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink/65">
              {shortDescription}
            </p>
            {annotated && (
              <ProvenanceBadge muralTitle={annotated.displayTitle} />
            )}
          </section>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onOpenTemple(mural.templeId)}
              className="min-h-11 rounded-full bg-cinnabar px-6 py-3 font-serif text-sm text-rice transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice"
            >
              {t("detail.goToTemple", { name: muralCopy.templeName })}
            </button>
            <button
              type="button"
              onClick={onSeeOtherElements}
              className="min-h-11 rounded-full border border-stone/25 px-6 py-3 font-serif text-sm text-stone transition-colors hover:border-stone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              {t("detail.seeOtherElements")}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
