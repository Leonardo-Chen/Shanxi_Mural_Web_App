"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { postcardLogoSrc } from "@/utils/postcardExport";

const REST_X = 8;
const REST_Y = -18;
const SENSITIVITY = 0.38;

interface PostcardStageProps {
  src: string;
  alt: string;
  title: string;
  orientation?: "landscape" | "portrait";
  collectedAt?: string;
}

export default function PostcardStage({
  src,
  alt,
  title,
  orientation = "landscape",
  collectedAt,
}: PostcardStageProps) {
  const { locale, t } = useLocale();
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
  } | null>(null);
  const tiltRef = useRef({ x: REST_X, y: REST_Y });
  const [tilt, setTilt] = useState({ x: REST_X, y: REST_Y });
  const [dragging, setDragging] = useState(false);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [ratio, setRatio] = useState(
    orientation === "portrait" ? 3 / 4 : 3 / 2
  );

  const setRotation = useCallback((x: number, y: number) => {
    const next = { x, y };
    tiltRef.current = next;
    setTilt(next);
  }, []);

  useEffect(() => {
    setRotation(REST_X, REST_Y);
    setRatio(orientation === "portrait" ? 3 / 4 : 3 / 2);
  }, [src, orientation, setRotation]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (!width || !height) return;
      let nextW = width;
      let nextH = nextW / ratio;
      if (nextH > height) {
        nextH = height;
        nextW = nextH * ratio;
      }
      setBox((prev) =>
        Math.abs(prev.width - nextW) < 0.5 && Math.abs(prev.height - nextH) < 0.5
          ? prev
          : { width: nextW, height: nextH }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ratio]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rx: tiltRef.current.x,
      ry: tiltRef.current.y,
    };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    setRotation(drag.rx - dy * SENSITIVITY, drag.ry + dx * SENSITIVITY);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
  };

  const reset = () => setRotation(REST_X, REST_Y);

  const dateLabel = collectedAt
    ? new Date(collectedAt).toLocaleDateString(
        locale === "zh" ? "zh-CN" : locale === "it" ? "it-IT" : "en-GB",
        { year: "numeric", month: "short", day: "numeric" }
      )
    : null;

  const rx = reducedMotion ? 0 : tilt.x;
  const ry = reducedMotion ? 0 : tilt.y;

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div ref={stageRef} className="postcard-stage min-h-0 flex-1">
        <div
          aria-label={t("postcard.flipAria", { title: alt })}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={reset}
          onKeyDown={(event) => {
            if (reducedMotion) return;
            const step = event.shiftKey ? 18 : 8;
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setRotation(tiltRef.current.x, tiltRef.current.y - step);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              setRotation(tiltRef.current.x, tiltRef.current.y + step);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setRotation(tiltRef.current.x + step, tiltRef.current.y);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              setRotation(tiltRef.current.x - step, tiltRef.current.y);
            } else if (event.key === "Home" || event.key === "Escape") {
              event.preventDefault();
              reset();
            }
          }}
          className={`postcard-3d ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            width: box.width || undefined,
            height: box.height || undefined,
            transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: dragging || reducedMotion ? "none" : "transform 160ms ease-out",
          }}
        >
          <div className="postcard-3d-face postcard-3d-face--front">
            <div className="flex h-full w-full bg-rice p-[7px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                draggable={false}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight) {
                    setRatio(image.naturalWidth / image.naturalHeight);
                  }
                }}
                className="pointer-events-none h-full w-full select-none object-cover"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(
                  ${90 + ry * 0.35}deg,
                  rgb(33 51 56 / ${Math.min(0.22, Math.max(0, ry * 0.0018))}) 0%,
                  transparent 42%,
                  rgb(255 255 255 / ${Math.min(0.18, Math.max(0, -ry * 0.0014))}) 100%
                )`,
              }}
              aria-hidden="true"
            />
          </div>

          <div className="postcard-3d-face postcard-3d-face--back" aria-hidden="true">
            <div className="flex h-full w-full flex-col bg-[#efe8dc] px-4 py-4 md:px-5 md:py-5">
              <div className="flex items-start justify-between gap-3">
                <p className="type-meta text-gold">{t("postcard.backNote")}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={postcardLogoSrc(locale)}
                  alt=""
                  className="h-8 w-auto max-w-[42%] object-contain opacity-90"
                />
              </div>
              <div className="mt-4 min-h-0 flex-1 border-t border-dashed border-ink/20 pt-3">
                <p className="type-card text-ink">{title}</p>
                {dateLabel ? (
                  <p className="type-caption mt-2 text-ink/55">{dateLabel}</p>
                ) : null}
                <div className="mt-4 space-y-2.5" aria-hidden="true">
                  <span className="block h-px bg-ink/15" />
                  <span className="block h-px bg-ink/15" />
                  <span className="block h-px w-2/3 bg-ink/15" />
                </div>
              </div>
              <p className="type-caption mt-3 text-ink/45">
                {t("brand.siteName")}
              </p>
            </div>
          </div>
        </div>
      </div>
      {!reducedMotion ? (
        <p className="hint-fade type-caption mt-2 shrink-0 text-center text-ink/70">
          {t("postcard.flipHint")}
        </p>
      ) : null}
    </div>
  );
}
