"use client";

import Image from "next/image";
import { coloringArtwork } from "@/data/coloringArtwork";
import type { ScoreResult } from "@/utils/colorScoring";
import ScorePanel from "./ScorePanel";

interface ComparisonViewProps {
  userPaintUrl: string;
  userCompositeUrl: string;
  score: ScoreResult;
  onRetry: () => void;
  onDownload: () => void;
  onDeityInfo: () => void;
  onBackInteractive: () => void;
}

export default function ComparisonView({
  userCompositeUrl,
  score,
  onRetry,
  onDownload,
  onDeityInfo,
  onBackInteractive,
}: ComparisonViewProps) {
  return (
    <div className="bg-parchment pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <header className="mb-8">
          <h2 className="font-serif text-2xl text-ink md:text-3xl">
            你的壁上之色
          </h2>
          <p className="mt-2 font-serif text-sm text-ink/65">
            将你的选择与原壁画留存的颜色进行比较。
          </p>
          <p className="mt-2 font-sans text-[10px] text-stone">
            {coloringArtwork.comparisonNote}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <figure>
            <figcaption className="mb-2 font-sans text-[11px] text-stone">
              我的上色
            </figcaption>
            <div className="relative aspect-[3/4] overflow-hidden border border-ink/10 bg-rice">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={userCompositeUrl}
                alt="我的上色作品"
                className="h-full w-full object-contain"
              />
            </div>
          </figure>
          <figure>
            <figcaption className="mb-2 font-sans text-[11px] text-stone">
              原壁画
            </figcaption>
            <div className="relative aspect-[3/4] overflow-hidden border border-ink/10 bg-rice">
              <Image
                src={coloringArtwork.originalSrc}
                alt="永乐宫三清殿东壁原壁画"
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </figure>
        </div>

        <div className="mt-8">
          <ScorePanel score={score} />
        </div>

        <p className="mt-6 max-w-2xl font-serif text-sm leading-relaxed text-ink/70">
          画面中的颜色并不只是装饰。石青、石绿、朱砂和赭石共同建立人物的视觉等级，也帮助观看者区分衣饰、身份和画面层次。今天看到的颜色，是原始矿物颜料与数百年时间共同留下的结果。
        </p>

        <div className="mt-8 flex flex-wrap gap-2 pb-4">
          <ActionBtn onClick={onRetry}>再画一次</ActionBtn>
          <ActionBtn onClick={onDownload}>保存我的作品</ActionBtn>
          <ActionBtn onClick={onDeityInfo}>了解这位天神</ActionBtn>
          <ActionBtn href="/">探索永乐宫</ActionBtn>
          <ActionBtn onClick={onBackInteractive}>返回互动读画</ActionBtn>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "rounded-sm border border-ink/15 px-4 py-2.5 font-sans text-[11px] tracking-wide text-ink transition-colors hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar";
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
