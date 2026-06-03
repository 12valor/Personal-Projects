import { NextResponse } from "next/server";
import { checkAuth } from "../../actions";
import { serializeInquiry } from "../../../lib/project-mappers";
import { getSupabaseServerClient, type PortfolioInquiryRow } from "../../../lib/supabase";

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<PortfolioInquiryRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(inquiries.map(serializeInquiry));
}

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = getSupabaseServerClient();
  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .insert({
      name: body.name,
      email: body.email,
      message: body.message,
    })
    .select("*")
    .single<PortfolioInquiryRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(serializeInquiry(inquiry), { status: 201 });
}
