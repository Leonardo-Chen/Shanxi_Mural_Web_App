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
}

export default function SelectedFigureCard({
  figure,
  sourceRect,
  reducedMotion,
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
      gsap.set(bodyRef.current, { opacity: 1, y: 0 });
      return;
    }

    const target = card.getBoundingClientRect();
    const dx =
      sourceRect.left +
      sourceRect.width / 2 -
      (target.left + target.width / 2);
    const dy =
      sourceRect.top +
      sourceRect.height / 2 -
      (target.top + target.height / 2);
    const scale = Math.min(
      1.08,
      Math.max(
        0.58,
        Math.min(
          sourceRect.width / Math.max(target.width, 1),
          sourceRect.height / Math.max(target.height, 1)
        )
      )
    );
    const lift = Math.min(28, Math.abs(dx) * 0.035);
    const ease = gsap.parseEase("expo.out");
    const proxy = { t: 0 };

    const ctx = gsap.context(() => {
      gsap.set(card, {
        x: dx,
        y: dy,
        scale,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      gsap.set(bodyRef.current, { opacity: 0, y: 14 });

      const tl = gsap.timeline();
      tl.to(proxy, {
        t: 1,
        duration: 1.12,
        ease: "none",
        onUpdate: () => {
          const t = proxy.t;
          const e = ease(t);
          gsap.set(card, {
            x: dx * (1 - e),
            y: dy * (1 - e) - Math.sin(Math.PI * t) * lift,
            scale: scale + (1 - scale) * e,
            force3D: true,
          });
        },
        onComplete: () => {
          gsap.set(card, { x: 0, y: 0, scale: 1, clearProps: "transform" });
        },
      });
      tl.to(
        bodyRef.current,
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.48
      );
    }, card);

    return () => ctx.revert();
  }, [figure.id, reducedMotion, sourceRect]);

  return (
    <div className="pointer-events-none fixed inset-y-0 left-4 right-4 z-[82] flex items-center md:left-6 md:right-auto">
    <aside
      ref={cardRef}
      className="pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-2xl border border-ink/12 bg-rice shadow-[0_16px_40px_rgb(33_51_56_/_14%)] md:h-[min(32rem,calc(100svh-6rem))] md:w-[280px]"
      aria-label={t("match.figureAria", { name: copy.displayName })}
    >
      <div className="flex h-24 w-full min-h-0 items-center justify-center bg-parchment/70 p-4 md:h-auto md:flex-1">
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

      <div ref={bodyRef} className="min-w-0 shrink-0 px-4 py-3 md:p-5">
        <p className="type-meta text-cinnabar">
          {t("detail.selectedFigure")}
        </p>
        <h2 className="type-card mt-1.5">
          {copy.displayName}
        </h2>
        {copy.category && (
          <p className="type-meta mt-1.5 text-gold">
            {copy.category}
          </p>
        )}
        <p className="type-body mt-2 line-clamp-3 text-ink/80">
          {copy.shortDescription}
        </p>
      </div>
    </aside>
    </div>
  );
}
