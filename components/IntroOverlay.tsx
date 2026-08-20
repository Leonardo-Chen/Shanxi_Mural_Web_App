"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface IntroOverlayProps {
  visible: boolean;
  onStart: () => void;
}

export default function IntroOverlay({ visible, onStart }: IntroOverlayProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const targets = [
        titleRef.current,
        subtitleRef.current,
        descRef.current,
        btnRef.current,
        hintRef.current,
      ].filter(Boolean);

      if (reducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [visible, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-label={t("intro.aria")}
    >
      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        <h1
          ref={titleRef}
          className="font-serif text-4xl tracking-wide text-ink md:text-5xl"
        >
          {t("brand.siteName")}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-3 font-sans text-xs tracking-[0.35em] text-stone"
        >
          {t("brand.siteSubtitle")}
        </p>
        <p
          ref={descRef}
          className="mx-auto mt-8 max-w-sm font-serif text-base leading-relaxed text-ink/80"
        >
          {t("intro.desc1")}
          <br />
          {t("intro.desc2")}
        </p>
        <button
          ref={btnRef}
          type="button"
          onClick={onStart}
          className="mt-10 rounded-sm bg-cinnabar px-10 py-3 font-sans text-sm tracking-wider text-rice transition-colors hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
        >
          {t("cover.start")}
        </button>
        <p
          ref={hintRef}
          className="mt-8 font-sans text-xs tracking-wide text-ink/45"
        >
          {t("intro.hint")}
        </p>
      </div>
    </div>
  );
}
