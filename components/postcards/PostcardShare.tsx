"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PostcardAsset } from "@/lib/postcards";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface PostcardShareProps {
  postcard: PostcardAsset;
  kind?: "postcard" | "sticker";
}

export default function PostcardShare({
  postcard,
  kind = "postcard",
}: PostcardShareProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [pageUrl, setPageUrl] = useState("/postcards");
  const { t } = useLocale();

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
    setPageUrl(`${window.location.origin}/postcards`);
  }, []);

  const shareText =
    kind === "sticker"
      ? t("postcard.shareSticker", {
          brand: t("brand.siteName"),
          title: postcard.title,
        })
      : t("postcard.shareCard", {
          brand: t("brand.siteName"),
          title: postcard.title,
        });
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

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {canShare && (
        <button
          type="button"
          onClick={shareNative}
          className="min-h-9 rounded-full border border-stone/25 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] text-stone hover:border-stone/50"
        >
          {t("postcard.shareNative")}
        </button>
      )}
      <a
        href={weiboHref}
        target="_blank"
        rel="noreferrer"
        className="min-h-9 rounded-full border border-stone/25 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] text-stone hover:border-stone/50"
      >
        {t("postcard.weibo")}
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="min-h-9 rounded-full border border-stone/25 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] text-stone hover:border-stone/50"
      >
        {copied ? t("postcard.copied") : t("postcard.copy")}
      </button>
      <a
        href={postcard.src}
        download={postcard.fileName}
        className="min-h-9 rounded-full border border-stone/25 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] text-stone hover:border-stone/50"
      >
        {t("postcard.download")}
      </a>
    </div>
  );
}
