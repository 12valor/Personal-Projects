import { NextResponse } from "next/server";
import { checkAuth } from "../../../actions";
import { serializeProject } from "../../../../lib/project-mappers";
import { removeLegacySupabasePortfolioImage } from "../../../../lib/supabase-storage";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../../lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const supabase = getSupabaseServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .update({
      title: body.title,
      category: body.category,
      role: body.role || null,
      year: body.year || null,
      description: body.description || null,
      image_url: body.image_url || null,
      gallery_urls: body.gallery_urls ?? [],
      is_featured: Boolean(body.is_featured),
      project_url: body.project_url || null,
      display_index: body.display_index ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", Number(id))
    .select("*")
    .single<PortfolioProjectRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath(`/work/${id}`);

  return NextResponse.json(serializeProject(project));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data: project, error: findError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", Number(id))
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

  revalidatePath("/");
  revalidatePath(`/work/${id}`);

  return NextResponse.json({ success: true });
}
