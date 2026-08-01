"use client";

import { useCallback, useRef, useState } from "react";
import TextureBackground from "@/components/TextureBackground";
import BrushSettingsPanel from "@/components/coloring/BrushSettingsPanel";
import ColorPalette from "@/components/coloring/ColorPalette";
import ColoringIntro from "@/components/coloring/ColoringIntro";
import ColoringProgress from "@/components/coloring/ColoringProgress";
import ColoringSiteNav from "@/components/coloring/ColoringSiteNav";
import ComparisonView from "@/components/coloring/ComparisonView";
import CelebrationOverlay from "@/components/coloring/CelebrationOverlay";
import ScoreReveal from "@/components/coloring/ScoreReveal";
import CulturalHints from "@/components/coloring/CulturalHints";
import MuralCanvas, {
  type MuralCanvasHandle,
} from "@/components/coloring/MuralCanvas";
import ToolSelector from "@/components/coloring/ToolSelector";
import { coloringArtwork } from "@/data/coloringArtwork";
import { defaultColorId, coloringPalette } from "@/data/coloringPalette";
import { useAutosave } from "@/hooks/coloring/useAutosave";
import { computeColorScore } from "@/utils/colorScoring";
import { downloadBlob, exportShareCard } from "@/utils/canvasExport";
import {
  defaultBrush,
  toolBrushDefaults,
  type BrushSettings,
  type DrawingTool,
} from "@/utils/drawingTools";
import { getRegionName } from "@/data/coloringRegions";
import { extractRegionMasks, buildRegionIdMap } from "@/utils/maskProcessing";

type Phase = "intro" | "paint" | "result";

