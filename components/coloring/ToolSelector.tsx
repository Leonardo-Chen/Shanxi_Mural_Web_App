"use client";

import type { DrawingTool } from "@/utils/drawingTools";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const tools: { id: DrawingTool; key: MessageKey; icon: string }[] = [
  { id: "crayon", key: "color.crayon", icon: "◐" },
  { id: "pencil", key: "color.pencil", icon: "／" },
  { id: "eraser", key: "color.eraser", icon: "⌫" },
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
  const { t } = useLocale();

  return (
    <div
      className={`flex gap-1 ${compact ? "flex-row" : "flex-col"}`}
      role="toolbar"
      aria-label={t("color.tools")}
    >
      {tools.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={t(item.key)}
          aria-pressed={tool === item.id}
          onClick={() => onChange(item.id)}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-sm border font-sans text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar ${
            compact ? "flex-1 flex-col px-2 py-2" : "h-10 w-full px-2"
          } ${
            tool === item.id
              ? "border-cinnabar/40 bg-cinnabar/10 text-ink"
              : "border-ink/10 bg-rice/40 text-ink/70 hover:border-ink/25 hover:text-ink"
          }`}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span className={compact ? "text-[10px]" : ""}>{t(item.key)}</span>
        </button>
      ))}
    </div>
  );
}
