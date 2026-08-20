"use client";

import { useState } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";
import type { CollectedPostcard, CollectedSticker } from "@/hooks/useGameProgress";
import { resolvePostcardSrc } from "@/lib/postcards";
import PostcardShare from "./PostcardShare";
import FixedNavigation from "@/components/FixedNavigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locCollectedTitle } from "@/lib/i18n/localize";

type ActiveItem =
  | { kind: "postcard"; item: CollectedPostcard }
  | { kind: "sticker"; item: CollectedSticker };

function fileNameFromSrc(src: string, fallback: string) {
  const raw = src.split("/").pop() ?? fallback;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function PostcardAlbum() {
  const { progress, clearPostcards, clearStickers } = useGameProgress();
  const { locale, t } = useLocale();
  const [active, setActive] = useState<ActiveItem | null>(null);
  const [confirming, setConfirming] = useState<"postcard" | "sticker" | null>(
    null
  );
  const cards = progress.collectedPostcards;
  const stickers = progress.collectedStickers;

  return (
    <div className="collection-root h-svh overflow-y-auto bg-parchment">
      <FixedNavigation />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-24 md:px-8 md:pt-28">
        <p className="font-sans text-[10px] tracking-[0.24em] text-cinnabar/80">
          {t("postcard.albumEyebrow")}
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          {t("postcard.albumTitle")}
        </h1>
        <p className="mt-3 max-w-xl font-serif text-sm leading-relaxed text-ink/65">
          {t("postcard.albumLead")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
          <section
            className="md:pr-8 lg:pr-12"
            aria-labelledby="postcards-heading"
          >
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone/70">
              {t("postcard.kindPostcard")}
            </p>
            <h2
              id="postcards-heading"
              className="mt-1 font-serif text-2xl text-stone"
            >
              {t("postcard.section")}
            </h2>
            {cards.length === 0 ? (
              <div className="mt-5 border border-stone/20 bg-rice/70 px-6 py-8 text-center">
                <p className="font-serif text-base text-stone">{t("postcard.empty")}</p>
                <p className="mt-2 font-serif text-sm text-ink/60">
                  {t("postcard.emptyHint")}
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid grid-cols-1 gap-5">
                {cards.map((card) => {
                  const title = locCollectedTitle(locale, card.id, card.title);
                  return (
                  <li key={card.id}>
                    <button
                      type="button"
                      onClick={() => setActive({ kind: "postcard", item: card })}
                      className="w-full overflow-hidden border border-stone/20 bg-rice text-left shadow-sm transition-colors hover:border-stone/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvePostcardSrc(card.src, card.id)}
                        alt={title}
                        className="aspect-[3/2] w-full bg-parchment/80 object-contain"
                      />
                      <span className="block px-4 py-3 font-serif text-sm text-stone">
                        {title}
                      </span>
                    </button>
                  </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section
            className="md:border-l md:border-stone/15 md:pl-8 lg:pl-12"
            aria-labelledby="stickers-heading"
          >
            <p className="font-sans text-[10px] tracking-[0.2em] text-stone/70">
              {t("postcard.kindSticker")}
            </p>
            <h2
              id="stickers-heading"
              className="mt-1 font-serif text-2xl text-stone"
            >
              {t("postcard.stickers")}
            </h2>
            {stickers.length === 0 ? (
              <div className="mt-5 border border-stone/20 bg-rice/70 px-6 py-8 text-center">
                <p className="font-serif text-base text-stone">{t("postcard.stickersEmpty")}</p>
                <p className="mt-2 font-serif text-sm text-ink/60">
                  {t("postcard.stickersHint")}
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid grid-cols-2 gap-4">
                {stickers.map((sticker) => {
                  const title = locCollectedTitle(locale, sticker.id, sticker.title);
                  return (
                  <li key={sticker.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setActive({ kind: "sticker", item: sticker })
                      }
                      className="w-full overflow-hidden border border-stone/20 bg-rice text-left shadow-sm transition-colors hover:border-stone/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                    >
                      <span className="flex aspect-square items-center justify-center bg-parchment/80 p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sticker.src}
                          alt={title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                      <span className="block px-3 py-2.5 font-serif text-sm text-stone">
                        {title}
                      </span>
                    </button>
                  </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {stickers.length === 0 && cards.length === 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full bg-cinnabar px-6 py-3 font-serif text-sm text-rice hover:bg-[#7a2e28]"
            >
              {t("postcard.backCover")}
            </Link>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-3 border-t border-stone/15 pt-8 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={cards.length === 0}
            onClick={() => {
              if (confirming === "postcard") {
                clearPostcards();
                setActive(null);
                setConfirming(null);
                return;
              }
              setConfirming("postcard");
            }}
            className="min-h-11 min-w-[12rem] rounded-full border border-stone/25 px-6 py-2.5 font-serif text-sm text-stone transition-colors hover:border-cinnabar/50 hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone/25 disabled:hover:text-stone"
          >
            {confirming === "postcard" ? t("postcard.clearConfirm") : t("postcard.clear")}
          </button>
          <button
            type="button"
            disabled={stickers.length === 0}
            onClick={() => {
              if (confirming === "sticker") {
                clearStickers();
                setActive(null);
                setConfirming(null);
                return;
              }
              setConfirming("sticker");
            }}
            className="min-h-11 min-w-[12rem] rounded-full border border-stone/25 px-6 py-2.5 font-serif text-sm text-stone transition-colors hover:border-cinnabar/50 hover:text-cinnabar disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone/25 disabled:hover:text-stone"
          >
            {confirming === "sticker" ? t("postcard.clearStickersConfirm") : t("postcard.clearStickers")}
          </button>
        </div>
        {confirming && (
          <p className="mt-3 text-center font-serif text-xs text-ink/50">
            {t("postcard.clearHint")}
          </p>
        )}
      </main>

      {active && (() => {
        const activeTitle = locCollectedTitle(
          locale,
          active.item.id,
          active.item.title
        );
        return (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 px-5"
          role="presentation"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeTitle}
            className="relative w-full max-w-lg border border-stone/25 bg-rice px-6 py-7 text-center shadow-[0_20px_55px_rgba(38,36,31,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={
                active.kind === "sticker"
                  ? "flex min-h-56 items-center justify-center border border-stone/15 bg-parchment/80 p-4"
                  : ""
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  active.kind === "postcard"
                    ? resolvePostcardSrc(active.item.src, active.item.id)
                    : active.item.src
                }
                alt={activeTitle}
                className={
                  active.kind === "sticker"
                    ? "max-h-[50vh] w-auto max-w-full object-contain"
                    : "h-auto w-full border border-stone/15 object-contain"
                }
              />
            </div>
            <p className="mt-4 font-serif text-lg text-stone">{activeTitle}</p>
            <p className="mt-1 font-sans text-[10px] tracking-[0.16em] text-stone/55">
              {active.kind === "sticker"
                ? t("postcard.kindSticker")
                : t("postcard.kindPostcard")}
            </p>
            <PostcardShare
              kind={active.kind}
              postcard={{
                id: active.item.id,
                src:
                  active.kind === "postcard"
                    ? resolvePostcardSrc(active.item.src, active.item.id)
                    : active.item.src,
                title: activeTitle,
                fileName:
                  active.kind === "sticker"
                    ? active.item.fileName
                    : fileNameFromSrc(active.item.src, `${active.item.id}.png`),
              }}
            />
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-5 min-h-11 rounded-full border border-stone/25 px-6 py-2.5 font-serif text-sm text-stone hover:border-stone/50"
            >
              {t("nav.close")}
            </button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
