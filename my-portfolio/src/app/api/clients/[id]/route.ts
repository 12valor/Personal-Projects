import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { checkAuth } from "../../../actions";
import { parseClientInput } from "../../../../lib/client-input";
import {
  getSupabaseServerClient,
  type PortfolioClientRow,
} from "../../../../lib/supabase";

function parseClientId(id: string) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const clientId = parseClientId(id);
    if (!clientId) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const input = parseClientInput(await request.json());
    const supabase = getSupabaseServerClient();
    const { data: client, error } = await supabase
      .from("clients")
      .update(input)
      .eq("id", clientId)
      .select("*")
      .single<PortfolioClientRow>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");
    return NextResponse.json(client);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update client";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const clientId = parseClientId(id);
    if (!clientId) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("clients").delete().eq("id", clientId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete client";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
