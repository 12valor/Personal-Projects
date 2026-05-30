import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { checkAuth } from "../../actions";
import { serializeProject } from "../../../lib/project-mappers";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { id: "desc" },
  });

  return NextResponse.json(projects.map(serializeProject));
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const project = await prisma.project.create({
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

  return NextResponse.json(serializeProject(project), { status: 201 });
}
