"use client";

import { useState } from "react";
import { coloringArtwork } from "@/data/coloringArtwork";

export default function CulturalHints() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-ink/10 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-sans text-[11px] tracking-wide text-stone hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
      >
        色彩线索
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {coloringArtwork.hints.map((hint) => (
            <li
              key={hint}
              className="font-serif text-[11px] leading-relaxed text-ink/65"
            >
              {hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
