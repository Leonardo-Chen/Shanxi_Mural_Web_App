"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";
import type {
  CollectedPostcard,
  CollectedSticker,
} from "@/hooks/useGameProgress";
import PostcardShare from "./PostcardShare";
import PostcardStage from "./PostcardStage";
import FixedNavigation from "@/components/FixedNavigation";
import TextureBackground from "@/components/TextureBackground";
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

function itemKey(entry: ActiveItem) {
  return `${entry.kind}-${entry.item.id}`;
}

export default function PostcardAlbum() {
  const { locale, t } = useLocale();
  const { progress, clearPostcards, clearStickers } = useGameProgress();
  const [active, setActive] = useState<ActiveItem | null>(null);
  const [confirming, setConfirming] = useState<"postcard" | "sticker" | null>(
    null
  );
  const [mobileTab, setMobileTab] = useState<"postcard" | "sticker">(
    "postcard"
  );
  const cards = progress.collectedPostcards;
  const stickers = progress.collectedStickers;

  const earnedCards = useMemo<ActiveItem[]>(() => {
    return [...cards]
      .sort((a, b) =>
        (b.collectedAt ?? "").localeCompare(a.collectedAt ?? "")
      )
      .map((item) => ({ kind: "postcard" as const, item }));
  }, [cards]);

  const elements = useMemo<ActiveItem[]>(() => {
    return [...stickers]
      .sort((a, b) =>
        (b.collectedAt ?? "").localeCompare(a.collectedAt ?? "")
      )
      .map((item) => ({ kind: "sticker" as const, item }));
  }, [stickers]);

  useEffect(() => {
    if (active?.kind === "postcard") {
      const next = earnedCards.find((entry) => entry.item.id === active.item.id);
      if (next) {
        if (next.item !== active.item) setActive(next);
        return;
      }
    }
    if (active?.kind === "sticker") {
      const next = elements.find((entry) => entry.item.id === active.item.id);
      if (next) {
        if (next.item !== active.item) setActive(next);
        return;
      }
    }
    if (earnedCards[0]) {
      setActive(earnedCards[0]);
      setMobileTab("postcard");
      return;
    }
    setActive(elements[0] ?? null);
    if (elements[0]) setMobileTab("sticker");
  }, [earnedCards, elements, active]);

  const select = (item: ActiveItem) => {
    setActive(item);
    setMobileTab(item.kind);
    setConfirming(null);
  };

  const title = active
    ? locCollectedTitle(locale, active.item.id, active.item.title)
    : t("postcard.albumTitle");

  return (
    <div className="collection-root relative h-svh overflow-hidden">
      <TextureBackground />
      <FixedNavigation variant="collection" />

      <main className="absolute inset-0 z-10 flex flex-col gap-3 px-4 pb-5 pt-[4.75rem] md:flex-row md:gap-4 md:px-6 md:pb-6 md:pt-24">
        <section
          aria-label={title}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-ink/12 bg-rice/92 shadow-[0_16px_40px_rgb(33_51_56_/_14%)] backdrop-blur-md"
        >
          {active ? (
            <div className="flex min-h-0 flex-1 flex-col px-5 py-4 md:px-7 md:py-5">
              <p className="type-meta font-semibold text-gold">
                {active.kind === "postcard"
                  ? t("postcard.earned")
                  : t("postcard.albumTitle")}
              </p>
              <h1 className="type-section mt-1 truncate">{title}</h1>
              <div
                className={`mt-3 flex min-h-0 flex-1 items-center justify-center rounded-xl bg-parchment/55 ${
                  active.kind === "postcard"
                    ? "overflow-visible px-4 py-4 md:px-6 md:py-5"
                    : "overflow-hidden p-6"
                }`}
              >
                {active.kind === "postcard" ? (
                  <PostcardStage
                    src={active.item.src}
                    alt={title}
                    title={title}
                    orientation={active.item.orientation}
                    collectedAt={active.item.collectedAt}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.item.src}
                    alt={title}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              <PostcardShare
                compact
                kind={active.kind}
                postcard={{
                  id: active.item.id,
                  src: active.item.src,
                  title: active.item.title,
                  fileName:
                    active.kind === "sticker"
                      ? active.item.fileName
                      : fileNameFromSrc(
                          active.item.src,
                          `${active.item.id}.png`
                        ),
                }}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <p className="type-meta font-semibold text-cinnabar">
                {t("postcard.albumEyebrow")}
              </p>
              <h1 className="type-page mt-2">{t("postcard.albumTitle")}</h1>
              <p className="type-body mt-3 max-w-md text-ink/75">
                {t("postcard.emptyHint")}
              </p>
              <Link href="/" className="btn-primary mt-6">
                {t("postcard.backCover")}
              </Link>
            </div>
          )}
        </section>

        <aside className="flex h-[min(38svh,17.5rem)] min-h-0 w-full shrink-0 flex-col gap-2 md:h-auto md:w-[22rem] lg:w-[24rem]">
          <div className="flex shrink-0 rounded-full border border-ink/12 bg-rice/90 p-1 md:hidden">
            <TabButton
              active={mobileTab === "postcard"}
              onClick={() => setMobileTab("postcard")}
              count={earnedCards.length}
            >
              {t("postcard.earned")}
            </TabButton>
            <TabButton
              active={mobileTab === "sticker"}
              onClick={() => setMobileTab("sticker")}
              count={elements.length}
            >
              {t("postcard.albumTitle")}
            </TabButton>
          </div>

          <CollectionRail
            className={mobileTab === "postcard" ? "flex" : "hidden md:flex"}
            title={t("postcard.earned")}
            count={earnedCards.length}
            empty={t("postcard.earnedEmpty")}
            hint={t("postcard.earnedHint")}
            confirming={confirming === "postcard"}
            confirmHint={t("postcard.clearHint")}
            clearLabel={
              confirming === "postcard"
                ? t("postcard.clearCardsConfirm")
                : t("postcard.clearCards")
            }
            onClear={() => {
              if (confirming === "postcard") {
                clearPostcards();
                setConfirming(null);
                return;
              }
              setConfirming("postcard");
            }}
          >
            {earnedCards.map((entry) => (
              <RailTile
                key={itemKey(entry)}
                label={locCollectedTitle(
                  locale,
                  entry.item.id,
                  entry.item.title
                )}
                src={entry.item.src}
                selected={
                  active?.kind === "postcard" &&
                  active.item.id === entry.item.id
                }
                padded={false}
                onClick={() => select(entry)}
              />
            ))}
          </CollectionRail>

          <CollectionRail
            className={mobileTab === "sticker" ? "flex" : "hidden md:flex"}
            title={t("postcard.albumTitle")}
            count={elements.length}
            empty={t("postcard.empty")}
            hint={t("postcard.emptyHint")}
            confirming={confirming === "sticker"}
            confirmHint={t("postcard.clearHint")}
            clearLabel={
              confirming === "sticker"
                ? t("postcard.clearConfirm")
                : t("postcard.clear")
            }
            onClear={() => {
              if (confirming === "sticker") {
                clearStickers();
                setConfirming(null);
                return;
              }
              setConfirming("sticker");
            }}
          >
            {elements.map((entry) => (
              <RailTile
                key={itemKey(entry)}
                label={locCollectedTitle(
                  locale,
                  entry.item.id,
                  entry.item.title
                )}
                src={entry.item.src}
                selected={
                  active?.kind === "sticker" &&
                  active.item.id === entry.item.id
                }
                padded
                onClick={() => select(entry)}
              />
            ))}
          </CollectionRail>
        </aside>
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`type-ui min-w-0 flex-1 truncate rounded-full py-2 transition-colors ${
        active ? "bg-cinnabar text-on-accent" : "text-ink/70 hover:text-ink"
      }`}
    >
      {children}
      <span className={`ml-1 ${active ? "text-on-accent/80" : "text-ink/40"}`}>
        {count}
      </span>
    </button>
  );
}

