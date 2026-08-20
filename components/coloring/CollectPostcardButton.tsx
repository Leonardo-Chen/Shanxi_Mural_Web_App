"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type CollectPostcardButtonProps = {
  collected: boolean;
  onClick: () => void;
};

export default function CollectPostcardButton({
  collected,
  onClick,
}: CollectPostcardButtonProps) {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={collected}
      className="mx-auto mt-2 flex min-h-10 min-w-[220px] items-center justify-center gap-2 bg-cinnabar px-5 font-sans text-[11px] tracking-[0.18em] text-rice shadow-[0_4px_12px_rgba(139,53,46,0.2)] transition-opacity hover:opacity-95 disabled:cursor-default disabled:opacity-100"
    >
      {collected ? t("color.collected") : t("color.collectAs")}
    </button>
  );
}
