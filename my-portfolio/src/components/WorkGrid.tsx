"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Layers, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import GalleryModal from "./GalleryModal";

// --- TYPES ---
export interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[] | null;
  description: string;
  preview_video_url?: string | null;
}

interface WorkGridProps {
  initialProjects: Project[];
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
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782387591/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_11_nafj9z.jpg",
    duration: "",
  },
  {
    id: "v2",
    title: "Video Edit 2",
    caption: "Dynamic Editing & Sound Design",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389688/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_9_endrwm.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782389688/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_9_endrwm.jpg",
    duration: "",
  },
  {
    id: "v3",
    title: "Video Edit 3",
    caption: "Short Form Content",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_1_lphzsh.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_1_lphzsh.jpg",
    duration: "",
  },
  {
    id: "v4",
    title: "Video Edit 4",
    caption: "Social Media Reel",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_5_ibsr29.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_5_ibsr29.jpg",
    duration: "",
  },
  {
    id: "v5",
    title: "Video Edit 5",
    caption: "Fast Paced Cuts",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_3_l5tzql.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782389691/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_3_l5tzql.jpg",
    duration: "",
  },
  {
    id: "v6",
    title: "Video Edit 6",
    caption: "Event Highlights",
    videoUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/v1782389729/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_zsuvwl.mp4",
    posterUrl:
      "https://res.cloudinary.com/ddjrj0ymx/video/upload/w_600,h_1067,c_fill,q_auto,f_jpg/v1782389729/1110_2_-copy_1_-copy_1_-copy-copy-copy-cop_zsuvwl.jpg",
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

// Instant, Solid Project Image (no opacity toggle or blanking)
function ProjectImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}

// WebsiteProjectCard: renders static thumbnail and crossfades to video on hover
interface WebsiteProjectCardProps {
  project: Project;
  canHover: boolean;
  onProjectClick: (project: Project) => void;
}

const WebsiteProjectCard = React.memo(function WebsiteProjectCard({
  project,
  canHover,
  onProjectClick,
}: WebsiteProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const hasVideo = Boolean(project.preview_video_url && !videoError);

  const handleMouseEnter = () => {
    if (!canHover || !hasVideo) return;
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
    if (!canHover || !hasVideo) return;
    setIsVideoActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

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
      className="website-project-card group cursor-pointer flex flex-col bg-card transition-all duration-300 rounded-2xl md:rounded-3xl overflow-hidden border border-border hover:border-black/30 dark:hover:border-white/30 h-full shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* IMAGE / VIDEO PREVIEW AREA */}
      <div className="website-project-preview relative aspect-[16/10] overflow-hidden bg-muted border-b border-border/60">
        {project.image_url ? (
          <ProjectImage
            src={project.image_url}
            alt={project.title}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
            No Preview Available
          </div>
        )}

        {/* HOVER VIDEO OVERLAY */}
        {hasVideo && (
          <video
            ref={videoRef}
            src={project.preview_video_url!}
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
      <div className="p-6 md:p-8 flex flex-col flex-grow justify-between gap-6">
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {project.category}
            </p>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-black dark:group-hover:text-white transition-colors">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center text-sm font-semibold text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors">
          View Project
          <ArrowUpRight
            size={16}
            className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </div>
    </div>
  );
});

// DetailedProjectList: renders immediately without hydration fade/blink
interface DetailedProjectListProps {
  items: Project[];
  emptyLabel: string;
  onProjectClick: (project: Project) => void;
}

const DetailedProjectList = React.memo(function DetailedProjectList({
  items,
  emptyLabel,
  onProjectClick,
}: DetailedProjectListProps) {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="website-project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((project) => (
        <WebsiteProjectCard
          key={project.id}
          project={project}
          canHover={canHover}
          onProjectClick={onProjectClick}
        />
      ))}
    </div>
  );
});

// VideoCard: solid, immediate render without opacity flash
interface VideoCardProps {
  video: VideoProject;
  index: number;
  onSelectVideo: (url: string) => void;
}

