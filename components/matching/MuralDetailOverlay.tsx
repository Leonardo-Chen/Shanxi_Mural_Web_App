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
  const image = uiCopy.thumbnail || uiCopy.image || annotated?.imageSrc;

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
      className={`pointer-events-none fixed z-[80] flex flex-col ${
        isMobile
          ? "inset-x-0 bottom-0 top-[4.75rem] items-center justify-end px-3 pb-6"
          : "inset-y-0 left-[22rem] right-6 items-stretch"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.muralAria", { title: uiCopy.title })}
    >
      <div
        className={`relative flex min-h-0 w-full items-center ${
          isMobile ? "max-w-lg" : "flex-1"
        }`}
      >
        <article
          className={`pointer-events-auto flex w-full overflow-hidden rounded-2xl border border-ink/12 bg-rice shadow-[0_18px_40px_rgba(38,36,31,0.18)] ${
            isMobile
              ? "h-[min(72svh,36rem)] flex-col"
              : "h-[min(32rem,calc(100svh-6rem))] flex-row items-stretch"
          }`}
        >
          <div
            className={`min-h-0 min-w-0 overflow-hidden bg-[#B8B0A4] ${
              isMobile ? "h-[42%] w-full" : "w-[58%] self-stretch"
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
            className={`relative flex min-h-0 flex-col ${
              isMobile ? "flex-1" : "w-[42%] self-stretch"
            }`}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("detail.closeMural")}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-rice text-ink/60 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pr-12 md:px-6 md:pb-4 md:pr-14 md:pt-6">
              {figure.image ? (
                <section className="mb-5 flex items-center gap-3 border-b border-ink/10 pb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-parchment/80 p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={figure.image}
                      alt={figureCopy.imageAlt ?? figureCopy.displayName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="type-meta text-cinnabar">
                      {t("detail.foundElement")}
                    </p>
                    <p className="type-card mt-1">{figureCopy.displayName}</p>
                    {figureCopy.category ? (
                      <p className="type-meta mt-1 text-gold">
                        {figureCopy.category}
                      </p>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {annotated ? (
                <MuralInfoPanel
                  mural={annotated}
                  relatedElements={relatedElements}
                />
              ) : (
                <>
                  <p className="type-meta text-cinnabar">
                    {t("detail.eyebrow")}
                  </p>
                  <h2 className="type-page mt-2">{uiCopy.title}</h2>
                  <p className="type-meta mt-2 text-gold">
                    {uiCopy.templeName} · {uiCopy.period} · {uiCopy.location}
                  </p>
                  <p className="type-body mt-4 text-ink/85">
                    {uiCopy.description}
                  </p>
                </>
              )}
            </div>

            <div className="shrink-0 border-t border-ink/10 bg-parchment/40 px-4 py-3 md:px-5">
              <button
                type="button"
                onClick={() => onOpenTemple(uiCopy.templeId)}
                className="type-ui inline-flex h-11 w-full items-center justify-center rounded-full bg-cinnabar px-4 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
              >
                {t("detail.goToTemple", { name: uiCopy.templeName })}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
