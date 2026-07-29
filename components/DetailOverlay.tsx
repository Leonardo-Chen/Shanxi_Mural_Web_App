"use client";

import { useCallback } from "react";
import type { Temple } from "@/data/temples";
import type { StoryCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface DetailContent {
  type: "temple" | "story";
  temple?: Temple;
  story?: StoryCardData;
}

interface DetailOverlayProps {
  content: DetailContent | null;
  onClose: () => void;
  isMobile: boolean;
}

export default function DetailOverlay({
  content,
  onClose,
  isMobile,
}: DetailOverlayProps) {
  const reducedMotion = useReducedMotion();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!content) return null;

  const isTemple = content.type === "temple" && content.temple;
  const isStory = content.type === "story" && content.story;

  const title = isTemple
    ? `${content.temple!.name}${isTemple ? "壁画" : ""}`
    : content.story!.title;

  const description = isTemple
    ? content.temple!.description
    : content.story!.description;

  const keywords = isTemple
    ? content.temple!.keywords
    : content.story!.keywords;

  const image = isTemple
    ? content.temple!.detailImage
    : content.story!.detailImage;

  const imageAlt = isTemple
    ? content.temple!.detailImageAlt
    : content.story!.detailImageAlt;

  const templeName = isStory
    ? templeMap[content.story!.templeId]?.name
    : undefined;

  return (
    <div
      className={`fixed inset-0 z-[100] flex ${
        isMobile ? "items-end" : "items-center justify-center"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[3px]"
        style={{
          transition: reducedMotion ? "none" : "opacity 0.4s ease",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex w-full flex-col bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[85vh] rounded-t-md"
            : "mx-6 max-h-[90vh] max-w-3xl rounded-sm"
        }`}
        style={{
          animation: reducedMotion
            ? "none"
            : isMobile
              ? "slideUp 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "fadeScale 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-sm text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          aria-label="关闭详情"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={`relative w-full ${isMobile ? "h-48" : "h-72"} shrink-0 overflow-hidden ${isMobile ? "rounded-t-md" : "rounded-t-sm"}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        <div className="overflow-y-auto px-6 py-5 md:px-8 md:py-6">
          {isTemple && (
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone">
              {content.temple!.region} · {content.temple!.era}
            </p>
          )}
          <h2 className="mt-1 font-serif text-xl text-ink md:text-2xl">
            {isTemple ? `${content.temple!.name}壁画` : title}
          </h2>
          <p className="mt-3 font-serif text-sm leading-relaxed text-ink/75">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-sm bg-parchment px-2.5 py-1 font-sans text-[10px] text-stone"
              >
                {kw}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ActionButton primary>查看壁画故事</ActionButton>
            {isTemple && <ActionButton>进入寺庙</ActionButton>}
            <ActionButton>{isTemple ? "规划现场参观" : "开始读画"}</ActionButton>
          </div>

          {isStory && templeName && (
            <p className="mt-4 font-sans text-[10px] text-ink/40">
              所属：{content.story!.templeId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  primary = false,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-sm px-5 py-2.5 font-sans text-xs tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice ${
        primary
          ? "bg-cinnabar text-rice hover:bg-cinnabar/90"
          : "border border-ink/15 text-ink hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}
