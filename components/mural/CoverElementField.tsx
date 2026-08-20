"use client";

import type { CoverElement } from "@/data/coverElements";
import { getCanvasWidth } from "@/data/coverElements";
import MuralElement from "./MuralElement";

interface CoverElementFieldProps {
  elements: CoverElement[];
  viewportWidth: number;
  phase: "cover" | "explore";
  interactive: boolean;
  selectedId: string | null;
  focusingId?: string | null;
  reducedMotion: boolean;
  registerRef: (id: string, node: HTMLDivElement | null) => void;
  onSelect: (id: string) => void;
  onOutlineComplete: (id: string) => void;
}

export default function CoverElementField({
  elements,
  viewportWidth,
  phase,
  interactive,
  selectedId,
  focusingId = null,
  reducedMotion,
  registerRef,
  onSelect,
  onOutlineComplete,
}: CoverElementFieldProps) {
  return (
    <>
      {elements.map((element) => (
        <MuralElement
          key={element.id}
          ref={(node) => registerRef(element.id, node)}
          element={element}
          width={getCanvasWidth(element, viewportWidth)}
          phase={phase}
          interactive={interactive}
          selected={selectedId === element.id}
          focusing={focusingId === element.id}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
          onOutlineComplete={onOutlineComplete}
        />
      ))}
    </>
  );
}
