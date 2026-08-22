"use client";

import type { Mural } from "@/data/murals";
import BoundedMuralViewer from "@/components/matching/BoundedMuralViewer";
import { locMural } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

type MuralInspectWindowProps = {
  mural: Mural;
  isMobile: boolean;
  onConfirm: () => void;
};

export default function MuralInspectWindow({
  mural,
  isMobile,
  onConfirm,
}: MuralInspectWindowProps) {
  const { locale, t } = useLocale();
  const copy = locMural(locale, mural);
  const src = copy.image || copy.thumbnail;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center ${
        isMobile ? "top-[4.75rem] justify-end px-3 pb-6" : "top-24 justify-center p-6"
      }`}
    >
      <div
        className={`pointer-events-auto flex w-full flex-col overflow-hidden bg-rice shadow-[0_18px_40px_rgba(38,36,31,0.18)] ${
          isMobile
            ? "h-[min(58svh,28rem)] max-w-lg"
            : "h-[min(28rem,calc(100vh-14rem))] max-w-4xl"
        }`}
      >
        {src ? (
          <BoundedMuralViewer src={src} alt={copy.alt} resetKey={mural.id} />
        ) : (
          <div className="h-full w-full bg-[#B8B0A4]" aria-hidden="true" />
        )}
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="pointer-events-auto mt-4 min-h-11 bg-cinnabar px-9 py-3 font-serif text-sm text-rice shadow-[0_10px_28px_rgba(38,36,31,0.2)] transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
      >
        {t("match.thisOne")}
      </button>
    </div>
  );
}
