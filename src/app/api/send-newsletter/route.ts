import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { subject, content } = await req.json();

  const { data: subscribers } = await supabase
    .from("newsletter")
    .select("*")
    .eq("unsubscribed", false);

  for (const user of subscribers ?? []) {

    const unsubscribeLink =
      `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${user.unsubscribe_token}`;

    const html = `
      <h2>${subject}</h2>
      <p>${content}</p>

      <br/><br/>

      <a href="${unsubscribeLink}">Unsubscribe</a>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Shama Landscapes <journal@shamalandscapes.co.ke>",
        to: user.email,
        subject,
        html
      })
    });
  }

  return NextResponse.json({ success: true });
}