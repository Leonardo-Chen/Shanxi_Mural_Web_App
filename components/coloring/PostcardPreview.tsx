"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

type PostcardPreviewProps = {
  imageDataUrl: string;
  title: string;
  stars: number;
  onDownload: () => void;
  onClose: () => void;
};

export default function PostcardPreview({
  imageDataUrl,
  title,
  stars,
  onDownload,
  onClose,
}: PostcardPreviewProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[92] flex items-center justify-center bg-ink/40 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="postcard-preview-title"
        className="max-h-[90svh] w-full max-w-md overflow-y-auto border border-ink/10 bg-rice p-5 shadow-[0_10px_28px_rgba(38,36,31,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="postcard-preview-title"
          className="font-serif text-lg text-ink"
        >
          {t("color.savePostcard")}
        </h2>
        <p className="mt-1 font-sans text-xs text-stone">
          {title} · {stars} / 5
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageDataUrl}
          alt={t("color.postcardAlt", { title })}
          className="mt-4 w-full border border-ink/10 object-contain"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-11 px-4 font-sans text-xs text-stone hover:text-ink"
          >
            {t("nav.close")}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="min-h-11 bg-cinnabar px-4 font-sans text-xs tracking-wide text-rice"
          >
            {t("color.downloadPng")}
          </button>
        </div>
      </div>
    </div>
  );
}
