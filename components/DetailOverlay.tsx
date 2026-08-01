"use client";

import { useCallback } from "react";
import type { Temple } from "@/data/temples";
import type { StoryCardData } from "@/data/muralCards";
import { templeMap } from "@/data/temples";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface DetailContent {
  type: "temple" | "story";
  temple?: Temple;
  story?: StoryCardData;
}

interface DetailOverlayProps {
  content: DetailContent | null;
  onClose: () => void;
  isMobile: boolean;
}

// 动态匹配山西各市县的邮政编码，作为明信片的趣味细节
const getPostalCode = (regionStr?: string) => {
  if (!regionStr) return [0, 3, 0, 0, 0, 0];
  if (regionStr.includes("大同") || regionStr.includes("浑源")) return [0, 3, 7, 0, 0, 0];
  if (regionStr.includes("太原")) return [0, 3, 0, 0, 0, 0];
  if (regionStr.includes("忻州") || regionStr.includes("繁峙") || regionStr.includes("五台")) return [0, 3, 4, 0, 0, 0];
  if (regionStr.includes("晋中") || regionStr.includes("平遥") || regionStr.includes("介休")) return [0, 3, 0, 6, 0, 0];
  if (regionStr.includes("临汾") || regionStr.includes("洪洞")) return [0, 4, 1, 0, 0, 0];
  if (regionStr.includes("运城") || regionStr.includes("芮城")) return [0, 4, 4, 0, 0, 0];
  if (regionStr.includes("长治")) return [0, 4, 6, 0, 0, 0];
  if (regionStr.includes("晋城") || regionStr.includes("高平")) return [0, 4, 8, 0, 0, 0];
  if (regionStr.includes("朔州") || regionStr.includes("应县")) return [0, 3, 6, 0, 0, 0];
  if (regionStr.includes("阳泉")) return [0, 4, 5, 0, 0, 0];
  if (regionStr.includes("吕梁")) return [0, 3, 3, 0, 0, 0];
  return [0, 3, 0, 0, 0, 0];
};

