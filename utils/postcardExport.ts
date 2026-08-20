import { canvasToPngDataUrl } from "@/utils/coloringExport";

const POSTCARD_WIDTH = 1080;
const POSTCARD_HEIGHT = 1350;
const LOGO_SRC = "/images/Jin_logo.png";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`无法加载图片：${src}`));
    image.src = src;
  });
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  boxW: number,
  boxH: number,
  sourceW: number,
  sourceH: number
) {
  const scale = Math.min(boxW / sourceW, boxH / sourceH);
  const drawW = sourceW * scale;
  const drawH = sourceH * scale;
  const dx = x + (boxW - drawW) / 2;
  const dy = y + (boxH - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}

export async function exportColoringPostcard(options: {
  artworkCanvas: HTMLCanvasElement;
  title: string;
  figureName: string;
  templeName: string;
  stars: number;
  createdAt: Date;
  siteLabel?: string;
  siteName?: string;
  headerLabel?: string;
}): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = POSTCARD_WIDTH;
  canvas.height = POSTCARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建明信片画布");

  ctx.fillStyle = "#EEE8DC";
  ctx.fillRect(0, 0, POSTCARD_WIDTH, POSTCARD_HEIGHT);

  ctx.fillStyle = "rgba(38, 36, 31, 0.04)";
  ctx.fillRect(48, 48, POSTCARD_WIDTH - 96, POSTCARD_HEIGHT - 96);

  try {
    const logo = await loadImage(LOGO_SRC);
    ctx.drawImage(logo, 72, 72, 72, 72);
  } catch {
    /* logo 加载失败时仍输出明信片 */
  }

  ctx.fillStyle = "#26241F";
  ctx.font = "600 28px 'Noto Serif SC', serif";
  ctx.fillText(options.siteName ?? "看见壁上山西", 164, 104);
  ctx.font = "12px Inter, sans-serif";
  ctx.fillStyle = "#3E6264";
  ctx.fillText(options.siteLabel ?? "JIN MUSEUM", 164, 128);

  ctx.fillStyle = "#26241F";
  ctx.font = "600 42px 'Noto Serif SC', serif";
  ctx.fillText(options.headerLabel ?? "COLOR THE MURAL", 72, 196);
  ctx.font = "22px 'Noto Serif SC', serif";
  ctx.fillStyle = "#3E6264";
  ctx.fillText(
    `${options.templeName} · ${options.figureName}`,
    72,
    236
  );

  drawContainedImage(
    ctx,
    options.artworkCanvas,
    72,
    268,
    POSTCARD_WIDTH - 144,
    820,
    options.artworkCanvas.width,
    options.artworkCanvas.height
  );

  const starText = `${"★".repeat(options.stars)}${"☆".repeat(5 - options.stars)}  ${options.stars} / 5`;
  ctx.fillStyle = "#A2643E";
  ctx.font = "28px serif";
  ctx.fillText(starText, 72, 1148);

  ctx.fillStyle = "#8D8A82";
  ctx.font = "16px Inter, sans-serif";
  const date = options.createdAt.toISOString().slice(0, 10);
  ctx.fillText(date, 72, 1188);
  ctx.fillText(options.siteLabel ?? "murals of shanxi", 72, 1218);

  ctx.strokeStyle = "rgba(38, 36, 31, 0.18)";
  ctx.strokeRect(POSTCARD_WIDTH - 168, 1168, 88, 88);

  return canvasToPngDataUrl(canvas);
}
