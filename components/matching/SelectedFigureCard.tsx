"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import ElementInfoCard from "@/components/annotations/ElementInfoCard";
import type { Figure } from "@/data/murals";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locFigure } from "@/lib/i18n/localize";

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
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLocale();
  const copy = locFigure(locale, figure);
  const displayName = copy.displayName;
  const descriptionId = `selected-figure-${figure.id}`;

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
      aria-label={t("match.figureAria", { name: displayName })}
    >
      <div ref={bodyRef} className="min-h-0 min-w-0 flex-1">
        <ElementInfoCard
          compact
          describedById={descriptionId}
          imageSrc={figure.image}
          imageAlt={copy.imageAlt}
          element={{
            displayName,
            researchName: copy.researchName,
            category: copy.category ?? "",
            shortDescription: copy.shortDescription,
            aliases: [],
          }}
        />
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  );
}
