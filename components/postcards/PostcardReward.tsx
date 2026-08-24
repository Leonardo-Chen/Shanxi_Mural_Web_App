"use client";

import { useEffect, useRef, useState } from "react";
import type { PostcardAsset } from "@/lib/postcards";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locCollectedTitle } from "@/lib/i18n/localize";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PostcardRewardProps {
  postcard: PostcardAsset;
  alreadyCollected: boolean;
  onCollect: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function openMailTo(to: string, subject: string, body: string) {
  const href = `mailto:${to.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const link = document.createElement("a");
  link.href = href;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function PostcardReward({
  postcard,
  alreadyCollected,
  onCollect,
}: PostcardRewardProps) {
  const { locale, t } = useLocale();
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"reward" | "compose">("reward");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "opened">("idle");
  const title = locCollectedTitle(locale, postcard.id, postcard.title);
  const composing = step === "compose";

  useEffect(() => {
    cardRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step === "compose") emailRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (step === "compose") {
        setStep("reward");
        return;
      }
      onCollect();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCollect, step]);

  const sendPostcard = () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setEmailError(true);
      emailRef.current?.focus();
      return;
    }
    setEmailError(false);
    const pageUrl = `${window.location.origin}${postcard.src}`;
    const subject = t("postcard.emailSubject", {
      brand: t("brand.siteName"),
      title,
    });
    const body = [
      note.trim(),
      t("postcard.emailBody", {
        brand: t("brand.siteName"),
        title,
        url: pageUrl,
      }),
    ]
      .filter(Boolean)
      .join("\n\n");
    openMailTo(trimmed, subject, body);
    setSendState("opened");
  };

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-parchment/92 px-5 ${
        reducedMotion ? "" : "overlay-in"
      }`}
      role="presentation"
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          composing ? t("postcard.addNoteShare") : t("postcard.congratsAria")
        }
        tabIndex={-1}
        className={`relative flex h-[min(28rem,calc(100svh-2.5rem))] w-[calc(100vw-32px)] max-w-[min(92vw,860px)] overflow-hidden rounded-2xl border border-ink/12 bg-rice text-left shadow-[0_18px_40px_rgb(33_51_56_/_18%)] max-md:flex-col md:flex-row md:items-stretch ${
          reducedMotion ? "" : "dialog-pop"
        }`}
      >
        <div
          className={`min-h-0 min-w-0 overflow-hidden bg-[#B8B0A4] max-md:h-[38%] max-md:w-full md:self-stretch ${
            postcard.orientation === "portrait" ? "md:w-[42%]" : "md:w-[54%]"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postcard.src}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-6 py-5 md:px-7 md:py-6">
          {composing ? (
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                sendPostcard();
              }}
            >
              <p className="type-meta text-gold">{t("postcard.rewardEyebrow")}</p>
              <h2 className="type-section mt-1">{title}</h2>
              <label className="mt-4 block shrink-0">
                <span className="type-meta text-gold">
                  {t("postcard.emailLabel")}
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(false);
                    if (sendState === "opened") setSendState("idle");
                  }}
                  placeholder={t("postcard.emailPlaceholder")}
                  aria-invalid={emailError}
                  className="type-body mt-1.5 h-10 w-full rounded-xl border border-ink/15 bg-parchment/70 px-3 text-ink placeholder:text-ink/35 focus:border-cinnabar/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                />
              </label>
              <p
                className={`type-meta mt-1.5 min-h-[1.25rem] ${
                  emailError ? "text-cinnabar" : "text-ink/50"
                }`}
              >
                {emailError
                  ? t("postcard.emailInvalid")
                  : t("postcard.emailHint")}
              </p>
              <label className="mt-2 block shrink-0">
                <span className="type-meta text-gold">
                  {t("postcard.noteLabel")}
                </span>
                <input
                  type="text"
                  value={note}
                  maxLength={120}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={t("postcard.notePlaceholder")}
                  className="type-body mt-1.5 h-10 w-full rounded-xl border border-ink/15 bg-parchment/70 px-3 text-ink placeholder:text-ink/35 focus:border-cinnabar/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                />
              </label>
              <div className="mt-auto flex shrink-0 gap-2 pt-4">
                <button
                  type="button"
                  onClick={onCollect}
                  className="type-ui inline-flex h-11 flex-1 items-center justify-center rounded-full border border-ink/15 bg-rice px-3 text-ink/70 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                >
                  {t("postcard.continue")}
                </button>
                <button
                  type="submit"
                  className="type-ui inline-flex h-11 flex-1 items-center justify-center rounded-full bg-cinnabar px-3 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
                >
                  {sendState === "opened"
                    ? t("postcard.sendOpened")
                    : t("postcard.send")}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="type-meta text-gold">{t("postcard.rewardEyebrow")}</p>
              <h2 className="type-page mt-2">{t("postcard.congrats")}</h2>
              <p className="type-body mt-3 text-ink/80">
                {t("postcard.congratsBody")}
              </p>
              <p className="type-card mt-3">{title}</p>
              <div className="mt-auto flex shrink-0 gap-2 pt-4">
                <button
                  type="button"
                  onClick={onCollect}
                  className="type-ui inline-flex h-11 flex-1 items-center justify-center rounded-full border border-ink/15 bg-rice px-3 text-ink/70 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
                >
                  {alreadyCollected
                    ? t("postcard.continue")
                    : t("postcard.skipForNow")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("compose")}
                  className="type-ui inline-flex h-11 flex-1 items-center justify-center rounded-full bg-cinnabar px-3 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
                >
                  {t("postcard.send")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