const VideoCard = React.memo(function VideoCard({
  video,
  onSelectVideo,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
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
      className="video-project-card group cursor-pointer flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-project-preview relative aspect-[9/16] bg-muted rounded-2xl overflow-hidden border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-black/30 dark:hover:border-white/30">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          muted
          playsInline
          loop
          preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className={`absolute inset-0 bg-black/10 transition-colors duration-300 z-10 ${
            isHovered ? "bg-black/0" : ""
          }`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
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
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md z-20">
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
  onSelectVideo,
}: {
  onSelectVideo: (url: string) => void;
}) {
  return (
    <div className="video-project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {STATIC_VIDEO_PROJECTS.map((video, i) => (
        <VideoCard
          key={video.id}
          video={video}
          index={i}
          onSelectVideo={onSelectVideo}
        />
      ))}
    </div>
  );
});

// GraphicDesignCollage: Orientation-aware editorial collage that preserves natural image dimensions
export type ImageOrientation = "portrait" | "square" | "landscape";

export interface ImageDimension {
  width: number;
  height: number;
  ratio: number;
  orientation: ImageOrientation;
}

const KNOWN_DIMENSIONS: Record<number, ImageDimension> = {
  8: { width: 3000, height: 3000, ratio: 1.0, orientation: "square" },
  36: { width: 2048, height: 2048, ratio: 1.0, orientation: "square" },
  9: { width: 4000, height: 4000, ratio: 1.0, orientation: "square" },
};

function calculateOrientation(width: number, height: number): { ratio: number; orientation: ImageOrientation } {
  const ratio = width / height;
  let orientation: ImageOrientation = "square";
  if (ratio < 0.88) orientation = "portrait";
  else if (ratio > 1.18) orientation = "landscape";
  return { ratio, orientation };
}

interface GraphicDesignProjectListProps {
  items: Project[];
  onProjectClick: (project: Project) => void;
}

