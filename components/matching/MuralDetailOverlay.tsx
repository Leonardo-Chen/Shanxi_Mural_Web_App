"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Figure, Mural } from "@/data/murals";
import { elements, muralById } from "@/data/muralData";
import MuralInfoPanel from "@/components/annotations/MuralInfoPanel";
import BoundedMuralViewer from "@/components/matching/BoundedMuralViewer";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locFigure, locMural } from "@/lib/i18n/localize";

interface MuralDetailOverlayProps {
  mural: Mural;
  figure: Figure;
  isMobile: boolean;
  onClose: () => void;
  onOpenTemple: (templeId: string) => void;
}

export default function MuralDetailOverlay({
  mural,
  figure,
  isMobile,
  onClose,
  onOpenTemple,
}: MuralDetailOverlayProps) {
  const { locale, t } = useLocale();
  const uiCopy = locMural(locale, mural);
  const figureCopy = locFigure(locale, figure);
  const annotated = muralById[mural.id];
  const relatedElements = useMemo(
    () => elements.filter((element) => element.sourceMuralId === mural.id),
    [mural.id]
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = uiCopy.image || uiCopy.thumbnail || annotated?.imageSrc;

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
      className={`fixed inset-x-0 bottom-0 z-[80] flex ${
        isMobile
          ? "top-[4.75rem] items-end"
          : "top-24 items-center justify-center p-6"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.muralAria", { title: uiCopy.title })}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className={`relative flex w-full overflow-hidden bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[calc(100%-0.5rem)] flex-col rounded-t-md"
            : "h-full max-h-[40rem] max-w-5xl flex-row"
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
          className={`shrink-0 bg-[#B8B0A4] ${
            isMobile ? "h-52 w-full" : "h-full w-[54%]"
          }`}
        >
          {image ? (
            <BoundedMuralViewer
              src={image}
              alt={uiCopy.alt}
              resetKey={mural.id}
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}
        </div>

        <div
          className={`min-h-0 overflow-y-auto px-6 py-6 md:px-8 md:py-10 ${
            isMobile ? "flex-1" : "h-full w-[46%]"
          }`}
        >
          {figure.image && (
            <section className="mb-6 flex items-center gap-3 border-b border-stone/15 pb-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-parchment/80 p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={figure.image}
                  alt={figureCopy.imageAlt ?? figureCopy.displayName}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[10px] tracking-[0.18em] text-cinnabar/80">
                  {t("detail.foundElement")}
                </p>
                <p className="mt-1 font-serif text-base text-stone">
                  {figureCopy.displayName}
                </p>
                {figureCopy.category && (
                  <p className="mt-0.5 font-sans text-[10px] tracking-wide text-stone/55">
                    {figureCopy.category}
                  </p>
                )}
              </div>
            </section>
          )}

          {annotated ? (
            <MuralInfoPanel
              mural={annotated}
              relatedElements={relatedElements}
            />
          ) : (
            <>
              <p className="font-sans text-[10px] tracking-[0.22em] text-cinnabar/80">
                {t("detail.eyebrow")}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-stone md:text-3xl">
                {uiCopy.title}
              </h2>
              <p className="mt-1 font-sans text-[11px] text-stone/60">
                {uiCopy.templeName} · {uiCopy.period} · {uiCopy.location}
              </p>
              <p className="mt-5 font-serif text-sm leading-7 text-ink/70">
                {uiCopy.description}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => onOpenTemple(uiCopy.templeId)}
            className="mt-7 min-h-11 bg-cinnabar px-6 py-3 font-serif text-sm text-rice transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice"
          >
            {t("detail.goToTemple", { name: uiCopy.templeName })}
          </button>
        </div>
      </article>
    </div>
  );
}
