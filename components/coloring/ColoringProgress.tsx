"use client";

import { regionCount } from "@/data/coloringRegions";

interface ColoringProgressProps {
  coloredCount: number;
  completion: number;
}

export default function ColoringProgress({
  coloredCount,
  completion,
}: ColoringProgressProps) {
  return (
    <div className="space-y-2">
      <p className="font-sans text-[11px] text-stone">
        已着色区域 {coloredCount} / {regionCount}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full bg-stone transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>
      <p className="font-sans text-[11px] text-ink/70">完成度 {completion}%</p>
    </div>
  );
}
