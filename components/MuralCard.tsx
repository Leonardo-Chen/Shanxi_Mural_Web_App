"use client";

import { memo, useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { MuralCardData, StoryCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import { muralById } from "@/data/muralData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locAnnotationMural, locTemple } from "@/lib/i18n/localize";

interface MuralCardProps {
  card: MuralCardData;
  parallaxOffset: { x: number; y: number };
  onSelect: (cardId: string, element: HTMLElement) => void;
  isSelected: boolean;
  isDetailOpen: boolean;
  priority?: boolean;
  introVisible?: boolean;
  isDragging?: boolean;
}

function MuralCardInner({
  card,
  parallaxOffset,
  onSelect,
  isSelected,
  isDetailOpen,
  priority = false,
  introVisible = false,
  isDragging = false,
}: MuralCardProps) {
  const reducedMotion = useReducedMotion();
  const { locale } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const depthFactor = 1 - card.depth * 0.08;
  // 拖动时关闭视差，避免卡片/图片相对画布“单独滑动”
  const parallaxX = isDragging
    ? 0
    : parallaxOffset.x * (1 - card.depth) * 0.015;
  const parallaxY = isDragging
    ? 0
    : parallaxOffset.y * (1 - card.depth) * 0.015;
  const scale =
    depthFactor * (isHovered && !reducedMotion && !isDragging ? 1.03 : 1);
  const rotation =
    isHovered && !reducedMotion && !isDragging ? 0 : card.rotation;

  const transformTransition =
    reducedMotion || isDragging
      ? "none"
      : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease";

  const handleClick = useCallback(() => {
    if (card.type === "annotation" || !cardRef.current) return;
    onSelect(card.id, cardRef.current);
  }, [card, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (card.type === "annotation") return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (cardRef.current) onSelect(card.id, cardRef.current);
      }
    },
    [card, onSelect]
  );

  if (card.type === "annotation") {
    return (
      <CanvasAnnotationCard
        card={card}
        parallaxX={parallaxX}
        parallaxY={parallaxY}
        introVisible={introVisible}
      />
    );
  }

  if (card.type === "temple") {
    const temple = templeMap[card.templeId];
    if (!temple) return null;
    const copy = locTemple(locale, temple);

    return (
      <div
        ref={cardRef}
        data-card-interactive
        data-flip-id={card.id}
        role="button"
        tabIndex={isDetailOpen && !isSelected ? -1 : 0}
        aria-label={`${copy.name}，${copy.region}，${copy.era}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer will-change-transform"
        style={{
          left: card.x,
          top: card.y,
          width: card.width,
          height: card.height,
          transform: `translate(${parallaxX}px, ${parallaxY}px) rotate(${rotation}deg) scale(${scale})`,
          zIndex: isHovered || isSelected ? 30 : Math.round(card.depth * 20),
          opacity: introVisible ? 0 : 1,
          transition: transformTransition,
          pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
        }}
      >
        <TempleCardContent temple={copy} isHovered={isHovered} priority={priority} />
      </div>
    );
  }

  const story = card as StoryCardData;
  const mural = story.muralId ? muralById[story.muralId] : undefined;
  const muralCopy = mural ? locAnnotationMural(locale, mural) : null;
  const storyTitle = muralCopy?.displayTitle ?? story.title;
  const storyAlt = muralCopy?.displayTitle ?? story.imageAlt;

  return (
    <div
      ref={cardRef}
      data-card-interactive
      data-flip-id={card.id}
      role="button"
      tabIndex={isDetailOpen && !isSelected ? -1 : 0}
      aria-label={storyTitle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute cursor-pointer will-change-transform"
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height,
        transform: `translate(${parallaxX}px, ${parallaxY}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex: isHovered || isSelected ? 30 : Math.round(card.depth * 20),
        opacity: introVisible ? 0 : 1,
        transition: transformTransition,
        pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
      }}
    >
      <StoryCardContent
        story={story}
        title={storyTitle}
        imageAlt={storyAlt}
        isHovered={isHovered}
        priority={priority}
      />
    </div>
  );
}

function TempleCardContent({
  temple,
  isHovered,
  priority,
}: {
  temple: (typeof templeMap)[string];
  isHovered: boolean;
  priority: boolean;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-sm bg-rice/60 shadow-[0_2px_12px_rgba(38,36,31,0.08)]">
      <div className="relative flex-1 overflow-hidden">
        <Image
          src={temple.image}
          alt={temple.imageAlt}
          fill
          sizes="(max-width: 768px) 200px, 320px"
          priority={priority}
          draggable={false}
          className="pointer-events-none select-none object-cover group-hover:scale-[1.03] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />
      </div>
      <div className="px-3 py-2.5">
        <h3 className="font-serif text-base text-ink">{temple.name}</h3>
        <p className="mt-0.5 font-sans text-[10px] tracking-wider text-stone">
          {temple.region} · {temple.era}
        </p>
        {(isHovered || priority) && (
          <p className="mt-1.5 font-serif text-[11px] leading-snug text-ink/65">
            {temple.tagline}
          </p>
        )}
      </div>
    </div>
  );
}

function StoryCardContent({
  story,
  title,
  imageAlt,
  isHovered,
  priority,
}: {
  story: StoryCardData;
  title: string;
  imageAlt: string;
  isHovered: boolean;
  priority: boolean;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-md bg-rice/50 shadow-[0_1px_8px_rgba(38,36,31,0.06)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-[#C8BFB0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt={imageAlt}
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          className="pointer-events-none absolute inset-0 h-full w-full select-none rounded-md object-cover group-hover:scale-[1.03] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />
      </div>
      <div className="shrink-0 px-3 py-2.5">
        <p
          className={`font-serif text-[12px] leading-snug text-ink/80 transition-colors ${
            isHovered ? "text-ink" : ""
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function CanvasAnnotationCard({
  card,
  parallaxX,
  parallaxY,
  introVisible,
}: {
  card: Extract<MuralCardData, { type: "annotation" }>;
  parallaxX: number;
  parallaxY: number;
  introVisible: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        left: card.x,
        top: card.y,
        transform: `translate(${parallaxX}px, ${parallaxY}px) rotate(${card.rotation}deg)`,
        opacity: introVisible ? 0 : 0.55,
        transition: "opacity 0.3s ease",
      }}
      aria-hidden="true"
    >
      <p className="font-sans text-[11px] tracking-wide text-ink/50">{card.text}</p>
    </div>
  );
}

const MuralCard = memo(MuralCardInner);
export default MuralCard;

export { TempleCardContent, StoryCardContent, CanvasAnnotationCard };
