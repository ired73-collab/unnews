import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vxtxrnkhrdccalnpxngb.supabase.co";
const supabaseKey = "여기에_Publishable_key_붙여넣기";

export const supabase = createClient(supabaseUrl, supabaseKey);