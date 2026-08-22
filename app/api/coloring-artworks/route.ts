import { NextResponse } from "next/server";
import { listColoringArtworkPairs } from "@/lib/coloringArtworks";

export const dynamic = "force-dynamic";

export async function GET() {
  const pairs = await listColoringArtworkPairs();
  return NextResponse.json({ pairs });
}
