"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";

export default function CanvasInstruction({
  messageKey = "home.instruction",
}: {
  messageKey?: MessageKey;
}) {
  const { t } = useLocale();

  return (
    <p className="font-serif text-sm leading-snug text-ink md:text-base lg:text-lg">
      {t(messageKey)}
    </p>
  );
}
