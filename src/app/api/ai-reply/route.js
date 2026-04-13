import { createClient } from "@supabase/supabase-js";
import { SHAMA_SYSTEM_PROMPT } from "@/lib/ai/shamaPrompt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------------
// 🔥 GEMINI WITH RETRY SYSTEM
// -----------------------------------
async function callGeminiWithRetry(payload, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data?.candidates?.length) {
        return data;
      }

      const errorMsg = data?.error?.message || "";
      const isOverloaded =
        response.status === 429 ||
        response.status === 503 ||
        errorMsg.includes("high demand");

      if (isOverloaded && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 800 * (i + 1)));
        continue;
      }

      throw new Error(errorMsg || "Gemini request failed");
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

// -----------------------------------
// 🧠 GEMINI RESPONSE
// -----------------------------------
async function generateGeminiReply(message, history = [], visitorInfo = {}, conversationMeta = {}) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const contents = [];

    const contextualPrompt = `${SHAMA_SYSTEM_PROMPT}

--- CLIENT CONTEXT ---
Name: ${visitorInfo.name || 'Unknown'}
Phone: ${visitorInfo.phone || 'Not provided'}
Email: ${visitorInfo.email || 'Not provided'}
Location: ${conversationMeta.location || 'Unknown'}
Project Type: ${conversationMeta.project_type || 'Not specified'}
Budget: ${conversationMeta.budget || 'Not discussed'}
Timeline: ${conversationMeta.timeline || 'Not discussed'}

IMPORTANT:
- Be natural and professional
- Collect missing details
- If lead is strong → return JSON with action
`;

    contents.push({
      role: "user",
      parts: [{ text: contextualPrompt }],
    });

    history.slice().reverse().forEach((msg) => {
      if (!msg?.content) return;
      contents.push({
        role: msg.sender_type === "agent" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    });

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const data = await callGeminiWithRetry({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) throw new Error("Empty Gemini response");

    return text;

  } catch (err) {
    console.error("Gemini Error:", err.message);

    // 🔥 SMART FALLBACK RESPONSE
    return JSON.stringify({
      reply: "Thanks for your message 🌿 Our team at Shama Landscapes will get back to you shortly. You can also chat with us directly on WhatsApp for faster assistance.",
      action: "fallback_whatsapp",
      data: {
        show_whatsapp: true
      }
    });
  }
}

// -----------------------------------
// 🚀 API ROUTE
// -----------------------------------
export async function POST(req) {
  try {
    const { conversation_id, message, visitor_info = {} } = await req.json();

    if (!conversation_id || !message) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: conversation } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", conversation_id)
      .single();

    const { data: history } = await supabase
      .from("chat_messages")
      .select("content, sender_type, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false })
      .limit(8);

    const conversationMeta = conversation?.metadata || {};

    const aiResponse = await generateGeminiReply(
      message,
      history || [],
      visitor_info,
      conversationMeta
    );

    let replyText = aiResponse;
    let action = null;
    let actionData = null;

    // -----------------------------------
    // 🧠 PARSE JSON ACTION
    // -----------------------------------
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        replyText = parsed.reply || replyText;
        action = parsed.action;
        actionData = parsed.data;
      }
    } catch {}

    // -----------------------------------
    // 📱 WHATSAPP FALLBACK LINK
    // -----------------------------------
    let whatsappLink = null;

    if (action === "fallback_whatsapp") {
      const phone =
        conversation?.company_whatsapp ||
        process.env.COMPANY_WHATSAPP ||
        "254711706059";

      const text = encodeURIComponent(
        `Hello Shama Landscapes 🌿

I was chatting on your website and would like assistance with my project.

Name: ${visitor_info?.name || 'Not provided'}`
      );

      whatsappLink = `https://wa.me/${phone}?text=${text}`;
    }

    // -----------------------------------
    // 💾 SAVE MESSAGE
    // -----------------------------------
    await supabase.from("chat_messages").insert([
      {
        conversation_id,
        sender_type: "agent",
        sender_name: "Shama",
        content: replyText,
        metadata: { action, actionData }
      }
    ]);

    return Response.json({
      reply: replyText,
      action,
      data: actionData,
      whatsappLink
    });

  } catch (err) {
    console.error("Route Error:", err.message);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}