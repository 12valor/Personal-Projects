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
  // Portrait Posters & Pubmats
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792450178/eztpvqee2ktlckqzukgd.png": { width: 1587, height: 2245, ratio: 0.7069, orientation: "portrait" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449824/ugbi20jufmjgodh29vcc.png": { width: 1587, height: 2245, ratio: 0.7069, orientation: "portrait" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449859/arkjqhbn5lnc98zcussd.png": { width: 1080, height: 1350, ratio: 0.8, orientation: "portrait" },

  // Widescreen / Landscape Pubmats
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792450069/wxgtwykamtsbsti79hx8.png": { width: 1640, height: 924, ratio: 1.7749, orientation: "landscape" },

  // Square Blast, Apparel & Event Graphics
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449843/njfn8fruzmrf6ozjfkcu.jpg": { width: 3456, height: 3456, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792450102/xyqv3dncjgofey0fid2l.png": { width: 3456, height: 3456, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792450148/k0n9cinanteoillw161o.jpg": { width: 2419, height: 2419, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449975/o7rbaysdklqyjaspv3lc.png": { width: 1800, height: 1800, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445295/ug0qpsrv6kvjevi8rzjx.jpg": { width: 2048, height: 2048, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449657/vtih3308s7zn5zd9gg8i.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792449680/jeo1j1x31bmspfg1af2i.png": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445266/t9jdt3l4adotiyxhuy6z.jpg": { width: 3000, height: 3000, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445475/jfrky0ikmqgeyagknnxd.jpg": { width: 3000, height: 3000, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1788553758/tdbh5mnmpctvaef4knvw.jpg": { width: 4000, height: 4000, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445401/xpcu7zleegn3l8cd2ndd.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445403/d2jf5uucmzqxk7jbktft.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
  "https://res.cloudinary.com/ddjrj0ymx/image/upload/v1792445403/hrrcivt4kizffyg78cnk.jpg": { width: 1080, height: 1080, ratio: 1.0, orientation: "square" },
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

export async function resolveImageDimensions(
  urls: string[]
): Promise<Record<string, ImageDimension>> {
  const result: Record<string, ImageDimension> = {};
  const urlsToProbe = new Set<string>();

  for (const url of urls) {
    if (!url) continue;
    if (KNOWN_URL_DIMENSIONS[url]) {
      result[url] = KNOWN_URL_DIMENSIONS[url];
    } else if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
      urlsToProbe.add(url);
    }
  }

  if (urlsToProbe.size === 0) return result;

  await Promise.allSettled(
    Array.from(urlsToProbe).map(async (url) => {
      const infoUrl = url.replace("/image/upload/", "/image/upload/fl_getinfo/");
      try {
        const res = await fetch(infoUrl, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(4500),
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
        // Ignore timeout/network failures; layout falls back to default aspect ratio.
      }
    })
  );

  return result;
}

export async function resolveGraphicDimensions(
  projects: SerializedProject[]
): Promise<Record<string, ImageDimension>> {
  const graphicCategories = ["graphic", "poster", "pubmat", "gfx", "brand", "visual design"];
  const urls: string[] = [];

  for (const project of projects) {
    const cat = (project.category || "").toLowerCase();
    if (!graphicCategories.some((c) => cat.includes(c))) continue;
    if (project.image_url) urls.push(project.image_url);
    if (Array.isArray(project.gallery_urls)) {
      for (const url of project.gallery_urls) {
        if (url) urls.push(url);
      }
    }
  }

  const resolved = await resolveImageDimensions(urls);
  return { ...KNOWN_URL_DIMENSIONS, ...resolved };
}

export function isBatchOrHardwareCategory(category: string): boolean {
  const lower = (category || "").toLowerCase();
  return (
    lower.includes("poster") ||
    lower.includes("gfx") ||
    lower.includes("graphic") ||
    lower.includes("brand") ||
    lower.includes("pubmat") ||
    lower.includes("hardware") ||
    lower.includes("embedded") ||
    lower.includes("iot") ||
    lower.includes("arduino") ||
    lower.includes("electronics") ||
    lower.includes("robotics") ||
    lower.includes("firmware")
  );
}

export interface ProjectFeatureItem {
  title: string;
  description: string;
}

export interface ProjectEditorialContent {
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  role: string;
  technologies: string[];
  tags: string[];
  features: ProjectFeatureItem[];
  status: string;
  screenshots: Array<{ url: string; caption?: string }>;
}

function cleanNarrativeText(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s*>\s?/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildProjectEditorialContent(
  project: SerializedProject
): ProjectEditorialContent {
  const cs = project.case_study;
  const cleanedDescription = cleanNarrativeText(project.description || "");
  const sentences = splitSentences(cleanedDescription);

  const summary =
    sentences[0] ||
    `${project.title} — ${project.category.toLowerCase()} build designed with a focus on clarity, usability, and dependable execution.`;

  const overview =
    cs?.system_design?.operating_principle?.trim() ||
    cleanedDescription ||
    `${project.title} is a ${project.category.toLowerCase()} project built to deliver a structured, reliable workflow with minimal friction.`;

  const isSystem = project.category.toLowerCase().includes("system");

  const challenge =
    cs?.problem_statement?.trim() ||
    cs?.challenges_solutions?.[0]?.challenge?.trim() ||
    (isSystem
      ? `Structuring multi-step operational records, validation, and role-specific workflows inside ${project.title} without adding unnecessary interface complexity.`
      : `Organizing information hierarchy, responsive layout structure, and clear user journeys for ${project.title} across desktop and mobile viewports.`);

  const solution =
    cs?.system_design?.architecture?.trim() ||
    cs?.challenges_solutions?.[0]?.solution?.trim() ||
    (sentences.length > 1 ? sentences.slice(1).join(" ") : "") ||
    (isSystem
      ? `Designed a clear interface and structured workflow around core tasks so users can navigate, record, and review operational data efficiently.`
      : `Focused on clean typography, straightforward navigation, and a restrained visual system so core content and actions stay immediately accessible.`);

  const role = project.role?.trim() || "Developer & Designer";

  const explicitTech = [
    ...(cs?.software_tools ?? []),
    ...(cs?.hardware_components?.map((item) => item.name) ?? []),
  ]
    .map((item) => item.trim())
    .filter(Boolean);

  const technologies = Array.from(new Set(explicitTech));

  const tags =
    technologies.length > 0
      ? technologies.slice(0, 6)
      : [
          project.category,
          role,
          project.project_url ? "Live Web" : "Product Build",
        ].filter(Boolean);

  const features: ProjectFeatureItem[] = [];

  if (cs?.implementation_steps && cs.implementation_steps.length > 0) {
    for (const step of cs.implementation_steps.slice(0, 6)) {
      if (step.title?.trim() || step.description?.trim()) {
        features.push({
          title: step.title?.trim() || "Key Capability",
          description: step.description?.trim() || "",
        });
      }
    }
  } else if (cs?.objectives && cs.objectives.length > 0) {
    for (const objective of cs.objectives.slice(0, 6)) {
      const text = objective.trim();
      if (!text) continue;
      const colonIdx = text.indexOf(":");
      if (colonIdx > 0 && colonIdx < 48) {
        features.push({
          title: text.slice(0, colonIdx).trim(),
          description: text.slice(colonIdx + 1).trim(),
        });
      } else {
        features.push({
          title: text,
          description: "",
        });
      }
    }
  } else {
    // Derive concise, truthful feature highlights grounded in category & description
    const lowerDesc = cleanedDescription.toLowerCase();
    if (lowerDesc.includes("real-time")) {
      features.push({
        title: "Real-Time Workflow",
        description: "Supports live updates and immediate coordination across active users.",
      });
    }
    if (lowerDesc.includes("analytics") || lowerDesc.includes("computation") || lowerDesc.includes("payroll")) {
      features.push({
        title: "Structured Calculations & Reporting",
        description: "Automates domain calculations and turns raw entries into readable summaries.",
      });
    }
    if (lowerDesc.includes("prototype") || lowerDesc.includes("revamp")) {
      features.push({
        title: "Refined Interface Architecture",
        description: "Reworks layout hierarchy and visual consistency to improve clarity and flow.",
      });
    }

    const baselineFeatures: ProjectFeatureItem[] = [
      {
        title: "Focused Information Hierarchy",
        description: "Prioritizes key content and primary actions with restrained typography and clear spacing.",
      },
      {
        title: "Responsive Layout System",
        description: "Adapts cleanly across desktop, tablet, and mobile viewports without horizontal overflow.",
      },
      {
        title: isSystem ? "Role-Centered Structure" : "Fast Asset Delivery",
        description: isSystem
          ? "Separates day-to-day workflows so each stakeholder sees only relevant actions."
          : "Optimizes images and media loading so pages remain responsive on everyday connections.",
      },
      {
        title: "Maintainable Component Setup",
        description: "Built with reusable patterns so future content and feature updates stay predictable.",
      },
    ];

    for (const item of baselineFeatures) {
      if (features.length >= 4) break;
      if (!features.some((existing) => existing.title === item.title)) {
        features.push(item);
      }
    }
  }

  const seenUrls = new Set<string>();
  const heroPrimaryImage = project.preview_video_url ? "" : project.image_url;
  if (heroPrimaryImage) {
    seenUrls.add(heroPrimaryImage);
  }

  const screenshots: Array<{ url: string; caption?: string }> = [];

  if (cs?.gallery_media && cs.gallery_media.length > 0) {
    for (const item of cs.gallery_media) {
      if (item.media_type === "video" || !item.url || seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      screenshots.push({ url: item.url, caption: item.caption });
    }
  }

  for (const url of project.gallery_urls ?? []) {
    if (!url || seenUrls.has(url)) continue;
    seenUrls.add(url);
    screenshots.push({ url });
  }

  return {
    summary,
    overview,
    challenge,
    solution,
    role,
    technologies,
    tags,
    features,
    status: cs?.status?.trim() || (project.project_url ? "Live" : "Completed"),
    screenshots,
  };
}

