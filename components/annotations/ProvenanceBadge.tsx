"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type ProvenanceBadgeProps = {
  muralTitle: string;
};

export default function ProvenanceBadge({ muralTitle }: ProvenanceBadgeProps) {
  const { t } = useLocale();

  return (
    <div
      className="my-5 flex items-center gap-3"
      aria-label={t("detail.from", { title: muralTitle })}
    >
      <span className="h-px flex-1 bg-stone/20" aria-hidden="true" />
      <div className="flex flex-col items-center text-center">
        <span className="mt-1 flex items-center gap-1.5 font-serif text-xs text-stone">
          <span aria-hidden="true">→</span>
          {t("detail.fromMural")}
        </span>
        <span className="mt-1 max-w-[16rem] font-serif text-[11px] leading-snug text-ink/60">
          {t("detail.from", { title: muralTitle })}
        </span>
      </div>
      <span className="h-px flex-1 bg-stone/20" aria-hidden="true" />
    </div>
  );
}
