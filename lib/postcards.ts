export type PostcardAsset = {
  id: string;
  src: string;
  title: string;
  fileName: string;
};

function postcardFromSvg(id: string, title: string): PostcardAsset {
  const fileName = `${id}.svg`;
  return {
    id,
    title,
    fileName,
    src: `/images/postcards/${encodeURIComponent(fileName)}`,
  };
}

export const FALLBACK_POSTCARDS: PostcardAsset[] = [
  postcardFromSvg("水神堂_龙母出宫降雨图", "水神堂 · 龙母出宫降雨图"),
  postcardFromSvg("多福寺_佛传故事", "多福寺 · 佛传故事"),
  postcardFromSvg("永乐宫_朝元图", "永乐宫 · 朝元图"),
];

const postcardByKey = new Map<string, PostcardAsset>();

function remember(asset: PostcardAsset, extraKeys: string[] = []) {
  for (const key of [asset.id, asset.fileName, ...extraKeys]) {
    postcardByKey.set(key, asset);
    postcardByKey.set(decodeURIComponentSafe(key), asset);
  }
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stemFromSrc(src: string) {
  const raw = decodeURIComponentSafe(src.split("/").pop() ?? "");
  return raw.replace(/\.[^.]+$/, "");
}

for (const asset of FALLBACK_POSTCARDS) {
  remember(asset, [`${asset.id}.svg`, `${asset.id}.png`]);
}

export function resolvePostcardSrc(src: string, id?: string): string {
  const fromId = id ? postcardByKey.get(id) : undefined;
  if (fromId) return fromId.src;
  const fromStem = postcardByKey.get(stemFromSrc(src));
  if (fromStem) return fromStem.src;
  return src;
}

export function resolvePostcardAsset(
  item: Pick<PostcardAsset, "id" | "src" | "title" | "fileName">
): PostcardAsset {
  const mapped = postcardByKey.get(item.id) ?? postcardByKey.get(stemFromSrc(item.src));
  if (!mapped) {
    return {
      ...item,
      src: resolvePostcardSrc(item.src, item.id),
    };
  }
  return {
    ...mapped,
    title: item.title || mapped.title,
  };
}

export async function fetchPostcardAssets(): Promise<PostcardAsset[]> {
  try {
    const response = await fetch("/api/postcards", { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as { postcards?: PostcardAsset[] };
      if (data.postcards?.length) {
        return data.postcards.map(resolvePostcardAsset);
      }
    }
  } catch {
    /* use fallback */
  }
  return FALLBACK_POSTCARDS;
}

export function pickRandomPostcard(
  postcards: PostcardAsset[],
  collectedIds: string[]
): PostcardAsset | null {
  const poolSource = postcards.length ? postcards : FALLBACK_POSTCARDS;
  const unused = poolSource.filter((item) => !collectedIds.includes(item.id));
  const pool = unused.length ? unused : poolSource;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
