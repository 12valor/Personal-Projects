import { createClient } from "@supabase/supabase-js";

export type PortfolioProjectRow = {
  id: number;
  title: string;
  category: string;
  role: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  is_featured: boolean;
  project_url: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

export type PortfolioInquiryRow = {
  id: number;
  created_at: string | Date | null;
  name: string;
  email: string;
  message: string;
};

export type PortfolioTechStackRow = {
  id: number;
  name: string;
  logo_url: string;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
