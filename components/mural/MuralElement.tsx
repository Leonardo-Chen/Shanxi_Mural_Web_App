"use client";

import { forwardRef, memo, useCallback, useMemo } from "react";
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
  isRepeat?: boolean;
  lockedPose?: { x: number; y: number; scale: number; rotation: number } | null;
  onSelect: (id: string, node: HTMLDivElement) => void;
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
      isRepeat = false,
      lockedPose = null,
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
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive) return;
        event.stopPropagation();
        onSelect(element.id, event.currentTarget);
      },
      [element.id, interactive, onSelect]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive || isRepeat) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(element.id, event.currentTarget);
        }
      },
      [element.id, interactive, isRepeat, onSelect]
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
        data-repeat={isRepeat ? "true" : undefined}
        role={interactive && !isRepeat ? "button" : undefined}
        tabIndex={interactive && !isRepeat ? 0 : -1}
        aria-label={interactive && !isRepeat ? element.alt : undefined}
        aria-hidden={interactive && !isRepeat ? undefined : true}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`mural-slot absolute left-0 top-0 select-none${
          isRepeat ? " mural-slot-repeat" : ""
        }`}
        style={{
          width,
          height,
          zIndex: selected
            ? 40
            : element.canvasPosition.zIndex ?? element.coverPosition.zIndex,
          pointerEvents: interactive ? "auto" : "none",
          cursor: interactive ? "pointer" : "default",
          ...(lockedPose
            ? {
                transform: `translate3d(${lockedPose.x}px, ${lockedPose.y}px, 0) scale(${lockedPose.scale}) rotate(${lockedPose.rotation}deg)`,
                transformOrigin: "0 0",
              }
            : null),
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
              loading={phase === "cover" || (!isRepeat && imageNearCenter) ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full select-none object-contain"
            />
          )}

          {phase === "explore" && !isRepeat && (
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

MuralElement.displayName = "MuralElement";

export default memo(MuralElement);
