"use client";

import type { CoverElement } from "@/data/coverElements";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locCoverAlt } from "@/lib/i18n/localize";

interface ElementSelectionProps {
  element: CoverElement | null;
}

/** 预留人物轮廓与浮层接口；描边与 Continue 由 MuralElement 就近渲染，避免遮挡素材。 */
export default function ElementSelection({ element }: ElementSelectionProps) {
  const { t, locale } = useLocale();
  if (!element) return null;
  return (
    <span className="sr-only">
      {t("home.selectedFigure", {
        name: locCoverAlt(locale, element.id, element.alt),
      })}
    </span>
  );
}
