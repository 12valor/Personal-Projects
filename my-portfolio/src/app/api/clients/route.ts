import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { checkAuth } from "../../actions";
import { parseClientInput } from "../../../lib/client-input";
import {
  getSupabaseServerClient,
  type PortfolioClientRow,
} from "../../../lib/supabase";

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .order("display_index", { ascending: true })
      .order("id", { ascending: true })
      .returns<PortfolioClientRow[]>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(clients);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch clients";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = parseClientInput(await request.json());
    const supabase = getSupabaseServerClient();
    const { data: client, error } = await supabase
      .from("clients")
      .insert(input)
      .select("*")
      .single<PortfolioClientRow>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save client";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
