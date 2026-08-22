import type { Metadata } from "next";
import ColoringGamePage from "@/components/coloring/ColoringGamePage";
import { localeMetadata } from "@/lib/i18n/requestLocale";

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata("meta.colorTitle", "meta.colorDesc");
}

export default function ColorTheMuralPage() {
  return <ColoringGamePage />;
}
