"use client";

import { forwardRef } from "react";

interface StartExploreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  label?: string;
  hint?: string;
}

const StartExploreButton = forwardRef<HTMLButtonElement, StartExploreButtonProps>(
  function StartExploreButton(
    {
      onClick,
      disabled = false,
      pressed = false,
      label = "",
      hint = "",
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-pressed={pressed ? "true" : "false"}
        className="group min-h-12 min-w-[16.5rem] max-w-[min(22rem,calc(100vw-3rem))] rounded-full bg-cinnabar px-8 py-3.5 text-rice transition-[background-color,transform,box-shadow] duration-200 ease-out hover:bg-[#7a2e28] hover:-translate-y-0.5 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment active:translate-y-0 active:scale-[0.98] data-[pressed=true]:scale-[0.97] data-[pressed=true]:bg-[#6e2924] disabled:pointer-events-none md:px-11"
      >
        <span className="block font-serif text-[1.05rem] leading-none md:text-[1.2rem]">
          {label}
        </span>
        <span className="mt-1.5 block font-sans text-[8px] tracking-[0.28em] text-rice/85 md:text-[9px]">
          {hint}
        </span>
      </button>
    );
  }
);

export default StartExploreButton;
