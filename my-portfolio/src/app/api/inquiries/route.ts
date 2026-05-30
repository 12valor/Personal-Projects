import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { checkAuth } from "../../actions";
import { serializeInquiry } from "../../../lib/project-mappers";

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries.map(serializeInquiry));
}

export async function POST(request: Request) {
  const body = await request.json();

  const inquiry = await prisma.inquiry.create({
    data: {
      name: body.name,
      email: body.email,
      message: body.message,
    },
  });

  return NextResponse.json(serializeInquiry(inquiry), { status: 201 });
}
