"use client";

import { coloringPalette } from "@/data/coloringPalette";

interface ColorPaletteProps {
  selectedId: string;
  customColor: string;
  onSelect: (id: string, hex: string) => void;
  onCustomChange: (hex: string) => void;
  compact?: boolean;
}

export default function ColorPalette({
  selectedId,
  customColor,
  onSelect,
  onCustomChange,
  compact = false,
}: ColorPaletteProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${compact ? "flex-row overflow-x-auto pb-1" : ""}`}
      role="listbox"
      aria-label="传统色板"
    >
      {coloringPalette.map((c) => {
        const active = selectedId === c.id;
        return (
          <button
            key={c.id}
            type="button"
            role="option"
            aria-selected={active}
            aria-label={`${c.name} ${c.hex}`}
            title={`${c.source} · ${c.hex}`}
            onClick={() => onSelect(c.id, c.hex)}
            className={`group flex items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar ${
              compact ? "shrink-0" : "w-full"
            } ${active ? "bg-rice/90 ring-1 ring-ink/15" : "hover:bg-rice/50"}`}
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full border border-ink/10"
              style={{ backgroundColor: c.hex }}
            />
            {!compact && (
              <span className="min-w-0 flex-1">
                <span className="block font-sans text-[11px] text-ink">
                  {c.name}
                </span>
                <span className="block font-sans text-[9px] uppercase tracking-wider text-stone/70">
                  {c.hex}
                </span>
              </span>
            )}
            {compact && (
              <span className="font-sans text-[10px] text-ink">{c.name}</span>
            )}
          </button>
        );
      })}

      <div
        className={`mt-1 border-t border-ink/10 pt-2 ${compact ? "shrink-0 border-t-0 border-l pl-2 pt-0" : ""}`}
      >
        <label className="flex items-center gap-2 px-2 py-1">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              onCustomChange(e.target.value);
              onSelect("custom", e.target.value);
            }}
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            aria-label="自选颜色"
          />
          {!compact && (
            <span className="font-sans text-[10px] text-stone">自选颜色</span>
          )}
        </label>
      </div>
    </div>
  );
}
