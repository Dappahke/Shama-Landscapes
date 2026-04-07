// src/app/api/send-whatsapp/route.js
import { NextResponse } from 'next/server';

const COMPANY_WHATSAPP_NUMBER =
  process.env.COMPANY_WHATSAPP_NUMBER || '254781109052';

export async function POST(request) {
  try {
    const {
      message,
      name,
      phone,
      email,
      conversation_id,
      is_summary = false,
      attachments = [],
    } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // ----------------------------
    // FORMAT MESSAGE
    // ----------------------------
    let formattedMessage = '';

    if (is_summary) {
      formattedMessage = message;
    } else {
      formattedMessage =
        `*🚨 New Message - Shama Chat*\n\n` +
        `*From:* ${name || 'Anonymous'}\n` +
        `*Phone:* ${phone || 'N/A'}\n` +
        `*Email:* ${email || 'N/A'}\n` +
        `*Time:* ${new Date().toLocaleString('en-KE', {
          timeZone: 'Africa/Nairobi',
        })}\n\n` +
        `*Message:*\n${message}\n\n` +
        (attachments?.length > 0
          ? `*Attachments:* ${attachments.length} file(s)\n`
          : '') +
        `_Reply via WhatsApp_`;
    }

    // ----------------------------
    // TWILIO CREDENTIALS
    // ----------------------------
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // whatsapp:+14155238886

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // ----------------------------
    // CLEAN PHONE NUMBER (IMPORTANT FIX)
    // ----------------------------
    const cleanNumber = String(COMPANY_WHATSAPP_NUMBER).replace(/[^0-9]/g, '');

    const toNumber = `whatsapp:+${cleanNumber}`;

    // ----------------------------
    // TWILIO REQUEST
    // ----------------------------
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams({
      To: toNumber,
      From: fromNumber,
      Body: formattedMessage,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio Error:', data);
      throw new Error(data.message || 'Twilio API error');
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp sent via Twilio',
      sid: data.sid,
      to: toNumber,
    });
  } catch (error) {
    console.error('WhatsApp Error:', error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}