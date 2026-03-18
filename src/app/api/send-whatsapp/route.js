import { createClient } from "@supabase/supabase-js";

// ✅ Secure server-side Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();

    const message = formData.get("Body");
    const from = formData.get("From"); // e.g. whatsapp:+2547xxxxxxx
    const profileName = formData.get("ProfileName") || "WhatsApp";

    if (!from) {
      return new Response("Missing sender", { status: 400 });
    }

    // ✅ Normalize phone
    const phone = from.replace("whatsapp:", "").trim();

    console.log("Incoming WhatsApp:", phone, message);

    // 🔍 Find conversation using phone
    const { data: convo, error: convoError } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("visitor_phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (convoError) {
      console.error("Conversation fetch error:", convoError);
      return new Response("DB error", { status: 500 });
    }

    // 🆕 If no conversation exists → create one
    let conversationId = convo?.id;

    if (!conversationId) {
      const { data: newConv, error: createError } = await supabase
        .from("chat_conversations")
        .insert([{
          visitor_id: crypto.randomUUID(),
          visitor_name: profileName,
          visitor_phone: phone,
          source: "whatsapp",
          status: "active"
        }])
        .select()
        .single();

      if (createError) {
        console.error("Create conversation error:", createError);
        return new Response("Error creating conversation", { status: 500 });
      }

      conversationId = newConv.id;
    }

    // 💬 Save message into chat_messages
    const { error: msgError } = await supabase
      .from("chat_messages")
      .insert([{
        conversation_id: conversationId,
        sender_type: "agent",
        sender_id: phone,
        sender_name: profileName,
        content: message || "[WhatsApp message]"
      }]);

    if (msgError) {
      console.error("Message insert error:", msgError);
      return new Response("Insert error", { status: 500 });
    }

    // 🔄 Update conversation last message
    await supabase
      .from("chat_conversations")
      .update({
        last_message: message,
        last_message_at: new Date(),
        unread_count: 0
      })
      .eq("id", conversationId);

    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Server error", { status: 500 });
  }
}