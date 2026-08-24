"use client";

import type { CoverElement } from "@/data/coverElements";
import {
  CANVAS_TILE_OFFSETS,
  getCanvasPoint,
  getCanvasWidth,
} from "@/data/coverElements";
import MuralElement from "./MuralElement";

interface CoverElementFieldProps {
  elements: CoverElement[];
  viewportWidth: number;
  canvasSize: { width: number; height: number };
  tilePeriod: { x: number; y: number } | null;
  phase: "cover" | "explore";
  interactive: boolean;
  selectedId: string | null;
  focusingId?: string | null;
  reducedMotion: boolean;
  registerRef: (id: string, node: HTMLDivElement | null) => void;
  onSelect: (id: string, node: HTMLDivElement) => void;
  onOutlineComplete: (id: string) => void;
}

export default function CoverElementField({
  elements,
  viewportWidth,
  canvasSize,
  tilePeriod,
  phase,
  interactive,
  selectedId,
  focusingId = null,
  reducedMotion,
  registerRef,
  onSelect,
  onOutlineComplete,
}: CoverElementFieldProps) {
  const offsets =
    phase === "explore" && tilePeriod ? CANVAS_TILE_OFFSETS : [{ ox: 0, oy: 0 }];

  return (
    <>
      {elements.map((element) => {
        const pose = getCanvasPoint(element, viewportWidth, canvasSize);
        return offsets.map(({ ox, oy }) => {
          const origin = ox === 0 && oy === 0;
          const lockedPose =
            origin || !tilePeriod
              ? null
              : {
                  x: pose.x + ox * tilePeriod.x,
                  y: pose.y + oy * tilePeriod.y,
                  scale: 1,
                  rotation: 0,
                };

          return (
            <MuralElement
              key={`${element.id}:${ox}:${oy}`}
              ref={origin ? (node) => registerRef(element.id, node) : undefined}
              element={element}
              width={getCanvasWidth(element, viewportWidth)}
              phase={phase}
              interactive={interactive}
              selected={origin && selectedId === element.id}
              focusing={origin && focusingId === element.id}
              reducedMotion={reducedMotion}
              isRepeat={!origin}
              lockedPose={lockedPose}
              onSelect={onSelect}
              onOutlineComplete={onOutlineComplete}
            />
          );
        });
      })}
    </>
  );
}
