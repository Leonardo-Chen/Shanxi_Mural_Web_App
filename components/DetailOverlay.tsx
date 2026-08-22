"use client";

import { useCallback, useMemo } from "react";
import type { Temple } from "@/data/temples";
import type { StoryCardData } from "@/data/muralCards";
import type { CoverElement } from "@/data/coverElements";
import { COVER_CATEGORY_LABELS } from "@/data/coverElements";
import { templeMap } from "@/data/temples";
import { elements, type ManifestMural } from "@/data/muralData";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import BoundedMuralViewer from "@/components/matching/BoundedMuralViewer";
import MuralInfoPanel from "@/components/annotations/MuralInfoPanel";

export interface DetailContent {
  type: "temple" | "story" | "element" | "mural";
  temple?: Temple;
  story?: StoryCardData;
  element?: CoverElement;
  mural?: ManifestMural;
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

  if (content.type === "mural" && content.mural) {
    return (
      <MuralExploreOverlay
        mural={content.mural}
        isMobile={isMobile}
        onClose={onClose}
      />
    );
  }

  const isElement = content.type === "element" && content.element;
  const isTemple = content.type === "temple" && content.temple;
  const isStory = content.type === "story" && content.story;

  const title = isElement
    ? content.element!.alt
    : isTemple
      ? `${content.temple!.name}壁画`
      : content.story!.title;

  const description = isElement
    ? "人物资料尚在整理中"
    : isTemple
      ? content.temple!.description
      : content.story!.description;

  const keywords = isElement
    ? [COVER_CATEGORY_LABELS[content.element!.category], content.element!.id]
    : isTemple
      ? content.temple!.keywords
      : content.story!.keywords;

  const image = isElement
    ? null
    : isTemple
      ? content.temple!.detailImage
      : content.story!.detailImage;

  const imageAlt = isElement
    ? content.element!.alt
    : isTemple
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

        {image ? (
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
        ) : (
          <div
            className={`flex w-full shrink-0 items-center justify-center bg-[#C5BDB1] ${
              isMobile ? "h-36 rounded-t-md" : "h-48 rounded-t-sm"
            }`}
            aria-hidden="true"
          />
        )}

        <div className="overflow-y-auto px-6 py-5 md:px-8 md:py-6">
          {isTemple && (
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone">
              {content.temple!.region} · {content.temple!.era}
            </p>
          )}
          {isElement && (
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone">
              {COVER_CATEGORY_LABELS[content.element!.category]} · {content.element!.id}
            </p>
          )}
          <h2 className="mt-1 font-serif text-xl text-ink md:text-2xl">
            {title}
          </h2>
          <p className="mt-3 font-serif text-sm leading-relaxed text-ink/75">
            {description}
          </p>
          {isElement && (
            <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-ink/45">
              CONTENT IN PREPARATION
            </p>
          )}

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

          {!isElement && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <ActionButton primary>查看壁画故事</ActionButton>
              {isTemple && <ActionButton>进入寺庙</ActionButton>}
              <ActionButton>{isTemple ? "规划现场参观" : "开始读画"}</ActionButton>
            </div>
          )}

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

function MuralExploreOverlay({
  mural,
  isMobile,
  onClose,
}: {
  mural: ManifestMural;
  isMobile: boolean;
  onClose: () => void;
}) {
  const relatedElements = useMemo(
    () => elements.filter((element) => element.sourceMuralId === mural.id),
    [mural.id]
  );
  const image = mural.imageSrc;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] flex ${
        isMobile
          ? "top-[4.75rem] items-end"
          : "top-24 items-center justify-center p-6"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={mural.displayTitle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className={`relative flex w-full overflow-hidden bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[calc(100%-0.5rem)] flex-col rounded-t-md"
            : "h-full max-h-[40rem] max-w-5xl flex-row"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭壁画详情"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-rice/90 text-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
        >
          ×
        </button>

        <div
          className={`shrink-0 bg-[#B8B0A4] ${
            isMobile ? "h-52 w-full" : "h-full w-[54%]"
          }`}
        >
          {image ? (
            <BoundedMuralViewer
              src={image}
              alt={mural.displayTitle}
            />
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <MuralInfoPanel mural={mural} relatedElements={relatedElements} />
        </div>
      </article>
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
