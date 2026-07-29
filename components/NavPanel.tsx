"use client";

import { useCallback, useMemo } from "react";
import { temples, templeMap } from "@/data/temples";
import { muralCards, type StoryCardData } from "@/data/muralCards";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type NavSection = "temples" | "stories" | "routes" | "about";

const SECTION_TITLES: Record<NavSection, string> = {
  temples: "寺庙",
  stories: "壁画故事",
  routes: "探索路线",
  about: "关于项目",
};

/** 推荐探索顺序：中心公主寺，再向四周扩散 */
const ROUTE_TEMPLE_IDS = [
  "gongzhu",
  "yanshan",
  "yongning",
  "shuishen",
  "foguang",
] as const;

interface NavPanelProps {
  section: NavSection | null;
  onClose: () => void;
  onSelectTemple: (templeId: string) => void;
  onSelectStory: (cardId: string) => void;
  isMobile: boolean;
}

export default function NavPanel({
  section,
  onClose,
  onSelectTemple,
  onSelectStory,
  isMobile,
}: NavPanelProps) {
  const reducedMotion = useReducedMotion();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const stories = useMemo(() => {
    const list = muralCards.filter(
      (c): c is StoryCardData => c.type === "story"
    );
    return [...list].sort((a, b) => {
      const rank = (p?: string) =>
        p === "high" ? 0 : p === "normal" ? 1 : 2;
      return rank(a.priority) - rank(b.priority);
    });
  }, []);

  if (!section) return null;

  const title = SECTION_TITLES[section];

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? "items-end" : "items-start justify-end"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        style={{
          transition: reducedMotion ? "none" : "opacity 0.35s ease",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex w-full flex-col bg-rice shadow-2xl ${
          isMobile
            ? "max-h-[75vh] rounded-t-md"
            : "mt-20 mr-6 max-h-[min(70vh,640px)] w-full max-w-sm rounded-sm"
        }`}
        style={{
          animation: reducedMotion
            ? "none"
            : isMobile
              ? "slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "fadeScale 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-4">
          <h2 className="font-serif text-lg text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            aria-label="关闭"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {section === "temples" && (
            <ul className="flex flex-col gap-1">
              {temples.map((temple) => (
                <li key={temple.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTemple(temple.id)}
                    className="w-full rounded-sm px-3 py-3 text-left transition-colors hover:bg-parchment/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                  >
                    <span className="font-serif text-base text-ink">
                      {temple.name}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] tracking-wider text-stone">
                      {temple.region} · {temple.era}
                    </span>
                    <span className="mt-1.5 block font-serif text-[12px] leading-snug text-ink/60">
                      {temple.tagline}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {section === "stories" && (
            <ul className="flex flex-col gap-1">
              {stories.map((story) => (
                <li key={story.id}>
                  <button
                    type="button"
                    onClick={() => onSelectStory(story.id)}
                    className="w-full rounded-sm px-3 py-3 text-left transition-colors hover:bg-parchment/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                  >
                    <span className="font-serif text-sm text-ink">
                      {story.title}
                    </span>
                    <span className="mt-0.5 block font-sans text-[10px] text-stone">
                      {templeMap[story.templeId]?.name ?? story.templeId}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {section === "routes" && (
            <div>
              <p className="font-serif text-sm leading-relaxed text-ink/75">
                从中心公主寺出发，沿淡色连线向四周寺庙漫游，逐步展开山西寺观壁画的时空谱系。
              </p>
              <ol className="mt-4 flex flex-col gap-1">
                {ROUTE_TEMPLE_IDS.map((id, index) => {
                  const temple = templeMap[id];
                  if (!temple) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => onSelectTemple(id)}
                        className="flex w-full items-start gap-3 rounded-sm px-3 py-3 text-left transition-colors hover:bg-parchment/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                      >
                        <span className="mt-0.5 font-sans text-[10px] tabular-nums text-cinnabar/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="font-serif text-base text-ink">
                            {temple.name}
                          </span>
                          <span className="mt-0.5 block font-sans text-[10px] tracking-wider text-stone">
                            {temple.region} · {temple.era}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {section === "about" && (
            <div className="space-y-4">
              <p className="font-serif text-sm leading-relaxed text-ink/80">
                在人物、色彩与残存的故事之间，重新认识山西寺观壁画。
              </p>
              <p className="font-serif text-sm leading-relaxed text-ink/65">
                「看见壁上山西」是一个数字文化探索平台。拖动画布，在寺庙群落与壁画片段之间移动；点击卡片，阅读构图、身份与仪轨背后的叙事。
              </p>
              <p className="font-sans text-[10px] tracking-wider text-stone">
                MURALS OF SHANXI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
