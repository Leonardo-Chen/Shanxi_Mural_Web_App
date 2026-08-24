"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

interface DragIndicatorProps {
  visible: boolean;
  placement?: "bottom-left" | "bottom-center";
}

export default function DragIndicator({
  visible,
  placement = "bottom-left",
}: DragIndicatorProps) {
  const { locale, t } = useLocale();

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none hint-bob fixed z-40 ${
        placement === "bottom-center"
          ? "bottom-5 left-1/2 -translate-x-1/2 text-center md:bottom-6"
          : "bottom-5 left-5 md:bottom-6 md:left-6"
      }`}
      aria-hidden="true"
    >
      <p lang="en" className="type-meta-en text-ink/60">
        {t("home.dragHint")}
      </p>
      <p
        lang={locale === "zh" ? "zh-CN" : locale === "it" ? "it" : "en"}
        className="type-ui mt-1 text-ink/60"
      >
        {t("home.drag")}
      </p>
    </div>
  );
}
