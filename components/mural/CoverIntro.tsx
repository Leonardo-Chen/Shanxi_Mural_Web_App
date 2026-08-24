"use client";

import Link from "next/link";
import StartExploreButton from "./StartExploreButton";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface CoverIntroProps {
  visible: boolean;
  pressed: boolean;
  transitioning: boolean;
  onStart: () => void;
  chromeRef: React.RefObject<HTMLDivElement | null>;
}

export default function CoverIntro({
  visible,
  pressed,
  transitioning,
  onStart,
  chromeRef,
}: CoverIntroProps) {
  const { locale, t } = useLocale();
  const titleLang = locale === "zh" ? "zh-CN" : locale === "it" ? "it" : "en";

  return (
    <div
      ref={chromeRef}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={transitioning ? undefined : { opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <div className="relative z-10 flex w-full max-w-[680px] flex-col items-center px-4 text-center md:px-6">
        <h1
          lang={titleLang}
          className="type-display cover-rise max-w-[680px]"
          style={{ animationDelay: "60ms" }}
          aria-label={t("cover.title")}
        >
          {locale === "zh" ? (
            <>
              <span className="text-cinnabar">晋壁画</span>
              <span>博物馆</span>
            </>
          ) : (
            <>
              <span className="text-cinnabar">JIN</span>
              <span className="ml-[0.28em]">MUSEUM</span>
            </>
          )}
        </h1>
        <p
          lang="en"
          className="type-meta-en cover-rise mt-3 text-[rgb(33_51_56_/_70%)]"
          style={{ animationDelay: "180ms" }}
        >
          {t("cover.subtitle")}
        </p>
        <p
          lang={titleLang}
          className="type-body cover-rise mt-4 max-w-[32rem] text-ink/80"
          style={{ animationDelay: "300ms" }}
        >
          {t("cover.lead")}
        </p>
        <p
          lang={titleLang}
          className="type-ui cover-rise mt-3 max-w-[28rem] text-cinnabar"
          style={{ animationDelay: "380ms" }}
        >
          {t("cover.reward")}
        </p>
        <div
          className={`cover-rise mt-6 flex flex-col items-center ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
          style={{ animationDelay: "460ms" }}
        >
          <StartExploreButton
            onClick={onStart}
            disabled={!visible || pressed}
            pressed={pressed}
          />
          <Link
            href="/about"
            className="type-ui mt-4 inline-flex h-11 items-center justify-center rounded-full border border-ink/15 bg-rice px-5 text-ink/75 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            {t("nav.about")}
          </Link>
        </div>
      </div>
    </div>
  );
}
