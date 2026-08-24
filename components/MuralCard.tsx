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
  focusing?: boolean;
  muted?: boolean;
  onOutlineComplete?: (cardId: string) => void;
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
  focusing = false,
  muted = false,
  onOutlineComplete,
}: MuralCardProps) {
  const reducedMotion = useReducedMotion();
  const { locale } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lift = isHovered || isSelected || focusing;

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

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (card.type === "annotation" || !cardRef.current) return;
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      if (
        start &&
        Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6
      ) {
        return;
      }
      onSelect(card.id, cardRef.current);
    },
    [card, onSelect]
  );

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
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer will-change-transform grid__item"
        style={{
          width: card.width,
          height: card.height,
          transform: `translate3d(${card.x + parallaxX}px, ${card.y + parallaxY}px, 0) rotate(${rotation}deg) scale(${scale})`,
          zIndex: lift ? 30 : Math.round(card.depth * 20),
          opacity: introVisible ? 0 : muted ? 0.58 : 1,
          transition: transformTransition,
          pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
        }}
      >
        <div className="grid__itemCard h-full w-full">
          <TempleCardContent temple={temple} isHovered={isHovered} priority={priority} />
          {/* Back structure referencing user's design */}
          <div className="grid__itemBack pointer-events-none opacity-0 hidden">
            <div className="grid__itemClose pointer"></div>
            <div className="grid__itemThumb">
              <picture className="grid__itemThumbInner">
                <img src={temple.image} alt={temple.name} />
              </picture>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (card.type === "mural") {
    const mural = muralById[card.muralId];
    const copy = mural ? locAnnotationMural(locale, mural) : null;
    const title = copy?.displayTitle ?? card.title;

    return (
      <div
        ref={cardRef}
        data-card-interactive
        data-flip-id={card.id}
        role="button"
        tabIndex={isDetailOpen && !isSelected ? -1 : 0}
        aria-label={title}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mural-option absolute cursor-pointer text-left will-change-transform"
        style={{
          width: card.width,
          height: card.height,
          transform: `translate3d(${card.x + parallaxX}px, ${card.y + parallaxY}px, 0) rotate(${rotation}deg) scale(${
            focusing ? depthFactor * 1.04 : depthFactor
          })`,
          zIndex: lift ? 30 : Math.round(card.depth * 20),
          opacity: introVisible ? 0 : muted ? 0.58 : 1,
          transition: transformTransition,
          pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
        }}
        aria-pressed={isSelected}
      >
        <ExploreMuralCardContent
          title={title}
          image={mural?.imageSrc ?? card.image}
          imageAlt={title}
        />
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
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mural-option absolute cursor-pointer text-left will-change-transform grid__item"
      style={{
        width: card.width,
        height: card.height,
        transform: `translate3d(${card.x + parallaxX}px, ${card.y + parallaxY}px, 0) rotate(${rotation}deg) scale(${
          focusing ? depthFactor * 1.04 : depthFactor
        })`,
        zIndex: lift ? 30 : Math.round(card.depth * 20),
        opacity: introVisible ? 0 : muted ? 0.58 : 1,
        transition: transformTransition,
        pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
      }}
      aria-pressed={isSelected}
    >
      <StoryCardContent
        story={story}
        title={storyTitle}
        imageAlt={storyAlt}
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
  const { locale } = useLocale();
  const copy = locTemple(locale, temple);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-[rgb(33_51_56_/_18%)] bg-rice shadow-none transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[rgb(33_51_56_/_35%)] hover:shadow-hover">
      <div className="grid__itemPicture relative flex-1 overflow-hidden">
        <Image
          src={copy.image}
          alt={copy.imageAlt}
          fill
          sizes="(max-width: 768px) 200px, 320px"
          priority={priority}
          draggable={false}
          className="pointer-events-none select-none object-cover group-hover:scale-[1.03] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />
      </div>
      <div className="px-3 py-2.5">
        <h3 className="type-caption text-ink">{copy.name}</h3>
        <p className="type-meta mt-1 text-gold">
          {copy.region} · {copy.era}
        </p>
        {(isHovered || priority) && (
          <p className="type-caption mt-2 line-clamp-2 text-ink/70">
            {copy.tagline}
          </p>
        )}
      </div>
    </div>
  );
}

function ExploreMuralCardContent({
  title,
  image,
  imageAlt,
}: {
  title: string;
  image?: string;
  imageAlt: string;
}) {
  return (
    <span className="mural-option-visual relative flex h-full w-full flex-col">
      <span className="relative min-h-0 w-full flex-1 overflow-hidden border border-[rgb(33_51_56_/_18%)] bg-[#B8B0A4]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-cover"
            style={{ WebkitUserDrag: "none" } as React.CSSProperties}
          />
        ) : (
          <span className="block h-full w-full bg-[#B8B0A4]" aria-hidden="true" />
        )}
      </span>
      <span className="type-meta mt-2 line-clamp-2 block shrink-0 text-center text-ink/75">
        {title}
      </span>
    </span>
  );
}

function StoryCardContent({
  story,
  title,
  imageAlt,
  priority,
}: {
  story: StoryCardData;
  title: string;
  imageAlt: string;
  priority: boolean;
}) {
  return (
    <span className="mural-option-visual relative flex h-full w-full flex-col">
      <span className="relative min-h-0 w-full flex-1 overflow-hidden border border-[rgb(33_51_56_/_18%)] bg-[#B8B0A4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt={imageAlt}
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          className="pointer-events-none h-full w-full select-none object-cover"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />
      </span>
      <span className="type-meta mt-2 line-clamp-2 block shrink-0 text-center text-ink/75">
        {title}
      </span>
    </span>
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
      <p className="type-caption text-ink/50">{card.text}</p>
    </div>
  );
}

const MuralCard = memo(MuralCardInner);
export default MuralCard;

export { TempleCardContent, StoryCardContent, CanvasAnnotationCard };
