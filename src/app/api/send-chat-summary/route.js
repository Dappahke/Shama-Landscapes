import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAX_LENGTH = 1400;

// -----------------------------------
export async function POST(request) {
  try {
    const { conversation_id, trigger = 'manual' } = await request.json();

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'Missing conversation_id' },
        { status: 400 }
      );
    }

    // 🔹 Fetch conversation
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversation_id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // 🔹 Fetch messages
    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    if (msgError || !messages) {
      return NextResponse.json(
        { error: 'Messages not found' },
        { status: 404 }
      );
    }

    // 🔥 Detect high-intent leads
    const isHotLead = detectHotLead(messages);

    // ❌ Stop spam (only send important leads unless manual)
    if (!isHotLead && trigger !== 'manual') {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Not a high-intent lead',
      });
    }

    // 🧠 Build smarter summary
    let summary = formatSummary(conversation, messages, trigger, isHotLead);

    // 🔒 Enforce WhatsApp-safe length
    if (summary.length > MAX_LENGTH) {
      summary =
        summary.substring(0, MAX_LENGTH) +
        '\n\n... (truncated)';
    }

    // 📤 Send
    await sendToWhatsApp(summary);

    return NextResponse.json({
      success: true,
      isHotLead,
      summary_length: summary.length,
    });

  } catch (error) {
    console.error('Chat summary error:', error);

    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}

// -----------------------------------
// 🔥 Detect serious leads
function detectHotLead(messages) {
  const keywords = [
    'price',
    'cost',
    'quote',
    'visit',
    'site',
    'consult',
    'design',
    'plan',
    'project',
  ];

  return messages.some(msg =>
    keywords.some(keyword =>
      msg.content?.toLowerCase().includes(keyword)
    )
  );
}

// -----------------------------------
// 🧠 Professional summary (NOT raw logs)
function formatSummary(conversation, messages, trigger, isHotLead) {
  let output = `🚨 SHAMA LANDSCAPES – NEW LEAD\n\n`;

  output += `Priority: ${isHotLead ? '🔥 High Intent' : 'Normal'}\n`;
  output += `Trigger: ${trigger}\n`;
  output += `Client: ${conversation.visitor_name || 'Unknown'}\n\n`;

  // 🔹 Extract key info
  const fullText = messages.map(m => m.content).join(' ').toLowerCase();

  let intent = 'General Inquiry';
  if (/design|plan/.test(fullText)) intent = 'Design Request';
  if (/price|cost|quote/.test(fullText)) intent = 'Pricing Inquiry';
  if (/visit|site/.test(fullText)) intent = 'Site Visit Request';

  output += `Project Type: ${intent}\n\n`;

  output += `--- CONVERSATION HIGHLIGHTS ---\n\n`;

  let count = 0;

  for (const msg of messages) {
    if (!msg.content) continue;

    const sender =
      msg.sender_type === 'visitor'
        ? '🧑 Client'
        : msg.sender_type === 'agent'
        ? '🤖 AI'
        : '⚙️ System';

    output += `${sender}: ${msg.content}\n\n`;

    count++;
    if (count > 12 || output.length > MAX_LENGTH) break;
  }

  return output;
}

// -----------------------------------
// 📤 Send to WhatsApp (Vercel-safe)
async function sendToWhatsApp(message) {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL ||
        'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/send-whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      name: 'System',
      is_summary: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}