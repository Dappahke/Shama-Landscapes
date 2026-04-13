// test-whatsapp.js - Hardcoded version
// Replace these values with your actual credentials

const WHATSAPP_API_URL = 'https://graph.facebook.com/v25.0/1071980875993865/messages';
const WHATSAPP_ACCESS_TOKEN = 'EAA2xwW2Fl84BRMUZBUZClACURWXEGGzOMkSBxvZC55f7wOKIpDkreB5HUytdNnRtJMmEgHFc9YnuU1YEpu5yuFdUhqtbQxWSIVvoZAX6mfRrHZAoXdI02U2pRIuxKjaYEew8I1mIVgmhZAXtWZAIjt8G72rMDwEA69h5V0fZCf2famqBjEWGrXiZAcj4EOcjZCy3PtTnYHFbQ9LSzMHIOlZAIAVBz2u7Ij9Nq58eiV3Nw5jZADqFFpcMW2OA0sTALjNYYbEt5qLeHxaJ88d9r51oozdbOSSTJgv8h9G4S7X6F3QZD';
const COMPANY_WHATSAPP = '254781109052';

async function test() {
  const message = `📋 *TEST MESSAGE*

This is a test from Shama LiveChat
Time: ${new Date().toLocaleString()}`;

  try {
    console.log('📱 Sending to:', COMPANY_WHATSAPP);
    
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: COMPANY_WHATSAPP,
        type: "text",
        text: { body: message }
      })
    });

    const data = await response.json();
    console.log('📊 Status:', response.status);
    console.log('📥 Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ SUCCESS! Check your WhatsApp.');
    } else {
      console.error('❌ FAILED:', data.error?.message || 'Unknown error');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();