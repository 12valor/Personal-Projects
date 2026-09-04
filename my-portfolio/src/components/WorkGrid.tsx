"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Layers, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import GalleryModal from "./GalleryModal";
import { POP_EASING, ScrollReveal } from "./ScrollReveal";

// --- TYPES ---
export interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[] | null;
  description: string;
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

// Dedicated Smooth Project Image to eliminate pop-in & blinking
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
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className={`transition-opacity duration-500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        sizes={sizes}
        priority={priority}
        unoptimized
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

// Hoisted DetailedProjectList: stable component reference, prevents unmount/remount on re-renders
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
  if (items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="website-project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((project, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.5,
            delay: (i % 6) * 0.07,
            ease: POP_EASING,
          }}
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
          className="website-project-card group cursor-pointer flex flex-col bg-white dark:bg-zinc-950 transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 h-full shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* IMAGE AREA */}
          <div className="website-project-preview relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
            {project.image_url ? (
              <ProjectImage
                src={project.image_url}
                alt={project.title}
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i < 3}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">
                No Preview Available
              </div>
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
              <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center text-sm font-semibold text-foreground">
              View Project
              <ArrowUpRight
                size={16}
                className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// Hoisted VideoCard: stable component reference
interface VideoCardProps {
  video: VideoProject;
  index: number;
  onSelectVideo: (url: string) => void;
}

const VideoCard = React.memo(function VideoCard({
  video,
  index,
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: POP_EASING }}
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
      <div className="video-project-preview relative aspect-[9/16] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/60 shadow-sm transition-all duration-500 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl}
          muted
          playsInline
          loop
          preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div
          className={`absolute inset-0 bg-black/10 transition-colors duration-500 z-10 ${
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
        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium line-clamp-1">
          {video.caption}
        </p>
      </div>
    </motion.div>
  );
});

// Hoisted VideoProjectList: stable component reference
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

// Hoisted GraphicDesignProjectList: stable component reference
interface GraphicDesignProjectListProps {
  items: Project[];
  onProjectClick: (project: Project) => void;
}

const GraphicDesignProjectList = React.memo(function GraphicDesignProjectList({
  items,
  onProjectClick,
}: GraphicDesignProjectListProps) {
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

  return (
    <div className="graphic-project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {items.map((project, i) => {
        const galleryCount =
          project.gallery_urls && project.gallery_urls.length > 0
            ? project.gallery_urls.length
            : project.image_url
            ? 1
            : 0;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.5,
              delay: (i % 8) * 0.07,
              ease: POP_EASING,
            }}
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
            className="graphic-project-card group cursor-pointer flex flex-col bg-white dark:bg-zinc-950 transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 h-full shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* IMAGE / PREVIEW */}
            <div className="graphic-project-preview relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
              {project.image_url ? (
                <ProjectImage
                  src={project.image_url}
                  alt={project.title}
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={i < 4}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs italic">
                  No Preview Available
                </div>
              )}

              {/* Subtle scrim on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Batch / Gallery Indicator Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                  <Layers size={13} className="text-white/90" />
                  <span>{galleryCount > 1 ? `${galleryCount} slides` : "Gallery"}</span>
                </div>
              </div>

              {/* Hover CTA Button in Center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md flex items-center justify-center text-foreground shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>

            {/* CARD DETAILS */}
            <div className="p-5 flex flex-col justify-between flex-grow gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground/80 font-medium">
                    View Gallery
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
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
        router.push(`/work/${project.id}`);
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
          <div className="flex flex-col gap-8 md:gap-12" id="websites">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Websites
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <DetailedProjectList
              items={websiteProjects}
              emptyLabel="No website projects found."
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* SYSTEMS */}
          <div className="flex flex-col gap-8 md:gap-12" id="systems">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Systems
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <DetailedProjectList
              items={systemProjects}
              emptyLabel="No system projects found."
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* GRAPHIC DESIGNS */}
          <div className="flex flex-col gap-8 md:gap-12" id="graphic-designs">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Graphic Designs
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <GraphicDesignProjectList
              items={graphicDesignProjects}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* VIDEO EDITING */}
          <div className="flex flex-col gap-8 md:gap-12" id="video-edits">
            <ScrollReveal className="flex flex-col items-center text-center">
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Video Edits
              </h3>
              <div className="w-12 h-px bg-border mt-6" />
            </ScrollReveal>
            <VideoProjectList onSelectVideo={handleSelectVideo} />
          </div>
        </div>
      </div>

      {/* Hide Scrollbar Style Helper & Marquee CSS */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .marquee-container {
          animation: slide-marquee 40s linear infinite;
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }

        .website-project-preview,
        .video-project-preview,
        .graphic-project-preview {
          backface-visibility: hidden;
          transform: translateZ(0);
          transition: filter 450ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .website-project-grid:has(.website-project-card:hover)
            .website-project-card:not(:hover)
            .website-project-preview {
            filter: grayscale(1);
          }

          .video-project-grid:has(.video-project-card:hover)
            .video-project-card:not(:hover)
            .video-project-preview {
            filter: grayscale(1);
          }

          .graphic-project-grid:has(.graphic-project-card:hover)
            .graphic-project-card:not(:hover)
            .graphic-project-preview {
            filter: grayscale(1);
          }
        }

        .website-project-grid:has(.website-project-card:focus-visible)
          .website-project-card:not(:focus-visible)
          .website-project-preview {
          filter: grayscale(1);
        }

        .video-project-grid:has(.video-project-card:focus-visible)
          .video-project-card:not(:focus-visible)
          .video-project-preview {
          filter: grayscale(1);
        }

        .graphic-project-grid:has(.graphic-project-card:focus-visible)
          .graphic-project-card:not(:focus-visible)
          .graphic-project-preview {
          filter: grayscale(1);
        }

        @keyframes slide-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-container {
            animation: none !important;
          }
          .marquee-wrapper {
            overflow-x: auto;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .marquee-wrapper::-webkit-scrollbar {
            display: none;
          }
          .marquee-wrapper {
            scrollbar-width: none;
          }
          .marquee-content:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
