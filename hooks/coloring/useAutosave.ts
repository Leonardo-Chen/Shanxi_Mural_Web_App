"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { coloringArtwork } from "@/data/coloringArtwork";

export interface AutosaveData {
  paintDataUrl: string;
  coloredRegions: string[];
  updatedAt: number;
}

export function useAutosave(
  getPaintDataUrl: () => string | null,
  coloredRegions: Set<string>
) {
  const [restorePrompt, setRestorePrompt] = useState<AutosaveData | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(coloringArtwork.autosaveKey);
      if (raw) {
        const data = JSON.parse(raw) as AutosaveData;
        if (data.paintDataUrl) setRestorePrompt(data);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = useCallback(() => {
    const url = getPaintDataUrl();
    if (!url) return;
    const data: AutosaveData = {
      paintDataUrl: url,
      coloredRegions: [...coloredRegions],
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(coloringArtwork.autosaveKey, JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [getPaintDataUrl, coloredRegions]);

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(save, 8000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [save]);

  const clearSave = useCallback(() => {
    localStorage.removeItem(coloringArtwork.autosaveKey);
    setRestorePrompt(null);
  }, []);

  return { save, restorePrompt, setRestorePrompt, clearSave };
}
