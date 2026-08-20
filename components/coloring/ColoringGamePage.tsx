"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import FixedNavigation from "@/components/FixedNavigation";
import TextureBackground from "@/components/TextureBackground";
import CanvasControls from "@/components/coloring/CanvasControls";
import CollectPostcardButton from "@/components/coloring/CollectPostcardButton";
import ColoringHeader from "@/components/coloring/ColoringHeader";
import ColoringTools from "@/components/coloring/ColoringTools";
import ConfirmDialog from "@/components/coloring/ConfirmDialog";
import FinishColoringButton from "@/components/coloring/FinishColoringButton";
import LineArtCanvas, {
  type LineArtCanvasHandle,
} from "@/components/coloring/LineArtCanvas";
import OriginalMuralPanel from "@/components/coloring/OriginalMuralPanel";
import PigmentPalette from "@/components/coloring/PigmentPalette";
import PostcardPreview from "@/components/coloring/PostcardPreview";
import {
  buildArtworkFromPair,
  FALLBACK_ARTWORK,
  type ColoringArtwork,
  type ColoringArtworkPair,
} from "@/data/coloringArtworks";
import { defaultColorId, getPigmentById } from "@/data/coloringPalette";
import {
  listColoringAutosaves,
  useColoringAutosave,
} from "@/hooks/coloring/useColoringAutosave";
import { usePostcardCollection } from "@/hooks/coloring/usePostcardCollection";
import { Flip } from "@/hooks/coloring/useColoringTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  computePaintSimilarity,
  hashString,
  type SimilarityResult,
} from "@/utils/coloringScore";
import { downloadDataUrl } from "@/utils/coloringExport";
import { exportColoringPostcard } from "@/utils/postcardExport";
import type {
  InteractionMode,
  PaintSizeId,
  PaintTool,
} from "@/utils/drawingTools";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locMuralTemple } from "@/lib/i18n/localize";

type ColoringStage = "coloring" | "comparison";

