"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { exportPaintedArtwork } from "@/utils/coloringExport";
import {
  paintSpacing,
  stampPaint,
  type InteractionMode,
  type PaintSizeId,
  type PaintTool,
  PAINT_SIZES,
} from "@/utils/drawingTools";
import { useLocale } from "@/components/i18n/LocaleProvider";

const MIN_ZOOM = 0.55;
const MAX_ZOOM = 4.2;
const MAX_PAINT_EDGE = 1000;
const MAX_UNDO = 12;

export type LineArtCanvasHandle = {
  exportComposite: () => Promise<HTMLCanvasElement>;
  getPaintCanvas: () => HTMLCanvasElement | null;
  undo: () => void;
  clearPaint: () => void;
  resetPaint: () => void;
  restorePaint: (dataUrl: string) => void;
  getPaintDataUrl: () => string | null;
  fitView: () => void;
};

type LineArtCanvasProps = {
  lineArtUrl: string;
  figureName: string;
  templeName: string;
  selectedColor: string;
  tool: PaintTool;
  sizeId: PaintSizeId;
  mode: InteractionMode;
  interactive: boolean;
  paintBackupUrl?: string | null;
  onHistoryChange: (state: { canUndo: boolean; hasPaint: boolean }) => void;
  onPaintCommit: (dataUrl: string | null) => void;
  onColorUsed: (color: string) => void;
};

function pointerCenter(points: { x: number; y: number }[]) {
  return {
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  };
}

