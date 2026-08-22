"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type FinishColoringButtonProps = {
  onClick: () => void;
};

export default function FinishColoringButton({
  onClick,
}: FinishColoringButtonProps) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex min-h-12 min-w-[220px] items-center justify-center bg-cinnabar px-10 py-2.5 font-serif text-base tracking-wide text-rice shadow-[0_4px_12px_rgba(139,53,46,0.22)] transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
    >
      {t("color.finish")}
    </button>
  );
}
