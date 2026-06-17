import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { checkAuth } from "../../../actions";
import { getSupabaseServerClient, type PortfolioTechStackRow } from "../../../../lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabaseServerClient();
    const { data: item, error } = await supabase
      .from("tech_stack")
      .update({
        name: body.name,
        logo_url: body.logo_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", Number(id))
      .select("*")
      .single<PortfolioTechStackRow>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("tech_stack").delete().eq("id", Number(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete tech stack item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
