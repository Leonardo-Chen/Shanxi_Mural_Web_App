"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import CoverIntro from "./CoverIntro";
import CoverElementField from "./CoverElementField";
import ConvergencePaths from "./ConvergencePaths";
import ElementSelection from "./ElementSelection";
import DragIndicator from "@/components/DragIndicator";
import {
  coverPositionToCanvas,
  getCanvasPoint,
  getCanvasWidth,
  getCoverWidth,
  getViewportTier,
  getVisibleCoverElements,
  type CoverElement,
} from "@/data/coverElements";
import { loadCoverElements, reloadCoverElements } from "@/lib/coverSession";
import { elementCanvasLayout } from "@/data/canvasLayout";
import { computeContentZoomRange } from "@/lib/canvasZoom";
import { useDraggableCanvas } from "@/hooks/useDraggableCanvas";
import { useCoverTransition } from "@/hooks/useCoverTransition";
import { useElementSelection } from "@/hooks/useElementSelection";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ElementPose } from "@/hooks/useCoverTransition";

export type ExperienceMode = "cover" | "home";

interface MuralExperienceProps {
  hidden: boolean;
  mode: ExperienceMode;
  coverGeneration?: number;
  onCoverComplete: () => void;
  onContinueFigure: (element: CoverElement, sourceRect: DOMRect) => void;
  detailOpen: boolean;
}

