import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ success: false, error: "Missing subject or content" }, { status: 400 });
    }

    // Fetch active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("newsletter")
      .select("*")
      .eq("unsubscribed", false);

    if (fetchError) throw fetchError;

    if (!subscribers?.length) {
      return NextResponse.json({ success: true, message: "No active subscribers found" });
    }

    // Send emails concurrently
    const results = await Promise.all(
      subscribers.map(async (user) => {
        if (!user.unsubscribe_token) {
          console.warn(`Skipping user ${user.email} due to missing unsubscribe token`);
          return { email: user.email, status: "skipped" };
        }

        const unsubscribeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${user.unsubscribe_token}`;

        const html = `
          <h2>${subject}</h2>
          <p>${content}</p>
          <br/><br/>
          <a href="${unsubscribeLink}" style="color:#2A9D8F;">Unsubscribe</a>
        `;

        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Shama Landscapes <journal@shamalandscapes.co.ke>",
              to: user.email,
              subject,
              html,
            }),
          });

          if (!response.ok) {
            console.error(`Failed to send to ${user.email}:`, await response.text());
            return { email: user.email, status: "failed" };
          }

          return { email: user.email, status: "sent" };
        } catch (err) {
          console.error(`Error sending to ${user.email}:`, err);
          return { email: user.email, status: "error" };
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Newsletter send error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}