"use client";

import type { ScoreResult } from "@/utils/colorScoring";
import { coloringArtwork } from "@/data/coloringArtwork";

interface ScoreRevealProps {
  score: ScoreResult;
  onViewComparison: () => void;
  onContinue: () => void;
}

export default function ScoreReveal({
  score,
  onViewComparison,
  onContinue,
}: ScoreRevealProps) {
  const lowCompletion =
    score.completion < coloringArtwork.completionThreshold * 100;

  return (
    <div className="animate-[fadeScale_0.5s_ease-out]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[10px] tracking-wider text-stone">
            你的壁上之色
          </p>
          <p className="mt-1 font-serif text-3xl text-cinnabar">
            {score.finalScore}
            <span className="ml-1 font-sans text-sm text-stone">分</span>
          </p>
          <p className="mt-1 font-sans text-[11px] text-ink/65">
            色彩相似度 {score.colorSimilarity} · 完成度 {score.completion}%
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-sm border border-ink/15 px-4 py-2 font-sans text-[11px] tracking-wide text-ink hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            继续上色
          </button>
          <button
            type="button"
            onClick={onViewComparison}
            className="rounded-sm bg-cinnabar px-4 py-2 font-sans text-[11px] tracking-wide text-rice hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            查看对比
          </button>
        </div>
      </div>
      {lowCompletion && (
        <p className="mt-2 font-sans text-[10px] text-ochre">
          当前作品尚未完成，评分仅供参考。
        </p>
      )}
      <p className="mt-2 max-w-xl font-serif text-xs leading-relaxed text-ink/70">
        {score.evaluation}
      </p>
    </div>
  );
}
