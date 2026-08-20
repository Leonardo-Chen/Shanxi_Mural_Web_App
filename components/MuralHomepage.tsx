"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import TextureBackground from "./TextureBackground";
import ShanxiMap from "./ShanxiMap";
import DraggableCanvas from "./DraggableCanvas";
import DetailOverlay, { type DetailContent } from "./DetailOverlay";
import FixedNavigation from "./FixedNavigation";
import NavPanel, { type NavSection } from "./NavPanel";
import DragIndicator from "./DragIndicator";
import { MobilePositionIndicator } from "./MiniMap";
import MuralExperience from "./mural/MuralExperience";
import MuralMatchingExperience from "./matching/MuralMatchingExperience";
import type { CoverElement } from "@/data/coverElements";
import { muralCards, muralCardMap, getExploreCardsForTemple, type MuralCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import { muralMap, templeHasMurals } from "@/data/murals";
import { canvasLayout } from "@/data/canvasLayout";
import { scaleCards, layoutTempleExplore } from "@/lib/canvasScale";
import { useDraggableCanvas } from "@/hooks/useDraggableCanvas";
import { useCardTransition } from "@/hooks/useCardTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MAX_STARS, useGameProgress } from "@/hooks/useGameProgress";
import {
  FALLBACK_POSTCARDS,
  fetchPostcardAssets,
  pickRandomPostcard,
  type PostcardAsset,
} from "@/lib/postcards";
import PostcardReward from "@/components/postcards/PostcardReward";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Phase = "cover" | "home" | "matching" | "map" | "explore";

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
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("cover");
  const [introVisible, setIntroVisible] = useState(true);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [focusingCardId, setFocusingCardId] = useState<string | null>(null);
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null);
  const focusingCardIdRef = useRef<string | null>(null);
  const selectedCardIdRef = useRef<string | null>(null);
  const muralOpenTimerRef = useRef<number | null>(null);
  selectedCardIdRef.current = selectedCardId;
  const [matchingFigureId, setMatchingFigureId] = useState<string | null>(null);
  const [matchingCoverElement, setMatchingCoverElement] =
    useState<CoverElement | null>(null);
  const [matchingSourceRect, setMatchingSourceRect] = useState<DOMRect | null>(
    null
  );
  const [mapFocusTempleId, setMapFocusTempleId] = useState<string | null>(null);
  const [navSection, setNavSection] = useState<NavSection | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const parallaxRafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploreSession, setExploreSession] = useState(0);
  const [coverGeneration, setCoverGeneration] = useState(0);
  const { progress, redeemPostcard } = useGameProgress();
  const [postcardAssets, setPostcardAssets] = useState<PostcardAsset[]>(
    FALLBACK_POSTCARDS
  );
  const [pendingPostcard, setPendingPostcard] = useState<PostcardAsset | null>(
    null
  );
  const postcardOfferedRef = useRef(false);
  const [matchingDetailOpen, setMatchingDetailOpen] = useState(false);

  const pendingFocusRef = useRef<{ x: number; y: number } | null>(null);

  const { captureFlipState, animateClose } = useCardTransition();

  const exploreLayout = useMemo(() => {
    if (!selectedTempleId) return null;
    return layoutTempleExplore(
      getExploreCardsForTemple(selectedTempleId),
      isMobile
    );
  }, [selectedTempleId, isMobile]);

  const canvasSize = useMemo(() => {
    if (exploreLayout) return exploreLayout.canvas;
    return isMobile ? canvasLayout.mobile : canvasLayout.desktop;
  }, [exploreLayout, isMobile]);

  const initialCenter = useMemo(() => {
    if (exploreLayout) return exploreLayout.center;
    return isMobile
      ? canvasLayout.mobileInitialViewport
      : canvasLayout.initialViewport;
  }, [exploreLayout, isMobile]);

  const handleCanvasPositionChange = useCallback((pos: { x: number; y: number }) => {
    const dx = pos.x - lastPosRef.current.x;
    const dy = pos.y - lastPosRef.current.y;
    lastPosRef.current = pos;
    if (parallaxRafRef.current !== null) return;
    parallaxRafRef.current = requestAnimationFrame(() => {
      setParallaxOffset({ x: dx, y: dy });
      parallaxRafRef.current = null;
    });
  }, []);

  const {
    position,
    isDragging,
    initialized,
    viewportSize,
    bind,
    navigateTo,
    resetView,
    cancelPan,
    hasDraggedRef,
  } = useDraggableCanvas({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    initialCenter,
    enabled:
      phase === "explore" &&
      !detailContent &&
      !navSection &&
      !focusingCardId &&
      !selectedCardId,
    allowDragFromInteractive: true,
    onPositionChange: handleCanvasPositionChange,
  });

  const clearMuralFocus = useCallback(() => {
    focusingCardIdRef.current = null;
    setFocusingCardId(null);
    if (muralOpenTimerRef.current !== null) {
      window.clearTimeout(muralOpenTimerRef.current);
      muralOpenTimerRef.current = null;
    }
  }, []);

  // 拖动结束时清零视差，避免残留偏移
  useEffect(() => {
    if (!isDragging) {
      setParallaxOffset({ x: 0, y: 0 });
    }
  }, [isDragging]);

  const cards = useMemo(() => {
    if (exploreLayout) return exploreLayout.cards;
    return scaleCards(filterCardsForTemple(null, isMobile), isMobile);
  }, [exploreLayout, isMobile]);

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
      clearMuralFocus();
      setIntroVisible(true);
      setExploreSession((n) => n + 1);
      setPhase("explore");
    },
    [clearMuralFocus]
  );

  const handleCoverComplete = useCallback(() => {
    setPhase("home");
  }, []);

  const handleContinueFigure = useCallback(
    (element: CoverElement, sourceRect: DOMRect) => {
      setMatchingFigureId(element.id);
      setMatchingCoverElement(element);
      setMatchingSourceRect(sourceRect);
      setMatchingDetailOpen(false);
      setDetailContent(null);
      setNavSection(null);
      setPhase("matching");
    },
    []
  );

  const goHome = useCallback(() => {
    clearMuralFocus();
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    pendingFocusRef.current = null;
    setMapFocusTempleId(null);
    if (phase !== "cover") setPhase("home");
  }, [clearMuralFocus, phase]);

  const goToCover = useCallback(() => {
    clearMuralFocus();
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    pendingFocusRef.current = null;
    setMapFocusTempleId(null);
    setCoverGeneration((generation) => generation + 1);
    setPhase("cover");
  }, [clearMuralFocus]);

  useEffect(() => {
    let cancelled = false;
    fetchPostcardAssets().then((assets) => {
      if (!cancelled && assets.length) setPostcardAssets(assets);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (progress.stars < MAX_STARS) {
      postcardOfferedRef.current = false;
      setPendingPostcard(null);
      return;
    }
    if (postcardOfferedRef.current) return;
    const postcard = pickRandomPostcard(
      postcardAssets,
      progress.collectedPostcards.map((item) => item.id)
    );
    if (!postcard) return;
    postcardOfferedRef.current = true;
    setPendingPostcard(postcard);
  }, [postcardAssets, progress.collectedPostcards, progress.stars]);

  const collectPendingPostcard = useCallback(() => {
    if (pendingPostcard) {
      redeemPostcard({
        id: pendingPostcard.id,
        src: pendingPostcard.src,
        title: pendingPostcard.title,
        collectedAt: new Date().toISOString(),
      });
    }
    setPendingPostcard(null);
  }, [pendingPostcard, redeemPostcard]);

  const openTempleOnMap = useCallback((templeId: string) => {
    clearMuralFocus();
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    pendingFocusRef.current = null;
    setMapFocusTempleId(templeId);
    setPhase("map");
  }, [clearMuralFocus]);

  const handleBackToMap = useCallback(() => {
    clearMuralFocus();
    const templeId = selectedTempleId;
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    pendingFocusRef.current = null;
    setMapFocusTempleId(templeId);
    setPhase("map");
  }, [clearMuralFocus, selectedTempleId]);

  useEffect(() => {
    if (phase !== "explore" || !selectedTempleId || !initialized) return;

    const focus = pendingFocusRef.current;
    pendingFocusRef.current = null;

    if (focus) {
      navigateTo(focus.x, focus.y, !reducedMotion);
      return;
    }

    resetView(1);
    // 只在进入寺庙时对准一次，避免拖动过程中被拉回中心
  }, [phase, selectedTempleId, initialized, exploreSession]);

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
      const card =
        cards.find((item) => item.id === cardId) ?? muralCardMap[cardId];
      if (!card || card.type === "annotation") return;

      if (card.type === "mural") {
        if (focusingCardIdRef.current === cardId) return;
        if (selectedCardIdRef.current === cardId) return;

        if (muralOpenTimerRef.current !== null) {
          window.clearTimeout(muralOpenTimerRef.current);
          muralOpenTimerRef.current = null;
        }

        focusingCardIdRef.current = cardId;
        setFocusingCardId(cardId);
        setSelectedCardId(null);

        navigateTo(
          card.x + card.width / 2,
          card.y + card.height / 2,
          !reducedMotion,
          () => {
            if (focusingCardIdRef.current !== cardId) return;
            setSelectedCardId(cardId);
            focusingCardIdRef.current = null;
            setFocusingCardId(null);
          },
          true
        );
        return;
      }

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
    [captureFlipState, cards, navigateTo, reducedMotion]
  );

  const handleMuralOutlineComplete = useCallback(
    (cardId: string) => {
      if (selectedCardIdRef.current !== cardId) return;
      const card =
        cards.find((item) => item.id === cardId) ?? muralCardMap[cardId];
      if (!card || card.type !== "mural") return;
      const mural = muralMap.get(card.muralId);
      if (!mural) return;

      captureFlipState(`[data-flip-id="${cardId}"]`);

      const open = () => {
        if (selectedCardIdRef.current !== cardId) return;
        setDetailContent({ type: "mural", mural });
      };

      if (reducedMotion) {
        open();
        return;
      }

      if (muralOpenTimerRef.current !== null) {
        window.clearTimeout(muralOpenTimerRef.current);
      }
      muralOpenTimerRef.current = window.setTimeout(() => {
        muralOpenTimerRef.current = null;
        open();
      }, 180);
    },
    [captureFlipState, cards, reducedMotion]
  );

  const handleCloseDetail = useCallback(() => {
    if (detailContent?.type === "element") {
      setDetailContent(null);
      return;
    }

    animateClose(() => {
      setDetailContent(null);
      setSelectedCardId(null);
      clearMuralFocus();
    });
  }, [animateClose, clearMuralFocus, detailContent]);

  const handleNavClick = useCallback(
    (section: NavSection) => {
      if (detailContent || focusingCardIdRef.current || selectedCardIdRef.current) {
        setDetailContent(null);
        setSelectedCardId(null);
        clearMuralFocus();
        cancelPan();
      }
      if (section === "temples" && phase !== "explore") {
        setNavSection(null);
        setMapFocusTempleId(null);
        setPhase("map");
        return;
      }
      if (section === "temples" && phase === "explore") {
        setNavSection((prev) => (prev === section ? null : section));
        return;
      }
      setNavSection((prev) => (prev === section ? null : section));
    },
    [cancelPan, clearMuralFocus, detailContent, phase]
  );

  const handleCloseNav = useCallback(() => {
    setNavSection(null);
  }, []);

  const handleSelectTemple = useCallback(
    (templeId: string) => {
      if (!templeHasMurals(templeId)) return;
      enterTempleExplore(templeId);
    },
    [enterTempleExplore]
  );

  useEffect(() => {
    if (phase === "explore") return;
    cancelPan();
    clearMuralFocus();
  }, [cancelPan, clearMuralFocus, phase]);

  useEffect(() => {
    return () => {
      if (muralOpenTimerRef.current !== null) {
        window.clearTimeout(muralOpenTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!detailContent && !navSection && !focusingCardId && !selectedCardId) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (navSection) {
        setNavSection(null);
        return;
      }
      if (detailContent) {
        handleCloseDetail();
        return;
      }
      cancelPan();
      clearMuralFocus();
      setSelectedCardId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    cancelPan,
    clearMuralFocus,
    detailContent,
    focusingCardId,
    handleCloseDetail,
    navSection,
    selectedCardId,
  ]);

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
        compact={phase !== "cover"}
        variant={
          phase === "cover"
            ? "cover"
            : phase === "home"
              ? "home"
              : phase === "matching"
                ? "matching"
                : "site"
        }
        activeSection={navSection}
        onNavClick={handleNavClick}
        onLogoClick={goToCover}
        instructionKey={
          phase === "matching" && matchingDetailOpen
            ? "match.detailHint"
            : undefined
        }
      />

      <MuralExperience
        hidden={
          phase === "matching" || phase === "map" || phase === "explore"
        }
        mode={phase === "cover" ? "cover" : "home"}
        coverGeneration={coverGeneration}
        onCoverComplete={handleCoverComplete}
        onContinueFigure={handleContinueFigure}
        detailOpen={!!detailContent}
      />

      {phase === "matching" && matchingFigureId && (
        <MuralMatchingExperience
          figureId={matchingFigureId}
          coverElement={matchingCoverElement}
          sourceRect={matchingSourceRect}
          isMobile={isMobile}
          onOpenTemple={openTempleOnMap}
          onReturnHome={goHome}
          hideFeedback={Boolean(pendingPostcard)}
          onDetailOpen={setMatchingDetailOpen}
        />
      )}

      {phase === "map" && (
        <ShanxiMap
          focusTempleId={mapFocusTempleId}
          onSelectTemple={handleSelectTemple}
        />
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
            focusingId={focusingCardId}
            onOutlineComplete={handleMuralOutlineComplete}
            hasDraggedRef={hasDraggedRef}
          />

          <button
            type="button"
            onClick={handleBackToMap}
            className="pointer-events-auto fixed left-5 top-20 z-40 rounded-sm border border-ink/15 bg-rice/80 px-3 py-2 font-sans text-[11px] tracking-wide text-ink/70 backdrop-blur-sm transition-colors hover:border-ink/30 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar md:left-6 md:top-24"
          >
            {t("explore.backToMap")}
            {selectedTempleName ? ` · ${selectedTempleName}` : ""}
          </button>

          <DragIndicator
            visible={
              !detailContent && !navSection && !focusingCardId && !selectedCardId
            }
          />

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

      <NavPanel
        section={navSection}
        onClose={handleCloseNav}
        onSelectTemple={handleSelectTemple}
        isMobile={isMobile}
      />

      <DetailOverlay
        content={detailContent}
        onClose={handleCloseDetail}
        isMobile={isMobile}
      />

      {pendingPostcard && (
        <PostcardReward
          postcard={pendingPostcard}
          alreadyCollected={progress.collectedPostcards.some(
            (item) => item.id === pendingPostcard.id
          )}
          onCollect={collectPendingPostcard}
        />
      )}
    </div>
  );
}
