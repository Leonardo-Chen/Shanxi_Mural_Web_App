"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";

type CanvasInstructionProps = {
  messageKey: MessageKey;
  hintKey?: MessageKey;
  tone?: "plain" | "quest";
  floating?: boolean;
  visible?: boolean;
  onClose?: () => void;
};

export default function CanvasInstruction({
  messageKey,
  hintKey,
  tone = "plain",
  floating = false,
  visible = true,
  onClose,
}: CanvasInstructionProps) {
  const { locale, t } = useLocale();
  const lang = locale === "zh" ? "zh-CN" : locale === "it" ? "it" : "en";
  const text = t(messageKey);
  const hint = hintKey ? t(hintKey) : null;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShown(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setShown(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [visible]);

  if (tone === "quest") {
    return (
      <div className="hud-quest max-w-[min(32rem,100%)] text-center">
        <p className="type-caption tracking-[0.22em] text-cinnabar">
          {t("home.questLabel")}
        </p>
        <p lang={lang} className="type-ui mt-1 text-balance text-ink">
          {text}
        </p>
      </div>
    );
  }

  if (floating) {
    return (
      <div
        className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-700 ease-in-out ${
          shown ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!shown}
      >
        <div
          className={`relative flex max-w-[min(36rem,calc(100vw-2.5rem))] items-center rounded-3xl bg-[rgb(247_243_233_/_90%)] text-center shadow-[0_12px_40px_rgb(33_51_56_/_18%)] backdrop-blur-[8px] ${
            onClose ? "gap-1 py-3 pl-3 pr-3" : "px-9 py-6"
          }`}
        >
          {onClose ? (
            <span className="h-9 w-9 shrink-0" aria-hidden="true" />
          ) : null}
          <div className="min-w-0 flex-1 px-2">
            <p lang={lang} className="type-body text-balance text-ink">
              {text}
            </p>
            {hint ? (
              <p className="type-caption mt-1 text-ink/50">{hint}</p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgb(33_51_56_/_16%)] bg-[rgb(255_252_246_/_94%)] text-[rgb(33_51_56_/_58%)] shadow-[0_3px_8px_rgb(33_51_56_/_10%)] transition-[color,border-color,background-color,transform,opacity] duration-200 hover:scale-105 hover:border-[rgb(139_53_46_/_40%)] hover:bg-rice hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-95 ${
                shown ? "pointer-events-auto" : "pointer-events-none"
              }`}
              onClick={onClose}
              aria-label={t("nav.close")}
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
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <p
      lang={lang}
      className="type-body cover-rise max-w-[min(40rem,100%)] text-balance text-center text-ink"
    >
      {text}
    </p>
  );
}
