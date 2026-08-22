"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { CoverElement } from "@/data/coverElements";
import { getConvergenceDelta, getCoverWidth } from "@/data/coverElements";

export type ElementPose = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type Target = { id: string; el: HTMLElement };

interface UseCoverTransitionOptions {
  reducedMotion: boolean;
  getTargets: () => Target[];
  getCoverPose: (id: string) => ElementPose | null;
  getCanvasPose: (id: string) => ElementPose | null;
  getElement: (id: string) => CoverElement | undefined;
  getViewport: () => { width: number; height: number };
  getCanvasCenter: () => { x: number; y: number };
}

function getDriftNode(el: HTMLElement): HTMLElement {
  return (el.querySelector("[data-mural-drift]") as HTMLElement | null) ?? el;
}

export function useCoverTransition({
  reducedMotion,
  getTargets,
  getCoverPose,
  getCanvasPose,
  getElement,
  getViewport,
  getCanvasCenter,
}: UseCoverTransitionOptions) {
  const driftTweensRef = useRef<gsap.core.Tween[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const getTargetsRef = useRef(getTargets);
  getTargetsRef.current = getTargets;

  const killDrift = useCallback(() => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    driftTweensRef.current.forEach((tween) => tween.kill());
    driftTweensRef.current = [];
    getTargetsRef.current().forEach(({ el }) => {
      const driftNode = getDriftNode(el);
      gsap.killTweensOf(driftNode);
      gsap.set(driftNode, { x: 0, y: 0, rotation: 0 });
    });
  }, []);

  const placeAtCover = useCallback(() => {
    const targets = getTargets();
    targets.forEach(({ id, el }) => {
      const element = getElement(id);
      if (element?.showOnCover === false) {
        const canvasPose = getCanvasPose(id);
        if (!canvasPose) return;
        gsap.set(el, {
          x: canvasPose.x,
          y: canvasPose.y,
          scale: canvasPose.scale,
          rotation: canvasPose.rotation,
          opacity: 0,
          transformOrigin: "0 0",
        });
        return;
      }

      const pose = getCoverPose(id);
      if (!pose) return;
      gsap.set(el, {
        x: pose.x,
        y: pose.y,
        scale: pose.scale,
        rotation: pose.rotation,
        opacity: 1,
        transformOrigin: "0 0",
      });
    });
    return targets.length;
  }, [getCanvasPose, getCoverPose, getElement, getTargets]);

  const placeAtCanvas = useCallback(() => {
    getTargets().forEach(({ id, el }) => {
      const pose = getCanvasPose(id);
      if (!pose) return;
      gsap.set(el, {
        x: pose.x,
        y: pose.y,
        scale: pose.scale,
        rotation: pose.rotation,
        opacity: 1,
        transformOrigin: "0 0",
      });
    });
  }, [getCanvasPose, getTargets]);

  const startDrift = useCallback(() => {
    const targets = getTargets();
    if (!targets.length) return 0;

    driftTweensRef.current.forEach((tween) => tween.kill());
    driftTweensRef.current = [];
    if (reducedMotion) return targets.length;

    targets.forEach(({ id, el }) => {
      const pose = getCoverPose(id);
      const element = getElement(id);
      if (!pose || !element || element.showOnCover === false) return;

      const viewport = getViewport();
      const coverWidth = getCoverWidth(element, viewport.width);
      const delta = getConvergenceDelta(
        element,
        pose,
        coverWidth,
        viewport.height,
        getCanvasCenter()
      );
      const driftNode = getDriftNode(el);

      const tween = gsap.to(driftNode, {
        x: delta.x,
        y: delta.y,
        rotation: 1.6,
        duration: Math.max(6.5, element.motion.duration * 0.42),
        delay: element.motion.delay,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        overwrite: "auto",
      });
      driftTweensRef.current.push(tween);
    });

    return driftTweensRef.current.length;
  }, [
    getCanvasCenter,
    getCoverPose,
    getElement,
    getTargets,
    getViewport,
    reducedMotion,
  ]);

  const playToCanvas = useCallback(
    ({
      chrome,
      onComplete,
    }: {
      chrome: HTMLElement[];
      onComplete: () => void;
    }) => {
      killDrift();
      timelineRef.current?.kill();

      const targets = getTargets();

      if (reducedMotion) {
        gsap.set(chrome, { opacity: 0, scale: 1 });
        targets.forEach(({ id, el }) => {
          const pose = getCanvasPose(id);
          if (!pose) return;
          gsap.set(el, {
            x: pose.x,
            y: pose.y,
            scale: pose.scale,
            rotation: pose.rotation,
            opacity: 1,
          });
        });
        onComplete();
        return;
      }

      const timeline = gsap.timeline({
        onComplete,
      });
      timelineRef.current = timeline;

      timeline.to(
        chrome,
        {
          opacity: 0,
          scale: 0.96,
          duration: 0.38,
          ease: "power2.in",
        },
        0
      );

      targets.forEach(({ id, el }, index) => {
        const pose = getCanvasPose(id);
        const element = getElement(id);
        if (!pose) return;

        if (element?.showOnCover === false) {
          gsap.set(el, {
            x: pose.x,
            y: pose.y,
            scale: pose.scale * 0.92,
            rotation: pose.rotation,
            opacity: 0,
            transformOrigin: "0 0",
          });
          timeline.to(
            el,
            {
              opacity: 1,
              scale: pose.scale,
              duration: 0.72,
              ease: "power2.out",
            },
            0.38 + index * 0.03
          );
          return;
        }

        timeline.to(
          el,
          {
            x: pose.x,
            y: pose.y,
            scale: pose.scale,
            rotation: pose.rotation,
            duration: 0.82,
            ease: "power3.inOut",
          },
          0.16 + index * 0.012
        );
      });
    },
    [getCanvasPose, getElement, getTargets, killDrift, reducedMotion]
  );

  useEffect(() => {
    return () => {
      driftTweensRef.current.forEach((tween) => tween.kill());
      driftTweensRef.current = [];
      timelineRef.current?.kill();
    };
  }, []);

  return {
    placeAtCover,
    placeAtCanvas,
    startDrift,
    playToCanvas,
    killDrift,
  };
}
