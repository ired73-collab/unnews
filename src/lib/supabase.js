import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vxtxrnkhrdccalnpxngb.supabase.co";
const supabaseKey = "sb_publishable_DvMdfV_vxQmtzytcUqf_fQ_fQteCimC";

export const supabase = createClient(supabaseUrl, supabaseKey);