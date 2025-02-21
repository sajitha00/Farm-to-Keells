import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pyqdueucoboljwdnzwlf.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cWR1ZXVjb2JvbGp3ZG56d2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5ODIzNDMsImV4cCI6MjA1NTU1ODM0M30.4ZI9PugXtfVmOdsFHPUhttFrzCw6nuXk8MBK5FF99Rk"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
