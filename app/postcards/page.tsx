import type { Metadata } from "next";
import PostcardAlbum from "@/components/postcards/PostcardAlbum";
import { localeMetadata } from "@/lib/i18n/requestLocale";

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata("meta.postcardsTitle", "meta.postcardsDesc");
}

export default function PostcardsPage() {
  return <PostcardAlbum />;
}
