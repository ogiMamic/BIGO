import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function testSupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables:");
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL:",
      supabaseUrl ? "defined" : "undefined"
    );
    console.error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      supabaseKey ? "defined" : "undefined"
    );
    return false;
  }

  console.log("Using Supabase URL:", supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Try a simple query
    const { data, error } = await supabase.from("teams").select("*").limit(1);

    if (error) {
      console.error("Supabase query failed:", error);
      return false;
    }

    console.log("Supabase connection successful:", data);
    return true;
  } catch (error) {
    console.error("Supabase connection failed:", error);
    return false;
  }
}

testSupabaseConnection();
