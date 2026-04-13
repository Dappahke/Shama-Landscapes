const MAX_WA_LENGTH = 1500;

export async function sendWhatsAppMessage(payload) {
  // Validate env vars
  if (!process.env.WHATSAPP_API_URL) {
    throw new Error('WHATSAPP_API_URL not defined');
  }
  
  // 🔧 Fixed: Use correct env var name
  const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
  if (!token) {
    throw new Error('WHATSAPP_ACCESS_TOKEN (or WHATSAPP_TOKEN) not defined');
  }

  const message = payload.message || '';
  
  // 🔥 HARD CUT
  const safeMessage =
    message.length > MAX_WA_LENGTH
      ? message.substring(0, MAX_WA_LENGTH) + '\n...'
      : message;

  // 🔧 Fixed: Proper WhatsApp API payload structure
  const whatsappPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: payload.to,
    type: "text",
    text: { 
      body: safeMessage 
    }
  };

  const response = await fetch(process.env.WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(whatsappPayload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || JSON.stringify(data) || 'WhatsApp failed');
  }

  return data;
}