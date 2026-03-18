import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // SERVICE ROLE key, keep secret
);

export const dynamic = 'force-dynamic';

// POST handler
export async function POST(req) {
  try {
    const { fileName, fileType, fileData } = await req.json();

    if (!fileName || !fileData) {
      return new Response(JSON.stringify({ error: 'Missing file data' }), { status: 400 });
    }

    // Remove base64 prefix and convert to buffer
    const base64Data = fileData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Supabase Storage bucket
    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, buffer, {
        contentType: fileType,
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData, error: urlError } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    return new Response(JSON.stringify({ url: publicData.publicUrl }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}