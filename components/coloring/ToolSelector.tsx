"use client";

import type { DrawingTool } from "@/utils/drawingTools";

const tools: { id: DrawingTool; label: string; icon: string }[] = [
  { id: "crayon", label: "蜡笔", icon: "◐" },
  { id: "pencil", label: "铅笔", icon: "／" },
  { id: "eraser", label: "橡皮", icon: "⌫" },
];

interface ToolSelectorProps {
  tool: DrawingTool;
  onChange: (tool: DrawingTool) => void;
  compact?: boolean;
}

export default function ToolSelector({
  tool,
  onChange,
  compact = false,
}: ToolSelectorProps) {
  return (
    <div
      className={`flex gap-1 ${compact ? "flex-row" : "flex-col"}`}
      role="toolbar"
      aria-label="绘制工具"
    >
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={t.label}
          aria-pressed={tool === t.id}
          onClick={() => onChange(t.id)}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-sm border font-sans text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar ${
            compact ? "flex-1 flex-col px-2 py-2" : "h-10 w-full px-2"
          } ${
            tool === t.id
              ? "border-cinnabar/40 bg-cinnabar/10 text-ink"
              : "border-ink/10 bg-rice/40 text-ink/70 hover:border-ink/25 hover:text-ink"
          }`}
        >
          <span className="text-base leading-none">{t.icon}</span>
          <span className={compact ? "text-[10px]" : ""}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
