"use client";

import type { CoverElement } from "@/data/coverElements";

interface ElementSelectionProps {
  element: CoverElement | null;
}

/** 预留人物轮廓与浮层接口；描边与 Continue 由 MuralElement 就近渲染，避免遮挡素材。 */
export default function ElementSelection({ element }: ElementSelectionProps) {
  if (!element) return null;
  return (
    <span className="sr-only">
      已选择{element.alt}
    </span>
  );
}
