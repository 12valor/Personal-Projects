import type { PortfolioInquiryRow, PortfolioProjectRow } from "./supabase";

function toIsoString(value: string | Date | null | undefined) {
  if (!value) return "";
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function serializeProject(project: PortfolioProjectRow) {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    role: project.role ?? "",
    year: project.year ?? "",
    description: project.description ?? "",
    image_url: project.image_url ?? "",
    gallery_urls: project.gallery_urls ?? [],
    is_featured: project.is_featured,
    project_url: project.project_url ?? "",
    display_index: project.display_index ?? 0,
    created_at: toIsoString(project.created_at),
    updated_at: toIsoString(project.updated_at),
  };
}

export function serializeInquiry(inquiry: PortfolioInquiryRow) {
  return {
    id: inquiry.id,
    created_at: toIsoString(inquiry.created_at),
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
  };
}
