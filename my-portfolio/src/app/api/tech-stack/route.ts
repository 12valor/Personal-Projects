import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { checkAuth } from "../../actions";
import { getSupabaseServerClient, type PortfolioTechStackRow } from "../../../lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data: items, error } = await supabase
      .from("tech_stack")
      .select("*")
      .order("kind", { ascending: true })
      .order("id", { ascending: true })
      .returns<PortfolioTechStackRow[]>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tech stack";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseServerClient();
    const { data: item, error } = await supabase
      .from("tech_stack")
      .insert({
        name: body.name,
        kind: body.kind || "Tools",
        logo_url: body.logo_url,
      })
      .select("*")
      .single<PortfolioTechStackRow>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
