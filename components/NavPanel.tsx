"use client";

import { useCallback } from "react";
import { temples } from "@/data/temples";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locTemple } from "@/lib/i18n/localize";
import type { MessageKey } from "@/lib/i18n/messages";

export type NavSection = "temples" | "stories" | "routes" | "about";

const SECTION_KEYS: Record<NavSection, MessageKey> = {
  temples: "nav.temples",
  stories: "nav.stories",
  routes: "nav.routes",
  about: "nav.about",
};

interface NavPanelProps {
  section: NavSection | null;
  onClose: () => void;
  onSelectTemple: (templeId: string) => void;
  isMobile: boolean;
}

export default function NavPanel({
  section,
  onClose,
  onSelectTemple,
  isMobile,
}: NavPanelProps) {
  const reducedMotion = useReducedMotion();
  const { locale, t } = useLocale();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!section || section !== "temples") return null;

  const title = t(SECTION_KEYS[section]);

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? "items-end" : "items-start justify-end"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        style={{
          transition: reducedMotion ? "none" : "opacity 0.35s ease",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex w-full flex-col bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[75vh] rounded-t-md"
            : "mt-20 mr-6 max-h-[min(70vh,640px)] w-full max-w-sm rounded-sm"
        }`}
        style={{
          animation: reducedMotion
            ? "none"
            : isMobile
              ? "slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "fadeScale 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-4">
          <h2 className="font-serif text-lg text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            aria-label={t("nav.close")}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-1">
            {temples.map((temple) => {
              const copy = locTemple(locale, temple);
              return (
              <li key={temple.id}>
                <button
                  type="button"
                  onClick={() => onSelectTemple(temple.id)}
                  className="w-full rounded-sm px-3 py-3 text-left transition-colors hover:bg-parchment/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                >
                  <span className="font-serif text-base text-ink">
                    {copy.name}
                  </span>
                  <span className="mt-0.5 block font-sans text-[10px] tracking-wider text-stone">
                    {copy.region} · {copy.era}
                  </span>
                  <span className="mt-1.5 block font-serif text-[12px] leading-snug text-ink/60">
                    {copy.tagline}
                  </span>
                </button>
              </li>
            );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
