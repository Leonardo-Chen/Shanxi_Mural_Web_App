"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useDrag } from "@use-gesture/react";
import { useCanvasBounds } from "./useCanvasBounds";
import { useReducedMotion } from "./useReducedMotion";

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface UseDraggableCanvasOptions {
  canvasWidth: number;
  canvasHeight: number;
  initialCenter: { x: number; y: number };
  enabled?: boolean;
  allowDragFromInteractive?: boolean;
  minZoom?: number;
  maxZoom?: number;
  onPositionChange?: (pos: CanvasPosition) => void;
}

const FRICTION = 0.92;
const MIN_VELOCITY = 0.5;

export function useDraggableCanvas({
  canvasWidth,
  canvasHeight,
  initialCenter,
  enabled = true,
  allowDragFromInteractive = false,
  minZoom = 0.25,
  maxZoom = 4,
  onPositionChange,
}: UseDraggableCanvasOptions) {
  const reducedMotion = useReducedMotion();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const positionRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const velocityRef = useRef({ x: 0, y: 0 });
  const inertiaFrameRef = useRef<number | null>(null);
  const dragStartRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const zoomRafRef = useRef<number | null>(null);

  const { applyEdgeResistance, clampPosition, clampForScale } =
    useCanvasBounds({
      canvasWidth,
      canvasHeight,
      viewportWidth: viewportSize.width || 1,
      viewportHeight: viewportSize.height || 1,
      scale: zoom,
    });

  useEffect(() => {
    const update = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (viewportSize.width > 0 && !initialized) {
      const initialZoom = Math.min(maxZoom, Math.max(minZoom, 1));
      zoomRef.current = initialZoom;
      setZoom(initialZoom);
      const initial = clampForScale(
        viewportSize.width / 2 - initialCenter.x * initialZoom,
        viewportSize.height / 2 - initialCenter.y * initialZoom,
        initialZoom,
        false
      );
      positionRef.current = initial;
      setPosition(initial);
      setInitialized(true);
    }
  }, [
    clampForScale,
    initialCenter,
    initialized,
    maxZoom,
    minZoom,
    viewportSize.height,
    viewportSize.width,
  ]);

  const applyPosition = useCallback(
    (x: number, y: number, clamp = true) => {
      const next = clamp ? applyEdgeResistance(x, y) : { x, y };
      positionRef.current.x = next.x;
      positionRef.current.y = next.y;
      setPosition({ x: next.x, y: next.y });
      onPositionChange?.(positionRef.current);
    },
    [applyEdgeResistance, onPositionChange]
  );

  const updatePosition = useCallback(
    (x: number, y: number) => {
      applyPosition(x, y, true);
    },
    [applyPosition]
  );

  const stopInertia = useCallback(() => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  }, []);

  const startInertia = useCallback(() => {
    if (reducedMotion) return;

    const tick = () => {
      velocityRef.current.x *= FRICTION;
      velocityRef.current.y *= FRICTION;

      if (
        Math.abs(velocityRef.current.x) < MIN_VELOCITY &&
        Math.abs(velocityRef.current.y) < MIN_VELOCITY
      ) {
        stopInertia();
        return;
      }

      const nextX = positionRef.current.x + velocityRef.current.x;
      const nextY = positionRef.current.y + velocityRef.current.y;
      updatePosition(nextX, nextY);
      inertiaFrameRef.current = requestAnimationFrame(tick);
    };

    stopInertia();
    inertiaFrameRef.current = requestAnimationFrame(tick);
  }, [reducedMotion, stopInertia, updatePosition]);

  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], last, first, event }) => {
      if (!enabled) return;

      const target = event?.target as HTMLElement | undefined;
      if (
        !allowDragFromInteractive &&
        target?.closest("[data-card-interactive], [data-element-interactive]")
      )
        return;

      if (first) {
        stopInertia();
        setIsDragging(true);
        dragStartRef.current = { ...positionRef.current };
      }

      updatePosition(
        dragStartRef.current.x + mx,
        dragStartRef.current.y + my
      );

      if (last) {
        setIsDragging(false);
        velocityRef.current = {
          x: vx * 15,
          y: vy * 15,
        };
        startInertia();
      }
    },
    {
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  const panTweenRef = useRef<gsap.core.Tween | null>(null);

  const navigateTo = useCallback(
    (
      pointX: number,
      pointY: number,
      animate = true,
      onComplete?: () => void,
      clamp = true
    ) => {
      stopInertia();
      panTweenRef.current?.kill();
      const scale = zoomRef.current;
      const rawX = (viewportSize.width || 1) / 2 - pointX * scale;
      const rawY = (viewportSize.height || 1) / 2 - pointY * scale;
      const target = clamp
        ? clampForScale(rawX, rawY, scale, false)
        : { x: rawX, y: rawY };

      if (!animate || reducedMotion) {
        applyPosition(target.x, target.y, clamp);
        onComplete?.();
        return;
      }

      panTweenRef.current = gsap.to(positionRef.current, {
        x: target.x,
        y: target.y,
        duration: 0.72,
        ease: "power2.inOut",
        onUpdate: () => {
          applyPosition(positionRef.current.x, positionRef.current.y, false);
        },
        onComplete: () => {
          panTweenRef.current = null;
          applyPosition(target.x, target.y, clamp);
          onComplete?.();
        },
      });
    },
    [
      applyPosition,
      clampForScale,
      reducedMotion,
      stopInertia,
      viewportSize.height,
      viewportSize.width,
    ]
  );

  const resetView = useCallback(
    (nextZoom = 1) => {
      stopInertia();
      panTweenRef.current?.kill();
      panTweenRef.current = null;
      const width = viewportSize.width || (typeof window !== "undefined" ? window.innerWidth : 1);
      const height = viewportSize.height || (typeof window !== "undefined" ? window.innerHeight : 1);
      const z = Math.min(maxZoom, Math.max(0.25, nextZoom));
      zoomRef.current = z;
      setZoom(z);
      const next = {
        x: width / 2 - initialCenter.x * z,
        y: height / 2 - initialCenter.y * z,
      };
      positionRef.current = next;
      setPosition(next);
      onPositionChange?.(positionRef.current);
    },
    [initialCenter.x, initialCenter.y, maxZoom, onPositionChange, stopInertia, viewportSize.height, viewportSize.width]
  );

  const cancelPan = useCallback(() => {
    panTweenRef.current?.kill();
    panTweenRef.current = null;
  }, []);

  const setZoomAt = useCallback(
    (nextZoom: number, clientX: number, clientY: number) => {
      const clampedZoom = Math.min(maxZoom, Math.max(minZoom, nextZoom));
      const currentZoom = zoomRef.current;
      if (Math.abs(clampedZoom - currentZoom) < 0.0001) return;

      stopInertia();
      const worldX = (clientX - positionRef.current.x) / currentZoom;
      const worldY = (clientY - positionRef.current.y) / currentZoom;
      const nextPosition = clampForScale(
        clientX - worldX * clampedZoom,
        clientY - worldY * clampedZoom,
        clampedZoom,
        false
      );

      zoomRef.current = clampedZoom;
      positionRef.current = nextPosition;

      if (zoomRafRef.current !== null) return;
      zoomRafRef.current = requestAnimationFrame(() => {
        zoomRafRef.current = null;
        setZoom(zoomRef.current);
        setPosition({ ...positionRef.current });
        onPositionChange?.(positionRef.current);
      });
    },
    [clampForScale, maxZoom, minZoom, onPositionChange, stopInertia]
  );

  const applyWheelZoom = useCallback(
    (event: WheelEvent) => {
      if (!enabled) return;
      event.preventDefault();
      const delta =
        event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 800 : 1);
      const factor = Math.exp(-delta * 0.0016);
      setZoomAt(zoomRef.current * factor, event.clientX, event.clientY);
    },
    [enabled, setZoomAt]
  );

  const setZoomLevel = useCallback(
    (nextZoom: number) => {
      setZoomAt(
        nextZoom,
        (viewportSize.width || window.innerWidth) / 2,
        (viewportSize.height || window.innerHeight) / 2
      );
    },
    [setZoomAt, viewportSize.height, viewportSize.width]
  );

  useEffect(() => {
    if (!initialized || viewportSize.width <= 0) return;
    const next = Math.min(maxZoom, Math.max(minZoom, zoomRef.current));
    if (Math.abs(next - zoomRef.current) < 0.0001) return;
    setZoomAt(next, viewportSize.width / 2, viewportSize.height / 2);
  }, [initialized, maxZoom, minZoom, setZoomAt, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    return () => {
      stopInertia();
      panTweenRef.current?.kill();
      if (zoomRafRef.current !== null) cancelAnimationFrame(zoomRafRef.current);
    };
  }, [stopInertia]);

  return {
    position,
    positionRef,
    zoom,
    zoomRef,
    isDragging,
    initialized,
    viewportSize,
    bind,
    navigateTo,
    clampPosition,
    setPosition: updatePosition,
    applyWheelZoom,
    setZoomLevel,
    minZoom,
    maxZoom,
    cancelPan,
    resetView,
  };
}