export default function DetailOverlay({
  content,
  onClose,
  isMobile,
}: DetailOverlayProps) {
  const reducedMotion = useReducedMotion();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!content) return null;

  const isTemple = content.type === "temple" && content.temple;
  const isStory = content.type === "story" && content.story;

  const activeTemple = isTemple 
    ? content.temple 
    : templeMap[content.story!.templeId];

  const title = isTemple
    ? `${content.temple!.name}`
    : content.story!.title;

  const description = isTemple
    ? content.temple!.description
    : content.story!.description;

  const keywords = isTemple
    ? content.temple!.keywords
    : content.story!.keywords;

  const image = isTemple
    ? content.temple!.detailImage
    : content.story!.detailImage;

  const imageAlt = isTemple
    ? content.temple!.detailImageAlt
    : content.story!.detailImageAlt;

  const region = activeTemple?.region ?? "山西";
  const era = activeTemple?.era ?? "古代";
  const postalCode = getPostalCode(region);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
    >
      {/* 嵌入式 entry 弹出放大特效 CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes postcardPop {
          0% {
            opacity: 0;
            transform: scale(0.35) rotate(-6deg) translateY(50px);
          }
          65% {
            transform: scale(1.025) rotate(1deg) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg) translateY(0);
          }
        }
        .postcard-container {
          animation: postcardPop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}} />

      {/* 遮罩背景 */}
      <div
        className="absolute inset-0 bg-ink/65 backdrop-blur-[4px]"
        style={{
          transition: reducedMotion ? "none" : "opacity 0.4s ease",
        }}
        aria-hidden="true"
      />

      {/* 竖向明信片卡片 - 高度固定为 540px，宽度为 360px/380px，无内部滚动条，一页纸布局 */}
      <div
        className={`relative z-10 flex flex-col justify-between bg-[#F4EFE6] text-ink p-4 border border-ink/10 shadow-2xl rounded-sm postcard-container overflow-hidden ${
          isMobile
            ? "h-[500px] w-[330px]"
            : "h-[540px] w-[370px]"
        }`}
        style={{
          boxShadow: "0 20px 50px rgba(38, 36, 31, 0.3), inset 0 0 40px rgba(139, 53, 46, 0.04)",
        }}
      >
        {/* 顶部经典双细线明信片边框装饰 */}
        <div className="absolute inset-2 pointer-events-none border border-ink/5 rounded-sm" />
        <div className="absolute inset-2.5 pointer-events-none border border-dashed border-[#8B352E]/10 rounded-sm" />

        {/* 关闭按钮 - 设计成一个古风的小圆盖戳记 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#8B352E]/5 border border-[#8B352E]/10 text-[#8B352E]/60 transition-all hover:bg-[#8B352E] hover:text-white hover:scale-105 focus:outline-none cursor-pointer"
          aria-label="关闭详情"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* 【1. 正面：精美贴照区域 (占 40% 高度)】 */}
        <div className="relative w-full flex flex-col bg-white p-2 shadow-sm border border-ink/5 rounded-xs mt-1 shrink-0">
          <div className={`relative w-full overflow-hidden bg-parchment rounded-xs ${isMobile ? "h-[110px]" : "h-[135px]"}`}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              className="object-cover"
            />
          </div>
          {/* 照片下方的复古印字说明 */}
          <div className="mt-1.5 text-center flex flex-col gap-0.5">
            <span className="font-serif text-[12.5px] leading-tight text-ink font-semibold truncate px-1">
              {isTemple ? `${title}壁画` : `${title}`}
            </span>
            <span className="font-serif text-[9px] tracking-widest text-stone italic">
              {region} · {era}
            </span>
          </div>
        </div>

        {/* 【2. 横向分隔线：古典 POST CARD 标志】 */}
        <div className="relative flex items-center justify-center my-2 py-0.5 shrink-0">
          <div className="absolute w-full border-t border-dashed border-stone/20" />
          <span className="relative px-3 bg-[#F4EFE6] font-serif text-[8.5px] tracking-[0.35em] text-[#8B352E] font-medium uppercase">
            Post Card · 明信片
          </span>
        </div>

        {/* 【3. 背面：书写投递区域 (占 50% 高度)】 */}
        <div className="relative flex flex-col flex-1 justify-between min-h-0">
          
          {/* 第一行：邮政编码 & 邮票区域 */}
          <div className="flex justify-between items-start shrink-0">
            
            {/* 红色邮政编码框 */}
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                {postalCode.map((num, i) => (
                  <div
                    key={i}
                    className="flex h-[17px] w-[17px] items-center justify-center border border-[#8B352E]/70 bg-white/20 text-[9.5px] font-bold text-[#8B352E] rounded-xs"
                  >
                    {num}
                  </div>
                ))}
              </div>
              <span className="font-serif text-[7.5px] text-[#8B352E]/60 tracking-wider">
                邮政编码 (Postal Code)
              </span>
            </div>

            {/* 古典精致邮票 & 邮戳 */}
            <div className="relative select-none pointer-events-none scale-85 -translate-y-1">
              {/* 邮票主体 */}
              <div 
                className="w-10 h-13 border-2 border-dotted border-[#8B352E]/35 bg-[#FAF6F0] p-0.5 shadow-sm flex flex-col items-center justify-between relative"
                style={{ borderRadius: "1px" }}
              >
                <div className="absolute inset-0.5 border border-dashed border-[#8B352E]/15" />
                <div className="w-full h-7 relative bg-stone/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#8B352E]/35 font-serif font-bold">
                    ⛩️
                  </div>
                </div>
                <span className="font-serif text-[6.5px] text-[#8B352E] tracking-widest scale-85 font-bold leading-none">
                  山西
                </span>
                <span className="font-serif text-[7.5px] text-[#8B352E] font-extrabold scale-85 leading-none self-end">
                  ¥1.20
                </span>
              </div>

              {/* 叠加印戳 (Postmark) */}
              <div 
                className="absolute -top-2 -left-4 w-12 h-12 rounded-full border border-stone/30 flex flex-col items-center justify-center text-[#26241F]/30 font-serif scale-90 select-none rotate-[-15deg] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, transparent 70%, rgba(38,36,31,0.02) 72%)"
                }}
              >
                <div className="absolute w-[92%] h-[92%] rounded-full border border-dashed border-stone/20" />
                <span className="text-[5.5px] tracking-wider font-semibold scale-80 leading-none">SHANXI</span>
                <span className="text-[5px] my-0.5 border-y border-stone/25 px-1 py-0.1 scale-80 leading-none">2026.08.01</span>
              </div>
            </div>

          </div>

          {/* 第二行：信件文本书写区 (带横格，防止溢出) */}
          <div className="relative my-1 flex-1 flex flex-col justify-center min-h-0">
            <h3 className="font-serif text-[13.5px] font-bold text-ink tracking-wide mb-1 flex items-center gap-1.5 shrink-0">
              <span className="inline-block w-1 h-1 bg-[#8B352E] rounded-full" />
              {isTemple ? "壁画风物志" : "读画随笔"}
            </h3>
            
            {/* 优雅信件书写格效果，严格控制最多展示3行，避免超出 */}
            <div 
              className="font-serif text-[11.5px] leading-[21px] text-ink/85 tracking-wide text-justify pr-1 line-clamp-3 overflow-hidden flex-1"
              style={{
                backgroundImage: "linear-gradient(to bottom, transparent 20px, rgba(139, 53, 46, 0.08) 21px)",
                backgroundSize: "100% 21px",
                lineHeight: "21px",
              }}
            >
              <p className="indent-5">{description}</p>
            </div>
          </div>

          {/* 第三行：标签/落款栏 */}
          <div className="flex flex-col gap-1.5 mt-1 pt-1.5 border-t border-stone/10 shrink-0">
            {/* 标签 */}
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 3).map((kw) => (
                <span
                  key={kw}
                  className="rounded-xs bg-[#8B352E]/5 border border-[#8B352E]/10 px-1.5 py-0.1 font-serif text-[8.5px] text-[#8B352E]"
                >
                  #{kw}
                </span>
              ))}
            </div>

            {/* 落款 */}
            <div className="flex justify-between items-end text-[8.5px] font-serif text-stone">
              <span>投递至：古建壁画同好者</span>
              <span>寄自：山西 · {region.replace("山西·", "")} 古遗址</span>
            </div>
          </div>

          {/* 第四行：行动按钮栏 (横向排列) */}
          <div className="mt-2.5 flex gap-1.5 border-t border-dashed border-[#8B352E]/10 pt-2 shrink-0">
            <ActionButton primary className="flex-1 py-1.5 h-8">
              {isTemple ? "壁画故事 📜" : "开始读画 👁️"}
            </ActionButton>
            <ActionButton className="flex-1 py-1.5 h-8">
              {isTemple ? "进入寺庙 ⛩️" : "缺失探索 🔍"}
            </ActionButton>
          </div>

        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  primary = false,
  className = "",
}: {
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`rounded-xs px-3 font-serif text-[11px] tracking-widest transition-all duration-300 font-medium active:scale-97 shadow-sm flex items-center justify-center gap-1 ${
        primary
          ? "bg-[#8B352E] text-[#FDFBF7] hover:bg-[#8B352E]/90 border border-[#8B352E] hover:shadow-md"
          : "border border-[#8B352E]/25 text-[#8B352E] hover:bg-[#8B352E]/5 hover:border-[#8B352E]/40 bg-white/40"
      } ${className}`}
    >
      {children}
    </button>
  );
}
