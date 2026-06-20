import { NextResponse } from "next/server";
import { checkAuth } from "../../actions";
import { serializeProject } from "../../../lib/project-mappers";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../lib/supabase";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_index", { ascending: true })
    .order("id", { ascending: false })
    .returns<PortfolioProjectRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects.map(serializeProject));
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const supabase = getSupabaseServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
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
    })
    .select("*")
    .single<PortfolioProjectRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");

  return NextResponse.json(serializeProject(project), { status: 201 });
}
