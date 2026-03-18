import { createClient } from "@supabase/supabase-js";

// ✅ Secure server-side Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    let formData;
    let body = "";

    // Determine if request is JSON (Postman) or form-data (Twilio)
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      formData = await req.json();
      body = formData.message || formData.Body || "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      formData = await req.formData();
      body = formData.get("Body") || "";
    } else {
      return new Response("Unsupported content-type", { status: 415 });
    }

    // Get sender info
    const from = formData.get?.("From") || formData.phone || formData.from;
    const profileName = formData.get?.("ProfileName") || formData.name || "WhatsApp";

    if (!from) {
      console.error("Missing sender info");
      return new Response("Missing sender", { status: 400 });
    }

    // Normalize phone
    const phone = from.replace("whatsapp:", "").trim();

    console.log("Incoming WhatsApp:", phone, body);

    // 🔍 Find existing conversation
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

    let conversationId = convo?.id;

    // 🆕 Create conversation if none exists
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

    // 💬 Save message
    const { error: msgError } = await supabase
      .from("chat_messages")
      .insert([{
        conversation_id: conversationId,
        sender_type: "visitor", // mark WhatsApp messages as visitor
        sender_id: phone,
        sender_name: profileName,
        content: body || "[WhatsApp message]"
      }]);

    if (msgError) {
      console.error("Message insert error:", msgError);
      return new Response("Insert error", { status: 500 });
    }

    // 🔄 Update conversation last message
    const { error: updateError } = await supabase
      .from("chat_conversations")
      .update({
        last_message: body,
        last_message_at: new Date(),
        unread_count: convo?.unread_count != null ? convo.unread_count + 1 : 1
      })
      .eq("id", conversationId);

    if (updateError) {
      console.error("Conversation update error:", updateError);
    }

    return new Response(JSON.stringify({ status: "ok", conversationId }), { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}