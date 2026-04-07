import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ⏱ 30 minutes in milliseconds
const TIMEOUT = 30 * 60 * 1000;

// 🧠 Generate lead summary
async function generateLeadSummary(messages) {
  const prompt = `
You are Shama, a sales assistant for Shama Landscapes.

Summarize this conversation into a professional LEAD REPORT:

Include:
- Client name (if available)
- Project type
- Location
- Needs
- Budget hints
- Intent level (low/medium/high)
- Recommended next action

Conversation:
${messages.map(m => `${m.sender_type}: ${m.content}`).join("\n")}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await res.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

// 📤 Send report to company WhatsApp
async function sendToCompany(report) {
  await fetch(
    `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.COMPANY_WHATSAPP_NUMBER,
        type: "text",
        text: { body: report },
      }),
    }
  );
}

// 🔥 MAIN WORKER
export async function runTimeoutCheck() {
  const cutoff = new Date(Date.now() - TIMEOUT).toISOString();

  // 1. Find inactive conversations
  const { data: inactiveConvos } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("status", "active")
    .lt("last_message_at", cutoff);

  if (!inactiveConvos || inactiveConvos.length === 0) return;

  for (const convo of inactiveConvos) {
    // 2. Get messages
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: true });

    if (!messages?.length) continue;

    // 3. Generate summary
    const summary = await generateLeadSummary(messages);

    // 4. Send to company
    await sendToCompany(summary);

    // 5. Mark as completed
    await supabase
      .from("chat_conversations")
      .update({ status: "completed" })
      .eq("id", convo.id);
  }
}