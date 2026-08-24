import type { Metadata } from "next";
import ProjectAbout from "@/components/about/ProjectAbout";
import { localeMetadata } from "@/lib/i18n/requestLocale";

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata("meta.aboutTitle", "meta.aboutDesc");
}

export default function AboutPage() {
  return <ProjectAbout />;
}
