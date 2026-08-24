"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import TextureBackground from "./TextureBackground";
import ShanxiMap from "./ShanxiMap";
import DraggableCanvas from "./DraggableCanvas";
import DetailOverlay, { type DetailContent } from "./DetailOverlay";
import FixedNavigation from "./FixedNavigation";
import NavPanel, { type NavSection } from "./NavPanel";
import CanvasViewControls, { CANVAS_ZOOM_STEP } from "@/components/mural/CanvasViewControls";
import CanvasInstruction from "@/components/mural/CanvasInstruction";
import { MobilePositionIndicator } from "./MiniMap";
import MuralExperience from "./mural/MuralExperience";
import MuralMatchingExperience from "./matching/MuralMatchingExperience";
import type { CoverElement } from "@/data/coverElements";
import { muralCards, muralCardMap, type MuralCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import { templeHasMurals } from "@/data/murals";
import { canvasLayout } from "@/data/canvasLayout";
import {
  scaleCards,
  layoutCenteredCardGrid,
  resolveTempleCardId,
} from "@/lib/canvasScale";
import { getTempleExploreCards } from "@/lib/templeExplore";
import { muralById } from "@/data/muralData";
import { useLocale } from "@/components/i18n/LocaleProvider";
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

type Phase = "cover" | "home" | "matching" | "map" | "explore";

function filterCardsForTemple(
  templeId: string | null,
  isMobile: boolean
): MuralCardData[] {
  if (templeId) {
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
  const [detailContent, setDetailContent] = useState<DetailContent | null>(null);
  const [matchingFigureId, setMatchingFigureId] = useState<string | null>(null);
  const [matchingCoverElement, setMatchingCoverElement] =
    useState<CoverElement | null>(null);
  const [matchingSourceRect, setMatchingSourceRect] = useState<DOMRect | null>(
    null
  );
  const [mapFocusTempleId, setMapFocusTempleId] = useState<string | null>(null);
  const [navSection, setNavSection] = useState<NavSection | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploreSession, setExploreSession] = useState(0);
  const [exploreHintVisible, setExploreHintVisible] = useState(false);
  const [coverGeneration, setCoverGeneration] = useState(0);
  const { progress, redeemPostcard, resetFigureAwards } = useGameProgress();
  const [postcardAssets, setPostcardAssets] = useState<PostcardAsset[]>(
    FALLBACK_POSTCARDS
  );
  const [pendingPostcard, setPendingPostcard] = useState<PostcardAsset | null>(
    null
  );
  const postcardOfferedRef = useRef(false);
  const pendingFocusRef = useRef<{ x: number; y: number } | null>(null);
  const openedFromQueryRef = useRef(false);

  useEffect(() => {
    if (openedFromQueryRef.current) return;
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "map") {
      openedFromQueryRef.current = true;
      setPhase("map");
      setMapFocusTempleId(null);
    }
  }, []);

  const { captureFlipState, animateClose } = useCardTransition();

  const templeExplore = useMemo(() => {
    if (!selectedTempleId) return null;
    return layoutCenteredCardGrid(
      getTempleExploreCards(selectedTempleId),
      isMobile,
      viewport
    );
  }, [selectedTempleId, isMobile, viewport]);

  const canvasSize = useMemo(() => {
    if (templeExplore) return templeExplore.canvas;
    return isMobile ? canvasLayout.mobile : canvasLayout.desktop;
  }, [isMobile, templeExplore]);

  const initialCenter = useMemo(() => {
    if (templeExplore) return templeExplore.center;
    return isMobile
      ? canvasLayout.mobileInitialViewport
      : canvasLayout.initialViewport;
  }, [isMobile, templeExplore]);

  const {
    position,
    isDragging,
    initialized,
    viewportSize,
    bind,
    layerRef,
    navigateTo,
    cancelPan,
    hasDraggedRef,
    zoom,
    setZoomLevel,
    resetView,
    minZoom,
    maxZoom,
  } = useDraggableCanvas({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    initialCenter,
    enabled: phase === "explore" && !detailContent && !navSection,
    allowDragFromInteractive: true,
  });

  const cards = useMemo(() => {
    if (templeExplore) return templeExplore.cards;
    return scaleCards(filterCardsForTemple(null, isMobile), isMobile);
  }, [templeExplore, isMobile]);

  const activeTempleIds = useMemo(
    () => (selectedTempleId ? [selectedTempleId] : null),
    [selectedTempleId]
  );

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const enterTempleExplore = useCallback(
    (templeId: string, focus?: { x: number; y: number }) => {
      pendingFocusRef.current = focus ?? null;
      setSelectedTempleId(templeId);
      setMapFocusTempleId(templeId);
      setNavSection(null);
      setDetailContent(null);
      setSelectedCardId(null);
      setIntroVisible(true);
      setExploreSession((n) => n + 1);
      setPhase("explore");
    },
    []
  );

  const handleCoverComplete = useCallback(() => {
    setPhase("home");
  }, []);

  const handleContinueFigure = useCallback(
    (element: CoverElement, sourceRect: DOMRect) => {
      setMatchingFigureId(element.id);
      setMatchingCoverElement(element);
      setMatchingSourceRect(sourceRect);
      setDetailContent(null);
      setNavSection(null);
      setPhase("matching");
    },
    []
  );

  const openTempleOnMap = useCallback((templeId: string) => {
    pendingFocusRef.current = null;
    setSelectedTempleId(templeId);
    setMapFocusTempleId(templeId);
    setNavSection(null);
    setDetailContent(null);
    setSelectedCardId(null);
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    setPhase("map");
  }, []);

  const goHome = useCallback(() => {
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    pendingFocusRef.current = null;
    if (phase !== "cover") setPhase("home");
  }, [phase]);

  const goToCover = useCallback(() => {
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    setMatchingFigureId(null);
    setMatchingCoverElement(null);
    setMatchingSourceRect(null);
    pendingFocusRef.current = null;
    setCoverGeneration((generation) => generation + 1);
    setPhase("cover");
    resetFigureAwards();
  }, [resetFigureAwards]);

  useEffect(() => {
    if (phase === "cover") resetFigureAwards();
  }, [phase, resetFigureAwards]);

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
        orientation: pendingPostcard.orientation,
      });
    }
    setPendingPostcard(null);
  }, [pendingPostcard, redeemPostcard]);

  const handleBackToMap = useCallback(() => {
    const templeId = selectedTempleId;
    setDetailContent(null);
    setSelectedCardId(null);
    setNavSection(null);
    setSelectedTempleId(null);
    pendingFocusRef.current = null;
    setMapFocusTempleId(templeId);
    setPhase("map");
  }, [selectedTempleId]);

  useEffect(() => {
    if (phase !== "explore" || !selectedTempleId || !initialized) return;

    const focus = pendingFocusRef.current;
    pendingFocusRef.current = null;

    if (focus) {
      navigateTo(focus.x, focus.y, !reducedMotion);
      return;
    }

    const center = templeExplore?.center;
    if (center) navigateTo(center.x, center.y, !reducedMotion);
  }, [
    phase,
    selectedTempleId,
    initialized,
    navigateTo,
    reducedMotion,
    exploreSession,
    templeExplore,
  ]);

  useEffect(() => {
    if (phase !== "explore") {
      setExploreHintVisible(false);
      return;
    }
    setExploreHintVisible(true);
    const timer = window.setTimeout(() => setExploreHintVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [phase, exploreSession]);

  useEffect(() => {
    if (detailContent || isDragging) setExploreHintVisible(false);
  }, [detailContent, isDragging]);

  useEffect(() => {
    if (phase !== "explore") return;

    if (reducedMotion) {
      setIntroVisible(false);
      return;
    }

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
      const card =
        cards.find((item) => item.id === cardId) ?? muralCardMap[baseId];
      if (!card || card.type === "annotation") return;

      captureFlipState(`[data-flip-id="${cardId}"]`);
      setSelectedCardId(cardId);

      if (card.type === "mural") {
        const mural = muralById[card.muralId];
        if (mural) setDetailContent({ type: "mural", mural });
        return;
      }

      if (card.type === "story" && card.muralId) {
        const mural = muralById[card.muralId];
        if (mural) {
          setDetailContent({ type: "mural", mural });
        } else {
          setDetailContent({ type: "story", story: card });
        }
      } else if (card.type === "temple") {
        const temple = templeMap[card.templeId];
        if (temple) setDetailContent({ type: "temple", temple });
      } else if (card.type === "story") {
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
    });
  }, [animateClose, detailContent]);

  const handleNavClick = useCallback(
    (section: NavSection) => {
      if (detailContent) {
        setDetailContent(null);
        setSelectedCardId(null);
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
    [cancelPan, detailContent, phase]
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
    if (!detailContent && !navSection && !selectedCardId) {
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
      setSelectedCardId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cancelPan, detailContent, handleCloseDetail, navSection, selectedCardId]);

  if (!initialized && viewportSize.width === 0) {
    return (
      <div className="fixed inset-0 bg-parchment">
        <TextureBackground />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      <TextureBackground />

      <div
        className={pendingPostcard ? "invisible pointer-events-none" : undefined}
        aria-hidden={pendingPostcard ? true : undefined}
      >
        <FixedNavigation
          compact={phase !== "cover"}
          variant={
            phase === "cover"
              ? "cover"
              : phase === "home"
                ? "home"
                : phase === "matching"
                  ? "matching"
                  : phase === "explore"
                    ? "explore"
                    : phase === "map"
                      ? "map"
                      : "site"
          }
          activeSection={navSection}
          onNavClick={handleNavClick}
          onLogoClick={goToCover}
        />
      </div>

      <MuralExperience
        hidden={phase === "matching" || phase === "map" || phase === "explore"}
        mode={phase === "cover" ? "cover" : "home"}
        coverGeneration={coverGeneration}
        onCoverComplete={handleCoverComplete}
        onContinueFigure={handleContinueFigure}
        onBackToCover={goToCover}
        detailOpen={!!detailContent}
      />

      {phase === "matching" && matchingFigureId && (
        <MuralMatchingExperience
          key={matchingFigureId}
          figureId={matchingFigureId}
          coverElement={matchingCoverElement}
          sourceRect={matchingSourceRect}
          isMobile={isMobile}
          onOpenTemple={openTempleOnMap}
          onReturnHome={goHome}
          hideCards={!!pendingPostcard}
        />
      )}

      {phase === "map" && (
        <ShanxiMap
          onSelectTemple={handleSelectTemple}
          focusTempleId={mapFocusTempleId}
          onChooseSticker={goHome}
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
            parallaxOffset={{ x: 0, y: 0 }}
            isMobile={isMobile}
            activeTempleIds={activeTempleIds}
            hasDraggedRef={hasDraggedRef}
            zoom={zoom}
            layerRef={layerRef}
          />

          {templeExplore && templeExplore.cards.length === 0 && (
            <p className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center type-body text-ink/55">
              {t("map.closed")}
            </p>
          )}

          {!detailContent ? (
            <CanvasInstruction
              messageKey="home.canvasHint"
              floating
              visible={exploreHintVisible}
              onClose={() => setExploreHintVisible(false)}
            />
          ) : null}

          <CanvasViewControls
            onBack={handleBackToMap}
            backLabel={t("explore.backToMap")}
            backPlacement="top-left"
            onZoomIn={() => setZoomLevel(zoom * CANVAS_ZOOM_STEP)}
            onZoomOut={() => setZoomLevel(zoom / CANVAS_ZOOM_STEP)}
            onReset={() => resetView(1)}
            canZoomIn={zoom < maxZoom - 0.001}
            canZoomOut={zoom > minZoom + 0.001}
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

      {!pendingPostcard ? (
        <NavPanel
          section={navSection}
          onClose={handleCloseNav}
          onSelectTemple={handleSelectTemple}
          isMobile={isMobile}
        />
      ) : null}

      {!pendingPostcard ? (
        <DetailOverlay
          content={detailContent}
          onClose={handleCloseDetail}
          isMobile={isMobile}
        />
      ) : null}

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
