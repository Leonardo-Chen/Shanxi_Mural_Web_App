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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={`${t("language.label")}：${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="nav-chip type-ui gap-2 px-2"
      >
        <span className="flex h-11 w-8 items-center justify-center text-ink/70" aria-hidden="true">
          <TranslateIcon />
        </span>
        {LOCALE_SHORT[locale]}
        <Chevron up={open} />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={t("language.label")}
          className="absolute right-0 top-[calc(100%+6px)] z-[90] flex min-w-full flex-col overflow-hidden rounded-2xl border border-ink/15 bg-rice/95 py-1 shadow-[0_12px_28px_rgb(33_51_56_/_14%)] backdrop-blur-md"
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
                className={`type-ui px-4 py-2.5 text-left transition-colors duration-200 ${
                  active
                    ? "bg-parchment text-ink"
                    : "text-ink/55 hover:bg-parchment hover:text-cinnabar"
                }`}
              >
                {LOCALE_NAMES[code]}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function TranslateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h12M9 8c0 5-2 8-6 10M12.5 8c-.4 2.2-1.6 4.2-3.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m14 20 3.2-8 3.2 8M15.2 17h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 8 8"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${up ? "rotate-180" : ""}`}
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
