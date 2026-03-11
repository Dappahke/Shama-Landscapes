import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await supabase
      .from("newsletter")
      .update({ last_opened_at: new Date().toISOString(), opens: supabase.raw("opens + 1") })
      .eq("id", id);

    // Return a transparent 1x1 pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );
    return new Response(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Open pixel error:", error);
    return NextResponse.json({ error: "Failed to log open" }, { status: 500 });
  }
}