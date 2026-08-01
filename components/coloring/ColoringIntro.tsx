"use client";

import { coloringArtwork } from "@/data/coloringArtwork";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ColoringIntroProps {
  onStart: () => void;
}

export default function ColoringIntro({ onStart }: ColoringIntroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-parchment/75 backdrop-blur-[2px] ${
        reducedMotion ? "" : "animate-[fadeScale_0.7s_ease-out]"
      }`}
    >
      <div className="max-w-md px-6 text-center">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">
          {coloringArtwork.pageTitle}
        </h2>
        <p className="mt-2 font-sans text-xs tracking-[0.2em] text-stone">
          {coloringArtwork.titleEn}
        </p>
        <p className="mt-6 font-serif text-sm leading-relaxed text-ink/75">
          选择壁画中的颜色，重新为三清殿东壁天神着色。
          完成后，你可以将自己的作品与原壁画进行比较。
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-sm bg-cinnabar px-8 py-3 font-sans text-xs tracking-wider text-rice transition-colors hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
        >
          开始着色
        </button>
        <p className="mt-4 font-serif text-[11px] text-ink/50">
          这里没有唯一正确的画法，你也可以先按照自己的理解选择颜色。
        </p>
      </div>
    </div>
  );
}
