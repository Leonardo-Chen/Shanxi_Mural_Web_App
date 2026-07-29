"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(Flip);

export interface CardTransitionState {
  cardId: string | null;
  isOpen: boolean;
}

export function useCardTransition() {
  const reducedMotion = useReducedMotion();
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);

  const captureFlipState = useCallback((selector: string) => {
    flipStateRef.current = Flip.getState(selector);
  }, []);

  const animateToDetail = useCallback(
    (cardElement: HTMLElement, onComplete?: () => void) => {
      activeCardRef.current = cardElement;

      if (reducedMotion) {
        onComplete?.();
        return;
      }

      gsap.to(cardElement, {
        scale: 1.05,
        duration: 0.35,
        ease: "power2.out",
        onComplete,
      });
    },
    [reducedMotion]
  );

  const animateClose = useCallback(
    (onComplete?: () => void) => {
      const card = activeCardRef.current;

      if (!card || reducedMotion) {
        activeCardRef.current = null;
        onComplete?.();
        return;
      }

      if (flipStateRef.current) {
        Flip.from(flipStateRef.current, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => {
            gsap.set(card, { clearProps: "all" });
            activeCardRef.current = null;
            flipStateRef.current = null;
            onComplete?.();
          },
        });
      } else {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            activeCardRef.current = null;
            onComplete?.();
          },
        });
      }
    },
    [reducedMotion]
  );

  return {
    captureFlipState,
    animateToDetail,
    animateClose,
    activeCardRef,
  };
}
