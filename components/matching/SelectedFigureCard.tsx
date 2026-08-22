"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Figure } from "@/data/murals";
import { locFigure } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface SelectedFigureCardProps {
  figure: Figure;
  sourceRect: DOMRect | null;
  reducedMotion: boolean;
  onClose: () => void;
}

export default function SelectedFigureCard({
  figure,
  sourceRect,
  reducedMotion,
  onClose,
}: SelectedFigureCardProps) {
  const { locale, t } = useLocale();
  const copy = locFigure(locale, figure);
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (reducedMotion || !sourceRect) {
      gsap.set(card, { opacity: 1, clearProps: "transform" });
      gsap.set(bodyRef.current, { opacity: 1 });
      return;
    }

    const target = card.getBoundingClientRect();
    const scaleX = sourceRect.width / Math.max(target.width, 1);
    const scaleY = sourceRect.height / Math.max(target.height, 1);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          x: sourceRect.left - target.left,
          y: sourceRect.top - target.top,
          scaleX,
          scaleY,
          transformOrigin: "0 0",
          opacity: 1,
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.78,
          ease: "power3.inOut",
          clearProps: "transform",
        }
      );
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.5, ease: "power2.out" }
      );
    }, card);

    return () => ctx.revert();
  }, [figure.id, reducedMotion, sourceRect]);

  return (
    <aside
      ref={cardRef}
      className="fixed left-4 right-4 top-[4.5rem] z-40 flex max-h-[26svh] border border-stone/20 bg-rice/95 shadow-[0_14px_36px_rgba(38,36,31,0.13)] md:bottom-auto md:left-10 md:right-auto md:top-28 md:block md:max-h-none md:w-[270px]"
      aria-label={t("match.figureAria", { name: copy.displayName })}
    >
      <div className="flex h-24 w-[38%] shrink-0 items-center justify-center bg-parchment/70 p-3 md:h-64 md:w-full md:p-6">
        {figure.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={figure.image}
            alt={copy.imageAlt ?? copy.displayName}
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        ) : (
          <div
            className="h-full max-h-52 w-[42%] min-w-10 bg-[#B7AFA3]"
            aria-hidden="true"
          />
        )}
      </div>

      <div ref={bodyRef} className="min-w-0 flex-1 overflow-y-auto px-4 py-3 md:px-5 md:py-5">
        <p className="font-sans text-[9px] tracking-[0.2em] text-cinnabar/80">
          {t("detail.selectedFigure")}
        </p>
        <h2 className="mt-1 font-serif text-lg text-stone md:text-2xl">
          {copy.displayName}
        </h2>
        {copy.category && (
          <p className="mt-1 font-sans text-[10px] tracking-[0.12em] text-stone/55">
            {copy.category}
          </p>
        )}
        <p className="mt-2 line-clamp-4 font-serif text-xs leading-relaxed text-ink/65 md:line-clamp-none md:text-[13px]">
          {copy.shortDescription}
        </p>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label={t("match.backHome")}
        className="absolute bottom-2 right-2 z-10 flex h-8 w-8 items-center justify-center text-stone/55 transition-colors hover:text-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
      >
        ×
      </button>
    </aside>
  );
}
