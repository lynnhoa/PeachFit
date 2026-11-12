// ── SUPABASE CONNECTION ──────────────────────────────────────────────────────
// The publishable key is meant to be in the app: it only allows what the Row Level Security
// policies in supabase/schema.sql allow — each signed-in account sees and changes only its own rows.
// To point the app at another project, set VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (e.g. in Vercel).
import { createSync } from "./sync";

const env=(import.meta as any).env||{};
export const SUPABASE_URL=env.VITE_SUPABASE_URL||"https://hmqtmqfgfhhnxqgallmx.supabase.co";
export const SUPABASE_KEY=env.VITE_SUPABASE_PUBLISHABLE_KEY||"sb_publishable_TcMDk1YbOfORUaFlLDWvpw_HY5eei5j";

// The Supabase library is loaded the first time it's needed (signed-in phone, or signing in),
// so the app still opens instantly — also offline.
let client:Promise<any>|null=null;
const getClient=()=>client||(client=import("@supabase/supabase-js").then(({createClient})=>
  createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}))
  .catch(e=>{client=null;throw e;})); // no signal on the first load → try again next time

export const cloud=createSync({getClient,store:localStorage});
