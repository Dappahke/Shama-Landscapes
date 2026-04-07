// src/app/api/send-chat-summary/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access
);

export async function POST(request) {
  try {
    const { conversation_id, trigger = 'manual' } = await request.json();
    
    if (!conversation_id) {
      return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 });
    }

    // Fetch conversation details
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversation_id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch all messages
    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    if (msgError) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    // Format the comprehensive WhatsApp message
    const summary = formatChatSummary(conversation, messages, trigger);
    
    // Send to company WhatsApp
    await sendToWhatsApp(summary, conversation);

    return NextResponse.json({ 
      success: true, 
      message: 'Chat summary sent to WhatsApp',
      summary_length: summary.length 
    });

  } catch (error) {
    console.error('Chat summary error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatChatSummary(conversation, messages, trigger) {
  const { visitor_name, visitor_email, visitor_phone, created_at, source } = conversation;
  
  // Calculate duration
  const startTime = new Date(created_at);
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 60000); // minutes
  
  // Count messages by type
  const visitorMsgs = messages.filter(m => m.sender_type === 'visitor').length;
  const aiMsgs = messages.filter(m => m.sender_type === 'ai').length;
  const agentMsgs = messages.filter(m => m.sender_type === 'agent').length;
  
  // Format header
  let summary = `*🚨 NEW CHAT SUMMARY - SHAMA LANDSCAPES*\n\n`;
  summary += `*Trigger:* ${trigger.toUpperCase()}\n`;
  summary += `*Time:* ${startTime.toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}\n`;
  summary += `*Duration:* ${duration} minutes\n\n`;
  
  // Visitor details
  summary += `*👤 VISITOR DETAILS*\n`;
  summary += `Name: ${visitor_name || 'Unknown'}\n`;
  summary += `Phone: ${visitor_phone || 'Not provided'}\n`;
  summary += `Email: ${visitor_email || 'Not provided'}\n`;
  summary += `Source: ${source || 'Website Chat'}\n\n`;
  
  // Stats
  summary += `*📊 CHAT STATS*\n`;
  summary += `Total Messages: ${messages.length}\n`;
  summary += `Visitor: ${visitorMsgs} | AI: ${aiMsgs} | Agent: ${agentMsgs}\n\n`;
  
  // Chat transcript
  summary += `*💬 CONVERSATION TRANSCRIPT*\n`;
  summary += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  messages.forEach((msg, index) => {
    const time = new Date(msg.created_at).toLocaleTimeString('en-KE', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    });
    
    const sender = msg.sender_type === 'visitor' 
      ? `*${visitor_name || 'Visitor'}*` 
      : msg.sender_type === 'ai' 
        ? '*🤖 Shama Bot*' 
        : '*👨‍💼 Agent*';
    
    summary += `[${time}] ${sender}:\n`;
    
    if (msg.content) {
      // Truncate very long messages for WhatsApp
      const content = msg.content.length > 500 
        ? msg.content.substring(0, 500) + '...' 
        : msg.content;
      summary += `${content}\n`;
    }
    
    // Handle attachments
    if (msg.metadata?.attachments?.length > 0) {
      msg.metadata.attachments.forEach(att => {
        summary += `📎 [${att.type.toUpperCase()}: ${att.name}]\n`;
        summary += `🔗 ${att.url}\n`;
      });
    }
    
    summary += `\n`;
    
    // WhatsApp has a ~4000 character limit, split if needed
    if (summary.length > 3500 && index < messages.length - 1) {
      summary += `... (${messages.length - index - 1} more messages) ...\n`;
      return summary; // Truncate here
    }
  });
  
  summary += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  summary += `_End of summary | Conversation ID: ${conversation.id}_`;
  
  return summary;
}

async function sendToWhatsApp(summary, conversation) {
  const companyWhatsApp = '254781109052';
  
  // Option 1: Using your existing WhatsApp API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: summary,
      name: 'Chat Summary System',
      phone: companyWhatsApp,
      conversation_id: conversation.id,
      is_summary: true,
      summary_type: 'comprehensive'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send WhatsApp summary');
  }

  // Option 2: Direct WhatsApp Business API call (if you have it)
  // Uncomment and configure if using direct API
  /*
  await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: companyWhatsApp,
      type: 'text',
      text: { body: summary }
    }),
  });
  */

  return true;
}