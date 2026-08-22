"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";

type CanvasInstructionProps = {
  messageKey: MessageKey;
};

export default function CanvasInstruction({
  messageKey,
}: CanvasInstructionProps) {
  const { t } = useLocale();

  return (
    <p className="max-w-[min(40rem,100%)] text-balance text-center font-serif text-[13px] leading-snug text-cinnabar md:text-[15px]">
      {t(messageKey)}
    </p>
  );
}
