"use client";

import { useCallback, useRef, useState } from "react";

const MAX_HISTORY = 30;

export function useUndoRedo(
  paintCanvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);
  const [, tick] = useState(0);
  const force = () => tick((n) => n + 1);

  const snapshot = useCallback(() => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d")!;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [paintCanvasRef]);

  const pushHistory = useCallback(() => {
    const img = snapshot();
    if (!img) return;
    undoStack.current.push(img);
    if (undoStack.current.length > MAX_HISTORY) {
      undoStack.current.shift();
    }
    redoStack.current = [];
    force();
  }, [snapshot]);

  const restore = useCallback(
    (img: ImageData) => {
      const canvas = paintCanvasRef.current;
      if (!canvas) return;
      canvas.getContext("2d")!.putImageData(img, 0, 0);
    },
    [paintCanvasRef]
  );

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const current = snapshot();
    if (current) redoStack.current.push(current);
    const prev = undoStack.current.pop()!;
    restore(prev);
    force();
  }, [restore, snapshot]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const current = snapshot();
    if (current) undoStack.current.push(current);
    const next = redoStack.current.pop()!;
    restore(next);
    force();
  }, [restore, snapshot]);

  const clearHistory = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    force();
  }, []);

  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;

  return {
    pushHistory,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
  };
}
