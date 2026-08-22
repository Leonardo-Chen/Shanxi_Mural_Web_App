"use client";

import Link from "next/link";
import SiteBrand from "@/components/SiteBrand";

export default function ColoringSiteNav() {
  return (
    <>
      <header className="pointer-events-none fixed left-0 top-0 z-40 p-4 md:p-5">
        <div className="pointer-events-auto">
          <SiteBrand compact href="/" />
        </div>
      </header>

      <nav
        className="pointer-events-none fixed right-0 top-0 z-40 p-4 md:p-5"
        aria-label="主导航"
      >
        <ul className="pointer-events-auto flex flex-wrap justify-end gap-3 md:gap-5">
          <li>
            <Link
              href="/"
              className="font-sans text-[11px] tracking-wide text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:underline md:text-xs"
            >
              返回首页
            </Link>
          </li>
          <li>
            <span
              className="font-sans text-[11px] tracking-wide text-ink underline underline-offset-4 md:text-xs"
              aria-current="page"
            >
              互动读画
            </span>
          </li>
        </ul>
      </nav>
    </>
  );
}
