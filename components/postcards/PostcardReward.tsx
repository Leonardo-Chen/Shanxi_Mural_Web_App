"use client";

import { useEffect, useRef } from "react";
import type { PostcardAsset } from "@/lib/postcards";
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
  const { locale, t } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-5">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("postcard.congratsAria")}
        tabIndex={-1}
        className="relative w-full max-w-lg border border-stone/25 bg-rice px-6 py-7 text-center shadow-[0_20px_55px_rgba(38,36,31,0.22)] focus:outline-none"
      >
        <p className="font-sans text-[10px] tracking-[0.24em] text-cinnabar/80">
          {t("postcard.rewardEyebrow")}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-stone">{t("postcard.congrats")}</h2>
        <p className="mt-2 font-serif text-sm text-ink/65">
          {t("postcard.congratsBody")}
        </p>

        <div className="mt-5 overflow-hidden border border-stone/15 bg-parchment/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postcard.src}
            alt={locCollectedTitle(locale, postcard.id, postcard.title)}
            className="h-auto w-full object-contain"
          />
        </div>
        <p className="mt-3 font-serif text-base text-stone">
          {locCollectedTitle(locale, postcard.id, postcard.title)}
        </p>

        <PostcardShare postcard={postcard} />

        <button
          type="button"
          onClick={onCollect}
          className="mt-6 min-h-11 w-full rounded-full bg-cinnabar px-6 py-3 text-rice transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice"
        >
          {alreadyCollected ? t("postcard.continue") : t("postcard.collect")}
        </button>
      </div>
    </div>
  );
}
