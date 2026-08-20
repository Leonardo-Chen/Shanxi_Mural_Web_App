"use client";

import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import type { CoverElement } from "@/data/coverElements";
import { getSlotDisplayState, PLACEHOLDER_TONES } from "@/data/coverElements";
import { getElementByAssetFile } from "@/data/muralData";
import ElementTooltip from "@/components/annotations/ElementTooltip";
import OutlineAnimation from "./OutlineAnimation";
import { locCoverAlt, locElement } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

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
    const tooltipId = useId();
    const { locale } = useLocale();
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

    const annotation = useMemo(
      () => getElementByAssetFile(element.fileName),
      [element.fileName]
    );

    const localizedAnnotation = useMemo(() => {
      if (!annotation) return null;
      return locElement(locale, annotation);
    }, [annotation, locale]);

    const showTooltip =
      phase === "explore" &&
      interactive &&
      Boolean(localizedAnnotation) &&
      (hovered || focused || selected);

    const assignRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const captureRect = useCallback((node: HTMLDivElement) => {
      setAnchorRect(node.getBoundingClientRect());
    }, []);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive) return;
        event.stopPropagation();
        captureRect(event.currentTarget);
        onSelect(element.id);
      },
      [captureRect, element.id, interactive, onSelect]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          captureRect(event.currentTarget);
          onSelect(element.id);
        }
      },
      [captureRect, element.id, interactive, onSelect]
    );

    const imageNearCenter = useMemo(() => {
      const dx = Math.abs(element.canvasPosition.x - 2800);
      const dy = Math.abs(element.canvasPosition.y - 1900);
      return dx < 1100 && dy < 800;
    }, [element.canvasPosition.x, element.canvasPosition.y]);

    const displayName =
      localizedAnnotation?.displayName ??
      locCoverAlt(locale, element.id, element.alt);

    return (
      <div
        ref={assignRef}
        data-element-interactive
        data-mural-element={element.id}
        data-slot-state={slotState}
        data-selected={selected ? "true" : "false"}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : -1}
        aria-label={interactive ? displayName : undefined}
        aria-describedby={showTooltip ? tooltipId : undefined}
        aria-hidden={interactive ? undefined : true}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(event) => {
          if (!interactive || phase !== "explore") return;
          setHovered(true);
          captureRect(event.currentTarget);
        }}
        onMouseLeave={() => setHovered(false)}
        onFocus={(event) => {
          if (!interactive || phase !== "explore") return;
          setFocused(true);
          captureRect(event.currentTarget);
        }}
        onBlur={() => setFocused(false)}
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
              alt={displayName}
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

        {localizedAnnotation && (
          <ElementTooltip
            id={tooltipId}
            category={localizedAnnotation.category}
            displayName={localizedAnnotation.displayName}
            shortDescription={localizedAnnotation.shortDescription}
            anchorRect={anchorRect}
            visible={showTooltip}
          />
        )}
      </div>
    );
  }
);

export default MuralElement;
