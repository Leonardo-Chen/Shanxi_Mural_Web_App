import {
  coloringRegions,
  regionIdToRgb,
  type RegionShape,
} from "@/data/coloringRegions";

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: RegionShape,
  w: number,
  h: number
) {
  if (shape.type === "ellipse") {
    ctx.beginPath();
    ctx.ellipse(
      shape.cx * w,
      shape.cy * h,
      shape.rx * w,
      shape.ry * h,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else {
    ctx.fillRect(shape.x * w, shape.y * h, shape.w * w, shape.h * h);
  }
}

/** 从 PNG 蒙版或程序化 shape 生成区域 ID 图 */
export async function buildRegionIdMap(
  width: number,
  height: number
): Promise<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  for (let i = coloringRegions.length - 1; i >= 0; i--) {
    const region = coloringRegions[i];
    if (region.maskImage) {
      const img = await loadImage(region.maskImage);
      ctx.drawImage(img, 0, 0, width, height);
      continue;
    }
    if (region.shape) {
      const [r, g, b] = regionIdToRgb(i);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      drawShape(ctx, region.shape, width, height);
    }
  }

  return { canvas, ctx };
}

/** 生成每区域二值蒙版（用于评分采样） */
export function extractRegionMasks(
  regionIdCtx: CanvasRenderingContext2D,
  width: number,
  height: number
): Uint8Array[] {
  const data = regionIdCtx.getImageData(0, 0, width, height).data;
  const masks = coloringRegions.map(() => new Uint8Array(width * height));

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    if (b !== 0) continue;
    const regionIndex = r + (g << 8) - 1;
    if (regionIndex >= 0 && regionIndex < masks.length) {
      masks[regionIndex][i] = 1;
    }
  }

  return masks;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export { loadImage };
