import { createClient } from "@supabase/supabase-js";

export async function removeLegacySupabasePortfolioImage(imageUrl?: string | null) {
  if (!imageUrl || !imageUrl.includes("/portfolio/")) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Skipped Supabase Storage cleanup because Supabase env vars are not configured.");
    return;
  }

  const path = imageUrl.split("/portfolio/")[1];
  if (!path) return;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.storage.from("portfolio").remove([path]);

  if (error) {
    console.warn("Supabase Storage cleanup failed:", error.message);
  }
}
