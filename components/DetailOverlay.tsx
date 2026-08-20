"use client";

import { useCallback } from "react";
import type { Temple } from "@/data/temples";
import type { StoryCardData } from "@/data/muralCards";
import type { CoverElement } from "@/data/coverElements";
import type { Mural } from "@/data/murals";
import { templeMap } from "@/data/temples";
import { elementsByMuralId, muralById } from "@/data/muralData";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import BoundedMuralViewer from "@/components/matching/BoundedMuralViewer";
import MuralInfoPanel from "@/components/annotations/MuralInfoPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  locCoverAlt,
  locCoverCategory,
  locMural,
  locTemple,
} from "@/lib/i18n/localize";

export interface DetailContent {
  type: "temple" | "story" | "element" | "mural";
  temple?: Temple;
  story?: StoryCardData;
  element?: CoverElement;
  mural?: Mural;
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
  const { locale, t } = useLocale();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!content) return null;

  const isElement = content.type === "element" && content.element;
  const isTemple = content.type === "temple" && content.temple;
  const isStory = content.type === "story" && content.story;
  const isMural = content.type === "mural" && content.mural;
  const annotated = isMural ? muralById[content.mural!.id] : undefined;
  const temple = isTemple ? locTemple(locale, content.temple!) : undefined;
  const mural = isMural ? locMural(locale, content.mural!) : undefined;
  const elementAlt = isElement
    ? locCoverAlt(locale, content.element!.id, content.element!.alt)
    : "";

  const title = isElement
    ? elementAlt
    : isTemple
      ? t("detail.templeMurals", { name: temple!.name })
      : isMural
        ? mural!.displayTitle
        : content.story!.title;

  if (isMural && mural) {
    const related = elementsByMuralId[mural.id] ?? [];
    const image = mural.image || mural.thumbnail;

    return (
      <div
        className={`fixed inset-0 z-[100] flex bg-ink/45 ${
          isMobile ? "items-end" : "items-center justify-center p-6"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={handleBackdropClick}
      >
        <article
          className={`relative flex w-full overflow-hidden bg-rice shadow-2xl ${
            isMobile
              ? "max-h-[88svh] flex-col rounded-t-md"
              : "h-[min(90vh,40rem)] max-w-5xl flex-row"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("detail.closeMural")}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-rice/90 text-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            ×
          </button>
          <div
            className={`relative min-h-0 shrink-0 bg-[#B8B0A4] ${
              isMobile ? "h-52 w-full" : "h-full w-[54%]"
            }`}
          >
            {image ? (
              <BoundedMuralViewer
                src={image}
                alt={annotated?.displayTitle ?? mural.alt}
                describedBy="explore-mural-detail-copy"
                resetKey={mural.id}
              />
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
          </div>
          <div
            id="explore-mural-detail-copy"
            className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8"
          >
            {annotated ? (
              <MuralInfoPanel mural={annotated} relatedElements={related} />
            ) : (
              <div>
                <h2 className="font-serif text-2xl text-stone">
                  {mural.displayTitle}
                </h2>
                <p className="mt-1 font-sans text-[11px] text-stone/60">
                  {mural.templeName}
                  {mural.hall ? ` / ${mural.hall}` : ""}
                  {mural.period ? ` · ${mural.period}` : ""}
                </p>
                {mural.detailedDescription || mural.description ? (
                  <p className="mt-5 font-serif text-sm leading-7 text-ink/70">
                    {mural.detailedDescription ?? mural.description}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </article>
      </div>
    );
  }

  const description = isElement
    ? t("detail.elementPending")
    : isTemple
      ? temple!.description
      : content.story!.description;

  const image = isElement
    ? null
    : isTemple
      ? temple!.detailImage
      : content.story!.detailImage;

  const imageAlt = isElement
    ? elementAlt
    : isTemple
      ? temple!.detailImageAlt
      : content.story!.detailImageAlt;

  const storyTemple = isStory
    ? templeMap[content.story!.templeId]
    : undefined;
  const templeName = storyTemple
    ? locTemple(locale, storyTemple).name
    : undefined;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
    >
      {/* 嵌入式 entry 弹出放大特效 CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes postcardPop {
          0% {
            opacity: 0;
            transform: scale(0.35) rotate(-6deg) translateY(50px);
          }
          65% {
            transform: scale(1.025) rotate(1deg) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
          }
        }
        .postcard-container {
          animation: postcardPop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}} />

      {/* 遮罩背景 */}
      <div
        className="absolute inset-0 bg-ink/65 backdrop-blur-[4px]"
        style={{
          transition: reducedMotion ? "none" : "opacity 0.4s ease",
        }}
        aria-hidden="true"
      />

      {/* 竖向明信片卡片 - 高度固定为 540px，宽度为 360px/380px，无内部滚动条，一页纸布局 */}
      <div
        className={`relative z-10 flex flex-col justify-between bg-[#F4EFE6] text-ink p-4 border border-ink/10 shadow-2xl rounded-sm postcard-container overflow-hidden ${
          isMobile
            ? "h-[500px] w-[330px]"
            : "h-[540px] w-[370px]"
        }`}
        style={{
          boxShadow: "0 20px 50px rgba(38, 36, 31, 0.3), inset 0 0 40px rgba(139, 53, 46, 0.04)",
        }}
      >
        {/* 顶部经典双细线明信片边框装饰 */}
        <div className="absolute inset-2 pointer-events-none border border-ink/5 rounded-sm" />
        <div className="absolute inset-2.5 pointer-events-none border border-dashed border-[#8B352E]/10 rounded-sm" />

        {/* 关闭按钮 - 设计成一个古风的小圆盖戳记 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-sm text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          aria-label={t("detail.close")}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.8"
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
              {temple!.region} · {temple!.era}
            </p>
          )}
          {isElement && (
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone">
              {locCoverCategory(locale, content.element!.category)} · {content.element!.id}
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
              {t("detail.elementPending")}
            </p>
          )}

          {!isElement && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <ActionButton primary>{t("detail.viewStory")}</ActionButton>
              {isTemple && <ActionButton>{t("detail.enterTemple")}</ActionButton>}
              <ActionButton>
                {isTemple ? t("detail.planVisit") : t("detail.startReading")}
              </ActionButton>
            </div>
          )}

          {isStory && templeName && (
            <p className="mt-4 font-sans text-[10px] text-ink/40">
              {t("detail.belongsTo", { id: templeName })}
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
  className = "",
}: {
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`rounded-xs px-3 font-serif text-[11px] tracking-widest transition-all duration-300 font-medium active:scale-97 shadow-sm flex items-center justify-center gap-1 ${
        primary
          ? "bg-[#8B352E] text-[#FDFBF7] hover:bg-[#8B352E]/90 border border-[#8B352E] hover:shadow-md"
          : "border border-[#8B352E]/25 text-[#8B352E] hover:bg-[#8B352E]/5 hover:border-[#8B352E]/40 bg-white/40"
      } ${className}`}
    >
      {children}
    </button>
  );
}
