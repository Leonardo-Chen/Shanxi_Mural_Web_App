"use client";

import { useEffect, useRef } from "react";
import type { PostcardAsset } from "@/lib/postcards";
import { resolvePostcardSrc } from "@/lib/postcards";
import PostcardShare from "./PostcardShare";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locCollectedTitle } from "@/lib/i18n/localize";

interface PostcardRewardProps {
  postcard: PostcardAsset;
  alreadyCollected: boolean;
  onCollect: () => void;
}

export default function PostcardReward({
  postcard,
  alreadyCollected,
  onCollect,
}: PostcardRewardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLocale();
  const title = locCollectedTitle(locale, postcard.id, postcard.title);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const src = resolvePostcardSrc(postcard.src, postcard.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-ink/40 px-5 py-6">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="postcard-reward-title"
        tabIndex={-1}
        className="relative my-auto w-full max-w-md border border-stone/25 bg-rice px-6 py-6 text-center shadow-[0_20px_55px_rgba(38,36,31,0.22)] focus:outline-none"
      >
        <p className="font-sans text-[10px] tracking-[0.24em] text-cinnabar/80">
          {t("postcard.rewardEyebrow")}
        </p>
        <h2
          id="postcard-reward-title"
          className="mt-2 font-serif text-2xl text-stone md:text-3xl"
        >
          {t("postcard.congrats")}
        </h2>
        <p className="mt-2 font-serif text-sm text-ink/65">
          {t("postcard.congratsBody")}
        </p>

        <div className="mt-4 overflow-hidden border border-stone/15 bg-parchment/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            className="mx-auto h-auto max-h-[min(32vh,14rem)] w-full object-contain"
          />
        </div>
        <p className="mt-3 font-serif text-base text-stone">{title}</p>

        <PostcardShare postcard={{ ...postcard, src, title }} />

        <button
          type="button"
          onClick={onCollect}
          className="mt-5 min-h-11 w-full rounded-full bg-cinnabar px-6 py-3 text-rice transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice"
        >
          <span className="block font-serif text-sm">
            {alreadyCollected ? t("postcard.continue") : t("postcard.collect")}
          </span>
        </button>
      </div>
    </div>
  );
}
