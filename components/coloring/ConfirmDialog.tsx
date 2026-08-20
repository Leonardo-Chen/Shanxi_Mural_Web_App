"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/35 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coloring-dialog-title"
        className="w-full max-w-sm border border-ink/10 bg-rice p-6 shadow-[0_8px_24px_rgba(38,36,31,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="coloring-dialog-title"
          className="font-serif text-lg text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 font-serif text-sm leading-relaxed text-ink/70">
          {body}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-11 px-4 font-sans text-xs tracking-wide text-stone hover:text-ink"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 bg-cinnabar px-4 font-sans text-xs tracking-wide text-rice hover:bg-cinnabar/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
