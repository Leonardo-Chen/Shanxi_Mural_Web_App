"use client";

import ColorSimilarityRating from "./ColorSimilarityRating";
import { useLocale } from "@/components/i18n/LocaleProvider";

type OriginalMuralPanelProps = {
  originalUrl: string;
  figureName: string;
  templeName: string;
  stars: number;
  incomplete: boolean;
  revealStars: boolean;
};

export default function OriginalMuralPanel({
  originalUrl,
  figureName,
  templeName,
  stars,
  incomplete,
  revealStars,
}: OriginalMuralPanelProps) {
  const { t } = useLocale();

  return (
    <section
      data-coloring-original
      className="flex h-full min-h-0 flex-col items-center coloring-original-enter"
    >
      <h2 className="shrink-0 font-sans text-[10px] tracking-[0.22em] text-stone">
        {t("color.original")}
      </h2>
      <div className="relative mt-2 min-h-0 w-full flex-1 overflow-hidden border border-ink/10 bg-[#E9E2D4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalUrl}
          alt={t("color.originalFigAlt", {
            temple: templeName,
            figure: figureName,
          })}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          draggable={false}
        />
      </div>
      <div className="shrink-0">
        <ColorSimilarityRating
          stars={stars}
          incomplete={incomplete}
          reveal={revealStars}
        />
      </div>
    </section>
  );
}
