import { createClient } from "@supabase/supabase-js";
import { SHAMA_SYSTEM_PROMPT } from "@/lib/ai/shamaPrompt";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔥 Gemini function (clean + branded)
async function generateGeminiReply(message, history = []) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    // 🧠 Build conversation context
    const contents = [];

    // 1. System prompt as FIRST instruction (IMPORTANT)
    contents.push({
      role: "user",
      parts: [
        {
          text: SHAMA_SYSTEM_PROMPT,
        },
      ],
    });

    // 2. Add chat history (last messages first)
    if (Array.isArray(history)) {
      history
        .slice()
        .reverse()
        .forEach((msg) => {
          if (!msg?.content) return;

          contents.push({
            role: msg.sender_type === "agent" ? "model" : "user",
            parts: [{ text: msg.content }],
          });
        });
    }

    // 3. Current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini API request failed");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("Empty Gemini response");
    }

    return text;
  } catch (err) {
    console.error("Gemini Error:", err.message);

    return "Thanks for your message. Our team will get back to you shortly.";
  }
}

export async function POST(req) {
  try {
    const { conversation_id, message } = await req.json();

    if (!conversation_id || !message) {
      return Response.json(
        { error: "Missing conversation_id or message" },
        { status: 400 }
      );
    }

    // 📥 Fetch conversation history (last 6 messages)
    const { data: history, error: historyError } = await supabase
      .from("chat_messages")
      .select("content, sender_type, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false })
      .limit(6);

    if (historyError) {
      console.error("History fetch error:", historyError.message);
    }

    // 🧠 Generate Shama reply
    const aiReply = await generateGeminiReply(
      message,
      history || []
    );

    // 💾 Save AI response
    const { error: dbError } = await supabase
      .from("chat_messages")
      .insert([
        {
          conversation_id,
          sender_type: "agent",
          sender_id: "shama-ai",
          sender_name: "Shama",
          content: aiReply,
        },
      ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
    }

    return Response.json({ reply: aiReply });
  } catch (err) {
    console.error("Route Error:", err.message);

    return Response.json(
      {
        error: "Server Error",
        details: err.message,
      },
      { status: 500 }
    );
  }
}