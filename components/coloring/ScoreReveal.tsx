"use client";

import type { ScoreResult } from "@/utils/colorScoring";
import { coloringArtwork } from "@/data/coloringArtwork";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ScoreRevealProps {
  score: ScoreResult;
  onViewComparison: () => void;
  onContinue: () => void;
}

export default function ScoreReveal({
  score,
  onViewComparison,
  onContinue,
}: ScoreRevealProps) {
  const { t } = useLocale();
  const lowCompletion =
    score.completion < coloringArtwork.completionThreshold * 100;

  return (
    <div className="animate-[fadeScale_0.5s_ease-out]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[10px] tracking-wider text-stone">
            {t("color.yourColor")}
          </p>
          <p className="mt-1 font-serif text-3xl text-cinnabar">
            {score.finalScore}
            <span className="ml-1 font-sans text-sm text-stone">
              {t("color.scoreUnit")}
            </span>
          </p>
          <p className="mt-1 font-sans text-[11px] text-ink/65">
            {t("color.similarityLine", {
              sim: score.colorSimilarity,
              pct: score.completion,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-sm border border-ink/15 px-4 py-2 font-sans text-[11px] tracking-wide text-ink hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            {t("color.keepColoring")}
          </button>
          <button
            type="button"
            onClick={onViewComparison}
            className="rounded-sm bg-cinnabar px-4 py-2 font-sans text-[11px] tracking-wide text-rice hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            {t("color.seeCompare")}
          </button>
        </div>
      </div>
      {lowCompletion && (
        <p className="mt-2 font-sans text-[10px] text-ochre">
          {t("color.scoreNote")}
        </p>
      )}
      <p className="mt-2 max-w-xl font-serif text-xs leading-relaxed text-ink/70">
        {t(
          score.colorSimilarity >= 75
            ? "color.evalHigh"
            : score.colorSimilarity >= 50
              ? "color.evalMid"
              : "color.evalLow"
        )}
      </p>
    </div>
  );
}
