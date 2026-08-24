"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { pickMatchingMuralIds } from "@/data/muralMatchingLayout";
import { figureFromCoverElement, getFigure } from "@/data/murals";
import type { CoverElement } from "@/data/coverElements";
import { availableMurals } from "@/data/muralData";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import CanvasViewControls from "@/components/mural/CanvasViewControls";
import CanvasInstruction from "@/components/mural/CanvasInstruction";
import MatchingBoard from "./MatchingBoard";
import SelectedFigureCard from "./SelectedFigureCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

export type { ExperienceStage } from "./MatchingBoard";

interface MuralMatchingExperienceProps {
  figureId: string;
  coverElement?: CoverElement | null;
  sourceRect: DOMRect | null;
  isMobile: boolean;
  onOpenTemple: (templeId: string) => void;
  onReturnHome: () => void;
  hideCards?: boolean;
}

export default function MuralMatchingExperience({
  figureId,
  coverElement = null,
  sourceRect,
  isMobile,
  onOpenTemple,
  onReturnHome,
  hideCards = false,
}: MuralMatchingExperienceProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useLocale();
  const figure = useMemo(
    () =>
      coverElement
        ? figureFromCoverElement(coverElement)
        : getFigure(figureId),
    [coverElement, figureId]
  );
  const muralIds = useMemo(
    () =>
      pickMatchingMuralIds(
        availableMurals.map((mural) => mural.id),
        (figure.sourceMuralId ?? figure.correctMuralId) || undefined
      ),
    [figure.correctMuralId, figure.sourceMuralId]
  );
  const [hintVisible, setHintVisible] = useState(true);
  const [boardReady, setBoardReady] = useState(
    () => reducedMotion || !sourceRect
  );
  const { collectSticker } = useGameProgress();

  const handleFigureLanded = useCallback(() => {
    requestAnimationFrame(() => setBoardReady(true));
  }, []);

  useEffect(() => {
    const src = figure.image || coverElement?.src;
    if (!src) return;
    const rawName =
      coverElement?.fileName || src.split("/").pop() || `${figure.id}.png`;
    let fileName = rawName;
    try {
      fileName = decodeURIComponent(rawName);
    } catch {
      fileName = rawName;
    }
    collectSticker({
      id: figure.elementId ?? figure.id,
      src,
      title: figure.name,
      fileName,
      collectedAt: new Date().toISOString(),
    });
  }, [collectSticker, coverElement, figure]);

  useEffect(() => {
    setHintVisible(true);
    const timer = window.setTimeout(() => setHintVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [figure.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (hintVisible) setHintVisible(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hintVisible]);

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden bg-parchment"
      data-matching-stage="mural-matching"
    >
      <div
        className={hideCards ? "invisible pointer-events-none" : undefined}
        aria-hidden={hideCards || undefined}
      >
        <SelectedFigureCard
          figure={figure}
          sourceRect={sourceRect}
          reducedMotion={reducedMotion}
          onLanded={handleFigureLanded}
        />
      </div>

      {!hideCards ? (
        <CanvasInstruction
          messageKey="match.hint"
          floating
          visible={hintVisible}
          onClose={() => setHintVisible(false)}
        />
      ) : null}

      {boardReady ? (
        <MatchingBoard
          figure={figure}
          coverElement={coverElement}
          muralIds={muralIds}
          isMobile={isMobile}
          hideCards={hideCards}
          hintVisible={hintVisible}
          onOpenTemple={onOpenTemple}
          onReturnHome={onReturnHome}
        />
      ) : !hideCards ? (
        <CanvasViewControls
          onBack={onReturnHome}
          backLabel={t("match.reselect")}
          backPlacement="top-left"
          onZoomIn={() => undefined}
          onZoomOut={() => undefined}
          onReset={() => undefined}
          canZoomIn={false}
          canZoomOut={false}
          showZoom={false}
        />
      ) : null}
    </div>
  );
}
