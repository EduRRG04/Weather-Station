import { createClient } from "@supabase/supabase-js";

const supabaseurl = import.meta.env.VITE_SB_URL;
const supabasekey = import.meta.env.VITE_SB_KEY;

export const supabase = createClient(supabaseurl,supabasekey);