export default function MuralExperience({
  hidden,
  mode,
  coverGeneration = 0,
  onCoverComplete,
  onContinueFigure,
  detailOpen,
}: MuralExperienceProps) {
  const reducedMotion = useReducedMotion();
  const [transitioning, setTransitioning] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [layoutWidth, setLayoutWidth] = useState(1280);
  const [layoutHeight, setLayoutHeight] = useState(800);
  const [focusingId, setFocusingId] = useState<string | null>(null);
  const [sessionElements, setSessionElements] = useState<CoverElement[] | null>(
    null
  );
  const chromeRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeMapRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didPanRef = useRef(false);
  const openTimerRef = useRef<number | null>(null);
  const openingIdRef = useRef<string | null>(null);
  const focusingIdRef = useRef<string | null>(null);

  useEffect(() => {
    const update = () => {
      setLayoutWidth(window.innerWidth);
      setLayoutHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPlaced(false);
    if (coverGeneration > 0) {
      setSessionElements(null);
    }
    const task =
      coverGeneration === 0 ? loadCoverElements() : reloadCoverElements();
    task.then((elements) => {
      if (!cancelled) setSessionElements(elements);
    });
    return () => {
      cancelled = true;
    };
  }, [coverGeneration]);

  const canvasConfig = useMemo(
    () => elementCanvasLayout[getViewportTier(layoutWidth)],
    [layoutWidth]
  );

  const visibleElements = useMemo(
    () =>
      sessionElements
        ? getVisibleCoverElements(layoutWidth, sessionElements)
        : [],
    [layoutWidth, sessionElements]
  );

  const zoomRange = useMemo(() => {
    const canvasSize = {
      width: canvasConfig.width,
      height: canvasConfig.height,
    };
    const rects = visibleElements.map((element) => {
      const point = getCanvasPoint(element, layoutWidth, canvasSize);
      const width = getCanvasWidth(element, layoutWidth);
      return {
        x: point.x,
        y: point.y,
        width,
        height: width / element.coverPosition.aspectRatio,
      };
    });
    return computeContentZoomRange(rects, {
      width: layoutWidth,
      height: layoutHeight,
    });
  }, [
    canvasConfig.height,
    canvasConfig.width,
    layoutHeight,
    layoutWidth,
    visibleElements,
  ]);

  const {
    position,
    zoom,
    isDragging,
    initialized,
    viewportSize,
    bind,
    applyWheelZoom,
    navigateTo,
    cancelPan,
    resetView,
  } = useDraggableCanvas({
    canvasWidth: canvasConfig.width,
    canvasHeight: canvasConfig.height,
    initialCenter: canvasConfig.center,
    enabled:
      !hidden &&
      mode === "home" &&
      !detailOpen &&
      !transitioning &&
      !focusingId,
    allowDragFromInteractive: true,
    minZoom: zoomRange.minZoom,
    maxZoom: zoomRange.maxZoom,
  });

  const elementById = useMemo(() => {
    const map = new Map<string, CoverElement>();
    (sessionElements ?? []).forEach((element) => map.set(element.id, element));
    return map;
  }, [sessionElements]);

  const getTargets = useCallback(() => {
    return visibleElements
      .map((element) => {
        const el = nodeMapRef.current.get(element.id);
        return el ? { id: element.id, el } : null;
      })
      .filter((item): item is { id: string; el: HTMLDivElement } => item !== null);
  }, [visibleElements]);

  const getCoverPose = useCallback(
    (id: string): ElementPose | null => {
      const element = elementById.get(id);
      const width = viewportSize.width || layoutWidth;
      const height = viewportSize.height || (typeof window !== "undefined" ? window.innerHeight : 800);
      if (!element || width === 0) return null;
      const coverWidth = getCoverWidth(element, width);
      const mapped = coverPositionToCanvas(
        element,
        { width, height },
        canvasConfig.center,
        coverWidth
      );
      return {
        x: mapped.x,
        y: mapped.y,
        scale: mapped.scale,
        rotation: element.coverPosition.rotation ?? 0,
      };
    },
    [canvasConfig.center, elementById, layoutWidth, viewportSize.height, viewportSize.width]
  );

  const getCanvasPose = useCallback(
    (id: string): ElementPose | null => {
      const element = elementById.get(id);
      if (!element) return null;
      const point = getCanvasPoint(element, viewportSize.width || layoutWidth, {
        width: canvasConfig.width,
        height: canvasConfig.height,
      });
      return {
        x: point.x,
        y: point.y,
        scale: 1,
        rotation: element.canvasPosition.rotation ?? 0,
      };
    },
    [
      canvasConfig.height,
      canvasConfig.width,
      elementById,
      layoutWidth,
      viewportSize.width,
    ]
  );

  const getElement = useCallback(
    (id: string) => elementById.get(id),
    [elementById]
  );

  const getViewport = useCallback(
    () => ({
      width: viewportSize.width || layoutWidth,
      height:
        viewportSize.height ||
        (typeof window !== "undefined" ? window.innerHeight : 800),
    }),
    [layoutWidth, viewportSize.height, viewportSize.width]
  );

  const getCanvasCenter = useCallback(
    () => canvasConfig.center,
    [canvasConfig.center]
  );

  const { placeAtCover, placeAtCanvas, startDrift, playToCanvas, killDrift } = useCoverTransition({
    reducedMotion,
    getTargets,
    getCoverPose,
    getCanvasPose,
    getElement,
    getViewport,
    getCanvasCenter,
  });

  const selection = useElementSelection({
    enabled: !hidden && mode === "home" && !detailOpen,
  });

  const registerRef = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) nodeMapRef.current.set(id, node);
    else nodeMapRef.current.delete(id);
  }, []);

  const motionApiRef = useRef({ placeAtCover, placeAtCanvas, startDrift, killDrift });
  motionApiRef.current = { placeAtCover, placeAtCanvas, startDrift, killDrift };

  useLayoutEffect(() => {
    if (hidden || !initialized || !sessionElements) return;

    if (mode !== "cover") {
      motionApiRef.current.placeAtCanvas();
      setPlaced(true);
      return;
    }

    motionApiRef.current.killDrift();
    resetView(1);
    setPressed(false);
    setTransitioning(false);
    openingIdRef.current = null;
    focusingIdRef.current = null;
    setFocusingId(null);
    selection.clear();
    const chrome = [chromeRef.current, pathsRef.current].filter(
      (node): node is HTMLDivElement => node !== null
    );
    if (chrome.length) {
      gsap.set(chrome, { opacity: 1, scale: 1, clearProps: "transform" });
    }

    let raf = 0;
    let attempts = 0;
    const run = () => {
      motionApiRef.current.placeAtCover();
      const started = motionApiRef.current.startDrift();
      setPlaced(true);
      if (!started && attempts < 8) {
        attempts += 1;
        raf = requestAnimationFrame(run);
      }
    };
    run();
    return () => cancelAnimationFrame(raf);
  }, [
    hidden,
    initialized,
    mode,
    viewportSize.width,
    viewportSize.height,
    visibleElements.length,
    sessionElements,
    resetView,
  ]);

  const cancelPendingOpen = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    openingIdRef.current = null;
    focusingIdRef.current = null;
    setFocusingId(null);
    cancelPan();
  }, [cancelPan]);

  const handleStart = useCallback(() => {
    if (mode !== "cover" || transitioning) return;
    setPressed(true);
    setTransitioning(true);

    const chrome = [chromeRef.current, pathsRef.current].filter(
      (node): node is HTMLDivElement => node !== null
    );

    playToCanvas({
      chrome,
      onComplete: () => {
        setTransitioning(false);
        onCoverComplete();
      },
    });
  }, [mode, onCoverComplete, playToCanvas, transitioning]);

  const handleSelect = useCallback(
    (id: string) => {
      if (mode !== "home" || didPanRef.current) return;
      if (openingIdRef.current) return;
      if (focusingIdRef.current === id || selection.selectedId === id) return;

      cancelPendingOpen();
      focusingIdRef.current = id;
      setFocusingId(id);

      const node = nodeMapRef.current.get(id);
      if (!node) {
        focusingIdRef.current = null;
        setFocusingId(null);
        return;
      }

      const rect = node.getBoundingClientRect();
      const scale = zoom || 1;

      navigateTo(
        (rect.left + rect.width / 2 - position.x) / scale,
        (rect.top + rect.height / 2 - position.y) / scale,
        !reducedMotion,
        () => {
          if (focusingIdRef.current !== id) return;
          selection.select(id);
        },
        false
      );
    },
    [
      cancelPendingOpen,
      mode,
      navigateTo,
      position.x,
      position.y,
      reducedMotion,
      selection,
      zoom,
    ]
  );

  const openFigure = useCallback(
    (id: string) => {
      if (openingIdRef.current === id) return;
      const element = elementById.get(id);
      const node = nodeMapRef.current.get(id);
      if (!element || !node) return;
      openingIdRef.current = id;
      focusingIdRef.current = null;
      setFocusingId(null);
      onContinueFigure(element, node.getBoundingClientRect());
    },
    [elementById, onContinueFigure]
  );

  const handleOutlineComplete = useCallback(
    (id: string) => {
      if (selection.selectedId !== id || openingIdRef.current) return;
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
      openTimerRef.current = window.setTimeout(
        () => {
          openTimerRef.current = null;
          if (selection.selectedId === id) openFigure(id);
        },
        reducedMotion ? 0 : 180
      );
    },
    [openFigure, reducedMotion, selection.selectedId]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointerStartRef.current = { x: event.clientX, y: event.clientY };
      didPanRef.current = false;
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStartRef.current;
      if (!start) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) {
        didPanRef.current = true;
      }
    },
    []
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      if (!start || mode !== "home") return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) > 6) return;
      const target = event.target as HTMLElement;
      if (target.closest("[data-element-interactive]")) return;
      cancelPendingOpen();
      selection.clear();
    },
    [cancelPendingOpen, mode, selection]
  );

  useEffect(() => {
    const node = canvasRef.current;
    if (!node || hidden || mode !== "home" || detailOpen || transitioning) {
      return;
    }
    node.addEventListener("wheel", applyWheelZoom, { passive: false });
    return () => node.removeEventListener("wheel", applyWheelZoom);
  }, [applyWheelZoom, detailOpen, hidden, mode, transitioning]);

  useEffect(() => {
    if (!hidden && mode === "home") {
      openingIdRef.current = null;
      focusingIdRef.current = null;
      setFocusingId(null);
    }
  }, [hidden, mode]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const selectedElement = selection.selectedId
    ? elementById.get(selection.selectedId) ?? null
    : null;

  return (
    <div
      className={`cover-root fixed inset-0 z-10 overflow-hidden ${
        hidden ? "hidden" : ""
      }`}
      data-canvas-mode={mode === "home" ? "explore" : "cover"}
      aria-hidden={hidden}
    >
      {(mode === "cover" || transitioning) && (
        <div ref={pathsRef} className="pointer-events-none absolute inset-0 z-[1]">
          <ConvergencePaths
            visible={mode === "cover"}
            reduced={reducedMotion}
          />
        </div>
      )}

      <div
        {...bind()}
        ref={canvasRef}
        onPointerDownCapture={handlePointerDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerUpCapture={handlePointerUp}
        className={`absolute inset-0 z-10 touch-none overflow-hidden ${
          mode === "home"
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
        style={{
          touchAction: "none",
          opacity: placed ? 1 : 0,
        }}
      >
        <div
          className="absolute origin-top-left"
          style={{
            width: canvasConfig.width,
            height: canvasConfig.height,
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            willChange: isDragging ? "transform" : "auto",
          }}
        >
          <CoverElementField
            key={coverGeneration}
            elements={visibleElements}
            viewportWidth={viewportSize.width || layoutWidth}
            phase={mode === "home" ? "explore" : "cover"}
            interactive={mode === "home" && !detailOpen}
            selectedId={selection.selectedId}
            focusingId={focusingId}
            reducedMotion={reducedMotion}
            registerRef={registerRef}
            onSelect={handleSelect}
            onOutlineComplete={handleOutlineComplete}
          />
        </div>
      </div>

      {(mode === "cover" || transitioning) && (
        <CoverIntro
          visible={mode === "cover"}
          pressed={pressed}
          transitioning={transitioning}
          onStart={handleStart}
          chromeRef={chromeRef}
        />
      )}

      <DragIndicator
        visible={mode === "home" && !detailOpen && !transitioning}
      />

      <ElementSelection element={selectedElement} />
    </div>
  );
}
