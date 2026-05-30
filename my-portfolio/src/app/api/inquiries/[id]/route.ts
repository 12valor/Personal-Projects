import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { checkAuth } from "../../../actions";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.inquiry.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