const LineArtCanvas = forwardRef<LineArtCanvasHandle, LineArtCanvasProps>(
  function LineArtCanvas(
    {
      lineArtUrl,
      figureName,
      templeName,
      selectedColor,
      tool,
      sizeId,
      mode,
      interactive,
      paintBackupUrl,
      onHistoryChange,
      onPaintCommit,
      onColorUsed,
    },
    ref
  ) {
    const { t } = useLocale();
    const viewportRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const paintRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef(1);
    const panRef = useRef({ x: 0, y: 0 });
    const logicalRef = useRef({ w: 0, h: 0 });
    const undoStack = useRef<ImageData[]>([]);
    const pointersRef = useRef(new Map<number, { x: number; y: number }>());
    const pinchRef = useRef<{
      distance: number;
      zoom: number;
      panX: number;
      panY: number;
      midX: number;
      midY: number;
    } | null>(null);
    const panDrag = useRef<{
      x: number;
      y: number;
      panX: number;
      panY: number;
    } | null>(null);
    const backupOnMount = useRef(paintBackupUrl ?? null);
    const pendingRestore = useRef<string | null>(backupOnMount.current);
    const drawing = useRef(false);
    const lastPt = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);
    const pendingPt = useRef<{ x: number; y: number; pressure: number } | null>(
      null
    );
    const colorRef = useRef(selectedColor);
    const toolRef = useRef(tool);
    const sizeRef = useRef(PAINT_SIZES[sizeId]);
    const modeRef = useRef(mode);
    const interactiveRef = useRef(interactive);
    const [ratio, setRatio] = useState(0.72);
    const onHistoryChangeRef = useRef(onHistoryChange);
    const onPaintCommitRef = useRef(onPaintCommit);
    const onColorUsedRef = useRef(onColorUsed);

    colorRef.current = selectedColor;
    toolRef.current = tool;
    sizeRef.current = PAINT_SIZES[sizeId];
    modeRef.current = mode;
    interactiveRef.current = interactive;
    onHistoryChangeRef.current = onHistoryChange;
    onPaintCommitRef.current = onPaintCommit;
    onColorUsedRef.current = onColorUsed;

    const applyTransform = useCallback(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const { x, y } = panRef.current;
      stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoomRef.current})`;
    }, []);

    const clampZoom = (value: number) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

    const notifyHistory = useCallback(() => {
      const canvas = paintRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      let hasPaint = false;
      if (canvas && ctx) {
        const full = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < full.length; i += 64) {
          if (full[i] > 12) {
            hasPaint = true;
            break;
          }
        }
      }
      onHistoryChangeRef.current({
        canUndo: undoStack.current.length > 0,
        hasPaint,
      });
    }, []);

    const snapshot = () => {
      const canvas = paintRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const pushHistory = () => {
      const image = snapshot();
      if (!image) return;
      undoStack.current.push(image);
      if (undoStack.current.length > MAX_UNDO) undoStack.current.shift();
    };

    const fitView = useCallback(() => {
      zoomRef.current = 1;
      panRef.current = { x: 0, y: 0 };
      applyTransform();
    }, [applyTransform]);

    const screenToPaint = (clientX: number, clientY: number) => {
      const canvas = paintRef.current;
      const { w, h } = logicalRef.current;
      if (!canvas || w <= 0) return null;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      const x = ((clientX - rect.left) / rect.width) * w;
      const y = ((clientY - rect.top) / rect.height) * h;
      return { x, y };
    };

    const drawStamp = (x: number, y: number, pressure: number) => {
      const canvas = paintRef.current;
      const ctx = canvas?.getContext("2d");
      const { w, h } = logicalRef.current;
      if (!ctx || w <= 0) return;
      ctx.setTransform(canvas!.width / w, 0, 0, canvas!.height / h, 0, 0);
      stampPaint(
        ctx,
        x,
        y,
        toolRef.current,
        colorRef.current,
        sizeRef.current,
        pressure
      );
    };

    const drawFrame = () => {
      rafRef.current = null;
      const pt = pendingPt.current;
      if (!pt) return;
      const spacing = paintSpacing(toolRef.current, sizeRef.current);
      if (lastPt.current) {
        const dist = Math.hypot(pt.x - lastPt.current.x, pt.y - lastPt.current.y);
        const steps = Math.max(1, Math.ceil(dist / spacing));
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          drawStamp(
            lastPt.current.x + (pt.x - lastPt.current.x) * t,
            lastPt.current.y + (pt.y - lastPt.current.y) * t,
            pt.pressure
          );
        }
      } else {
        drawStamp(pt.x, pt.y, pt.pressure);
      }
      lastPt.current = { x: pt.x, y: pt.y };
      pendingPt.current = null;
    };

    const commitPaint = () => {
      const canvas = paintRef.current;
      if (!canvas) return;
      notifyHistory();
      try {
        onPaintCommitRef.current(canvas.toDataURL("image/webp", 0.72));
      } catch {
        onPaintCommitRef.current(canvas.toDataURL("image/png"));
      }
    };

    useImperativeHandle(ref, () => ({
      exportComposite: () => {
        const paint = paintRef.current;
        if (!paint) return Promise.reject(new Error("画布尚未准备好"));
        return exportPaintedArtwork({
          lineArtUrl,
          paintCanvas: paint,
        });
      },
      getPaintCanvas: () => paintRef.current,
      undo: () => {
        const canvas = paintRef.current;
        const ctx = canvas?.getContext("2d");
        const prev = undoStack.current.pop();
        if (!canvas || !ctx || !prev) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(prev, 0, 0);
        notifyHistory();
        commitPaint();
      },
      clearPaint: () => {
        const canvas = paintRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        pushHistory();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        notifyHistory();
        onPaintCommitRef.current(null);
      },
      resetPaint: () => {
        const canvas = paintRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        undoStack.current = [];
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        notifyHistory();
        onPaintCommitRef.current(null);
      },
      restorePaint: (dataUrl: string) => {
        const canvas = paintRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });
        if (!canvas || !ctx || logicalRef.current.w === 0) {
          pendingRestore.current = dataUrl;
          return;
        }
        const image = new Image();
        image.onload = () => {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          undoStack.current = [];
          notifyHistory();
        };
        image.src = dataUrl;
      },
      getPaintDataUrl: () => paintRef.current?.toDataURL("image/webp", 0.72) ?? null,
      fitView,
    }));

    useEffect(() => {
      const canvas = paintRef.current;
      if (!canvas) return;
      const image = new Image();
      image.onload = () => {
        const maxEdge = MAX_PAINT_EDGE;
        const scale = Math.min(
          1,
          maxEdge / Math.max(image.naturalWidth, image.naturalHeight)
        );
        const w = Math.max(1, Math.round(image.naturalWidth * scale));
        const h = Math.max(1, Math.round(image.naturalHeight * scale));
        logicalRef.current = { w, h };
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.getContext("2d", { willReadFrequently: true });
        setRatio(image.naturalWidth / image.naturalHeight);
        const pending = pendingRestore.current;
        if (pending) {
          pendingRestore.current = null;
          const saved = new Image();
          saved.onload = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(saved, 0, 0, canvas.width, canvas.height);
            notifyHistory();
          };
          saved.src = pending;
        } else {
          notifyHistory();
        }
      };
      image.src = lineArtUrl;
    }, [lineArtUrl, notifyHistory]);

    useEffect(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const zoomAtCursor = (clientX: number, clientY: number, factor: number) => {
        const rect = viewport.getBoundingClientRect();
        const cx = clientX - rect.left - rect.width / 2;
        const cy = clientY - rect.top - rect.height / 2;
        const prev = zoomRef.current;
        const next = clampZoom(prev * factor);
        const k = next / prev;
        panRef.current = {
          x: cx - (cx - panRef.current.x) * k,
          y: cy - (cy - panRef.current.y) * k,
        };
        zoomRef.current = next;
        applyTransform();
      };

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        const factor = event.deltaY > 0 ? 1 / 1.08 : 1.08;
        zoomAtCursor(event.clientX, event.clientY, factor);
      };

      const moveCursor = (clientX: number, clientY: number) => {
        const cursor = cursorRef.current;
        const canvas = paintRef.current;
        if (!cursor || !canvas) return;
        const rect = viewport.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const screenSize =
          (sizeRef.current / Math.max(logicalRef.current.w, 1)) * canvasRect.width;
        cursor.style.width = `${screenSize}px`;
        cursor.style.height = `${screenSize}px`;
        cursor.style.transform = `translate3d(${
          clientX - rect.left - screenSize / 2
        }px, ${clientY - rect.top - screenSize / 2}px, 0)`;
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        const canPaint = interactiveRef.current && modeRef.current === "paint";
        pointersRef.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
        viewport.setPointerCapture(event.pointerId);

        if (pointersRef.current.size === 2) {
          drawing.current = false;
          panDrag.current = null;
          const pts = [...pointersRef.current.values()];
          const mid = pointerCenter(pts);
          pinchRef.current = {
            distance: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
            zoom: zoomRef.current,
            panX: panRef.current.x,
            panY: panRef.current.y,
            midX: mid.x,
            midY: mid.y,
          };
          return;
        }

        if (!canPaint) {
          panDrag.current = {
            x: event.clientX,
            y: event.clientY,
            panX: panRef.current.x,
            panY: panRef.current.y,
          };
          return;
        }

        const pt = screenToPaint(event.clientX, event.clientY);
        if (!pt) return;
        drawing.current = true;
        lastPt.current = null;
        pushHistory();
        onColorUsedRef.current(colorRef.current);
        pendingPt.current = { ...pt, pressure: event.pressure || 0.5 };
        drawFrame();
      };

      const onPointerMove = (event: PointerEvent) => {
        moveCursor(event.clientX, event.clientY);
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
          const mid = pointerCenter(pts);
          zoomRef.current = clampZoom(
            pinchRef.current.zoom * (distance / pinchRef.current.distance)
          );
          panRef.current = {
            x: pinchRef.current.panX + (mid.x - pinchRef.current.midX),
            y: pinchRef.current.panY + (mid.y - pinchRef.current.midY),
          };
          applyTransform();
          return;
        }

        if (panDrag.current) {
          panRef.current = {
            x: panDrag.current.panX + event.clientX - panDrag.current.x,
            y: panDrag.current.panY + event.clientY - panDrag.current.y,
          };
          applyTransform();
          return;
        }

        if (!drawing.current) return;
        const pt = screenToPaint(event.clientX, event.clientY);
        if (!pt) return;
        pendingPt.current = { ...pt, pressure: event.pressure || 0.5 };
        if (rafRef.current == null) {
          rafRef.current = requestAnimationFrame(drawFrame);
        }
      };

      const onPointerUp = (event: PointerEvent) => {
        pointersRef.current.delete(event.pointerId);
        if (pointersRef.current.size < 2) pinchRef.current = null;
        panDrag.current = null;
        if (drawing.current) {
          drawing.current = false;
          lastPt.current = null;
          commitPaint();
        }
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

    useEffect(() => {
      if (!interactive) fitView();
    }, [fitView, interactive]);

    const cursorHidden = !interactive || mode === "pan";

    return (
      <div
        ref={viewportRef}
        data-paint-canvas="true"
        className={`relative h-full min-h-0 w-full touch-none select-none overflow-hidden bg-[#E9E2D4] ${
          interactive && mode === "paint"
            ? "cursor-crosshair"
            : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={stageRef}
            className="relative origin-center will-change-transform"
            style={{
              width: "min(100%, 68vh)",
              aspectRatio: `${ratio}`,
            }}
          >
            <div className="coloring-paper absolute inset-0" aria-hidden="true" />
            <canvas
              ref={paintRef}
              className="absolute inset-0 h-full w-full"
              aria-label={t("color.layerAria", {
                temple: templeName,
                figure: figureName,
              })}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lineArtUrl}
              alt={t("color.lineAlt", {
                temple: templeName,
                figure: figureName,
              })}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        <div
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 hidden rounded-full border border-ink/35 md:block ${
            cursorHidden ? "!hidden" : ""
          }`}
          style={{ backgroundColor: `${selectedColor}22` }}
        />
      </div>
    );
  }
);

export default LineArtCanvas;
