"use client";

import type { PigmentColor } from "@/data/coloringPalette";
import PigmentSwatch from "./PigmentSwatch";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locPigment } from "@/lib/i18n/localize";

const WELLS: Array<[number, number]> = [
  [78, 78],
  [136, 64],
  [196, 70],
  [254, 84],
  [300, 112],
  [92, 140],
  [152, 132],
  [212, 138],
  [268, 158],
  [168, 186],
];

type PigmentPaletteProps = {
  palette: PigmentColor[];
  selectedId: string;
  usedValues?: Set<string>;
  interactive?: boolean;
  compact?: boolean;
  onSelect: (color: PigmentColor) => void;
};

export default function PigmentPalette({
  palette,
  selectedId,
  usedValues,
  interactive = true,
  compact = false,
  onSelect,
}: PigmentPaletteProps) {
  const selected = palette.find((color) => color.id === selectedId);
  const { locale, t } = useLocale();
  const pigmentName = (color: PigmentColor) =>
    locPigment(locale, color.id, color.nameZh);

  if (compact) {
    return (
      <div className="w-full">
        <div
          className="flex gap-3 overflow-x-auto px-1 py-2"
          role="listbox"
          aria-label={t("color.pigments")}
        >
          {palette.map((color) => (
            <div key={color.id} className="shrink-0">
              <PigmentSwatch
                color={color}
                selected={color.id === selectedId}
                interactive={interactive}
                dimmed={
                  usedValues
                    ? !usedValues.has(color.value.toLowerCase())
                    : false
                }
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
        {selected && interactive && (
          <p className="mt-1 text-center font-sans text-[10px] text-stone">
            {pigmentName(selected)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full max-w-[360px]">
        <svg
          viewBox="0 0 360 250"
          className="h-auto w-full drop-shadow-[0_10px_18px_rgba(38,36,31,0.18)]"
          aria-hidden="true"
        >
          <defs>
            <filter id="palette-grain" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="table" tableValues="0 0.22" />
              </feComponentTransfer>
            </filter>
          </defs>
          <path
            d="M48 46C24 88 32 176 92 214C154 248 268 236 318 176C352 128 338 58 278 38C208 14 84 16 48 46Z"
            fill="#3E6264"
          />
          <path
            d="M48 46C24 88 32 176 92 214C154 248 268 236 318 176C352 128 338 58 278 38C208 14 84 16 48 46Z"
            fill="#2f4c4e"
            opacity="0.35"
          />
          <path
            d="M48 46C24 88 32 176 92 214C154 248 268 236 318 176C352 128 338 58 278 38C208 14 84 16 48 46Z"
            filter="url(#palette-grain)"
          />
        </svg>

        {palette.map((color, index) => {
          const well = WELLS[index];
          if (!well) return null;
          const [x, y] = well;
          return (
            <div
              key={color.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(x / 360) * 100}%`, top: `${(y / 250) * 100}%` }}
            >
              <PigmentSwatch
                color={color}
                selected={interactive && color.id === selectedId}
                interactive={interactive}
                dimmed={
                  usedValues
                    ? !usedValues.has(color.value.toLowerCase())
                    : false
                }
                onSelect={onSelect}
              />
            </div>
          );
        })}
      </div>

      {selected && interactive && (
        <p className="mt-3 font-sans text-[11px] tracking-wide text-stone">
          {pigmentName(selected)}
        </p>
      )}

      <ul className="mt-4 grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-1.5">
        {palette.map((color) => (
          <li key={color.id} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full border border-ink/15"
              style={{
                backgroundColor: color.value,
                opacity:
                  usedValues && !usedValues.has(color.value.toLowerCase())
                    ? 0.35
                    : 1,
              }}
            />
            <span className="font-sans text-[10px] text-ink/80">
              {pigmentName(color)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
