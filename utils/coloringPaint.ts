import type { ColoringRegion } from "@/data/coloringRegions";
import type { RegionColorMap } from "@/utils/coloringScore";
import type { BrushSettings } from "@/utils/drawingTools";

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function regionPath2D(
  region: ColoringRegion,
  width = 1,
  height = 1
): Path2D | null {
  if (region.svgPath) {
    const path = new Path2D();
    if (width === 1 && height === 1) return new Path2D(region.svgPath);
    path.addPath(
      new Path2D(region.svgPath),
      new DOMMatrix().scale(width, height)
    );
    return path;
  }

  const shape = region.shape;
  if (!shape) return null;
  const path = new Path2D();
  if (shape.type === "ellipse") {
    path.ellipse(
      shape.cx * width,
      shape.cy * height,
      shape.rx * width,
      shape.ry * height,
      0,
      0,
      Math.PI * 2
    );
  } else {
    path.rect(
      shape.x * width,
      shape.y * height,
      shape.w * width,
      shape.h * height
    );
  }
  return path;
}

let probeCtx: CanvasRenderingContext2D | null = null;

function getProbe() {
  if (probeCtx) return probeCtx;
  probeCtx = document.createElement("canvas").getContext("2d");
  return probeCtx;
}

export function pointInRegion(
  region: ColoringRegion,
  nx: number,
  ny: number
): boolean {
  const path = regionPath2D(region);
  if (path) {
    const probe = getProbe();
    if (!probe) return false;
    return probe.isPointInPath(path, nx, ny);
  }
  const shape = region.shape;
  if (!shape) return false;
  if (shape.type === "ellipse") {
    const dx = (nx - shape.cx) / Math.max(shape.rx, 0.0001);
    const dy = (ny - shape.cy) / Math.max(shape.ry, 0.0001);
    return dx * dx + dy * dy <= 1;
  }
  return (
    nx >= shape.x &&
    ny >= shape.y &&
    nx <= shape.x + shape.w &&
    ny <= shape.y + shape.h
  );
}

export function hitTestRegion(
  regions: ColoringRegion[],
  nx: number,
  ny: number
): ColoringRegion | null {
  for (const region of regions) {
    if (pointInRegion(region, nx, ny)) return region;
  }
  return null;
}

export function regionBBox(
  region: ColoringRegion,
  width: number,
  height: number
) {
  const shape = region.shape;
  if (shape?.type === "ellipse") {
    return {
      x: Math.max(0, Math.floor((shape.cx - shape.rx) * width)),
      y: Math.max(0, Math.floor((shape.cy - shape.ry) * height)),
      w: Math.ceil(shape.rx * 2 * width),
      h: Math.ceil(shape.ry * 2 * height),
    };
  }
  if (shape?.type === "rect") {
    return {
      x: Math.max(0, Math.floor(shape.x * width)),
      y: Math.max(0, Math.floor(shape.y * height)),
      w: Math.ceil(shape.w * width),
      h: Math.ceil(shape.h * height),
    };
  }
  return { x: 0, y: 0, w: width, h: height };
}

export function fillRegionTextured(
  ctx: CanvasRenderingContext2D,
  region: ColoringRegion,
  color: string,
  width: number,
  height: number,
  brush: BrushSettings
) {
  const path = regionPath2D(region, width, height);
  if (!path) return;
  ctx.save();
  ctx.clip(path);
  const [r, g, b] = parseHex(color);
  const box = regionBBox(region, width, height);
  const area = Math.max(1, box.w * box.h);
  const particles = Math.max(900, Math.floor(area * 0.35));
  for (let n = 0; n < particles; n += 1) {
    const x = box.x + Math.random() * box.w;
    const y = box.y + Math.random() * box.h;
    const a = brush.opacity * (0.4 + Math.random() * 0.55);
    const radius = 0.6 + Math.random() * (1.6 + brush.textureStrength * 1.8);
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function fillRegionSolid(
  ctx: CanvasRenderingContext2D,
  region: ColoringRegion,
  color: string,
  width: number,
  height: number
) {
  const path = regionPath2D(region, width, height);
  if (!path) return;
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.92;
  ctx.fill(path);
  ctx.restore();
}

export function samplePaintedRegions(
  canvas: HTMLCanvasElement,
  regions: ColoringRegion[],
  coverageThreshold = 0.08
): RegionColorMap {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return {};
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const result: RegionColorMap = {};

  for (const region of regions) {
    const box = regionBBox(region, width, height);
    const step = Math.max(1, Math.floor(Math.min(box.w, box.h) / 90));
    let area = 0;
    let painted = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    const maxX = Math.min(width - 1, box.x + box.w);
    const maxY = Math.min(height - 1, box.y + box.h);
    for (let y = box.y; y < maxY; y += step) {
      for (let x = box.x; x < maxX; x += step) {
        if (!pointInRegion(region, x / width, y / height)) continue;
        area += 1;
        const i = (y * width + x) * 4;
        if (data[i + 3] > 22) {
          painted += 1;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
      }
    }
    if (area > 0 && painted / area >= coverageThreshold && painted > 0) {
      result[region.id] = rgbToHex(r / painted, g / painted, b / painted);
    }
  }

  return result;
}
