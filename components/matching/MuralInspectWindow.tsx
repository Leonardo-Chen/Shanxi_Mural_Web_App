"use client";

import { useMemo } from "react";
import type { Mural } from "@/data/murals";
import { elements, muralById } from "@/data/muralData";
import MuralInfoPanel from "@/components/annotations/MuralInfoPanel";
import BoundedMuralViewer from "@/components/matching/BoundedMuralViewer";
import { locMural } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

type MuralInspectWindowProps = {
  mural: Mural;
  isMobile: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onOpenTemple: (templeId: string) => void;
};

export default function MuralInspectWindow({
  mural,
  isMobile,
  onConfirm,
  onClose,
  onOpenTemple,
}: MuralInspectWindowProps) {
  const { locale, t } = useLocale();
  const copy = locMural(locale, mural);
  const src = copy.thumbnail || copy.image;
  const annotated = muralById[mural.id];
  const relatedElements = useMemo(
    () => elements.filter((element) => element.sourceMuralId === mural.id),
    [mural.id]
  );

  return (
    <div
      className={`pointer-events-none fixed z-[80] flex flex-col ${
        isMobile
          ? "inset-x-0 bottom-0 top-[4.75rem] items-center justify-end px-3 pb-6"
          : "inset-y-0 left-[22rem] right-6 items-stretch"
      }`}
    >
      <div
        className={`relative flex min-h-0 w-full items-center ${
          isMobile ? "max-w-lg" : "flex-1"
        }`}
      >
        <div
          className={`pointer-events-auto flex w-full overflow-hidden rounded-2xl border border-ink/12 bg-rice shadow-[0_18px_40px_rgba(38,36,31,0.18)] ${
            isMobile
              ? "h-[min(58svh,28rem)] flex-col"
              : "h-[min(32rem,calc(100svh-6rem))] flex-row items-stretch"
          }`}
        >
          <div
            className={`min-h-0 min-w-0 overflow-hidden bg-[#B8B0A4] ${
              isMobile ? "h-[48%] w-full" : "self-stretch w-[58%]"
            }`}
          >
            {src ? (
              <BoundedMuralViewer
                src={src}
                alt={copy.alt}
                resetKey={mural.id}
              />
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
          </div>

          <div
            className={`relative flex min-h-0 flex-col ${
              isMobile ? "flex-1" : "w-[42%] self-stretch"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("nav.close")}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-rice text-ink/60 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pr-12 md:px-6 md:pb-4 md:pr-14 md:pt-6">
              {annotated ? (
                <MuralInfoPanel
                  mural={annotated}
                  relatedElements={relatedElements}
                />
              ) : (
                <>
                  <p className="type-meta text-cinnabar">{t("detail.eyebrow")}</p>
                  <h2 className="type-page mt-2">{copy.title}</h2>
                  <p className="type-meta mt-2 text-gold">
                    {[copy.templeName, copy.period, copy.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {copy.description ? (
                    <p className="type-body mt-4 text-ink/85">{copy.description}</p>
                  ) : null}
                </>
              )}
            </div>
            <div className="shrink-0 border-t border-ink/10 bg-parchment/40 px-4 py-3 md:px-5">
              <div className="flex items-center gap-2">
                {copy.templeId ? (
                  <button
                    type="button"
                    onClick={() => onOpenTemple(copy.templeId)}
                    className="type-ui inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full border border-ink/15 bg-rice px-4 text-ink/70 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                  >
                    {t("detail.learnTemple")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onConfirm}
                  className="type-ui inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-cinnabar px-4 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
                >
                  {t("match.thisOne")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
