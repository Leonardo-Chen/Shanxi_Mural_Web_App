"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export const CANVAS_ZOOM_STEP = 1.22;

type CanvasViewControlsProps = {
  onBack?: () => void;
  backLabel?: string;
  backPlacement?: "top-left" | "bottom-left";
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  showZoom?: boolean;
};

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-rice text-[18px] leading-none text-ink/75 shadow-[0_8px_24px_rgb(33_51_56_/_12%)] transition-colors hover:border-ink/30 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.2 3.6 5.2 9l6 5.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.2 8.1 9 3.2l5.8 4.9V14.6c0 .6-.5 1.1-1.1 1.1H10.4v-4.2H7.6v4.2H4.3c-.6 0-1.1-.5-1.1-1.1V8.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CanvasViewControls({
  onBack,
  backLabel,
  backPlacement = "bottom-left",
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
  showZoom = true,
}: CanvasViewControlsProps) {
  const { t } = useLocale();

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]">
      {onBack ? (
        <div
          className={`pointer-events-auto absolute ${
            backPlacement === "top-left"
              ? "left-4 top-4 md:left-6 md:top-5"
              : "bottom-5 left-5 md:bottom-6 md:left-6"
          }`}
        >
          <IconButton
            label={backLabel ?? t("home.backCover")}
            onClick={onBack}
          >
            <BackIcon />
          </IconButton>
        </div>
      ) : null}

      {showZoom ? (
        <div
          className="pointer-events-auto absolute bottom-5 right-5 flex flex-col gap-2 md:bottom-6 md:right-6"
          role="toolbar"
          aria-label={t("home.controls")}
        >
          <IconButton
            label={t("map.zoomIn")}
            onClick={onZoomIn}
            disabled={!canZoomIn}
          >
            +
          </IconButton>
          <IconButton
            label={t("map.zoomOut")}
            onClick={onZoomOut}
            disabled={!canZoomOut}
          >
            −
          </IconButton>
          <IconButton label={t("map.reset")} onClick={onReset}>
            <HomeIcon />
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}
