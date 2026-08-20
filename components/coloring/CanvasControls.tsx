"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type CanvasControlsProps = {
  canUndo: boolean;
  onUndo: () => void;
  onClear: () => void;
};

const btn =
  "flex h-11 w-11 items-center justify-center border border-ink/10 bg-rice/80 font-sans text-sm text-ink/70 shadow-sm transition-colors hover:bg-rice hover:text-ink disabled:cursor-not-allowed disabled:opacity-35";

export default function CanvasControls({
  canUndo,
  onUndo,
  onClear,
}: CanvasControlsProps) {
  const { t } = useLocale();

  return (
    <div
      className="pointer-events-auto absolute bottom-3 left-3 z-20 flex flex-col gap-1"
      role="toolbar"
      aria-label={t("color.controls")}
    >
      <button
        type="button"
        className={btn}
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={t("color.undo")}
      >
        ↺
      </button>
      <button
        type="button"
        className={btn}
        onClick={onClear}
        aria-label={t("color.clear")}
      >
        {t("color.clearShort")}
      </button>
    </div>
  );
}
