import type { Inquiry, Project } from "../generated/prisma/client";

export function serializeProject(project: Project) {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    role: project.role ?? "",
    year: project.year ?? "",
    description: project.description ?? "",
    image_url: project.imageUrl ?? "",
    gallery_urls: project.galleryUrls,
    is_featured: project.isFeatured,
    project_url: project.projectUrl ?? "",
    created_at: project.createdAt.toISOString(),
    updated_at: project.updatedAt.toISOString(),
  };
}

export function serializeInquiry(inquiry: Inquiry) {
  return {
    id: inquiry.id,
    created_at: inquiry.createdAt.toISOString(),
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
  };
}
