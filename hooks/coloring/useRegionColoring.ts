"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColoringRegion } from "@/data/coloringRegions";
import type { RegionColorMap } from "@/utils/coloringScore";

const MAX_HISTORY = 30;

export function useRegionColoring(regions: ColoringRegion[]) {
  const [regionColors, setRegionColors] = useState<RegionColorMap>({});
  const [undoStack, setUndoStack] = useState<RegionColorMap[]>([]);
  const [redoStack, setRedoStack] = useState<RegionColorMap[]>([]);

  const fillRegion = useCallback((regionId: string, color: string) => {
    setRegionColors((current) => {
      if (current[regionId] === color) return current;
      setUndoStack((stack) => {
        const next = [...stack, current];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
      setRedoStack([]);
      return { ...current, [regionId]: color };
    });
  }, []);

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      const previous = stack[stack.length - 1];
      setRegionColors((current) => {
        setRedoStack((redo) => [...redo, current]);
        return previous;
      });
      return stack.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((stack) => {
      if (stack.length === 0) return stack;
      const next = stack[stack.length - 1];
      setRegionColors((current) => {
        setUndoStack((undo) => {
          const merged = [...undo, current];
          return merged.length > MAX_HISTORY ? merged.slice(-MAX_HISTORY) : merged;
        });
        return next;
      });
      return stack.slice(0, -1);
    });
  }, []);

  const clearColors = useCallback(() => {
    setRegionColors((current) => {
      if (Object.keys(current).length === 0) return current;
      setUndoStack((stack) => {
        const next = [...stack, current];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
      setRedoStack([]);
      return {};
    });
  }, []);

  const restoreColors = useCallback((next: RegionColorMap) => {
    setRegionColors(next);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const completion = useMemo(() => {
    const total = regions.reduce((sum, region) => sum + region.weight, 0);
    const filled = regions.reduce(
      (sum, region) => (regionColors[region.id] ? sum + region.weight : sum),
      0
    );
    return total > 0 ? filled / total : 0;
  }, [regionColors, regions]);

  return {
    regionColors,
    fillRegion,
    undo,
    redo,
    clearColors,
    restoreColors,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    completion,
  };
}