const GraphicDesignProjectList = React.memo(function GraphicDesignProjectList({
  items,
  onProjectClick,
}: GraphicDesignProjectListProps) {
  const [dimensions, setDimensions] = useState<Record<number, ImageDimension>>(() => ({
    ...KNOWN_DIMENSIONS,
  }));

  // Probe image dimensions client-side for dynamic/newly uploaded projects
  useEffect(() => {
    items.forEach((p) => {
      if (!p.image_url || dimensions[p.id]) return;
      const img = new window.Image();
      img.src = p.image_url;
      const onDone = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const { ratio, orientation } = calculateOrientation(img.naturalWidth, img.naturalHeight);
        setDimensions((prev) => ({
          ...prev,
          [p.id]: {
            width: img.naturalWidth,
            height: img.naturalHeight,
            ratio,
            orientation,
          },
        }));
      };
      if (img.complete) onDone();
      else img.onload = onDone;
    });
  }, [items, dimensions]);

  if (items.length === 0) {
    return (
      <div className="h-36 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed border-border rounded-2xl p-6 text-center">
        <p className="text-sm font-medium">No graphic design projects published yet.</p>
        <p className="text-xs text-muted-foreground/70">
          Add graphic designs, posters, or branding mockups from the admin panel.
        </p>
      </div>
    );
  }

  const total = items.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-start grid-flow-row-dense">
      {items.map((project) => {
        const dim = dimensions[project.id];
        const orientation = dim?.orientation || "square";
        const ratio = dim?.ratio || 1.0;

        const galleryCount =
          project.gallery_urls && project.gallery_urls.length > 0
            ? project.gallery_urls.length
            : project.image_url
            ? 1
            : 0;

        // Auto column span based on orientation and layout context
        let colSpanClass = "col-span-1 sm:col-span-1 lg:col-span-4";
        let titleSizeClass = "text-lg sm:text-xl lg:text-2xl";

        if (orientation === "landscape") {
          if (ratio >= 2.0) {
            // Ultra-wide banner: full width
            colSpanClass = "col-span-1 sm:col-span-2 lg:col-span-12";
            titleSizeClass = "text-xl sm:text-2xl lg:text-3xl max-w-2xl";
          } else {
            // Standard landscape: spans 8 columns on desktop
            colSpanClass = "col-span-1 sm:col-span-2 lg:col-span-8";
            titleSizeClass = "text-xl sm:text-2xl lg:text-3xl max-w-xl";
          }
        } else if (orientation === "portrait") {
          // Portrait (vertical poster/pubmat): spans 4 columns on desktop
          colSpanClass = "col-span-1 sm:col-span-1 lg:col-span-4";
          titleSizeClass = "text-lg sm:text-xl lg:text-2xl";
        } else {
          // Square:
          if (total === 2) {
            colSpanClass = "col-span-1 sm:col-span-1 lg:col-span-6";
          } else {
            colSpanClass = "col-span-1 sm:col-span-1 lg:col-span-4";
          }
          titleSizeClass = "text-lg sm:text-xl lg:text-2xl";
        }

        return (
          <div
            key={project.id}
            onClick={() => onProjectClick(project)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onProjectClick(project);
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              aspectRatio: `${ratio}`,
              maxHeight: "720px",
              minHeight: "260px",
            }}
            className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl md:rounded-3xl border border-border/60 bg-muted/20 backdrop-blur-sm transition-all duration-500 hover:border-border hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full ${colSpanClass}`}
          >
            {/* Background Artwork - Uncropped & Perfectly Fitted */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight && !dimensions[project.id]) {
                      const { ratio: r, orientation: o } = calculateOrientation(
                        img.naturalWidth,
                        img.naturalHeight
                      );
                      setDimensions((prev) => ({
                        ...prev,
                        [project.id]: {
                          width: img.naturalWidth,
                          height: img.naturalHeight,
                          ratio: r,
                          orientation: o,
                        },
                      }));
                    }
                  }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 66vw, 100vw"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/40 text-muted-foreground/30">
                  <Layers className="w-16 h-16 stroke-1" />
                </div>
              )}

              {/* Gradient Scrim for high contrast text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 pointer-events-none transition-opacity duration-300 group-hover:from-black/92 group-hover:via-black/45" />
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-black/50 backdrop-blur-md text-white/90 border border-white/10 shadow-sm">
                {project.category}
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 flex items-center gap-1.5">
              {/* Orientation Tag */}
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-black/45 backdrop-blur-md text-white/75 border border-white/10 shadow-sm">
                {orientation}
              </span>

              {/* Gallery Slide Count */}
              {galleryCount > 1 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                  <Layers size={13} className="text-white/80" />
                  <span>{galleryCount} slides</span>
                </div>
              )}
            </div>

            {/* Hover Center Indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-md flex items-center justify-center text-foreground shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <ArrowUpRight size={20} />
              </div>
            </div>

            {/* Bottom Text Overlay */}
            <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col gap-1.5">
              <h3
                className={`font-semibold tracking-tight text-white leading-tight drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none ${titleSizeClass}`}
              >
                {project.title}
              </h3>
              {project.description && (
                <p className="text-xs sm:text-sm text-white/80 line-clamp-1 max-w-xl font-normal leading-relaxed">
                  {project.description}
                </p>
              )}
              <div className="flex items-center text-xs font-medium text-white/90 gap-1 mt-1 transition-colors group-hover:text-white">
                <span>View in Lightbox</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

// Main WorkGrid Component
export default function WorkGrid({ initialProjects }: WorkGridProps) {
  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const router = useRouter();

  // Keyboard accessibility for Video Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideoUrl(null);
    };
    if (activeVideoUrl) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeVideoUrl]);

  const handleProjectClick = useCallback(
    (project: Project) => {
      if (isBatchView(project.category)) {
        setSelectedProject(project);
        setIsGalleryOpen(true);
      } else {
        router.push(`/work/${project.id}`, { scroll: false });
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
      className="relative px-4 py-14 md:px-16 md:py-20 bg-background border-t border-border font-poppins"
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
        <div className="flex flex-col items-center text-center gap-6 mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tighter text-foreground leading-none">
            Selected Works
          </h2>
          <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
            Browse selected websites, systems, visual layouts, and video edits built across design, motion, and code.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="flex flex-col gap-24 md:gap-32">
          {/* WEBSITES */}
          <div className="flex flex-col gap-8 md:gap-12" id="websites">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Websites
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </div>
            <DetailedProjectList
              items={websiteProjects}
              emptyLabel="No website projects found."
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* SYSTEMS */}
          <div className="flex flex-col gap-8 md:gap-12" id="systems">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Systems
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </div>
            <DetailedProjectList
              items={systemProjects}
              emptyLabel="No system projects found."
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* GRAPHIC DESIGNS */}
          <div className="flex flex-col gap-8 md:gap-12" id="graphic-designs">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Graphic Designs
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </div>
            <GraphicDesignProjectList
              items={graphicDesignProjects}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* VIDEO EDITING */}
          <div className="flex flex-col gap-8 md:gap-12" id="video-edits">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Video Edits
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </div>
            <VideoProjectList onSelectVideo={handleSelectVideo} />
          </div>
        </div>
      </div>

    </section>
  );
}