function RailTile({
  label,
  src,
  selected,
  padded,
  onClick,
}: {
  label: string;
  src: string;
  selected: boolean;
  padded: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={label}
        onClick={onClick}
        className="group flex w-full flex-col gap-1.5 text-left focus:outline-none"
      >
        <span
          className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-parchment/80 transition-colors group-focus-visible:ring-2 group-focus-visible:ring-cinnabar ${
            padded ? "p-2" : "p-1"
          } ${
            selected
              ? "border-cinnabar/50 ring-1 ring-cinnabar/70"
              : "border-ink/10 group-hover:border-ink/25"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </span>
        <span className="type-caption line-clamp-2 text-ink/75">{label}</span>
      </button>
    </li>
  );
}

function CollectionRail({
  className,
  title,
  count,
  empty,
  hint,
  confirming,
  confirmHint,
  clearLabel,
  onClear,
  children,
}: {
  className?: string;
  title: string;
  count: number;
  empty: string;
  hint: string;
  confirming: boolean;
  confirmHint: string;
  clearLabel: string;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-ink/12 bg-rice/92 shadow-[0_16px_40px_rgb(33_51_56_/_14%)] backdrop-blur-md ${className ?? "flex"}`}
    >
      <header className="flex shrink-0 items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h2 className="type-card">
            {title}
            <span className="ml-2 type-caption font-normal text-ink/40">
              {count}
            </span>
          </h2>
          {confirming ? (
            <p className="type-caption mt-1 text-cinnabar">{confirmHint}</p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={count === 0}
          onClick={onClear}
          className="type-caption ml-auto shrink-0 text-ink/45 transition-colors hover:text-cinnabar disabled:cursor-not-allowed disabled:text-ink/20"
        >
          {clearLabel}
        </button>
      </header>
      {count === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center px-4 pb-4">
          <p className="type-ui text-ink">{empty}</p>
          <p className="type-caption mt-1 text-ink/60">{hint}</p>
        </div>
      ) : (
        <div className="album-rail min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-3">
            {children}
          </ul>
        </div>
      )}
    </section>
  );
}