export default function ColoringGamePage() {
  const canvasRef = useRef<MuralCanvasHandle>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [started, setStarted] = useState(false);
  const [tool, setTool] = useState<DrawingTool>("crayon");
  const [colorId, setColorId] = useState(defaultColorId);
  const [color, setColor] = useState(
    coloringPalette.find((c) => c.id === defaultColorId)!.hex
  );
  const [customColor, setCustomColor] = useState("#167F91");
  const [brush, setBrush] = useState<BrushSettings>(toolBrushDefaults.crayon);
  const [coloredRegions, setColoredRegions] = useState<Set<string>>(new Set());
  const [completion, setCompletion] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeityInfo, setShowDeityInfo] = useState(false);
  const [showScoreReveal, setShowScoreReveal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<ReturnType<typeof computeColorScore> | null>(
    null
  );
  const [compositeUrl, setCompositeUrl] = useState("");
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [hoverRegion, setHoverRegion] = useState<number | null>(null);

  const getPaintDataUrl = useCallback(
    () => canvasRef.current?.getPaintDataUrl() ?? null,
    []
  );

  const { restorePrompt, setRestorePrompt, clearSave } = useAutosave(
    getPaintDataUrl,
    coloredRegions
  );

  const handleStart = () => {
    setStarted(true);
    setPhase("paint");
  };

  const handleToolChange = (t: DrawingTool) => {
    setTool(t);
    setBrush((prev) => ({
      ...toolBrushDefaults[t],
      size: prev.size,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const paint = canvasRef.current?.getPaintCanvas();
    const line = canvasRef.current?.getLineCanvas();
    if (!paint || !line) {
      setSubmitting(false);
      return;
    }

    const w = paint.width;
    const h = paint.height;
    const { ctx } = await buildRegionIdMap(w, h);
    const masks = extractRegionMasks(ctx, w, h);
    const paintData = paint.getContext("2d")!.getImageData(0, 0, w, h).data;

    const result = computeColorScore(paintData, masks, w, h);
    setScore(result);
    setShowScoreReveal(true);
    setShowCelebration(result.finalScore >= 80);

    const composite = document.createElement("canvas");
    composite.width = w;
    composite.height = h;
    const cctx = composite.getContext("2d")!;
    cctx.fillStyle = "#EEE8DC";
    cctx.fillRect(0, 0, w, h);
    cctx.drawImage(paint, 0, 0);
    cctx.drawImage(line, 0, 0);
    setCompositeUrl(composite.toDataURL("image/png"));

    setSubmitting(false);
  };

  const goToComparison = () => {
    clearSave();
    setShowScoreReveal(false);
    setShowCelebration(false);
    setPhase("result");
  };

  const dismissScore = () => {
    setShowScoreReveal(false);
    setShowCelebration(false);
  };

  const handleDownload = async () => {
    const paint = canvasRef.current?.getPaintCanvas();
    const line = canvasRef.current?.getLineCanvas();
    if (!paint || !line || !score) return;
    const blob = await exportShareCard({
      paintCanvas: paint,
      lineCanvas: line,
      score: score.finalScore,
      colorSimilarity: score.colorSimilarity,
      completion: score.completion,
    });
    downloadBlob(blob, "为神明着色-永乐宫.png");
  };

  const handleRetry = () => {
    canvasRef.current?.clearAll();
    setScore(null);
    setCompositeUrl("");
    setShowScoreReveal(false);
    setShowCelebration(false);
    setPhase("paint");
    setStarted(true);
  };

  const compositeForResult = compositeUrl;

  if (phase === "result" && score && compositeForResult) {
    return (
      <div className="coloring-page coloring-page--scroll relative min-h-screen">
        <TextureBackground />
        <ColoringSiteNav />
        <main className="relative z-10 pt-16">
          <ComparisonView
            userPaintUrl={compositeForResult}
            userCompositeUrl={compositeForResult}
            score={score}
            onRetry={handleRetry}
            onDownload={handleDownload}
            onDeityInfo={() => setShowDeityInfo(true)}
            onBackInteractive={() => setPhase("paint")}
          />
        </main>
        {showDeityInfo && (
          <InfoModal
            title={coloringArtwork.deityIntro.title}
            body={coloringArtwork.deityIntro.body}
            onClose={() => setShowDeityInfo(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="coloring-page relative h-screen overflow-hidden">
      <TextureBackground />
      <ColoringSiteNav />

      <main
        className="relative z-10 flex h-[calc(100vh-56px)] flex-col pt-14 md:flex-row"
        style={{ height: "calc(100vh - 56px)" }}
      >
        {/* Desktop left toolbar */}
        <aside className="hidden w-[120px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-ink/10 bg-rice/30 p-3 md:flex lg:w-[132px]">
          <p className="font-sans text-[9px] tracking-wider text-stone">色板</p>
          <ColorPalette
            selectedId={colorId}
            customColor={customColor}
            onSelect={(id, hex) => {
              setColorId(id);
              setColor(hex);
            }}
            onCustomChange={setCustomColor}
          />
          <p className="mt-2 font-sans text-[9px] tracking-wider text-stone">
            工具
          </p>
          <ToolSelector tool={tool} onChange={handleToolChange} />
          <BrushSettingsPanel brush={brush} onChange={setBrush} />
          <UndoRedoBar canvasRef={canvasRef} onClear={() => setShowClearDialog(true)} />
        </aside>

        {/* Canvas + footer */}
        <section className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            {!started && phase === "intro" && (
              <ColoringIntro onStart={handleStart} />
            )}
            {started && (
              <>
                <MuralCanvas
                  ref={canvasRef}
                  active={phase === "paint" && !showScoreReveal}
                  tool={tool}
                  color={color}
                  brush={brush}
                  onColoredRegionsChange={setColoredRegions}
                  onCompletionChange={setCompletion}
                  onHoverRegion={setHoverRegion}
                />
                <CelebrationOverlay active={showCelebration} />
              </>
            )}
          </div>

          {started && (
            <footer className="shrink-0 border-t border-ink/10 bg-rice/50 px-4 py-3 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:px-6 md:pb-3">
              {showScoreReveal && score ? (
                <ScoreReveal
                  score={score}
                  onViewComparison={goToComparison}
                  onContinue={dismissScore}
                />
              ) : (
                <div className="flex justify-center md:justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-sm bg-cinnabar px-6 py-2.5 font-sans text-xs tracking-wider text-rice shadow-sm transition-colors hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar disabled:opacity-50"
                  >
                    {submitting ? "正在评分…" : "完成上色"}
                  </button>
                </div>
              )}
            </footer>
          )}
        </section>

        {/* Desktop right sidebar */}
        <aside className="hidden w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-ink/10 bg-rice/30 p-4 lg:flex lg:w-[300px]">
          <SidebarContent
            coloredCount={coloredRegions.size}
            completion={completion}
            hoverRegion={hoverRegion}
          />
        </aside>

        {/* Mobile bottom toolbar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-ink/10 bg-rice/95 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-1 overflow-x-auto px-2 py-2">
            <ColorPalette
              compact
              selectedId={colorId}
              customColor={customColor}
              onSelect={(id, hex) => {
                setColorId(id);
                setColor(hex);
              }}
              onCustomChange={setCustomColor}
            />
          </div>
          <div className="flex gap-1 border-t border-ink/10 px-2 py-2">
            <ToolSelector compact tool={tool} onChange={handleToolChange} />
            <button
              type="button"
              onClick={() => setMobileDrawer(true)}
              className="min-h-[44px] rounded-sm border border-ink/10 px-3 font-sans text-[10px] text-stone"
            >
              说明
            </button>
          </div>
        </div>
      </main>

      {mobileDrawer && (
        <div
          className="fixed inset-0 z-40 bg-ink/25 md:hidden"
          onClick={() => setMobileDrawer(false)}
        >
          <div
            className="absolute bottom-0 max-h-[70vh] w-full overflow-y-auto rounded-t-sm border-t border-ink/10 bg-rice p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              coloredCount={coloredRegions.size}
              completion={completion}
              hoverRegion={hoverRegion}
            />
            <BrushSettingsPanel brush={brush} onChange={setBrush} />
          </div>
        </div>
      )}


      {showClearDialog && (
        <ConfirmModal
          title="确定清空当前所有颜色吗？"
          onCancel={() => setShowClearDialog(false)}
          onConfirm={() => {
            canvasRef.current?.clearAll();
            setShowClearDialog(false);
          }}
        />
      )}

      {restorePrompt && phase === "intro" && (
        <ConfirmModal
          title="发现一幅尚未完成的作品，是否继续？"
          confirmLabel="继续上色"
          cancelLabel="重新开始"
          onCancel={() => {
            clearSave();
            setRestorePrompt(null);
          }}
          onConfirm={() => {
            canvasRef.current?.restorePaintFromDataUrl(
              restorePrompt.paintDataUrl
            );
            setColoredRegions(new Set(restorePrompt.coloredRegions));
            setRestorePrompt(null);
            handleStart();
          }}
        />
      )}
    </div>
  );
}

function SidebarContent({
  coloredCount,
  completion,
  hoverRegion,
}: {
  coloredCount: number;
  completion: number;
  hoverRegion: number | null;
}) {
  return (
    <>
      <div>
        <p className="font-sans text-[10px] tracking-wider text-stone">作品</p>
        <p className="font-serif text-base text-ink">{coloringArtwork.title}</p>
        <p className="mt-1 font-sans text-[10px] text-stone">
          地点：{coloringArtwork.location}
        </p>
      </div>
      <p className="font-serif text-[11px] leading-relaxed text-ink/65">
        选择颜色后，用蜡笔点击区域即可填色；铅笔适合细节，橡皮可清除区域。
      </p>
      <ColoringProgress coloredCount={coloredCount} completion={completion} />
      {hoverRegion != null && (
        <p className="font-sans text-[10px] text-stone">
          当前区域：{getRegionName(hoverRegion)}
        </p>
      )}
      <CulturalHints />
    </>
  );
}

function UndoRedoBar({
  canvasRef,
  onClear,
}: {
  canvasRef: React.RefObject<MuralCanvasHandle | null>;
  onClear: () => void;
}) {
  return (
    <div className="mt-auto flex flex-col gap-1 border-t border-ink/10 pt-2">
      <button
        type="button"
        aria-label="撤销"
        onClick={() => canvasRef.current?.undo()}
        className="rounded-sm border border-ink/10 px-2 py-1.5 font-sans text-[10px] text-ink/70 hover:border-ink/25"
      >
        撤销
      </button>
      <p className="px-1 font-sans text-[9px] text-stone/60">⌘Z / Ctrl+Z</p>
      <button
        type="button"
        aria-label="清空"
        onClick={onClear}
        className="rounded-sm border border-ink/10 px-2 py-1.5 font-sans text-[10px] text-cinnabar/80 hover:border-cinnabar/30"
      >
        清空
      </button>
    </div>
  );
}

function ConfirmModal({
  title,
  onConfirm,
  onCancel,
  confirmLabel = "确定",
  cancelLabel = "取消",
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4">
      <div className="w-full max-w-sm rounded-sm border border-ink/10 bg-rice p-6">
        <p className="font-serif text-sm text-ink">{title}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-sm border border-ink/15 py-2 font-sans text-xs text-ink"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-sm bg-cinnabar py-2 font-sans text-xs text-rice"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoModal({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md rounded-sm border border-ink/10 bg-rice p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg text-ink">{title}</h3>
        <p className="mt-3 font-serif text-sm leading-relaxed text-ink/75">
          {body}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-sm border border-ink/15 px-4 py-2 font-sans text-xs text-ink"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
