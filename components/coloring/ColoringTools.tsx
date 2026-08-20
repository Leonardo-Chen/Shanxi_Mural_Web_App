"use client";

import type { InteractionMode, PaintSizeId, PaintTool } from "@/utils/drawingTools";
import { useLocale } from "@/components/i18n/LocaleProvider";

type ColoringToolsProps = {
  mode: InteractionMode;
  tool: PaintTool;
  sizeId: PaintSizeId;
  onModeChange: (mode: InteractionMode) => void;
  onToolChange: (tool: PaintTool) => void;
  onSizeChange: (sizeId: PaintSizeId) => void;
  onFit: () => void;
};

const cell =
  "min-h-11 flex-1 border border-ink/10 px-2 font-sans text-[11px] tracking-wide transition-colors";

export default function ColoringTools({
  mode,
  tool,
  sizeId,
  onModeChange,
  onToolChange,
  onSizeChange,
  onFit,
}: ColoringToolsProps) {
  const { t } = useLocale();

  return (
    <div className="mb-5 w-full max-w-sm shrink-0 space-y-4">
      <div>
        <p className="mb-2 font-sans text-[10px] tracking-[0.18em] text-stone">
          {t("color.ops")}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-pressed={mode === "paint"}
            onClick={() => onModeChange("paint")}
            className={`${cell} ${
              mode === "paint" ? "bg-cinnabar text-rice" : "bg-rice/70 text-ink/75"
            }`}
          >
            {t("color.brush")}
          </button>
          <button
            type="button"
            aria-pressed={mode === "pan"}
            onClick={() => onModeChange("pan")}
            className={`${cell} ${
              mode === "pan" ? "bg-cinnabar text-rice" : "bg-rice/70 text-ink/75"
            }`}
          >
            {t("color.pan")}
          </button>
        </div>
        <p className="mt-1.5 font-sans text-[10px] text-stone/80">
          {mode === "pan" ? t("color.panHint") : t("color.paintHint")}
        </p>
      </div>

      <div className={mode === "pan" ? "opacity-40" : ""}>
        <p className="mb-2 font-sans text-[10px] tracking-[0.18em] text-stone">
          {t("color.stroke")}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-pressed={tool === "crayon"}
            disabled={mode === "pan"}
            onClick={() => onToolChange("crayon")}
            className={`${cell} ${
              tool === "crayon" ? "bg-stone text-rice" : "bg-rice/70 text-ink/75"
            }`}
          >
            {t("color.crayon")}
          </button>
          <button
            type="button"
            aria-pressed={tool === "spray"}
            disabled={mode === "pan"}
            onClick={() => onToolChange("spray")}
            className={`${cell} ${
              tool === "spray" ? "bg-stone text-rice" : "bg-rice/70 text-ink/75"
            }`}
          >
            {t("color.airbrush")}
          </button>
        </div>
      </div>

      <div className={mode === "pan" ? "opacity-40" : ""}>
        <p className="mb-2 font-sans text-[10px] tracking-[0.18em] text-stone">
          {t("color.size")}
        </p>
        <div className="flex gap-1">
          {(
            [
              ["fine", "color.fine"],
              ["medium", "color.medium"],
              ["broad", "color.broad"],
            ] as const
          ).map(([id, key]) => (
            <button
              key={id}
              type="button"
              aria-pressed={sizeId === id}
              disabled={mode === "pan"}
              onClick={() => onSizeChange(id)}
              className={`${cell} ${
                sizeId === id ? "bg-stone text-rice" : "bg-rice/70 text-ink/75"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onFit}
        className="min-h-11 w-full font-sans text-[11px] tracking-wide text-stone hover:text-ink"
      >
        {t("color.resetView")}
      </button>
    </div>
  );
}
