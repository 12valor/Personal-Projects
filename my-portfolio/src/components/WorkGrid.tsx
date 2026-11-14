"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import GalleryModal from "./GalleryModal";
import GraphicDesignGallery from "./GraphicDesignGallery";
import { ProjectCardReveal, ScrollReveal } from "./ScrollReveal";
import {
  isOptimizableImageSrc,
  optimizeCloudinaryUrl,
  type ImageDimension,
  type ImageOrientation,
} from "../lib/project-mappers";

// --- TYPES ---
export interface Project {
  id: number;
  slug?: string;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[] | null;
  description: string;
  role?: string | null;
  year?: string | null;
  project_url?: string | null;
  preview_video_url?: string | null;
  is_featured?: boolean;
}

interface WorkGridProps {
  initialProjects: Project[];
  initialGraphicDimensions?: Record<string, ImageDimension>;
}

export interface VideoProject {
  id: string;
  title: string;
  caption: string;
  videoUrl: string;
  posterUrl: string;
  duration?: string;
}

// --- CONFIGURATION ---
const CATEGORY_MAP: Record<string, string[]> = {
  "Web Design": ["Website", "Components"],
  "Systems": ["System", "POS System", "Management System"],
  "Graphic Design": [
    "Graphic Design",
    "Posters/Pubmats",
    "GFX",
    "Branding",
    "Poster",
    "Pubmat",
    "Graphics",
    "Visual Design",
  ],
  "Video Editing": ["Reels", "Long Form"],
};

const STATIC_VIDEO_PROJECTS: VideoProject[] = [
  {
    id: "v1",
    title: "Video Edit 1",
    caption: "Short Form & Text Animation",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782387591/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_11_nafj9z.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782387591/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_11_nafj9z.jpg",
    duration: "",
  },
  {
    id: "v2",
    title: "Video Edit 2",
    caption: "Dynamic Editing & Sound Design",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389688/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_9_endrwm.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782389688/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_9_endrwm.jpg",
    duration: "",
  },
  {
    id: "v3",
    title: "Video Edit 3",
    caption: "Short Form Content",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_1_lphzsh.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_1_lphzsh.jpg",
    duration: "",
  },
  {
    id: "v4",
    title: "Video Edit 4",
    caption: "Social Media Reel",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_5_ibsr29.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_5_ibsr29.jpg",
    duration: "",
  },
  {
    id: "v5",
    title: "Video Edit 5",
    caption: "Fast Paced Cuts",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_3_l5tzql.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_3_l5tzql.jpg",
    duration: "",
  },
  {
    id: "v6",
    title: "Video Edit 6",
    caption: "Event Highlights",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389729/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_zsuvwl.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_auto/v1782389729/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_zsuvwl.jpg",
    duration: "",
  },
];

// Helper functions declared outside components
function isBatchView(category: string) {
  const lowerCat = category.toLowerCase();
  return (
    lowerCat.includes("poster") ||
    lowerCat.includes("gfx") ||
    lowerCat.includes("graphic") ||
    lowerCat.includes("brand")
  );
}

function getProjectsByCategory(projects: Project[], parentCategory: string): Project[] {
  return projects.filter((project) => {
    const pCat = project.category?.trim() || "";
    const allowedSubs = CATEGORY_MAP[parentCategory] || [];
    const matchExactOrSub =
      pCat === parentCategory ||
      allowedSubs.some((sub) => sub.toLowerCase() === pCat.toLowerCase());

    if (matchExactOrSub) return true;

    if (parentCategory === "Graphic Design") {
      const lower = pCat.toLowerCase();
      return (
        lower.includes("graphic") ||
        lower.includes("poster") ||
        lower.includes("pubmat") ||
        lower.includes("gfx") ||
        lower.includes("brand")
      );
    }

    return false;
  });
}

// Instant, Solid Project Image with Cloudinary + Next.js responsive optimization
function ProjectImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  maxWidth = 1000,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  maxWidth?: number;
}) {
  const optimizedSrc = optimizeCloudinaryUrl(src, maxWidth);
  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      unoptimized={!isOptimizableImageSrc(optimizedSrc)}
    />
  );
}

