import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg", ".svg"]);
const POSTCARDS_ROOT = path.join(process.cwd(), "public", "images", "postcards");

export type PostcardAsset = {
  id: string;
  src: string;
  title: string;
  fileName: string;
};

function titleFromFileName(fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, "");
  return stem.replace(/[_-]+/g, " · ").trim() || stem;
}

export async function GET() {
  let entries;
  try {
    entries = await readdir(POSTCARDS_ROOT, { withFileTypes: true });
  } catch {
    return NextResponse.json({ postcards: [] as PostcardAsset[] });
  }

  const postcards: PostcardAsset[] = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith(".") &&
        IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
    )
    .map((entry) => ({
      id: entry.name.replace(/\.[^.]+$/, ""),
      fileName: entry.name,
      title: titleFromFileName(entry.name),
      src: `/images/postcards/${encodeURIComponent(entry.name)}`,
    }));

  return NextResponse.json({ postcards });
}
