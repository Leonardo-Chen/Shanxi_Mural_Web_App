/** 在线稿约束下的 flood fill（原型备用，正式版优先区域蒙版） */
export function floodFillAt(
  imageData: ImageData,
  x: number,
  y: number,
  tolerance: number,
  lineArtData: Uint8ClampedArray
): Set<number> {
  const { width, height, data } = imageData;
  const start = (y * width + x) * 4;
  if (lineArtData[start] < 80 && lineArtData[start + 1] < 80 && lineArtData[start + 2] < 80) {
    return new Set();
  }

  const target = [data[start], data[start + 1], data[start + 2]];
  const visited = new Set<number>();
  const stack = [x + y * width];

  while (stack.length) {
    const idx = stack.pop()!;
    if (visited.has(idx)) continue;
    const px = idx % width;
    const py = (idx / width) | 0;
    const i = idx * 4;

    if (lineArtData[i] < 60 && lineArtData[i + 1] < 60 && lineArtData[i + 2] < 60) {
      continue;
    }

    const dr = data[i] - target[0];
    const dg = data[i + 1] - target[1];
    const db = data[i + 2] - target[2];
    if (Math.sqrt(dr * dr + dg * dg + db * db) > tolerance) continue;

    visited.add(idx);
    if (px > 0) stack.push(idx - 1);
    if (px < width - 1) stack.push(idx + 1);
    if (py > 0) stack.push(idx - width);
    if (py < height - 1) stack.push(idx + width);
  }

  return visited;
}
