"use client";

import type { ScoreResult } from "@/utils/colorScoring";
import { coloringArtwork } from "@/data/coloringArtwork";

interface ScorePanelProps {
  score: ScoreResult;
}

export default function ScorePanel({ score }: ScorePanelProps) {
  const lowCompletion =
    score.completion < coloringArtwork.completionThreshold * 100;

  return (
    <div className="rounded-sm border border-ink/10 bg-rice/80 p-5 backdrop-blur-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="色彩相似度" value={score.colorSimilarity} />
        <Stat label="填色完成度" value={score.completion} suffix="%" />
        <Stat label="综合评分" value={score.finalScore} highlight />
      </div>

      {lowCompletion && (
        <p className="mt-4 font-sans text-[11px] text-ochre">
          当前作品尚未完成，评分仅供参考。
        </p>
      )}

      <p className="mt-4 font-serif text-sm leading-relaxed text-ink/75">
        {score.evaluation}
      </p>

      {score.bestRegion && (
        <p className="mt-3 font-sans text-[11px] text-stone">
          最接近原作：{score.bestRegion.name}（{score.bestRegion.similarity}）
        </p>
      )}
      {score.worstRegion && score.worstRegion.id !== score.bestRegion?.id && (
        <p className="font-sans text-[11px] text-stone">
          差异最大：{score.worstRegion.name}（{score.worstRegion.similarity}）
        </p>
      )}

      <p className="mt-4 border-t border-ink/10 pt-4 font-sans text-[10px] leading-relaxed text-stone">
        评分依据现存壁画颜色进行比较。壁画颜色已经受到年代、氧化、修复与拍摄条件影响，因此结果只代表近似色彩关系。
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  highlight = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] tracking-wide text-stone">{label}</p>
      <p
        className={`mt-1 font-serif text-2xl ${
          highlight ? "text-cinnabar" : "text-ink"
        }`}
      >
        {value}
        {suffix}
      </p>
    </div>
  );
}
