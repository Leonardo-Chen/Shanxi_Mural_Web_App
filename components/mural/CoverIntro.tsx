"use client";

import StartExploreButton from "./StartExploreButton";

interface CoverIntroProps {
  visible: boolean;
  pressed: boolean;
  transitioning: boolean;
  onStart: () => void;
  chromeRef: React.RefObject<HTMLDivElement | null>;
}

export default function CoverIntro({
  visible,
  pressed,
  transitioning,
  onStart,
  chromeRef,
}: CoverIntroProps) {
  return (
    <div
      ref={chromeRef}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={transitioning ? undefined : { opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <div className="relative z-10 flex w-full max-w-2xl -translate-y-6 flex-col items-center px-6 text-center md:-translate-y-10">
        <h1 className="font-serif text-[2.4rem] font-normal leading-[1.12] tracking-[0.06em] text-stone md:text-[3.5rem] lg:text-[3.85rem]">
          山西寺观壁画
        </h1>
        <p className="mt-3.5 font-sans text-[9px] tracking-[0.48em] text-stone/70 md:mt-4 md:text-[11px]">
          SHANXI TEMPLE MURALS
        </p>
        <div
          className={`mt-8 md:mt-10 ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <StartExploreButton
            onClick={onStart}
            disabled={!visible || pressed}
            pressed={pressed}
          />
        </div>
      </div>
    </div>
  );
}
