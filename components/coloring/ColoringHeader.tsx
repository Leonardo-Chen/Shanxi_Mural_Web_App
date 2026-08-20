"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type ColoringHeaderProps = {
  stage: "coloring" | "comparison";
};

export default function ColoringHeader({ stage }: ColoringHeaderProps) {
  const { t } = useLocale();
  const isCompare = stage === "comparison";

  return (
    <div className="pointer-events-none relative z-10 flex shrink-0 flex-col items-center px-4 pt-14 text-center md:pt-[4.5rem]">
      <h1 className="font-serif text-[1.5rem] tracking-wide text-ink md:text-[1.75rem]">
        {isCompare ? t("color.compareHeader") : t("color.header")}
      </h1>
      <p className="mt-0.5 max-w-xl font-sans text-[11px] leading-snug text-stone">
        {isCompare ? t("color.compareHint") : t("color.headerHint")}
      </p>
    </div>
  );
}
