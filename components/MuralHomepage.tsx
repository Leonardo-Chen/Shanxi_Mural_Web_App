"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import TextureBackground from "./TextureBackground";
import IntroOverlay from "./IntroOverlay";
import ShanxiMap from "./ShanxiMap";
import DraggableCanvas from "./DraggableCanvas";
import DetailOverlay, { type DetailContent } from "./DetailOverlay";
import FixedNavigation from "./FixedNavigation";
import NavPanel, { type NavSection } from "./NavPanel";
import DragIndicator from "./DragIndicator";
import MiniMap, { MobilePositionIndicator } from "./MiniMap";
import { muralCards, muralCardMap, type MuralCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import { canvasLayout } from "@/data/canvasLayout";
import {
  scaleCards,
  scaleSize,
  scalePoint,
  getTempleCardTemplates,
  getVisibleInfiniteTempleCards,
  resolveTempleCardId,
  TEMPLE_INFINITE_CANVAS,
  TEMPLE_INFINITE_CENTER,
} from "@/lib/canvasScale";
import { useDraggableCanvas } from "@/hooks/useDraggableCanvas";
import { useCardTransition } from "@/hooks/useCardTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Phase = "intro" | "map" | "explore";

function filterCardsForTemple(
  templeId: string | null,
  isMobile: boolean
): MuralCardData[] {
  if (templeId) {
    // 寺庙画布：该寺全部卡片，等大网格展示（含移动端）
    return muralCards.filter(
      (card) => card.type !== "annotation" && card.templeId === templeId
    );
  }

  if (!isMobile) return muralCards;

  return muralCards.filter((card) => {
    if (card.type === "temple") return true;
    if (card.type === "annotation") {
      return card.id === "anno-1" || card.id === "anno-5";
    }
    return card.priority === "high";
  });
}

export default function MuralHomepage() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [introVisible, setIntroVisible] = useState(true);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null);
  const [navSection, setNavSection] = useState<NavSection | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const parallaxRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploreSession, setExploreSession] = useState(0);

  const pendingFocusRef = useRef<{ x: number; y: number } | null>(null);

  const { captureFlipState, animateClose } = useCardTransition();

  const canvasSize = useMemo(() => {
    if (selectedTempleId) {
      return scaleSize(TEMPLE_INFINITE_CANVAS, isMobile);
    }
    return isMobile ? canvasLayout.mobile : canvasLayout.desktop;
  }, [isMobile, selectedTempleId]);

  const initialCenter = useMemo(() => {
    if (selectedTempleId) {
      return scalePoint(TEMPLE_INFINITE_CENTER, isMobile);
    }
    return isMobile
      ? canvasLayout.mobileInitialViewport
      : canvasLayout.initialViewport;
  }, [isMobile, selectedTempleId]);

  const templeTemplates = useMemo(() => {
    if (!selectedTempleId) return [];
    return getTempleCardTemplates(
      filterCardsForTemple(selectedTempleId, isMobile),
      selectedTempleId
    );
  }, [selectedTempleId, isMobile]);

  const {
    position,
    isDragging,
    initialized,
    viewportSize,
    bind,
    navigateTo,
  } = useDraggableCanvas({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    initialCenter,
    enabled: phase === "explore" && !detailContent && !navSection,
    onPositionChange: (pos) => {
      const dx = pos.x - lastPosRef.current.x;
      const dy = pos.y - lastPosRef.current.y;
      lastPosRef.current = pos;
      if (parallaxRafRef.current !== null) return;
      parallaxRafRef.current = requestAnimationFrame(() => {
        setParallaxOffset({ x: dx, y: dy });
        parallaxRafRef.current = null;
      });
    },
  });

  // 拖动结束时清零视差，避免残留偏移
  useEffect(() => {
    if (!isDragging) {
      setParallaxOffset({ x: 0, y: 0 });
    }
  }, [isDragging]);

  const cards = useMemo(() => {
    if (selectedTempleId && templeTemplates.length > 0) {
      return getVisibleInfiniteTempleCards(templeTemplates, {
        viewLeft: -position.x,
        viewTop: -position.y,
        viewWidth: viewportSize.width || 1280,
        viewHeight: viewportSize.height || 800,
        isMobile,
      });
    }

    return scaleCards(filterCardsForTemple(null, isMobile), isMobile);
  }, [
    selectedTempleId,
    templeTemplates,
    isMobile,
    position.x,
    position.y,
    viewportSize.width,
    viewportSize.height,
  ]);

  const activeTempleIds = useMemo(
    () => (selectedTempleId ? [selectedTempleId] : null),
    [selectedTempleId]
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const enterTempleExplore = useCallback(
    (templeId: string, focus?: { x: number; y: number }) => {
      pendingFocusRef.current = focus ?? null;
      setSelectedTempleId(templeId);
      setNavSection(null);
      setDetailContent(null);
      setSelectedCardId(null);
      setIntroVisible(true);
      setExploreSession((n) => n + 1);
      setPhase("explore");
    },
    []
  );

  const handleStartExplore = useCallback(() => {
    setPhase("map");
  }, []);

  const handleBackToMap = useCallback(() => {
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    pendingFocusRef.current = null;
    setPhase("map");
  }, []);

  useEffect(() => {
    if (phase !== "explore" || !selectedTempleId || !initialized) return;

    const focus = pendingFocusRef.current;
    pendingFocusRef.current = null;

    if (focus) {
      navigateTo(focus.x, focus.y, !reducedMotion);
      return;
    }

    const center = scalePoint(TEMPLE_INFINITE_CENTER, isMobile);
    navigateTo(center.x, center.y, !reducedMotion);
  }, [
    phase,
    selectedTempleId,
    initialized,
    isMobile,
    navigateTo,
    reducedMotion,
    exploreSession,
  ]);

  useEffect(() => {
    if (phase !== "explore") return;

    if (reducedMotion) {
      setIntroVisible(false);
      return;
    }

    // 无限寺庙网格：卡片随视口生成，不做长 stagger，避免拖动时新卡不可见
    if (selectedTempleId) {
      setIntroVisible(false);
      const frame = requestAnimationFrame(() => {
        const cardEls = document.querySelectorAll("[data-flip-id]");
        if (cardEls.length === 0) return;
        gsap.fromTo(
          cardEls,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.02,
            ease: "power2.out",
          }
        );
      });
      return () => cancelAnimationFrame(frame);
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;

    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const cardEls = document.querySelectorAll("[data-flip-id]");
        if (cardEls.length === 0) {
          setIntroVisible(false);
          return;
        }

        gsap.fromTo(
          cardEls,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            stagger: 0.06,
            ease: "power3.out",
            onComplete: () => setIntroVisible(false),
          }
        );
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [phase, selectedTempleId, reducedMotion, exploreSession]);

  const handleSelectCard = useCallback(
    (cardId: string, element: HTMLElement) => {
      const baseId = resolveTempleCardId(cardId);
      const card = muralCardMap[baseId];
      if (!card || card.type === "annotation") return;

      captureFlipState(`[data-flip-id="${cardId}"]`);
      setSelectedCardId(cardId);

      if (card.type === "temple") {
        const temple = templeMap[card.templeId];
        if (temple) setDetailContent({ type: "temple", temple });
      } else {
        setDetailContent({ type: "story", story: card });
      }

      if (!reducedMotion) {
        gsap.to(element, {
          scale: 1.02,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    },
    [captureFlipState, reducedMotion]
  );

  const handleCloseDetail = useCallback(() => {
    animateClose(() => {
      setDetailContent(null);
      setSelectedCardId(null);
    });
  }, [animateClose]);

  const handleNavClick = useCallback(
    (section: NavSection) => {
      if (phase === "intro") {
        setPhase("map");
      }
      if (detailContent) {
        setDetailContent(null);
        setSelectedCardId(null);
      }
      if (section === "temples" && phase === "explore") {
        setNavSection((prev) => (prev === section ? null : section));
        return;
      }
      setNavSection((prev) => (prev === section ? null : section));
    },
    [phase, detailContent]
  );

  const handleCloseNav = useCallback(() => {
    setNavSection(null);
  }, []);

  const handleSelectTemple = useCallback(
    (templeId: string) => {
      enterTempleExplore(templeId);
    },
    [enterTempleExplore]
  );

  const handleSelectStory = useCallback(
    (cardId: string) => {
      const raw = muralCardMap[cardId];
      if (!raw || raw.type === "annotation" || !raw.templeId) return;

      const scaled = scaleCards([raw], isMobile)[0];
      enterTempleExplore(
        raw.templeId,
        scaled
          ? {
              x: scaled.x + scaled.width / 2,
              y: scaled.y + scaled.height / 2,
            }
          : undefined
      );
    },
    [enterTempleExplore, isMobile]
  );

  useEffect(() => {
    if (!detailContent && !navSection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navSection) {
        setNavSection(null);
        return;
      }
      if (detailContent) handleCloseDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailContent, navSection, handleCloseDetail]);

  const handleMinimapNavigate = useCallback(
    (x: number, y: number) => {
      navigateTo(x, y, true);
    },
    [navigateTo]
  );

  if (!initialized && viewportSize.width === 0) {
    return (
      <div className="fixed inset-0 bg-parchment">
        <TextureBackground />
      </div>
    );
  }

  const selectedTempleName = selectedTempleId
    ? templeMap[selectedTempleId]?.name
    : null;

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      <TextureBackground />

      <FixedNavigation
        compact={phase !== "intro"}
        activeSection={navSection}
        onNavClick={handleNavClick}
      />

      {phase === "map" && (
        <ShanxiMap onSelectTemple={handleSelectTemple} />
      )}

      {phase === "explore" && (
        <>
          <DraggableCanvas
            cards={cards}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            position={position}
            isDragging={isDragging}
            bind={bind}
            onSelectCard={handleSelectCard}
            selectedCardId={selectedCardId}
            isDetailOpen={!!detailContent}
            introVisible={introVisible}
            parallaxOffset={parallaxOffset}
            isMobile={isMobile}
            activeTempleIds={activeTempleIds}
          />

          <button
            type="button"
            onClick={handleBackToMap}
            className="pointer-events-auto fixed left-5 top-20 z-40 rounded-sm border border-ink/15 bg-rice/80 px-3 py-2 font-sans text-[11px] tracking-wide text-ink/70 backdrop-blur-sm transition-colors hover:border-ink/30 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar md:left-6 md:top-24"
          >
            ← 返回地图
            {selectedTempleName ? ` · ${selectedTempleName}` : ""}
          </button>

          <DragIndicator visible={!detailContent && !navSection} />

          {!isMobile && (
            <MiniMap
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
              viewportWidth={viewportSize.width}
              viewportHeight={viewportSize.height}
              position={position}
              onNavigate={handleMinimapNavigate}
            />
          )}

          {isMobile && (
            <MobilePositionIndicator
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
              viewportWidth={viewportSize.width}
              viewportHeight={viewportSize.height}
              position={position}
            />
          )}
        </>
      )}

      {phase === "intro" && (
        <IntroOverlay visible={phase === "intro"} onStart={handleStartExplore} />
      )}

      <NavPanel
        section={navSection}
        onClose={handleCloseNav}
        onSelectTemple={handleSelectTemple}
        onSelectStory={handleSelectStory}
        isMobile={isMobile}
      />

      <DetailOverlay
        content={detailContent}
        onClose={handleCloseDetail}
        isMobile={isMobile}
      />
    </div>
  );
}
