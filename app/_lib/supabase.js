import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warn early in the client bundle if envs are missing.
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars are not configured.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
