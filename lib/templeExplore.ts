import type { StoryCardData } from "@/data/muralCards";
import {
  getAvailableMuralsForTemple,
  GROUP_TEMPLE_ID,
  type ManifestMural,
} from "@/data/muralData";
import { GRID_CARD } from "@/lib/canvasScale";

export function muralsToExploreCards(murals: ManifestMural[]): StoryCardData[] {
  return murals.flatMap((mural, index) => {
    if (!mural.imageSrc) return [];
    return [
      {
        id: `mural-${mural.id}`,
        type: "story" as const,
        templeId: GROUP_TEMPLE_ID[mural.groupId] ?? mural.groupId,
        muralId: mural.id,
        title: mural.displayTitle ?? mural.title,
        description: mural.summary,
        keywords: [mural.hall, mural.dynasty].filter(Boolean),
        image: mural.imageSrc,
        imageAlt: mural.displayTitle ?? mural.title,
        detailImage: mural.imageSrc,
        detailImageAlt: mural.displayTitle ?? mural.title,
        x: 0,
        y: 0,
        width: GRID_CARD.width,
        height: GRID_CARD.height,
        rotation: 0,
        depth: 0.8,
        priority: index < 2 ? "high" : "normal",
      },
    ];
  });
}

export function getTempleExploreCards(templeId: string): StoryCardData[] {
  return muralsToExploreCards(getAvailableMuralsForTemple(templeId));
}
