import { NextResponse } from "next/server";
import { checkAuth } from "../../../actions";
import {
  serializeProject,
  slugify,
  encodeCaseStudyFallback,
} from "../../../../lib/project-mappers";
import { removeLegacySupabasePortfolioImage } from "../../../../lib/supabase-storage";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../../lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const title = body.title ? String(body.title).trim() : undefined;
  const rawSlug = body.slug ? String(body.slug).trim() : title ? slugify(title) : undefined;
  const slug = rawSlug ? slugify(rawSlug) : undefined;
  const isPublished = body.is_published !== undefined ? Boolean(body.is_published) : undefined;
  const caseStudy = body.case_study !== undefined ? body.case_study : undefined;
  const description = body.description !== undefined ? body.description : undefined;

  const fullUpdate: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) fullUpdate.title = title;
  if (body.category !== undefined) fullUpdate.category = body.category;
  if (body.role !== undefined) fullUpdate.role = body.role || null;
  if (body.year !== undefined) fullUpdate.year = body.year || null;
  if (description !== undefined) fullUpdate.description = description || null;
  if (body.image_url !== undefined) fullUpdate.image_url = body.image_url || null;
  if (body.gallery_urls !== undefined) fullUpdate.gallery_urls = body.gallery_urls ?? [];
  if (body.preview_video_url !== undefined) fullUpdate.preview_video_url = body.preview_video_url || null;
  if (body.is_featured !== undefined) fullUpdate.is_featured = Boolean(body.is_featured);
  if (body.project_url !== undefined) fullUpdate.project_url = body.project_url || null;
  if (body.display_index !== undefined) fullUpdate.display_index = body.display_index ?? 0;
  if (slug !== undefined) fullUpdate.slug = slug || null;
  if (isPublished !== undefined) fullUpdate.is_published = isPublished;
  if (caseStudy !== undefined) fullUpdate.case_study = caseStudy;

  let { data: project, error } = await supabase
    .from("projects")
    .update(fullUpdate)
    .eq("id", projectId)
    .select("*")
    .single<PortfolioProjectRow>();

  // Graceful fallback if database migration has not been applied yet
  if (error && (error.message.includes("column") || error.code === "42703")) {
    console.warn("Retrying project patch with legacy column fallback due to unmigrated columns:", error.message);
    const fallbackDescription = encodeCaseStudyFallback(
      (description ?? project?.description ?? "") || "",
      caseStudy
    );

    const fallbackUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (title !== undefined) fallbackUpdate.title = title;
    if (body.category !== undefined) fallbackUpdate.category = body.category;
    if (body.role !== undefined) fallbackUpdate.role = body.role || null;
    if (body.year !== undefined) fallbackUpdate.year = body.year || null;
    fallbackUpdate.description = fallbackDescription;
    if (body.image_url !== undefined) fallbackUpdate.image_url = body.image_url || null;
    if (body.gallery_urls !== undefined) fallbackUpdate.gallery_urls = body.gallery_urls ?? [];
    if (body.is_featured !== undefined) fallbackUpdate.is_featured = Boolean(body.is_featured);
    if (body.project_url !== undefined) fallbackUpdate.project_url = body.project_url || null;
    if (body.display_index !== undefined) fallbackUpdate.display_index = body.display_index ?? 0;

    const retryResult = await supabase
      .from("projects")
      .update(fallbackUpdate)
      .eq("id", projectId)
      .select("*")
      .single<PortfolioProjectRow>();

    project = retryResult.data;
    error = retryResult.error;
  }

  if (error || !project) {
    return NextResponse.json({ error: error?.message || "Failed to update project" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath(`/work/${id}`);
  const serialized = serializeProject(project);
  if (serialized.slug) {
    revalidatePath(`/hardware/${serialized.slug}`);
  }

  return NextResponse.json(serialized);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);
  if (Number.isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data: project, error: findError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle<PortfolioProjectRow>();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await removeLegacySupabasePortfolioImage(project.image_url);

  const { error: deleteError } = await supabase.from("projects").delete().eq("id", project.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const serialized = serializeProject(project);

  revalidatePath("/");
  revalidatePath(`/work/${id}`);
  if (serialized.slug) {
    revalidatePath(`/hardware/${serialized.slug}`);
  }

  return NextResponse.json({ success: true });
}
