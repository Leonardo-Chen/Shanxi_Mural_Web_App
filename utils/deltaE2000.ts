/** CIE Delta E 2000 */
export function deltaE2000(
  lab1: [number, number, number],
  lab2: [number, number, number]
): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const avgLp = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const G =
    0.5 *
    (1 -
      Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const avgCp = (C1p + C2p) / 2;

  let h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
  if (h1p < 0) h1p += 360;
  let h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;
  if (h2p < 0) h2p += 360;

  let avgHp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
  if (Math.abs(h1p - h2p) > 180) {
    avgHp = (h1p + h2p + 360) / 2;
    if (h1p + h2p < 360) avgHp = (h1p + h2p) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos(((avgHp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * avgHp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * avgHp - 63) * Math.PI) / 180);

  let dhp = h2p - h1p;
  if (Math.abs(dhp) > 180) dhp += dhp > 0 ? -360 : 360;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Sl =
    1 +
    (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;

  const dRo =
    30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const Rc =
    2 *
    Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7))) *
    Math.sin((2 * dRo * Math.PI) / 180);

  const dL = dLp / Sl;
  const dC = dCp / Sc;
  const dH = dHp / Sh;

  return Math.sqrt(dL * dL + dC * dC + dH * dH + Rc * (dC * dH));
}

export function regionSimilarityFromDeltaE(deltaE: number): number {
  return Math.max(0, 1 - deltaE / 35);
}
