import AfricasTalking from 'africastalking';

const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME || 'sandbox',
});

export async function sendSMS({ to, message }) {
  try {
    // Format number (remove leading 0, add +254)
    const formattedNumber = to.startsWith('0') 
      ? `+254${to.substring(1)}` 
      : to.startsWith('+') ? to : `+254${to}`;

    const result = await AT.SMS.send({
      to: [formattedNumber],
      message: message.substring(0, 160), // SMS limit
      from: process.env.AT_SENDER_ID || 'Shama',
    });

    console.log('✅ SMS sent:', result);
    return { success: true, result };
  } catch (err) {
    console.error('❌ SMS failed:', err.message);
    throw err;
  }
}