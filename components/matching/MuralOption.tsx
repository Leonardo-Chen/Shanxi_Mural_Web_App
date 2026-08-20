"use client";

import type { Mural } from "@/data/murals";
import type { MuralMatchingPosition } from "@/data/muralMatchingLayout";
import OutlineAnimation from "@/components/mural/OutlineAnimation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locMural } from "@/lib/i18n/localize";

interface MuralOptionProps {
  mural: Mural;
  layout: MuralMatchingPosition;
  selected: boolean;
  focusing?: boolean;
  muted: boolean;
  outlineKey?: number;
  reducedMotion: boolean;
  onSelect: (muralId: string) => void;
}

export default function MuralOption({
  mural,
  layout,
  selected,
  focusing = false,
  muted,
  outlineKey = 0,
  reducedMotion,
  onSelect,
}: MuralOptionProps) {
  const { locale, t } = useLocale();
  const copy = locMural(locale, mural);
  const height = layout.width / layout.aspectRatio;
  const image = copy.thumbnail || copy.image;

  return (
    <button
      type="button"
      data-element-interactive
      data-mural-option={mural.id}
      aria-label={t("match.selectMural", { title: copy.displayTitle })}
      aria-describedby={`mural-caption-${mural.id}`}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(mural.id);
      }}
      className="mural-option group absolute text-left transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,36,31,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-4 focus-visible:ring-offset-parchment motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height,
        zIndex: selected || focusing ? 30 : layout.zIndex ?? 1,
        transform: `rotate(${layout.rotation ?? 0}deg)`,
        opacity: muted ? 0.58 : 1,
      }}
    >
      <span className="mural-option-visual relative block h-full w-full">
        <span className="block h-full w-full overflow-hidden bg-[#C9C0B3]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={copy.alt}
              draggable={false}
              loading="lazy"
              className="h-full w-full select-none object-contain"
            />
          ) : (
            <span
              className="block h-full w-full bg-[#B8B0A4]"
              aria-hidden="true"
            />
          )}
        </span>

        <span
          id={`mural-caption-${mural.id}`}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-rice/90 px-2 py-1.5"
        >
          <span className="block font-serif text-[11px] leading-snug text-stone">
            {copy.displayTitle}
          </span>
          <span className="mt-0.5 hidden font-sans text-[9px] tracking-wide text-stone/65 group-hover:block group-focus-visible:block group-aria-pressed:block">
            {copy.period} · {copy.templeName}
          </span>
        </span>

        <OutlineAnimation
          key={outlineKey}
          active={selected}
          width={layout.width}
          height={height}
          reducedMotion={reducedMotion}
        />
      </span>
    </button>
  );
}
