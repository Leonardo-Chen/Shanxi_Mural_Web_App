"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 4.2;

type ZoomableFrameProps = {
  children: ReactNode;
  className?: string;
  resetKey?: string | number;
};

export default function ZoomableFrame({
  children,
  className = "",
  resetKey,
}: ZoomableFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    distance: number;
    zoom: number;
    panX: number;
    panY: number;
    midX: number;
    midY: number;
  } | null>(null);

  const applyTransform = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { x, y } = panRef.current;
    stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoomRef.current})`;
  }, []);

  const fitView = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    applyTransform();
  }, [applyTransform]);

  useEffect(() => {
    fitView();
  }, [fitView, resetKey]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const clampZoom = (value: number) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const cx = event.clientX - rect.left - rect.width / 2;
      const cy = event.clientY - rect.top - rect.height / 2;
      const prev = zoomRef.current;
      const next = clampZoom(prev * (event.deltaY > 0 ? 1 / 1.08 : 1.08));
      const k = next / prev;
      panRef.current = {
        x: cx - (cx - panRef.current.x) * k,
        y: cy - (cy - panRef.current.y) * k,
      };
      zoomRef.current = next;
      applyTransform();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      viewport.setPointerCapture(event.pointerId);
      if (pointersRef.current.size === 2) {
        const pts = [...pointersRef.current.values()];
        pinchRef.current = {
          distance: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
          zoom: zoomRef.current,
          panX: panRef.current.x,
          panY: panRef.current.y,
          midX: (pts[0].x + pts[1].x) / 2,
          midY: (pts[0].y + pts[1].y) / 2,
        };
        dragRef.current = null;
        return;
      }
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      if (pointersRef.current.size === 2 && pinchRef.current) {
        const pts = [...pointersRef.current.values()];
        const distance = Math.max(
          1,
          Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        );
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        zoomRef.current = clampZoom(
          pinchRef.current.zoom * (distance / pinchRef.current.distance)
        );
        panRef.current = {
          x: pinchRef.current.panX + (midX - pinchRef.current.midX),
          y: pinchRef.current.panY + (midY - pinchRef.current.midY),
        };
        applyTransform();
        return;
      }
      if (!dragRef.current) return;
      panRef.current = {
        x: dragRef.current.panX + event.clientX - dragRef.current.x,
        y: dragRef.current.panY + event.clientY - dragRef.current.y,
      };
      applyTransform();
    };

    const onPointerUp = (event: PointerEvent) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
      dragRef.current = null;
      try {
        viewport.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
    };
  }, [applyTransform]);

  return (
    <div
      ref={viewportRef}
      className={`cursor-grab touch-none overflow-hidden active:cursor-grabbing ${className}`}
    >
      <div
        ref={stageRef}
        className="flex h-full w-full origin-center items-center justify-center will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
