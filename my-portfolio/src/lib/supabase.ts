import { createClient } from "@supabase/supabase-js";
import {
  isBatchOrHardwareCategory,
  serializeProject,
  slugify,
  type SerializedProject,
} from "./project-mappers";

export interface HardwareComponent {
  name: string;
  role?: string;
  spec?: string;
  count?: number;
  link?: string;
}

export interface ImplementationStep {
  step_number?: number;
  title: string;
  description: string;
  image_url?: string;
  caption?: string;
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface TestingResult {
  test: string;
  result: string;
  verified?: boolean;
}

export interface GalleryMediaItem {
  url: string;
  caption?: string;
  media_type?: "image" | "video";
}

export interface HardwareCaseStudyData {
  status?: string; // e.g. "Working Prototype", "Completed", "Field Tested", "In Development"
  duration?: string;
  layout_preset?: "feature" | "landscape" | "portrait" | "compact";
  problem_statement?: string;
  objectives?: string[];
  system_design?: {
    architecture?: string;
    operating_principle?: string;
    block_diagram_url?: string;
    schematic_url?: string;
  };
  hardware_components?: HardwareComponent[];
  software_tools?: string[];
  implementation_steps?: ImplementationStep[];
  challenges_solutions?: ChallengeSolution[];
  testing_results?: TestingResult[];
  gallery_media?: GalleryMediaItem[];
  reflection_and_improvements?: string;
  seo_title?: string;
  seo_description?: string;
  related_project_ids?: number[];
}

export type PortfolioProjectRow = {
  id: number;
  title: string;
  category: string;
  role: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  preview_video_url?: string | null;
  is_featured: boolean;
  project_url: string | null;
  display_index: number;
  slug?: string | null;
  is_published?: boolean;
  case_study?: HardwareCaseStudyData | null;
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
  kind: string;
  logo_url: string;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

export type PortfolioClientRow = {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_index: number;
  is_visible: boolean;
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

export async function getPublishedProjects(): Promise<SerializedProject[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_index", { ascending: true })
    .order("id", { ascending: false })
    .returns<PortfolioProjectRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map(serializeProject)
    .filter((p) => p.is_published !== false);
}

export async function getProjectDetailBySlugOrId(slugOrId: string): Promise<{
  project: SerializedProject | null;
  previousProject: SerializedProject | null;
  nextProject: SerializedProject | null;
}> {
  const projects = await getPublishedProjects();
  const normalized = decodeURIComponent(slugOrId).trim().toLowerCase();
  const numericId = /^\d+$/.test(normalized) ? Number(normalized) : null;

  const project =
    projects.find((p) => p.slug.toLowerCase() === normalized) ??
    (numericId !== null ? projects.find((p) => p.id === numericId) : undefined) ??
    projects.find((p) => slugify(p.title) === normalized) ??
    null;

  if (!project) {
    return { project: null, previousProject: null, nextProject: null };
  }

  const isDetailGroup = !isBatchOrHardwareCategory(project.category);
  const siblings = projects.filter((p) =>
    isDetailGroup
      ? !isBatchOrHardwareCategory(p.category)
      : p.category.toLowerCase() === project.category.toLowerCase()
  );

  const currentIdx = siblings.findIndex((p) => p.id === project.id);
  const previousProject =
    currentIdx > 0
      ? siblings[currentIdx - 1]
      : siblings.length > 1
        ? siblings[siblings.length - 1]
        : null;
  const nextProject =
    currentIdx >= 0 && currentIdx < siblings.length - 1
      ? siblings[currentIdx + 1]
      : siblings.length > 1
        ? siblings[0]
        : null;

  return { project, previousProject, nextProject };
}
