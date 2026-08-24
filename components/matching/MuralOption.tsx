"use client";

import type { Mural } from "@/data/murals";
import type { MuralMatchingPosition } from "@/data/muralMatchingLayout";
import OutlineAnimation from "@/components/mural/OutlineAnimation";
import { locMural } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface MuralOptionProps {
  mural: Mural;
  layout: MuralMatchingPosition;
  selected: boolean;
  focusing?: boolean;
  muted: boolean;
  outlineKey?: number;
  reducedMotion: boolean;
  onSelect: (muralId: string) => void;
  onOutlineComplete?: (muralId: string) => void;
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
  onOutlineComplete,
}: MuralOptionProps) {
  const { locale } = useLocale();
  const copy = locMural(locale, mural);
  const height = layout.width / layout.aspectRatio;
  const image = mural.thumbnail || mural.image;

  return (
    <button
      type="button"
      data-element-interactive
      data-mural-option={mural.id}
      aria-label={`选择壁画：${mural.alt}`}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(mural.id);
      }}
      className="mural-option group absolute text-left motion-reduce:hover:translate-y-0"
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.width,
        zIndex: selected || focusing ? 30 : layout.zIndex ?? 1,
        transform: `rotate(${layout.rotation ?? 0}deg)`,
        opacity: muted ? 0.58 : 1,
      }}
    >
      <span className="mural-option-visual relative block w-full">
        <span
          className="relative block w-full overflow-hidden border border-[rgb(33_51_56_/_18%)] bg-rice"
          style={{ height }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={mural.alt}
              draggable={false}
              loading="lazy"
              className="block h-full w-full select-none object-cover"
            />
          ) : (
            <span
              className="block h-full w-full bg-[#B8B0A4]"
              aria-hidden="true"
            />
          )}

          <OutlineAnimation
            key={outlineKey}
            active={selected}
            width={layout.width}
            height={height}
            reducedMotion={reducedMotion}
            onComplete={() => onOutlineComplete?.(mural.id)}
          />
        </span>

        <span className="type-meta mt-2 line-clamp-2 block text-center text-ink/75">
          {copy.title}
        </span>
      </span>
    </button>
  );
}
