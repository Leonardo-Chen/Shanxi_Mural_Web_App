"use client";

import { useCallback, useRef, useState } from "react";

export function useBeforeAfterSlider(initial = 0.5) {
  const [position, setPosition] = useState(initial);
  const dragging = useRef(false);

  const onPointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const onPointerMove = useCallback(
    (clientX: number, rect: DOMRect) => {
      if (!dragging.current) return;
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setPosition(x);
    },
    []
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return { position, setPosition, onPointerDown, onPointerMove, onPointerUp };
}
