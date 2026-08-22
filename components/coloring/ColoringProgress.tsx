"use client";

import { regionCount } from "@/data/coloringRegions";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ColoringProgressProps {
  coloredCount: number;
  completion: number;
}

export default function ColoringProgress({
  coloredCount,
  completion,
}: ColoringProgressProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-2">
      <p className="font-sans text-[11px] text-stone">
        {t("color.progress", { colored: coloredCount, total: regionCount })}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full bg-stone transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>
      <p className="font-sans text-[11px] text-ink/70">
        {t("color.completion", { pct: completion })}
      </p>
    </div>
  );
}
