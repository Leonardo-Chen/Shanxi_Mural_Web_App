import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "互动读画 | 看见壁上山西",
  description: "通过互动体验深入阅读山西寺观壁画。",
};

export default function InteractiveIndexPage() {
  return (
    <main className="coloring-page flex min-h-screen flex-col items-center justify-center bg-parchment px-6">
      <h1 className="font-serif text-2xl text-ink">互动读画</h1>
      <p className="mt-3 max-w-md text-center font-serif text-sm text-ink/65">
        在观察、选择与动手之间，接近壁画中的人物、色彩与层次。
      </p>
      <ul className="mt-8 space-y-3">
        <li>
          <Link
            href="/interactive/color-the-mural"
            className="block rounded-sm border border-ink/15 bg-rice/80 px-6 py-4 font-serif text-ink transition-colors hover:border-ink/30"
          >
            为神明着色
            <span className="mt-1 block font-sans text-[10px] tracking-wider text-stone">
              COLOR THE MURAL · 永乐宫三清殿
            </span>
          </Link>
        </li>
      </ul>
      <Link
        href="/"
        className="mt-10 font-sans text-xs text-ink/50 hover:text-ink"
      >
        返回首页
      </Link>
    </main>
  );
}
