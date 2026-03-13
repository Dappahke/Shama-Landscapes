import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Chat functionality will use fallback mode.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    }
);

// Test connection on init
supabase.from('chat_conversations').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
        if (error) {
            console.warn('Supabase connection test failed:', error.message);
        } else {
            console.log('Supabase chat connection ready');
        }
    });

export default supabase;