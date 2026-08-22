"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4.2;

type BoundedMuralViewerProps = {
  src: string;
  alt: string;
  describedBy?: string;
  resetKey?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function BoundedMuralViewer({
  src,
  alt,
  describedBy,
  resetKey,
}: BoundedMuralViewerProps) {
  const { t } = useLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ dw: 0, dh: 0, vw: 0, vh: 0 });
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
    stage.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${zoomRef.current})`;
  }, []);

  const clampPan = useCallback(() => {
    const { dw, dh, vw, vh } = sizeRef.current;
    const zoom = zoomRef.current;
    const maxX = Math.max(0, (dw * zoom - vw) / 2);
    const maxY = Math.max(0, (dh * zoom - vh) / 2);
    panRef.current = {
      x: clamp(panRef.current.x, -maxX, maxX),
      y: clamp(panRef.current.y, -maxY, maxY),
    };
  }, []);

  const layoutImage = useCallback(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!viewport || !stage || !image || !image.naturalWidth) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const scale = Math.min(vw / image.naturalWidth, vh / image.naturalHeight);
    const dw = image.naturalWidth * scale;
    const dh = image.naturalHeight * scale;
    sizeRef.current = { dw, dh, vw, vh };
    stage.style.width = `${dw}px`;
    stage.style.height = `${dh}px`;
    clampPan();
    applyTransform();
  }, [applyTransform, clampPan]);

  const fitView = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    layoutImage();
  }, [layoutImage]);

  useEffect(() => {
    fitView();
  }, [fitView, resetKey, src]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!viewport) return;

    const resize = new ResizeObserver(() => layoutImage());
    resize.observe(viewport);

    const onLoad = () => layoutImage();
    image?.addEventListener("load", onLoad);

    return () => {
      resize.disconnect();
      image?.removeEventListener("load", onLoad);
    };
  }, [layoutImage, src]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const zoomAt = (clientX: number, clientY: number, nextZoom: number) => {
      const rect = viewport.getBoundingClientRect();
      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;
      const prev = zoomRef.current;
      const next = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const k = next / prev;
      panRef.current = {
        x: cx - (cx - panRef.current.x) * k,
        y: cy - (cy - panRef.current.y) * k,
      };
      zoomRef.current = next;
      clampPan();
      applyTransform();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const factor = event.deltaY > 0 ? 1 / 1.08 : 1.08;
      zoomAt(event.clientX, event.clientY, zoomRef.current * factor);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.stopPropagation();
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
        zoomRef.current = clamp(
          pinchRef.current.zoom * (distance / pinchRef.current.distance),
          MIN_ZOOM,
          MAX_ZOOM
        );
        panRef.current = {
          x: pinchRef.current.panX + (midX - pinchRef.current.midX),
          y: pinchRef.current.panY + (midY - pinchRef.current.midY),
        };
        clampPan();
        applyTransform();
        return;
      }

      if (!dragRef.current) return;
      panRef.current = {
        x: dragRef.current.panX + event.clientX - dragRef.current.x,
        y: dragRef.current.panY + event.clientY - dragRef.current.y,
      };
      clampPan();
      applyTransform();
    };

    const onPointerUp = (event: PointerEvent) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
      dragRef.current = null;
      clampPan();
      applyTransform();
      try {
        viewport.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = 28;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        const rect = viewport.getBoundingClientRect();
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, zoomRef.current * 1.12);
        return;
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        const rect = viewport.getBoundingClientRect();
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, zoomRef.current / 1.12);
        return;
      }
      if (event.key === "0") {
        event.preventDefault();
        fitView();
        return;
      }
      const moves: Record<string, { x: number; y: number }> = {
        ArrowLeft: { x: step, y: 0 },
        ArrowRight: { x: -step, y: 0 },
        ArrowUp: { x: 0, y: step },
        ArrowDown: { x: 0, y: -step },
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      panRef.current = {
        x: panRef.current.x + move.x,
        y: panRef.current.y + move.y,
      };
      clampPan();
      applyTransform();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("keydown", onKeyDown);
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("keydown", onKeyDown);
    };
  }, [applyTransform, clampPan, fitView]);

  return (
    <div
      ref={viewportRef}
      tabIndex={0}
      role="region"
      aria-label={t("detail.panZoom", { alt })}
      className="relative h-full w-full cursor-grab touch-none overflow-hidden bg-[#B8B0A4] outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-inset active:cursor-grabbing"
    >
      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2 origin-center will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          aria-describedby={describedBy}
          draggable={false}
          className="h-full w-full select-none object-fill"
        />
      </div>
    </div>
  );
}
