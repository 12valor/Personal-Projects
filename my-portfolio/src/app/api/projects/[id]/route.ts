import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { checkAuth } from "../../../actions";
import { serializeProject } from "../../../../lib/project-mappers";
import { removeLegacySupabasePortfolioImage } from "../../../../lib/supabase-storage";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      category: body.category,
      role: body.role || null,
      year: body.year || null,
      description: body.description || null,
      imageUrl: body.image_url || null,
      galleryUrls: body.gallery_urls ?? [],
      isFeatured: Boolean(body.is_featured),
    },
  });

  return NextResponse.json(serializeProject(project));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await removeLegacySupabasePortfolioImage(project.imageUrl);
  await prisma.project.delete({
    where: { id: project.id },
  });

  return NextResponse.json({ success: true });
}
