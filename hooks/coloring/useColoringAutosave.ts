"use client";

import { useCallback, useEffect, useState } from "react";

const KEY_PREFIX = "jin-museum-coloring-";

export type ColoringAutosave = {
  artworkId: string;
  paintDataUrl: string;
  selectedColorId: string;
  usedColorValues: string[];
  updatedAt: string;
};

function storageKey(artworkId: string) {
  return `${KEY_PREFIX}${artworkId}`;
}

export function readColoringAutosave(artworkId: string): ColoringAutosave | null {
  try {
    const raw = localStorage.getItem(storageKey(artworkId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ColoringAutosave>;
    if (!parsed?.artworkId || !parsed.paintDataUrl) return null;
    return {
      artworkId: parsed.artworkId,
      paintDataUrl: parsed.paintDataUrl,
      selectedColorId: parsed.selectedColorId ?? "",
      usedColorValues: parsed.usedColorValues ?? [],
      updatedAt: parsed.updatedAt ?? "",
    };
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
      ) as Partial<ColoringAutosave>;
      if (parsed?.artworkId && parsed.paintDataUrl) {
        items.push({
          artworkId: parsed.artworkId,
          paintDataUrl: parsed.paintDataUrl,
          selectedColorId: parsed.selectedColorId ?? "",
          usedColorValues: parsed.usedColorValues ?? [],
          updatedAt: parsed.updatedAt ?? "",
        });
      }
    } catch {
      /* skip */
    }
  }
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function useColoringAutosave(
  artworkId: string | null,
  paintDataUrl: string | null,
  selectedColorId: string,
  usedColorValues: string[]
) {
  const [restorePrompt, setRestorePrompt] = useState<ColoringAutosave | null>(
    null
  );

  useEffect(() => {
    if (!artworkId) return;
    const saved = readColoringAutosave(artworkId);
    if (saved) setRestorePrompt(saved);
  }, [artworkId]);

  useEffect(() => {
    if (!artworkId || restorePrompt) return;
    try {
      if (!paintDataUrl) {
        localStorage.removeItem(storageKey(artworkId));
        return;
      }
      const data: ColoringAutosave = {
        artworkId,
        paintDataUrl,
        selectedColorId,
        usedColorValues,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey(artworkId), JSON.stringify(data));
    } catch {
      /* quota */
    }
  }, [artworkId, paintDataUrl, restorePrompt, selectedColorId, usedColorValues]);

  const clearSave = useCallback(() => {
    if (!artworkId) return;
    localStorage.removeItem(storageKey(artworkId));
    setRestorePrompt(null);
  }, [artworkId]);

  return { restorePrompt, setRestorePrompt, clearSave };
}
