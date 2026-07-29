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
  onPositionChange?: (pos: CanvasPosition) => void;
}

const FRICTION = 0.92;
const MIN_VELOCITY = 0.5;

export function useDraggableCanvas({
  canvasWidth,
  canvasHeight,
  initialCenter,
  enabled = true,
  onPositionChange,
}: UseDraggableCanvasOptions) {
  const reducedMotion = useReducedMotion();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState<CanvasPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const positionRef = useRef<CanvasPosition>({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const inertiaFrameRef = useRef<number | null>(null);
  const dragStartRef = useRef<CanvasPosition>({ x: 0, y: 0 });

  const { applyEdgeResistance, centerOn, clampPosition } = useCanvasBounds({
    canvasWidth,
    canvasHeight,
    viewportWidth: viewportSize.width || 1,
    viewportHeight: viewportSize.height || 1,
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
      const initial = centerOn(initialCenter.x, initialCenter.y);
      positionRef.current = initial;
      setPosition(initial);
      setInitialized(true);
    }
  }, [viewportSize, initialCenter, centerOn, initialized]);

  const updatePosition = useCallback(
    (x: number, y: number) => {
      const clamped = applyEdgeResistance(x, y);
      positionRef.current = clamped;
      setPosition(clamped);
      onPositionChange?.(clamped);
    },
    [applyEdgeResistance, onPositionChange]
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
      if (target?.closest("[data-card-interactive]")) return;

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

  const navigateTo = useCallback(
    (pointX: number, pointY: number, animate = true) => {
      stopInertia();
      const target = centerOn(pointX, pointY);

      if (!animate || reducedMotion) {
        updatePosition(target.x, target.y);
        return;
      }

      gsap.to(positionRef.current, {
        x: target.x,
        y: target.y,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          updatePosition(positionRef.current.x, positionRef.current.y);
        },
      });
    },
    [centerOn, reducedMotion, stopInertia, updatePosition]
  );

  useEffect(() => {
    return () => stopInertia();
  }, [stopInertia]);

  return {
    position,
    positionRef,
    isDragging,
    initialized,
    viewportSize,
    bind,
    navigateTo,
    clampPosition,
    setPosition: updatePosition,
  };
}
