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

export type ImageOrientation = "portrait" | "square" | "landscape";

export interface ImageDimension {
  width: number;
  height: number;
  ratio: number;
  orientation: ImageOrientation;
}

export const KNOWN_URL_DIMENSIONS: Record<string, ImageDimension> = {
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445266/t9jdt3l4adotiyxhuy6z.jpg": { width: 3000, height: 3000, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445475/jfrky0ikmqgeyagknnxd.jpg": { width: 3000, height: 3000, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445295/ug0qpsrv6kvjevi8rzjx.jpg": { width: 2048, height: 2048, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445401/xpcu7zleegn3l8cd2ndd.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445403/d2jf5uucmzqxk7jbktft.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445403/hrrcivt4kizffyg78cnk.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1788553758/tdbh5mnmpctvaef4knvw.jpg": { width: 4000, height: 4000, ratio: 1.0, orientation: "square" },
};

export function calculateImageOrientation(
  width: number,
  height: number
): { ratio: number; orientation: ImageOrientation } {
  const ratio = width / height;
  let orientation: ImageOrientation = "square";
  if (ratio < 0.88) orientation = "portrait";
  else if (ratio > 1.18) orientation = "landscape";
  return { ratio, orientation };
}

const OPTIMIZABLE_HOSTS = new Set([
  "images.unsplash.com",
  "i.scdn.co",
  "res.cloudinary.com",
  "drive.google.com",
  "lh3.googleusercontent.com",
  "avatars.githubusercontent.com",
]);

export function isOptimizableImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const { protocol, hostname } = new URL(src);
    if (protocol !== "https:") return false;
    return OPTIMIZABLE_HOSTS.has(hostname) || hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function optimizeCloudinaryUrl(
  url: string,
  maxWidth = 1200,
  kind: "image" | "video" = "image"
): string {
  if (!url) return url;
  const marker = kind === "video" ? "/video/upload/" : "/image/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) {
    return url;
  }

  const [prefix, rest] = url.split(marker);
  if (!rest) return url;

  // Skip if transformations are already present (e.g. w_600,q_auto)
  if (!/^v\d+\//.test(rest)) {
    return url;
  }

  const transform =
    kind === "video"
      ? `q_auto,w_${maxWidth},c_limit`
      : `f_auto,q_auto,w_${maxWidth},c_limit`;

  return `${prefix}${marker}${transform}/${rest}`;
}

export async function resolveGraphicDimensions(
  projects: SerializedProject[]
): Promise<Record<string, ImageDimension>> {
  const result: Record<string, ImageDimension> = { ...KNOWN_URL_DIMENSIONS };
  const graphicCategories = ["graphic", "poster", "pubmat", "gfx", "brand", "visual design"];
  const urlsToProbe = new Set<string>();

  for (const project of projects) {
    const cat = (project.category || "").toLowerCase();
    if (!graphicCategories.some((c) => cat.includes(c))) continue;
    if (project.image_url && !result[project.image_url]) {
      urlsToProbe.add(project.image_url);
    }
    if (Array.isArray(project.gallery_urls)) {
      for (const url of project.gallery_urls) {
        if (url && !result[url]) {
          urlsToProbe.add(url);
        }
      }
    }
  }

  const cloudinaryUrls = Array.from(urlsToProbe).filter(
    (url) => url.includes("res.cloudinary.com") && url.includes("/image/upload/")
  );

  if (cloudinaryUrls.length === 0) return result;

  await Promise.allSettled(
    cloudinaryUrls.map(async (url) => {
      const infoUrl = url.replace("/image/upload/", "/image/upload/fl_getinfo/");
      try {
        const res = await fetch(infoUrl, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(1500),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          output?: { width?: number; height?: number };
          input?: { width?: number; height?: number };
        };
        const width = data.output?.width ?? data.input?.width;
        const height = data.output?.height ?? data.input?.height;
        if (width && height) {
          const { ratio, orientation } = calculateImageOrientation(width, height);
          result[url] = { width, height, ratio, orientation };
        }
      } catch {
        // Ignore timeout/network failures; client onLoad remains as fallback.
      }
    })
  );

  return result;
}

