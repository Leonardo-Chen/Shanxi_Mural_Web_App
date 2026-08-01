export type DrawingTool = "crayon" | "pencil" | "eraser";

export interface BrushSettings {
  size: number;
  opacity: number;
  textureStrength: number;
}

export const defaultBrush: BrushSettings = {
  size: 18,
  opacity: 0.65,
  textureStrength: 0.5,
};

export const toolBrushDefaults: Record<DrawingTool, BrushSettings> = {
  crayon: { size: 24, opacity: 0.62, textureStrength: 0.65 },
  pencil: { size: 6, opacity: 0.85, textureStrength: 0.1 },
  eraser: { size: 28, opacity: 1, textureStrength: 0 },
};

/** 绘制单笔 stamp（铅笔/橡皮自由绘制） */
export function stampBrush(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tool: DrawingTool,
  color: string,
  brush: BrushSettings,
  pressure = 0.5
) {
  const size =
    tool === "pencil"
      ? brush.size * (0.6 + pressure * 0.8)
      : brush.size;
  const alpha =
    tool === "pencil"
      ? brush.opacity * (0.5 + pressure * 0.5)
      : brush.opacity;

  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
  }

  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

/** 蜡笔一键铺满区域（颗粒质感） */
export function crayonFillRegion(
  paintCtx: CanvasRenderingContext2D,
  mask: Uint8Array,
  width: number,
  height: number,
  color: string,
  brush: BrushSettings
) {
  paintCtx.globalCompositeOperation = "source-over";
  const [r, g, b] = parseHex(color);

  let pixelCount = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) pixelCount++;
  }

  const particles = Math.max(1200, Math.floor(pixelCount * 0.85));

  for (let n = 0; n < particles; n++) {
    const idx = (Math.random() * mask.length) | 0;
    if (!mask[idx]) continue;
    const px = idx % width;
    const py = (idx / width) | 0;
    const jitter = 2.2 * brush.textureStrength;
    const x = px + (Math.random() - 0.5) * jitter;
    const y = py + (Math.random() - 0.5) * jitter;
    const a = brush.opacity * (0.45 + Math.random() * 0.55);
    const radius = (0.8 + Math.random() * 1.8) * brush.textureStrength;
    paintCtx.fillStyle = `rgba(${r},${g},${b},${a})`;
    paintCtx.beginPath();
    paintCtx.arc(x, y, radius, 0, Math.PI * 2);
    paintCtx.fill();
  }
}

export function clearRegion(
  paintCtx: CanvasRenderingContext2D,
  mask: Uint8Array,
  width: number,
  height: number
) {
  const img = paintCtx.getImageData(0, 0, width, height);
  const d = img.data;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i]) {
      d[i * 4 + 3] = 0;
    }
  }
  paintCtx.putImageData(img, 0, 0);
}

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
