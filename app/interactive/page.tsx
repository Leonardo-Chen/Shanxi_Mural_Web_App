import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { localeMetadata } from "@/lib/i18n/requestLocale";

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata("meta.colorTitle", "meta.colorDesc");
}

export default function InteractiveIndexPage() {
  redirect("/interactive/color-the-mural");
}
