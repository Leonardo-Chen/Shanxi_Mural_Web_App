"use client";

import type { BrushSettings } from "@/utils/drawingTools";

interface BrushSettingsPanelProps {
  brush: BrushSettings;
  onChange: (brush: BrushSettings) => void;
}

export default function BrushSettingsPanel({
  brush,
  onChange,
}: BrushSettingsPanelProps) {
  return (
    <div className="space-y-3 border-t border-ink/10 pt-3">
      <label className="block">
        <span className="mb-1 block font-sans text-[10px] tracking-wide text-stone">
          笔触大小 · {Math.round(brush.size)}
        </span>
        <input
          type="range"
          min={4}
          max={48}
          value={brush.size}
          onChange={(e) =>
            onChange({ ...brush, size: Number(e.target.value) })
          }
          className="w-full accent-cinnabar"
          aria-label="笔触大小"
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-sans text-[10px] tracking-wide text-stone">
          透明度 · {Math.round(brush.opacity * 100)}%
        </span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(brush.opacity * 100)}
          onChange={(e) =>
            onChange({ ...brush, opacity: Number(e.target.value) / 100 })
          }
          className="w-full accent-cinnabar"
          aria-label="透明度"
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-sans text-[10px] tracking-wide text-stone">
          纹理强度 · {Math.round(brush.textureStrength * 100)}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(brush.textureStrength * 100)}
          onChange={(e) =>
            onChange({
              ...brush,
              textureStrength: Number(e.target.value) / 100,
            })
          }
          className="w-full accent-cinnabar"
          aria-label="纹理强度"
        />
      </label>
    </div>
  );
}
