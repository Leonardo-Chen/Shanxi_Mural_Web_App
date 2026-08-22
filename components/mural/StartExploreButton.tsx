"use client";

import { forwardRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface StartExploreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}

const StartExploreButton = forwardRef<HTMLButtonElement, StartExploreButtonProps>(
  function StartExploreButton({ onClick, disabled = false, pressed = false }, ref) {
    const { t } = useLocale();
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-pressed={pressed ? "true" : "false"}
        className="group min-h-12 min-w-[15.5rem] bg-cinnabar px-11 py-3.5 font-serif text-[1.05rem] leading-none text-rice transition-[background-color,transform,box-shadow] duration-200 ease-out hover:bg-[#7a2e28] hover:-translate-y-0.5 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment active:translate-y-0 active:scale-[0.98] data-[pressed=true]:scale-[0.97] data-[pressed=true]:bg-[#6e2924] disabled:pointer-events-none md:text-[1.2rem]"
      >
        {t("cover.start")}
      </button>
    );
  }
);

export default StartExploreButton;
