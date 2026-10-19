import { NextResponse } from "next/server";
import { checkAuth } from "../../actions";
import {
  serializeProject,
  slugify,
  encodeCaseStudyFallback,
} from "../../../lib/project-mappers";
import { revalidatePath } from "next/cache";
import {
  getSupabaseServerClient,
  type PortfolioProjectRow,
} from "../../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAuthenticated = await checkAuth();
  const includeDrafts = isAuthenticated && searchParams.get("drafts") === "true";
  const categoryParam = searchParams.get("category");

  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("display_index", { ascending: true })
    .order("id", { ascending: false });

  if (categoryParam) {
    query = query.ilike("category", `%${categoryParam}%`);
  }

  const { data: projects, error } = await query.returns<PortfolioProjectRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter out drafts for public callers (preserve backwards compatibility where is_published is undefined)
  const serialized = projects
    .map(serializeProject)
    .filter((project) => {
      if (includeDrafts) return true;
      return project.is_published !== false;
    });

  return NextResponse.json(serialized);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Project title is required." }, { status: 400 });
  }

  const title = body.title.trim();
  const rawSlug = body.slug?.trim() || slugify(title);
  const slug = slugify(rawSlug);
  const isPublished = body.is_published !== undefined ? Boolean(body.is_published) : true;
  const caseStudy = body.case_study ?? null;
  const description = body.description || null;

  const supabase = getSupabaseServerClient();

  // Primary payload with new schema columns
  const fullPayload: Record<string, unknown> = {
    title,
    category: body.category || "Hardware",
    role: body.role || null,
    year: body.year || null,
    description,
    image_url: body.image_url || null,
    gallery_urls: body.gallery_urls ?? [],
    preview_video_url: body.preview_video_url || null,
    is_featured: Boolean(body.is_featured),
    project_url: body.project_url || null,
    display_index: body.display_index ?? 0,
    slug: slug || null,
    is_published: isPublished,
    case_study: caseStudy,
  };

  let { data: project, error } = await supabase
    .from("projects")
    .insert(fullPayload)
    .select("*")
    .single<PortfolioProjectRow>();

  // Graceful fallback if database migration has not been applied yet
  if (error && (error.message.includes("column") || error.code === "42703")) {
    console.warn("Retrying project insert with legacy column fallback due to unmigrated columns:", error.message);
    const fallbackDescription = encodeCaseStudyFallback(description || "", caseStudy);

    const fallbackPayload: Record<string, unknown> = {
      title,
      category: body.category || "Hardware",
      role: body.role || null,
      year: body.year || null,
      description: fallbackDescription,
      image_url: body.image_url || null,
      gallery_urls: body.gallery_urls ?? [],
      is_featured: Boolean(body.is_featured),
      project_url: body.project_url || null,
      display_index: body.display_index ?? 0,
    };

    const retryResult = await supabase
      .from("projects")
      .insert(fallbackPayload)
      .select("*")
      .single<PortfolioProjectRow>();

    project = retryResult.data;
    error = retryResult.error;
  }

  if (error || !project) {
    return NextResponse.json({ error: error?.message || "Failed to create project" }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json(serializeProject(project), { status: 201 });
}
