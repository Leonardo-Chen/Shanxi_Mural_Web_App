"use client";

import Link from "next/link";
import type { NavSection } from "./NavPanel";

interface FixedNavigationProps {
  compact: boolean;
  activeSection?: NavSection | null;
  onNavClick?: (section: NavSection) => void;
}

const navItems: { id: NavSection; label: string }[] = [
  { id: "temples", label: "寺庙" },
  { id: "stories", label: "壁画故事" },
  { id: "routes", label: "探索路线" },
  { id: "about", label: "关于项目" },
];

export default function FixedNavigation({
  compact,
  activeSection = null,
  onNavClick,
}: FixedNavigationProps) {
  return (
    <>
      <header className="pointer-events-none fixed left-0 top-0 z-40 p-5 md:p-6">
        <div
          className={`pointer-events-auto transition-all duration-700 ease-out ${
            compact ? "scale-90 origin-top-left" : "scale-100"
          }`}
        >
          <h1
            className={`font-serif text-ink transition-all duration-700 ${
              compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
            }`}
          >
            看见壁上山西
          </h1>
          <p
            className={`font-sans tracking-[0.25em] text-stone transition-all duration-700 ${
              compact ? "mt-0.5 text-[8px] md:text-[9px]" : "mt-1 text-[10px] md:text-xs"
            }`}
          >
            MURALS OF SHANXI
          </p>
        </div>
      </header>

      <nav
        className="pointer-events-none fixed right-0 top-0 z-40 p-5 md:p-6"
        aria-label="主导航"
      >
        <ul className="pointer-events-auto flex gap-4 md:gap-6">
          <li>
            <Link
              href="/interactive"
              className="font-sans text-[11px] tracking-wide text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:underline md:text-xs"
            >
              互动读画
            </Link>
          </li>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavClick?.(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-sans text-[11px] tracking-wide transition-colors focus:outline-none focus-visible:underline md:text-xs ${
                    isActive
                      ? "text-ink underline underline-offset-4"
                      : "text-ink/60 hover:text-ink focus-visible:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
