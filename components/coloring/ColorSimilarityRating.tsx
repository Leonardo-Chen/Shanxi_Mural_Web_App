"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type ColorSimilarityRatingProps = {
  stars: number;
  incomplete: boolean;
  reveal: boolean;
};

export default function ColorSimilarityRating({
  stars,
  incomplete,
  reveal,
}: ColorSimilarityRatingProps) {
  const { t } = useLocale();
  return (
    <div className="mt-4 shrink-0 pb-2 text-center">
      <p className="font-sans text-[10px] tracking-[0.22em] text-stone">
        {t("color.similarityEyebrow")}
      </p>
      <p
        className="mt-2 font-serif text-lg text-ochre"
        aria-label={t("color.simAria", { stars })}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`inline-block px-0.5 transition-opacity duration-300 ${
              reveal && index < stars ? "opacity-100" : "opacity-30"
            }`}
            style={{
              transitionDelay: reveal ? `${index * 90}ms` : "0ms",
            }}
          >
            {index < stars ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-2 font-sans text-sm text-ink/70">
          {stars} / 5
        </span>
      </p>
      <p className="mt-2 font-sans text-[10px] text-stone/80">
        {t("color.comparedWith")}
      </p>
      {incomplete && (
        <p className="mt-2 font-sans text-[10px] text-ink/55">
          {t("color.incompleteRef")}
        </p>
      )}
    </div>
  );
}
