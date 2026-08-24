"use client";

import { useLayoutEffect, useRef } from "react";
import type { Figure } from "@/data/murals";
import { locFigure } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface SelectedFigureCardProps {
  figure: Figure;
  sourceRect: DOMRect | null;
  reducedMotion: boolean;
  onLanded?: () => void;
}

export default function SelectedFigureCard({
  figure,
  sourceRect,
  reducedMotion,
  onLanded,
}: SelectedFigureCardProps) {
  const { locale, t } = useLocale();
  const copy = locFigure(locale, figure);
  const cardRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLImageElement>(null);
  const landedRef = useRef(false);
  const onLandedRef = useRef(onLanded);
  onLandedRef.current = onLanded;

  const canFly = Boolean(sourceRect && figure.image && !reducedMotion);

  useLayoutEffect(() => {
    const finish = () => {
      if (landedRef.current) return;
      landedRef.current = true;
      const card = cardRef.current;
      const flyer = flyerRef.current;
      if (card) card.style.opacity = "1";
      if (flyer) {
        flyer.style.opacity = "0";
        flyer.style.visibility = "hidden";
        flyer.style.willChange = "auto";
      }
      onLandedRef.current?.();
    };

    const card = cardRef.current;
    if (!card) return;

    if (!canFly || !sourceRect) {
      card.style.opacity = "1";
      finish();
      return;
    }

    const flyer = flyerRef.current;
    const slot = slotRef.current;
    if (!flyer || !slot) {
      card.style.opacity = "1";
      finish();
      return;
    }

    const dest = slot.getBoundingClientRect();
    if (sourceRect.width < 8 || sourceRect.height < 8 || dest.width < 8) {
      card.style.opacity = "1";
      finish();
      return;
    }

    card.style.opacity = "0";
    const scale = Math.min(
      dest.width / sourceRect.width,
      dest.height / sourceRect.height
    );
    const endX = dest.left + (dest.width - sourceRect.width * scale) / 2;
    const endY = dest.top + (dest.height - sourceRect.height * scale) / 2;
    const from = `translate3d(${sourceRect.left}px, ${sourceRect.top}px, 0)`;
    const to = `translate3d(${endX}px, ${endY}px, 0) scale(${scale})`;

    flyer.style.visibility = "visible";
    flyer.style.opacity = "1";
    flyer.style.width = `${sourceRect.width}px`;
    flyer.style.height = `${sourceRect.height}px`;
    flyer.style.transformOrigin = "0 0";
    flyer.style.willChange = "transform";
    flyer.style.transform = from;

    let cancelled = false;
    const animation = flyer.animate([{ transform: from }, { transform: to }], {
      duration: 480,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards",
    });

    const fallback = window.setTimeout(() => {
      if (!cancelled) finish();
    }, 640);
    animation.onfinish = () => {
      if (cancelled) return;
      window.clearTimeout(fallback);
      finish();
    };

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      animation.cancel();
    };
  }, [canFly, figure.id, sourceRect]);

  return (
    <>
      {canFly ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={flyerRef}
          src={figure.image}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="sync"
          className="pointer-events-none fixed left-0 top-0 z-[90] object-contain"
        />
      ) : null}

      <div className="pointer-events-none fixed inset-y-0 left-4 right-4 z-[82] flex items-center md:left-6 md:right-auto">
        <aside
          ref={cardRef}
          className="pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-2xl border border-ink/12 bg-rice shadow-[0_16px_40px_rgb(33_51_56_/_14%)] md:h-[min(32rem,calc(100svh-6rem))] md:w-[280px]"
          aria-label={t("match.figureAria", { name: copy.displayName })}
          style={{ opacity: canFly ? 0 : 1 }}
        >
          <div
            ref={slotRef}
            className="flex h-24 w-full min-h-0 items-center justify-center bg-parchment/70 p-4 md:h-auto md:flex-1"
          >
            {figure.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={figure.image}
                alt={copy.imageAlt ?? copy.displayName}
                draggable={false}
                decoding="async"
                className="h-full w-full select-none object-contain"
              />
            ) : (
              <div
                className="h-full max-h-52 w-[42%] min-w-10 bg-[#B7AFA3]"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="min-w-0 shrink-0 px-4 py-3 md:p-5">
            <p className="type-meta text-cinnabar">{t("detail.selectedFigure")}</p>
            <h2 className="type-card mt-1.5">{copy.displayName}</h2>
            {copy.category && (
              <p className="type-meta mt-1.5 text-gold">{copy.category}</p>
            )}
            <p className="type-body mt-2 line-clamp-3 text-ink/80">
              {copy.shortDescription}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