// WebsiteProjectCard: renders static thumbnail and mounts hover video only on hover-capable desktop
interface WebsiteProjectCardProps {
  project: Project;
  canHover: boolean;
  reducedMotion: boolean;
  onProjectClick: (project: Project) => void;
}

const WebsiteProjectCard = React.memo(function WebsiteProjectCard({
  project,
  canHover,
  reducedMotion,
  onProjectClick,
}: WebsiteProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasHovered, setHasHovered] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const hasVideo = Boolean(
    canHover && !reducedMotion && project.preview_video_url && !videoError
  );

  const handleMouseEnter = () => {
    if (!hasVideo) return;
    if (!hasHovered) setHasHovered(true);
    setIsVideoActive(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Gracefully ignore play interruption/browser policy
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (!hasVideo) return;
    setIsVideoActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const domainLabel = useMemo(() => {
    if (project.project_url) {
      try {
        return new URL(project.project_url).hostname.replace(/^www\./, "");
      } catch {
        // Fallback below
      }
    }
    return `${project.title.toLowerCase().replace(/[^\w]/g, "")}.app`;
  }, [project.project_url, project.title]);

  const summaryText = useMemo(() => {
    if (!project.description) return "";
    const clean = project.description.replace(/\s+/g, " ").trim();
    // If the description has a multi-sentence structure where the first sentence
    // is a complete, well-formed 75-150 character summary (e.g. WebSystemBuilders),
    // extract it so it doesn't get awkwardly clipped at sentence 2 boundary.
    const sentences = clean.match(/[^.!?]+[.!?]+(?:\s|$)/g);
    if (sentences && sentences.length > 1) {
      const s1 = sentences[0].trim();
      if (s1.length >= 75 && s1.length <= 150) {
        return s1;
      }
    }
    return clean;
  }, [project.description]);

  return (
    <div
      onClick={() => onProjectClick(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onProjectClick(project);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`View case study for ${project.title}`}
      className="website-project-card group cursor-pointer flex flex-col bg-card transition-[border-color,box-shadow,transform] duration-300 ease-out rounded-xl sm:rounded-2xl overflow-hidden border border-border/80 dark:border-border/60 hover:border-foreground/25 dark:hover:border-white/25 h-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.6)] hover:-translate-y-1 motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring [contain:layout_style] [content-visibility:auto] [contain-intrinsic-size:auto_420px]"
    >
      {/* BROWSER FRAME HEADER */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-muted/40 dark:bg-muted/30 border-b border-border/70 dark:border-border/50 text-[11px] text-muted-foreground select-none">
        {/* Subtle window controls */}
        <div className="flex items-center gap-1.5 w-10">
          <span className="w-2.5 h-2.5 rounded-full bg-border dark:bg-white/20 group-hover:bg-[#FF5F56]/80 transition-colors duration-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-border dark:bg-white/20 group-hover:bg-[#FFBD2E]/80 transition-colors duration-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-border dark:bg-white/20 group-hover:bg-[#27C93F]/80 transition-colors duration-200" />
        </div>

        {/* Centered domain label pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-background/90 dark:bg-background/70 border border-border/60 dark:border-border/40 text-[11px] font-mono tracking-tight text-muted-foreground/90 max-w-[210px] sm:max-w-[260px] truncate shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Lock className="w-2.5 h-2.5 shrink-0 opacity-45" />
          <span className="truncate">{domainLabel}</span>
        </div>

        {/* Balancing spacer */}
        <div className="w-10 shrink-0" aria-hidden="true" />
      </div>

      {/* IMAGE / VIDEO PREVIEW AREA */}
      <div className="website-project-preview relative aspect-[16/8.2] w-full overflow-hidden bg-muted/20 border-b border-border/70 dark:border-border/50">
        {project.image_url ? (
          <ProjectImage
            src={project.image_url}
            alt={project.title}
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.018] motion-reduce:transform-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            maxWidth={1400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs italic">
            No Preview Available
          </div>
        )}

        {/* HOVER VIDEO OVERLAY: mounted lazily on first desktop hover */}
        {hasVideo && hasHovered && (
          <video
            ref={videoRef}
            src={optimizeCloudinaryUrl(project.preview_video_url!, 1200, "video")}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 pointer-events-none ${
              isVideoActive ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 sm:p-5.5 lg:p-6 flex flex-col flex-1 justify-between gap-5">
        <div className="flex flex-col gap-2.5">
          {/* CATEGORY & YEAR */}
          <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-muted-foreground/80">
            <span className="uppercase font-medium text-foreground/75 dark:text-foreground/80">
              {project.category}
            </span>
            {project.year && (
              <span className="tabular-nums text-muted-foreground/60">
                {project.year}
              </span>
            )}
          </div>

          {/* PROJECT TITLE */}
          <h3 className="text-xl sm:text-[22px] md:text-2xl font-semibold tracking-[-0.015em] text-foreground group-hover:text-foreground transition-colors duration-200 leading-snug">
            {project.title}
          </h3>

          {/* PROJECT DESCRIPTION */}
          {summaryText && (
            <p className="text-[13px] sm:text-[13.5px] lg:text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {summaryText}
            </p>
          )}
        </div>

        {/* CTA ROW */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs mt-auto">
          {/* Primary Action */}
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground group-hover:text-foreground transition-colors">
            <span>View Case Study</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            />
          </span>

          {/* Secondary Action: Independent Live Website */}
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-md bg-muted/40 hover:bg-muted border border-border/40 hover:border-border/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Visit live website for ${project.title}`}
            >
              <span>Live Website</span>
              <ExternalLink size={12} className="shrink-0 opacity-70" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// DetailedProjectList: renders immediately without hydration fade/blink
interface DetailedProjectListProps {
  items: Project[];
  emptyLabel: string;
  canHover: boolean;
  reducedMotion: boolean;
  onProjectClick: (project: Project) => void;
}

const DetailedProjectList = React.memo(function DetailedProjectList({
  items,
  emptyLabel,
  canHover,
  reducedMotion,
  onProjectClick,
}: DetailedProjectListProps) {
  if (items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="website-project-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 lg:gap-10 items-stretch">
      {items.map((project, index) => (
        <ProjectCardReveal
          key={project.id}
          index={index}
          staggerGroupSize={2}
          className="h-full flex flex-col"
        >
          <WebsiteProjectCard
            project={project}
            canHover={canHover}
            reducedMotion={reducedMotion}
            onProjectClick={onProjectClick}
          />
        </ProjectCardReveal>
      ))}
    </div>
  );
});

// VideoCard: renders lightweight lazy Image poster and mounts <video> only on desktop hover
interface VideoCardProps {
  video: VideoProject;
  canHover: boolean;
  reducedMotion: boolean;
  onSelectVideo: (url: string) => void;
}

const VideoCard = React.memo(function VideoCard({
  video,
  canHover,
  reducedMotion,
  onSelectVideo,
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!canHover || reducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!canHover || reducedMotion) return;
    setIsHovered(false);
  };

  return (
    <div
      onClick={() => onSelectVideo(video.videoUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectVideo(video.videoUrl);
        }
      }}
      role="button"
      tabIndex={0}
      className="video-project-card group cursor-pointer flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl [contain:layout_style] [content-visibility:auto] [contain-intrinsic-size:auto_520px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-project-preview relative aspect-[9/16] bg-muted rounded-2xl overflow-hidden border border-border shadow-sm transition-[border-color,box-shadow] duration-300 hover:shadow-md hover:border-black/30 dark:hover:border-white/30">
        <Image
          src={video.posterUrl}
          alt={video.title}
          fill
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={!isOptimizableImageSrc(video.posterUrl)}
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />

        {canHover && !reducedMotion && isHovered && (
          <video
            src={optimizeCloudinaryUrl(video.videoUrl, 720, "video")}
            autoPlay
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        )}

        <div
          className={`absolute inset-0 bg-black/10 transition-colors duration-300 z-10 pointer-events-none ${
            isHovered ? "bg-black/0" : ""
          }`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-black/45 md:bg-white/20 md:backdrop-blur-md flex items-center justify-center text-white shadow-lg">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black/75 md:bg-black/60 md:backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md z-20">
            {video.duration}
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-bold text-base text-foreground group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
          {video.caption}
        </p>
      </div>
    </div>
  );
});

// VideoProjectList: solid render
const VideoProjectList = React.memo(function VideoProjectList({
  canHover,
  reducedMotion,
  onSelectVideo,
}: {
  canHover: boolean;
  reducedMotion: boolean;
  onSelectVideo: (url: string) => void;
}) {
  return (
    <div className="video-project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {STATIC_VIDEO_PROJECTS.map((video, index) => (
        <ProjectCardReveal
          key={video.id}
          index={index}
          staggerGroupSize={3}
          className="h-full flex flex-col"
        >
          <VideoCard
            video={video}
            canHover={canHover}
            reducedMotion={reducedMotion}
            onSelectVideo={onSelectVideo}
          />
        </ProjectCardReveal>
      ))}
    </div>
  );
});

// Compatibility export
export type { ImageDimension, ImageOrientation };

const EMPTY_DIMENSIONS: Record<string, ImageDimension> = {};

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener?.("change", onStoreChange);
      return () => mql.removeEventListener?.("change", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false),
    () => false
  );
}

// Main WorkGrid Component
export default function WorkGrid({
  initialProjects,
  initialGraphicDimensions = EMPTY_DIMENSIONS,
}: WorkGridProps) {
  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const router = useRouter();

  // Keyboard accessibility for Video Modal
  useEffect(() => {
    if (!activeVideoUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideoUrl(null);
    };
    const prevOverflow = document.body.style.overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeVideoUrl]);

  const handleProjectClick = useCallback(
    (project: Project) => {
      if (isBatchView(project.category)) {
        setSelectedProject(project);
        setIsGalleryOpen(true);
      } else {
        router.push(`/work/${project.slug || project.id}`, { scroll: false });
      }
    },
    [router]
  );

  const handleSelectVideo = useCallback((url: string) => {
    setActiveVideoUrl(url);
  }, []);

  const websiteProjects = useMemo(
    () => getProjectsByCategory(initialProjects, "Web Design"),
    [initialProjects]
  );
  const systemProjects = useMemo(
    () => getProjectsByCategory(initialProjects, "Systems"),
    [initialProjects]
  );
  const graphicDesignProjects = useMemo(
    () => getProjectsByCategory(initialProjects, "Graphic Design"),
    [initialProjects]
  );

  return (
    <section
      id="work"
      className="relative px-4 py-14 sm:px-6 md:px-10 lg:px-16 md:py-20 bg-background border-t border-border font-poppins"
    >
      {/* GALLERY MODAL */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={
          selectedProject?.gallery_urls && selectedProject.gallery_urls.length > 0
            ? selectedProject.gallery_urls
            : [selectedProject?.image_url || ""]
        }
        title={selectedProject?.title || "Project"}
      />

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md"
            onClick={() => setActiveVideoUrl(null)}
          >
            <div
              className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 transition-colors z-50"
                aria-label="Close video"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <ScrollReveal className="flex flex-col items-center text-center gap-6 mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tighter text-foreground leading-none">
            Selected Works
          </h2>
          <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
            Browse selected websites, systems, visual layouts, and video edits built across design, motion, and code.
          </p>
        </ScrollReveal>

        {/* SECTIONS */}
        <div className="flex flex-col gap-24 md:gap-32">
          {/* WEBSITES */}
          <div className="flex flex-col gap-8 md:gap-12 scroll-mt-28" id="websites">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Websites
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <DetailedProjectList
              items={websiteProjects}
              emptyLabel="No website projects found."
              canHover={canHover}
              reducedMotion={reducedMotion}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* SYSTEMS */}
          <div className="flex flex-col gap-8 md:gap-12 scroll-mt-28" id="systems">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Systems
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <DetailedProjectList
              items={systemProjects}
              emptyLabel="No system projects found."
              canHover={canHover}
              reducedMotion={reducedMotion}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* GRAPHIC DESIGNS */}
          <div className="flex flex-col gap-8 md:gap-12 scroll-mt-28" id="graphic-designs">
            <GraphicDesignGallery
              items={graphicDesignProjects}
              initialDimensions={initialGraphicDimensions}
            />
          </div>

          {/* VIDEO EDITING */}
          <div className="flex flex-col gap-8 md:gap-12 scroll-mt-28" id="video-edits">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Video Edits
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <VideoProjectList
              canHover={canHover}
              reducedMotion={reducedMotion}
              onSelectVideo={handleSelectVideo}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
