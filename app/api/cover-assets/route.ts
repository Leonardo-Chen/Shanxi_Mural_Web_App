import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  altFromFileName,
  publicSrcFromRelativePath,
  type CoverAsset,
} from "@/lib/coverAssets";

export const dynamic = "force-dynamic";

const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg"]);
const OBJECTS_ROOT = path.join(process.cwd(), "public", "images", "objects");

async function collectAssets(
  directory: string,
  relativeDir = ""
): Promise<CoverAsset[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const assets: CoverAsset[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relativePath = relativeDir
      ? `${relativeDir}/${entry.name}`
      : entry.name;
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      assets.push(...(await collectAssets(fullPath, relativePath)));
      continue;
    }

    if (!IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const folder = relativeDir.split("/")[0] || "objects";
    assets.push({
      src: publicSrcFromRelativePath(relativePath),
      fileName: entry.name,
      folder,
      alt: altFromFileName(entry.name),
    });
  }
  return assets;
}

export async function GET() {
  const assets = await collectAssets(OBJECTS_ROOT);
  return NextResponse.json({ assets });
}
