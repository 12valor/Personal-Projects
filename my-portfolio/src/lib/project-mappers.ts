import type { HardwareCaseStudyData, PortfolioInquiryRow, PortfolioProjectRow } from "./supabase";

function toIsoString(value: string | Date | null | undefined) {
  if (!value) return "";
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CASE_STUDY_MARKER = "<!--CASE_STUDY_METADATA-->";

export function extractCaseStudyFallback(description: string | null | undefined): {
  cleanDescription: string;
  caseStudy: HardwareCaseStudyData | null;
} {
  if (!description) {
    return { cleanDescription: "", caseStudy: null };
  }

  if (description.includes(CASE_STUDY_MARKER)) {
    const parts = description.split(CASE_STUDY_MARKER);
    const cleanDescription = parts[0].trim();
    try {
      const caseStudy = JSON.parse(parts[1].trim()) as HardwareCaseStudyData;
      return { cleanDescription, caseStudy };
    } catch {
      return { cleanDescription: description, caseStudy: null };
    }
  }

  return { cleanDescription: description, caseStudy: null };
}

export function encodeCaseStudyFallback(
  cleanDescription: string,
  caseStudy: HardwareCaseStudyData | null | undefined
): string {
  if (!caseStudy || Object.keys(caseStudy).length === 0) {
    return cleanDescription;
  }
  return `${cleanDescription.trim()}\n\n${CASE_STUDY_MARKER}\n${JSON.stringify(caseStudy)}`;
}

export function serializeProject(project: PortfolioProjectRow) {
  let caseStudy = project.case_study ?? null;
  let cleanDescription = project.description ?? "";

  // If case_study is not set on row (e.g. column not yet migrated), check fallback in description
  if (!caseStudy && cleanDescription.includes(CASE_STUDY_MARKER)) {
    const extracted = extractCaseStudyFallback(cleanDescription);
    cleanDescription = extracted.cleanDescription;
    caseStudy = extracted.caseStudy;
  }

  const generatedSlug = project.slug || slugify(project.title) || `project-${project.id}`;

  return {
    id: project.id,
    title: project.title,
    slug: generatedSlug,
    category: project.category,
    role: project.role ?? "",
    year: project.year ?? "",
    description: cleanDescription,
    image_url: project.image_url ?? "",
    gallery_urls: project.gallery_urls ?? [],
    preview_video_url: project.preview_video_url ?? "",
    is_featured: Boolean(project.is_featured),
    is_published: project.is_published ?? true,
    case_study: caseStudy,
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

export type SerializedProject = ReturnType<typeof serializeProject>;
export type SerializedInquiry = ReturnType<typeof serializeInquiry>;