export default function ColoringGamePage() {
  const reducedMotion = useReducedMotion();
  const { locale, t } = useLocale();
  const canvasRef = useRef<LineArtCanvasHandle>(null);
  const [artwork, setArtwork] = useState<ColoringArtwork | null>(null);
  const [stage, setStage] = useState<ColoringStage>("coloring");
  const [selectedColorId, setSelectedColorId] = useState(defaultColorId);
  const [mode, setMode] = useState<InteractionMode>("paint");
  const [tool, setTool] = useState<PaintTool>("crayon");
  const [sizeId, setSizeId] = useState<PaintSizeId>("medium");
  const [canUndo, setCanUndo] = useState(false);
  const [hasPaint, setHasPaint] = useState(false);
  const [paintDataUrl, setPaintDataUrl] = useState<string | null>(null);
  const [usedColorValues, setUsedColorValues] = useState<string[]>([]);
  const [similarity, setSimilarity] = useState<SimilarityResult | null>(null);
  const [confirmIncomplete, setConfirmIncomplete] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [revealStars, setRevealStars] = useState(false);
  const [postcardPreview, setPostcardPreview] = useState<string | null>(null);
  const [generatingPostcard, setGeneratingPostcard] = useState(false);

  const selectedColor =
    getPigmentById(selectedColorId)?.value ??
    artwork?.palette[0]?.value ??
    "#A64B3C";

  const { restorePrompt, setRestorePrompt, clearSave } = useColoringAutosave(
    artwork?.id ?? null,
    paintDataUrl,
    selectedColorId,
    usedColorValues
  );

  const postcardId = artwork
    ? hashString(
        `${artwork.id}:${paintDataUrl?.slice(-120) ?? "empty"}:${usedColorValues.join(",")}`
      )
    : null;
  const { isCollected, collect } = usePostcardCollection(postcardId);
  const usedValues = new Set(usedColorValues.map((value) => value.toLowerCase()));

  const pendingFlip = useRef<Flip.FlipState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/coloring-artworks")
      .then((response) => response.json())
      .then((data: { pairs?: ColoringArtworkPair[] }) => {
        if (cancelled) return;
        const pairs = data.pairs?.length ? data.pairs : null;
        const saved = listColoringAutosaves()[0];
        const savedPair = saved
          ? pairs?.find((pair) => pair.id === saved.artworkId)
          : undefined;
        const pool = pairs ?? [];
        const randomPair =
          pool[Math.floor(Math.random() * Math.max(pool.length, 1))];
        const chosen = savedPair ?? randomPair;
        setArtwork(chosen ? buildArtworkFromPair(chosen) : FALLBACK_ARTWORK);
      })
      .catch(() => {
        if (!cancelled) setArtwork(FALLBACK_ARTWORK);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        canvasRef.current?.undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useLayoutEffect(() => {
    const state = pendingFlip.current;
    if (!state || reducedMotion) return;
    pendingFlip.current = null;
    Flip.from(state, {
      duration: 0.85,
      ease: "power2.inOut",
      scale: true,
      fade: true,
      nested: true,
    });
  }, [reducedMotion, stage]);

  useEffect(() => {
    if (stage !== "comparison") {
      setRevealStars(false);
      return;
    }
    if (reducedMotion) {
      setRevealStars(true);
      return;
    }
    const starTimer = window.setTimeout(() => setRevealStars(true), 450);
    return () => window.clearTimeout(starTimer);
  }, [reducedMotion, stage]);

  const enterComparison = useCallback(() => {
    const snapshotUrl = canvasRef.current?.getPaintDataUrl();
    if (snapshotUrl) setPaintDataUrl(snapshotUrl);
    if (!reducedMotion) {
      pendingFlip.current = Flip.getState(
        "[data-coloring-canvas], [data-coloring-palette]"
      );
    }
    setStage("comparison");
    window.requestAnimationFrame(() => {
      const url = snapshotUrl ?? paintDataUrl;
      if (url) canvasRef.current?.restorePaint(url);
      canvasRef.current?.fitView();
    });
  }, [paintDataUrl, reducedMotion]);

  const handleFinish = async () => {
    const paintCanvas = canvasRef.current?.getPaintCanvas();
    if (!artwork || !paintCanvas) return;
    const result = await computePaintSimilarity(
      paintCanvas,
      artwork.originalUrl
    );
    setSimilarity(result);
    if (!hasPaint || result.incomplete) {
      setConfirmIncomplete(true);
      return;
    }
    enterComparison();
  };

  const handleEditAgain = () => {
    if (!reducedMotion) {
      pendingFlip.current = Flip.getState(
        "[data-coloring-canvas], [data-coloring-palette]"
      );
    }
    setStage("coloring");
    setRevealStars(false);
    setPostcardPreview(null);
  };

  const handleCollect = async () => {
    if (!artwork || !similarity || generatingPostcard || isCollected) return;
    setGeneratingPostcard(true);
    try {
      const artworkCanvas = await canvasRef.current?.exportComposite();
      if (!artworkCanvas) return;
      const createdAt = new Date();
      const imageDataUrl = await exportColoringPostcard({
        artworkCanvas,
        title:
          artwork.id === "sanqing" ? t("color.artworkTitle") : artwork.title,
        figureName:
          artwork.id === "sanqing"
            ? t("color.figureName")
            : artwork.figureName,
        templeName: locMuralTemple(locale, artwork.templeName),
        stars: similarity.stars,
        createdAt,
        siteName: t("brand.siteName"),
        siteLabel: t("brand.siteSubtitle"),
        headerLabel: t("color.header"),
      });
      collect({
        id: hashString(
          `${artwork.id}:${paintDataUrl?.slice(-120) ?? "empty"}:${usedColorValues.join(",")}`
        ),
        artworkId: artwork.id,
        imageDataUrl,
        stars: similarity.stars,
        createdAt: createdAt.toISOString(),
        title: `${locMuralTemple(locale, artwork.templeName)} · ${
          artwork.id === "sanqing" ? t("color.figureName") : artwork.figureName
        }`,
      });
      setPostcardPreview(imageDataUrl);
    } finally {
      setGeneratingPostcard(false);
    }
  };

  const isColoring = stage === "coloring";
  const names = artwork
    ? {
        title:
          artwork.id === "sanqing" ? t("color.artworkTitle") : artwork.title,
        figureName:
          artwork.id === "sanqing"
            ? t("color.figureName")
            : artwork.figureName,
        templeName: locMuralTemple(locale, artwork.templeName),
      }
    : null;

  if (!artwork) {
    return (
      <div className="coloring-root coloring-root--locked relative min-h-svh bg-parchment">
        <TextureBackground />
        <FixedNavigation />
        <p className="pt-32 text-center font-serif text-sm text-stone">
          {t("color.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="coloring-root coloring-root--locked relative flex h-svh flex-col overflow-hidden bg-parchment">
      <TextureBackground />
      <FixedNavigation />
      <ColoringHeader stage={stage} />

      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-4 pb-2 pt-1 md:px-8">
        <div
          className={
            isColoring
              ? "flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.85fr)] md:items-stretch md:gap-x-[6%]"
              : "grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.38fr)_minmax(0,0.24fr)] md:gap-x-0 md:overflow-hidden"
          }
        >
          {stage === "comparison" && similarity && (
            <div
              key="original-column"
              className="flex h-full min-h-0 flex-col border-ink/10 md:border-r md:px-4 lg:px-6"
            >
              <OriginalMuralPanel
                originalUrl={artwork.originalUrl}
                figureName={names!.figureName}
                templeName={names!.templeName}
                stars={similarity.stars}
                incomplete={similarity.incomplete}
                revealStars={revealStars}
              />
            </div>
          )}

          <section
            key="canvas-column"
            className="relative flex h-full min-h-0 flex-col md:px-4 lg:px-6"
          >
            {stage === "comparison" && (
              <h2 className="mb-2 shrink-0 text-center font-sans text-[10px] tracking-[0.22em] text-stone">
                {t("color.mine")}
              </h2>
            )}
            <div
              data-coloring-canvas
              className={`relative min-h-0 flex-1 border border-ink/10 ${
                isColoring ? "min-h-[46svh] md:min-h-0" : "min-h-0"
              }`}
            >
              <LineArtCanvas
                key={`${artwork.id}-paint`}
                ref={canvasRef}
                lineArtUrl={artwork.lineArtUrl}
                figureName={names!.figureName}
                templeName={names!.templeName}
                selectedColor={selectedColor}
                tool={tool}
                sizeId={sizeId}
                mode={mode}
                interactive={isColoring}
                paintBackupUrl={paintDataUrl}
                onHistoryChange={({ canUndo: nextCanUndo, hasPaint: nextHasPaint }) => {
                  setCanUndo(nextCanUndo);
                  setHasPaint(nextHasPaint);
                }}
                onPaintCommit={setPaintDataUrl}
                onColorUsed={(color) => {
                  setUsedColorValues((current) =>
                    current.includes(color) ? current : [...current, color]
                  );
                }}
              />
              {isColoring && (
                <CanvasControls
                  canUndo={canUndo}
                  onUndo={() => canvasRef.current?.undo()}
                  onClear={() => setConfirmClear(true)}
                />
              )}
            </div>
            {stage === "comparison" && (
              <div className="flex shrink-0 flex-col items-center">
                <CollectPostcardButton
                  collected={isCollected}
                  onClick={() => {
                    void handleCollect();
                  }}
                />
                <button
                  type="button"
                  onClick={handleEditAgain}
                  className="min-h-8 px-3 font-sans text-[11px] tracking-wide text-stone hover:text-ink"
                >
                  EDIT AGAIN
                </button>
              </div>
            )}
          </section>

          <section
            key="palette-column"
            data-coloring-palette
            className={`flex h-full min-h-0 flex-col items-center justify-start overflow-y-auto border-ink/10 pt-1 ${
              isColoring
                ? "hidden md:flex md:border-l md:pl-6"
                : "md:border-l md:px-4 lg:px-5"
            }`}
          >
            {stage === "comparison" && (
              <h2 className="mb-2 shrink-0 font-sans text-[10px] tracking-[0.22em] text-stone">
                YOUR PALETTE
              </h2>
            )}
            {isColoring && (
              <ColoringTools
                mode={mode}
                tool={tool}
                sizeId={sizeId}
                onModeChange={setMode}
                onToolChange={setTool}
                onSizeChange={setSizeId}
                onFit={() => canvasRef.current?.fitView()}
              />
            )}
            <PigmentPalette
              palette={artwork.palette}
              selectedId={selectedColorId}
              usedValues={stage === "comparison" ? usedValues : undefined}
              interactive={isColoring}
              onSelect={(color) => {
                setSelectedColorId(color.id);
                setMode("paint");
              }}
            />
          </section>
        </div>

        {isColoring && (
          <>
            <div className="mt-3 border-t border-ink/10 pt-3 md:hidden">
              <ColoringTools
                mode={mode}
                tool={tool}
                sizeId={sizeId}
                onModeChange={setMode}
                onToolChange={setTool}
                onSizeChange={setSizeId}
                onFit={() => canvasRef.current?.fitView()}
              />
              <PigmentPalette
                palette={artwork.palette}
                selectedId={selectedColorId}
                interactive
                compact
                onSelect={(color) => {
                  setSelectedColorId(color.id);
                  setMode("paint");
                }}
              />
            </div>
            <div className="flex shrink-0 justify-center pb-2 pt-3 md:pt-4">
              <FinishColoringButton onClick={() => void handleFinish()} />
            </div>
          </>
        )}
      </main>

      {restorePrompt && (
        <ConfirmDialog
          title={t("color.resumeTitle")}
          body={t("color.resumeBody")}
          cancelLabel={t("color.restart")}
          confirmLabel={t("color.resume")}
          onCancel={() => {
            clearSave();
            setPaintDataUrl(null);
            setUsedColorValues([]);
            canvasRef.current?.resetPaint();
          }}
          onConfirm={() => {
            if (restorePrompt.selectedColorId) {
              setSelectedColorId(restorePrompt.selectedColorId);
            }
            setUsedColorValues(restorePrompt.usedColorValues);
            setPaintDataUrl(restorePrompt.paintDataUrl);
            canvasRef.current?.restorePaint(restorePrompt.paintDataUrl);
            setRestorePrompt(null);
          }}
        />
      )}

      {confirmIncomplete && (
        <ConfirmDialog
          title={t("color.incompleteTitle")}
          body={t("color.incompleteBody")}
          cancelLabel={t("color.keepColoring")}
          confirmLabel={t("color.stillFinish")}
          onCancel={() => setConfirmIncomplete(false)}
          onConfirm={() => {
            setConfirmIncomplete(false);
            enterComparison();
          }}
        />
      )}

      {confirmClear && (
        <ConfirmDialog
          title={t("color.clearTitle")}
          body={t("color.clearBody")}
          cancelLabel={t("color.cancel")}
          confirmLabel={t("color.clear")}
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            canvasRef.current?.clearPaint();
            setUsedColorValues([]);
            setPaintDataUrl(null);
            setConfirmClear(false);
          }}
        />
      )}

      {postcardPreview && (
        <PostcardPreview
          imageDataUrl={postcardPreview}
          title={`${names!.templeName} · ${names!.figureName}`}
          stars={similarity?.stars ?? 1}
          onClose={() => setPostcardPreview(null)}
          onDownload={() =>
            downloadDataUrl(
              postcardPreview,
              `${names!.figureName}-postcard.png`
            )
          }
        />
      )}
    </div>
  );
}
