"use client";

import { memo, useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { MuralCardData, StoryCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import OutlineAnimation from "@/components/mural/OutlineAnimation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locEra, locHall, locTemple } from "@/lib/i18n/localize";
import { locPair } from "@/lib/i18n/pick";
import { muralOverlays } from "@/lib/i18n/muralsOverlay";

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

    return (
      <div
        ref={cardRef}
        data-card-interactive
        data-flip-id={card.id}
        role="button"
        tabIndex={isDetailOpen && !isSelected ? -1 : 0}
        aria-label={`${temple.name}，${temple.region}，${temple.era}`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
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
        <TempleCardContent temple={temple} isHovered={isHovered} priority={priority} />
      </div>
    );
  }

  if (card.type === "mural") {
    const outlineActive = isSelected && !isDetailOpen && !focusing;
    const lift = isHovered || isSelected || focusing;

    return (
      <div
        ref={cardRef}
        data-card-interactive
        data-flip-id={card.id}
        role="button"
        tabIndex={isDetailOpen && !isSelected ? -1 : 0}
        aria-label={card.title}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute cursor-pointer will-change-transform"
        style={{
          left: card.x,
          top: card.y,
          width: card.width,
          height: card.height,
          transform: `translate(${parallaxX}px, ${parallaxY}px) rotate(${rotation}deg) scale(${
            focusing ? depthFactor * 1.04 : scale
          })`,
          zIndex: lift ? 30 : Math.round(card.depth * 20),
          opacity: introVisible ? 0 : muted ? 0.42 : 1,
          transition: transformTransition,
          pointerEvents: isDetailOpen && !isSelected ? "none" : "auto",
        }}
      >
        <ExploreMuralCardContent
          title={locPair(locale, card.title, muralOverlays[card.muralId]?.displayTitle)}
          hall={card.hall ? locHall(locale, card.hall) : card.hall}
          period={card.period ? locEra(locale, card.period) : card.period}
          image={card.image}
          imageAlt={locPair(locale, card.imageAlt, muralOverlays[card.muralId]?.displayTitle)}
          isHovered={isHovered}
          priority={priority}
        />
        <OutlineAnimation
          active={outlineActive}
          width={card.width}
          height={card.height}
          reducedMotion={reducedMotion}
          onComplete={() => onOutlineComplete?.(card.id)}
        />
      </div>
    );
  }

  const story = card as StoryCardData;
  return (
    <div
      ref={cardRef}
      data-card-interactive
      data-flip-id={card.id}
      role="button"
      tabIndex={isDetailOpen && !isSelected ? -1 : 0}
      aria-label={story.title}
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
      <StoryCardContent story={story} isHovered={isHovered} priority={priority} />
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
    <div className="group flex h-full flex-col overflow-hidden rounded-sm bg-rice/60 shadow-[0_2px_12px_rgba(38,36,31,0.08)]">
      <div className="relative flex-1 overflow-hidden">
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
        <h3 className="font-serif text-base text-ink">{copy.name}</h3>
        <p className="mt-0.5 font-sans text-[10px] tracking-wider text-stone">
          {copy.region} · {copy.era}
        </p>
        {(isHovered || priority) && (
          <p className="mt-1.5 font-serif text-[11px] leading-snug text-ink/65">
            {copy.tagline}
          </p>
        )}
      </div>
    </div>
  );
}

function ExploreMuralCardContent({
  title,
  hall,
  period,
  image,
  imageAlt,
  isHovered,
}: {
  title: string;
  hall?: string;
  period?: string;
  image?: string;
  imageAlt: string;
  isHovered: boolean;
  priority: boolean;
}) {
  const meta = [hall, period].filter(Boolean).join(" · ");

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-md bg-rice/50 shadow-[0_1px_8px_rgba(38,36,31,0.06)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-[#C5BDB1]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain group-hover:scale-[1.03] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
            style={{ WebkitUserDrag: "none" } as React.CSSProperties}
          />
        ) : null}
      </div>
      <div className="shrink-0 px-3 py-2.5">
        <p
          className={`font-serif text-[12px] leading-snug text-ink/80 transition-colors ${
            isHovered ? "text-ink" : ""
          }`}
        >
          {title}
        </p>
        {meta ? (
          <p className="mt-1 font-sans text-[10px] tracking-wide text-stone/60">
            {meta}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StoryCardContent({
  story,
  isHovered,
  priority,
}: {
  story: StoryCardData;
  isHovered: boolean;
  priority: boolean;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-md bg-rice/50 shadow-[0_1px_8px_rgba(38,36,31,0.06)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md">
        <Image
          src={story.image}
          alt={story.imageAlt}
          fill
          sizes="(max-width: 768px) 160px, 240px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          draggable={false}
          className="pointer-events-none select-none rounded-md object-cover group-hover:scale-[1.03] motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-out"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />
      </div>
      <div className="shrink-0 px-3 py-2.5">
        <p
          className={`font-serif text-[12px] leading-snug text-ink/80 transition-colors ${
            isHovered ? "text-ink" : ""
          }`}
        >
          {story.title}
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
