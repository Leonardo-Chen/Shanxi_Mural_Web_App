"use client";

import { isIdentityUnderResearch, type AnnotationElement } from "@/data/muralData";
import { useLocale } from "@/components/i18n/LocaleProvider";

type ElementInfoCardProps = {
  element: Pick<
    AnnotationElement,
    "displayName" | "researchName" | "category" | "shortDescription" | "aliases"
  >;
  imageSrc?: string;
  imageAlt?: string;
  describedById?: string;
  compact?: boolean;
  showImage?: boolean;
  titleAs?: "h2" | "h3";
};

export default function ElementInfoCard({
  element,
  imageSrc,
  imageAlt,
  describedById,
  compact = false,
  showImage = true,
  titleAs = "h2",
}: ElementInfoCardProps) {
  const underResearch = isIdentityUnderResearch(element);
  const labelId = describedById ?? "element-info-label";
  const TitleTag = titleAs;
  const { t } = useLocale();

  return (
    <div
      className={
        compact
          ? "flex h-full min-h-0 flex-row md:block"
          : "flex h-full min-h-0 flex-col"
      }
    >
      {showImage && (
        <div
          className={`flex items-center justify-center bg-parchment/70 ${
            compact
              ? "h-24 w-[38%] shrink-0 p-3 md:h-64 md:w-full md:p-6"
              : "min-h-40 p-6"
          }`}
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={imageAlt ?? element.displayName}
              draggable={false}
              aria-describedby={labelId}
              className="h-full w-full select-none object-contain"
            />
          ) : (
            <div
              className="h-full max-h-52 w-[42%] min-w-10 bg-[#B7AFA3]"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      <div
        id={labelId}
        className={`min-w-0 flex-1 overflow-y-auto ${
          compact ? "px-4 py-3 md:px-5 md:py-5" : "px-1 pt-4"
        }`}
      >
        <p className="font-sans text-[9px] tracking-[0.2em] text-cinnabar/80">
          {compact ? t("detail.selectedFigure") : element.category}
        </p>
        <TitleTag className="mt-1 font-serif text-lg text-stone md:text-2xl">
          {element.displayName}
        </TitleTag>
        <p className="mt-1 font-sans text-[10px] tracking-[0.12em] text-stone/55">
          {element.category}
        </p>
        {underResearch && (
          <p className="mt-2 inline-block border border-stone/20 px-2 py-0.5 font-sans text-[9px] tracking-[0.08em] text-stone/70">
            {t("detail.underResearch")}
          </p>
        )}
        <p
          className={`mt-2 font-serif leading-relaxed text-ink/65 ${
            compact
              ? "line-clamp-3 text-xs md:line-clamp-none md:text-[13px]"
              : "text-sm"
          }`}
        >
          {element.shortDescription}
        </p>
      </div>
    </div>
  );
}
