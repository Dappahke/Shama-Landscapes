// src/app/api/unsubscribe/route.js
import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.redirect(new URL("/unsubscribe", request.url));
  }

  try {
    const { error } = await supabase
      .from("newsletter")
      .update({ 
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString()
      })
      .eq("email", email.toLowerCase().trim());

    if (error) throw error;

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/unsubscribe?email=${encodeURIComponent(email)}&status=success`, request.url)
    );
  } catch (err) {
    return NextResponse.redirect(
      new URL(`/unsubscribe?status=error`, request.url)
    );
  }
}