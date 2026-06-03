import { NextResponse } from "next/server";
import { checkAuth } from "../../../actions";
import { getSupabaseServerClient } from "../../../../lib/supabase";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
