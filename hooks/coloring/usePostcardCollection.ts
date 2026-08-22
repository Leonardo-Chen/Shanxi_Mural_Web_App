"use client";

import { useCallback, useEffect, useState } from "react";
import { addCollectedPostcard } from "@/lib/gameProgressStore";

export const POSTCARD_STORAGE_KEY = "jin-museum-postcards";

export type CollectedColoringPostcard = {
  id: string;
  artworkId: string;
  imageDataUrl: string;
  stars: number;
  createdAt: string;
  title: string;
};

function readPostcards(): CollectedColoringPostcard[] {
  try {
    const raw = localStorage.getItem(POSTCARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CollectedColoringPostcard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePostcards(items: CollectedColoringPostcard[]) {
  localStorage.setItem(POSTCARD_STORAGE_KEY, JSON.stringify(items));
}

export function usePostcardCollection(currentId: string | null) {
  const [items, setItems] = useState<CollectedColoringPostcard[]>([]);

  useEffect(() => {
    setItems(readPostcards());
  }, []);

  const isCollected = Boolean(
    currentId && items.some((item) => item.id === currentId)
  );

  const collect = useCallback((postcard: CollectedColoringPostcard) => {
    const current = readPostcards();
    if (current.some((item) => item.id === postcard.id)) {
      setItems(current);
      return false;
    }
    const next = [...current, postcard];
    writePostcards(next);
    setItems(next);
    addCollectedPostcard({
      id: postcard.id,
      src: postcard.imageDataUrl,
      title: postcard.title,
      collectedAt: postcard.createdAt,
    });
    return true;
  }, []);

  return { items, isCollected, collect };
}
