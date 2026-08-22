"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
  type Locale,
} from "@/lib/i18n/locales";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-0.5 border border-stone/15 bg-rice/90 p-1 shadow-sm"
    >
      {open ? (
        <>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center text-ink/70"
            aria-hidden="true"
          >
            <TranslateIcon />
          </span>
          <div
            id={listId}
            role="listbox"
            aria-label={t("language.label")}
            className="flex items-center gap-0.5"
          >
            {LOCALES.map((code: Locale) => {
              const active = locale === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  aria-label={LOCALE_NAMES[code]}
                  onClick={() => choose(code)}
                  className={`min-h-7 min-w-8 px-2 font-sans text-[10px] tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar md:text-[11px] ${
                    active
                      ? "bg-parchment text-ink"
                      : "text-ink/45 hover:text-ink"
                  }`}
                >
                  {LOCALE_SHORT[code]}
                </button>
              );
            })}
            <button
              type="button"
              aria-expanded="true"
              aria-controls={listId}
              aria-label={t("nav.close")}
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center text-ink/55 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              <Chevron up />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          aria-expanded="false"
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-label={`${t("language.label")}：${LOCALE_NAMES[locale]}`}
          onClick={() => setOpen(true)}
          className="flex min-h-7 items-center gap-1.5 px-1.5 font-sans text-[10px] tracking-wide text-ink transition-colors hover:text-ink/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar md:text-[11px]"
        >
          <span className="flex h-7 w-7 items-center justify-center text-ink/70">
            <TranslateIcon />
          </span>
          {LOCALE_SHORT[locale]}
          <Chevron />
        </button>
      )}
    </div>
  );
}

function TranslateIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h12M9 8c0 5-2 8-6 10M12.5 8c-.4 2.2-1.6 4.2-3.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m14 20 3.2-8 3.2 8M15.2 17h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={up ? "rotate-180" : ""}
    >
      <path
        d="M1.5 3L4 5.5L6.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
