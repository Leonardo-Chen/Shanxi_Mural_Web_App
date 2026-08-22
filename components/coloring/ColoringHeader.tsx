"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type ColoringHeaderProps = {
  stage: "coloring" | "comparison";
};

export default function ColoringHeader({ stage }: ColoringHeaderProps) {
  const { t } = useLocale();
  const isCompare = stage === "comparison";

  return (
    <div className="pointer-events-none relative z-10 flex flex-col items-center px-4 pt-16 text-center md:pt-[4.75rem]">
      <h1 className="font-serif text-[1.65rem] tracking-wide text-ink md:text-3xl">
        {isCompare ? t("color.compareHeader") : t("color.header")}
      </h1>
    </div>
  );
}
