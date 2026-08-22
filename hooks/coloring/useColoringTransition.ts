"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(Flip);

export type ColoringStage = "coloring" | "comparison";

export function useColoringTransition(
  stage: ColoringStage,
  selectors: string
) {
  const reducedMotion = useReducedMotion();
  const previousStage = useRef(stage);

  useLayoutEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    if (reducedMotion) return;

    const elements = document.querySelectorAll(selectors);
    if (elements.length === 0) return;

    Flip.from(Flip.getState(elements), {
      duration: stage === "comparison" ? 0.85 : 0.7,
      ease: "power2.inOut",
      absolute: false,
      scale: true,
      fade: true,
      nested: true,
    });
  }, [reducedMotion, selectors, stage]);

  return reducedMotion;
}

export function captureColoringFlip(selector: string) {
  return Flip.getState(selector);
}

export function playColoringFlip(
  state: Flip.FlipState | null,
  reducedMotion: boolean,
  duration = 0.85
) {
  if (!state || reducedMotion) return;
  Flip.from(state, {
    duration,
    ease: "power2.inOut",
    scale: true,
    fade: true,
    nested: true,
  });
}

export { Flip };
export { useReducedMotion };
