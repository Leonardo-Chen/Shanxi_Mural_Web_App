"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PostcardAsset } from "@/lib/postcards";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locCollectedTitle } from "@/lib/i18n/localize";

interface PostcardShareProps {
  postcard: PostcardAsset;
  kind?: "postcard" | "sticker";
  compact?: boolean;
  note?: string;
}

export default function PostcardShare({
  postcard,
  kind = "postcard",
  compact = false,
  note = "",
}: PostcardShareProps) {
  const { locale, t } = useLocale();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [pageUrl, setPageUrl] = useState("/postcards");

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    setPageUrl(`${window.location.origin}/postcards`);
  }, []);

  const localizedTitle = locCollectedTitle(locale, postcard.id, postcard.title);
  const shareText = [
    t(kind === "sticker" ? "postcard.shareSticker" : "postcard.shareCard", {
      brand: t("brand.siteName"),
      title: localizedTitle,
    }),
    note.trim(),
  ]
    .filter(Boolean)
    .join("\n");
  const weiboHref = useMemo(
    () =>
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(shareText)}`,
    [pageUrl, shareText]
  );

  const shareNative = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: postcard.title,
        text: shareText,
        url: pageUrl,
      });
    } catch {
      /* user cancelled */
    }
  }, [pageUrl, shareText]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${pageUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [pageUrl, shareText]);

  const actionClass = compact
    ? "type-ui inline-flex h-9 items-center rounded-full border border-ink/15 bg-transparent px-3.5 text-ink/80 transition-colors hover:border-cinnabar hover:text-cinnabar"
    : "btn-secondary min-h-11 px-3";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${
        compact ? "mt-3" : "mt-4"
      }`}
    >
      {canShare && (
        <button type="button" onClick={shareNative} className={actionClass}>
          {t("postcard.shareNative")}
        </button>
      )}
      <a
        href={weiboHref}
        target="_blank"
        rel="noreferrer"
        className={actionClass}
      >
        {t("postcard.weibo")}
      </a>
      <button type="button" onClick={copyLink} className={actionClass}>
        {copied ? t("postcard.copied") : t("postcard.copy")}
      </button>
      <a
        href={postcard.src}
        download={postcard.fileName}
        className={actionClass}
      >
        {t("postcard.download")}
      </a>
    </div>
  );
}
