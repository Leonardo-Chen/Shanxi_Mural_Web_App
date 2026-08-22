"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ElementTooltipProps = {
  id: string;
  category: string;
  displayName: string;
  shortDescription: string;
  anchorRect: DOMRect | null;
  visible: boolean;
};

export default function ElementTooltip({
  id,
  category,
  displayName,
  shortDescription,
  anchorRect,
  visible,
}: ElementTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible || !anchorRect) return null;

  const width = Math.min(280, Math.max(220, Math.min(anchorRect.width + 48, 280)));
  const left = Math.min(
    window.innerWidth - width - 12,
    Math.max(12, anchorRect.left + anchorRect.width / 2 - width / 2)
  );
  const below = anchorRect.bottom + 10;
  const top =
    below + 132 > window.innerHeight
      ? Math.max(12, anchorRect.top - 118)
      : below;

  return createPortal(
    <div
      id={id}
      role="tooltip"
      className="pointer-events-none fixed z-[70] border border-stone/15 bg-rice/95 px-3 py-2.5 shadow-[0_8px_22px_rgba(38,36,31,0.12)]"
      style={{ left, top, width }}
    >
      <p className="font-sans text-[9px] tracking-[0.18em] text-stone/70">
        {category}
      </p>
      <p className="mt-1 font-serif text-sm text-ink">{displayName}</p>
      <p className="mt-1 font-sans text-[11px] leading-relaxed text-ink/65">
        {shortDescription}
      </p>
    </div>,
    document.body
  );
}
