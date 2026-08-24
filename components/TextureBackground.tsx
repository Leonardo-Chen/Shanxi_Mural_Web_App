"use client";

export default function TextureBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-parchment" />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/></svg>`
          )}")`,
          backgroundSize: "160px 160px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgb(33 51 56 / 15%) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgb(168 56 38 / 8%) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgb(33 51 56 / 5%) 0%, transparent 60%)
          `,
        }}
      />
    </div>
  );
}
