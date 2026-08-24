"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const BGM_SRC = "/audio/bgm.mp3";
const BGM_VOLUME = 0.32;
const STORAGE_KEY = "shanxi-bgm-muted";

type BgmContextValue = {
  muted: boolean;
  toggle: () => void;
};

const BgmContext = createContext<BgmContextValue | null>(null);

export function BgmProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const savedMuted =
      typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY) === "1";
    setMuted(savedMuted);

    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = BGM_VOLUME;
    audio.muted = savedMuted;
    audioRef.current = audio;

    const tryPlay = () => {
      if (!audioRef.current || audioRef.current.muted) return;
      void audioRef.current.play().catch(() => undefined);
    };

    const unlock = () => tryPlay();
    if (!savedMuted) tryPlay();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    if (muted) {
      audio.pause();
    } else {
      void audio.play().catch(() => undefined);
    }
  }, [muted]);

  const toggle = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ muted, toggle }), [muted, toggle]);

  return <BgmContext.Provider value={value}>{children}</BgmContext.Provider>;
}

export function BgmToggle({ className }: { className?: string }) {
  const { t } = useLocale();
  const bgm = useContext(BgmContext);
  if (!bgm) return null;

  return (
    <button
      type="button"
      className={
        className ??
        "flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-rice text-ink/75 shadow-[0_8px_24px_rgb(33_51_56_/_12%)] transition-colors hover:border-ink/30 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
      }
      aria-pressed={!bgm.muted}
      aria-label={bgm.muted ? t("nav.bgmPlay") : t("nav.bgmMute")}
      onClick={bgm.toggle}
    >
      {bgm.muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
    </button>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.1 7.15h2.05L8.5 4v10L5.15 10.85H3.1V7.15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.15 6.85a2.85 2.85 0 0 1 0 4.3M13.25 5.15a5.15 5.15 0 0 1 0 7.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.1 7.15h2.05L8.5 4v10L5.15 10.85H3.1V7.15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 7.05 15.1 10.95M15.1 7.05 11.2 10.95"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
