"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

export function useCanvasViewport(containerRef: React.RefObject<HTMLElement | null>) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );
  const spaceDown = useRef(false);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const zoomAt = useCallback(
    (factor: number, focusX?: number, focusY?: number) => {
      setZoom((prev) => {
        const next = clampZoom(prev * factor);
        if (!containerRef.current || focusX == null || focusY == null) {
          return next;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const cx = focusX - rect.left - rect.width / 2;
        const cy = focusY - rect.top - rect.height / 2;
        setPan((p) => ({
          x: p.x - cx * (next / prev - 1),
          y: p.y - cy * (next / prev - 1),
        }));
        return next;
      });
    },
    [containerRef]
  );

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const fitView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceDown.current = true;
        e.preventDefault();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("coloring:undo"));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("coloring:redo"));
      }
      if (e.key === "+" || e.key === "=") zoomAt(1.15);
      if (e.key === "-") zoomAt(1 / 1.15);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spaceDown.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [zoomAt]);

  const startPan = useCallback(
    (clientX: number, clientY: number, button: number) => {
      if (button === 1 || spaceDown.current) {
        panStart.current = {
          x: clientX,
          y: clientY,
          px: pan.x,
          py: pan.y,
        };
        setIsPanning(true);
        return true;
      }
      return false;
    },
    [pan.x, pan.y]
  );

  const movePan = useCallback((clientX: number, clientY: number) => {
    const s = panStart.current;
    if (!s) return;
    setPan({
      x: s.px + clientX - s.x,
      y: s.py + clientY - s.y,
    });
  }, []);

  const endPan = useCallback(() => {
    panStart.current = null;
    setIsPanning(false);
  }, []);

  return {
    zoom,
    pan,
    isPanning,
    spaceDown,
    zoomAt,
    resetView,
    fitView,
    setZoom,
    startPan,
    movePan,
    endPan,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
  };
}
