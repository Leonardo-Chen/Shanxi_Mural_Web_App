"use client";

import { forwardRef, useCallback, useMemo } from "react";
import type { CoverElement } from "@/data/coverElements";
import { getSlotDisplayState, PLACEHOLDER_TONES } from "@/data/coverElements";
import OutlineAnimation from "./OutlineAnimation";

interface MuralElementProps {
  element: CoverElement;
  width: number;
  phase: "cover" | "explore";
  interactive: boolean;
  selected: boolean;
  focusing?: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onOutlineComplete: (id: string) => void;
}

const MuralElement = forwardRef<HTMLDivElement, MuralElementProps>(
  function MuralElement(
    {
      element,
      width,
      phase,
      interactive,
      selected,
      focusing = false,
      reducedMotion,
      onSelect,
      onOutlineComplete,
    },
    ref
  ) {
    const height = width / element.coverPosition.aspectRatio;
    const slotState = getSlotDisplayState(element);
    const isPlaceholder = slotState === "placeholder";
    const tone = PLACEHOLDER_TONES[element.tone % PLACEHOLDER_TONES.length];

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        if (!interactive) return;
        event.stopPropagation();
        onSelect(element.id);
      },
      [element.id, interactive, onSelect]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!interactive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(element.id);
        }
      },
      [element.id, interactive, onSelect]
    );

    const imageNearCenter = useMemo(() => {
      const dx = Math.abs(element.canvasPosition.x - 2800);
      const dy = Math.abs(element.canvasPosition.y - 1900);
      return dx < 1100 && dy < 800;
    }, [element.canvasPosition.x, element.canvasPosition.y]);

    return (
      <div
        ref={ref}
        data-element-interactive
        data-mural-element={element.id}
        data-slot-state={slotState}
        data-selected={selected ? "true" : "false"}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : -1}
        aria-label={interactive ? element.alt : undefined}
        aria-hidden={interactive ? undefined : true}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="mural-slot absolute left-0 top-0 select-none"
        style={{
          width,
          height,
          zIndex: selected || focusing
            ? 40
            : element.canvasPosition.zIndex ?? element.coverPosition.zIndex,
          pointerEvents: interactive ? "auto" : "none",
          cursor: interactive ? "pointer" : "default",
        }}
      >
        <div className="mural-slot-visual relative h-full w-full" data-mural-drift>
          {isPlaceholder ? (
            <div
              className="mural-slot-placeholder"
              aria-hidden="true"
              style={{ backgroundColor: tone }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={element.src}
              alt={element.alt}
              draggable={false}
              loading={phase === "cover" || imageNearCenter ? "eager" : "lazy"}
              className="h-full w-full select-none object-contain"
            />
          )}

          {phase === "explore" && (
            <OutlineAnimation
              active={selected}
              width={width}
              height={height}
              reducedMotion={reducedMotion}
              onComplete={() => onOutlineComplete(element.id)}
            />
          )}
        </div>
      </div>
    );
  }
);

export default MuralElement;
