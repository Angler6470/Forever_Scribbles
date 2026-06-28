import { createClient } from '@supabase/supabase-js';

// Force re-deploy

// If these are undefined, the app will crash silently or show nothing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Supabase URL Check:", supabaseUrl ? "Found" : "MISSING");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);