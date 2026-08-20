import { readdir } from "fs/promises";
import path from "path";
import {
  FALLBACK_ARTWORK_PAIR,
  stemFromFileName,
  type ColoringArtworkPair,
} from "@/data/coloringArtworks";

const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg"]);
const LINE_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "coloring",
  "masks",
  "line"
);
const ORIGINAL_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "coloring",
  "masks",
  "original"
);

async function listImages(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          !entry.name.startsWith(".") &&
          IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      )
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

export async function listColoringArtworkPairs(): Promise<ColoringArtworkPair[]> {
  const [lineFiles, originalFiles] = await Promise.all([
    listImages(LINE_DIR),
    listImages(ORIGINAL_DIR),
  ]);

  const originalsByStem = new Map<string, string>();
  for (const fileName of originalFiles) {
    originalsByStem.set(stemFromFileName(fileName), fileName);
  }

  const pairs: ColoringArtworkPair[] = [];
  const seen = new Set<string>();

  for (const lineFileName of lineFiles) {
    const id = stemFromFileName(lineFileName);
    const originalFileName = originalsByStem.get(id);
    if (!originalFileName || seen.has(id)) continue;
    seen.add(id);
    pairs.push({
      id,
      lineFileName,
      originalFileName,
      lineArtUrl: `/images/coloring/masks/line/${encodeURIComponent(lineFileName)}`,
      originalUrl: `/images/coloring/masks/original/${encodeURIComponent(originalFileName)}`,
    });
  }

  if (pairs.length === 0) return [FALLBACK_ARTWORK_PAIR];
  return pairs;
}
