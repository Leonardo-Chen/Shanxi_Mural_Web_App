"use client";

import { useCallback, useEffect, useState } from "react";

interface UseElementSelectionOptions {
  enabled: boolean;
  onClear?: () => void;
}

export function useElementSelection({
  enabled,
  onClear,
}: UseElementSelectionOptions) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const select = useCallback(
    (id: string) => {
      if (!enabled) return;
      setSelectedId(id);
    },
    [enabled]
  );

  const clear = useCallback(() => {
    setSelectedId(null);
    onClear?.();
  }, [onClear]);

  useEffect(() => {
    if (!enabled || !selectedId) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        clear();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear, enabled, selectedId]);

  useEffect(() => {
    if (!enabled) {
      setSelectedId(null);
    }
  }, [enabled]);

  return {
    selectedId,
    select,
    clear,
  };
}
