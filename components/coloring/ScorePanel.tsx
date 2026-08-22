"use client";

import type { ScoreResult } from "@/utils/colorScoring";
import { coloringArtwork } from "@/data/coloringArtwork";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locColoringRegion } from "@/lib/i18n/localize";

interface ScorePanelProps {
  score: ScoreResult;
}

export default function ScorePanel({ score }: ScorePanelProps) {
  const { locale, t } = useLocale();
  const lowCompletion =
    score.completion < coloringArtwork.completionThreshold * 100;

  return (
    <div className="rounded-sm border border-ink/10 bg-rice/80 p-5 backdrop-blur-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={t("color.statSim")} value={score.colorSimilarity} />
        <Stat label={t("color.statFill")} value={score.completion} suffix="%" />
        <Stat label={t("color.statFinal")} value={score.finalScore} highlight />
      </div>

      {lowCompletion && (
        <p className="mt-4 font-sans text-[11px] text-ochre">
          {t("color.scoreNote")}
        </p>
      )}

      <p className="mt-4 font-serif text-sm leading-relaxed text-ink/75">
        {t(
          score.colorSimilarity >= 75
            ? "color.evalHigh"
            : score.colorSimilarity >= 50
              ? "color.evalMid"
              : "color.evalLow"
        )}
      </p>

      {score.bestRegion && (
        <p className="mt-3 font-sans text-[11px] text-stone">
          {t("color.best", {
            name: locColoringRegion(
              locale,
              score.bestRegion.id,
              score.bestRegion.name
            ),
            sim: score.bestRegion.similarity,
          })}
        </p>
      )}
      {score.worstRegion && score.worstRegion.id !== score.bestRegion?.id && (
        <p className="font-sans text-[11px] text-stone">
          {t("color.worst", {
            name: locColoringRegion(
              locale,
              score.worstRegion.id,
              score.worstRegion.name
            ),
            sim: score.worstRegion.similarity,
          })}
        </p>
      )}

      <p className="mt-4 border-t border-ink/10 pt-4 font-sans text-[10px] leading-relaxed text-stone">
        {t("color.scoreFoot")}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  highlight = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] tracking-wide text-stone">{label}</p>
      <p
        className={`mt-1 font-serif text-2xl ${
          highlight ? "text-cinnabar" : "text-ink"
        }`}
      >
        {value}
        {suffix}
      </p>
    </div>
  );
}
