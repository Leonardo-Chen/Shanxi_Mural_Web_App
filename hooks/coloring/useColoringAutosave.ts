"use client";

import { useCallback, useEffect, useState } from "react";
import type { RegionColorMap } from "@/utils/coloringScore";

const KEY_PREFIX = "jin-museum-coloring-";

export type ColoringAutosave = {
  artworkId: string;
  regionColors: RegionColorMap;
  selectedColorId: string;
  updatedAt: string;
};

function storageKey(artworkId: string) {
  return `${KEY_PREFIX}${artworkId}`;
}

export function readColoringAutosave(artworkId: string): ColoringAutosave | null {
  try {
    const raw = localStorage.getItem(storageKey(artworkId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ColoringAutosave;
    if (!parsed?.regionColors) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function listColoringAutosaves(): ColoringAutosave[] {
  if (typeof window === "undefined") return [];
  const items: ColoringAutosave[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(KEY_PREFIX)) continue;
    try {
      const parsed = JSON.parse(
        localStorage.getItem(key) ?? ""
      ) as ColoringAutosave;
      if (parsed?.artworkId && parsed.regionColors) items.push(parsed);
    } catch {
      /* skip */
    }
  }
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function useColoringAutosave(
  artworkId: string | null,
  regionColors: RegionColorMap,
  selectedColorId: string
) {
  const [restorePrompt, setRestorePrompt] = useState<ColoringAutosave | null>(
    null
  );

  useEffect(() => {
    if (!artworkId) return;
    const saved = readColoringAutosave(artworkId);
    if (saved && Object.keys(saved.regionColors).length > 0) {
      setRestorePrompt(saved);
    }
  }, [artworkId]);

  useEffect(() => {
    if (!artworkId || restorePrompt) return;
    try {
      if (Object.keys(regionColors).length === 0) {
        localStorage.removeItem(storageKey(artworkId));
        return;
      }
      const data: ColoringAutosave = {
        artworkId,
        regionColors,
        selectedColorId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey(artworkId), JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [artworkId, regionColors, restorePrompt, selectedColorId]);

  const clearSave = useCallback(() => {
    if (!artworkId) return;
    localStorage.removeItem(storageKey(artworkId));
    setRestorePrompt(null);
  }, [artworkId]);

  return { restorePrompt, setRestorePrompt, clearSave };
}
