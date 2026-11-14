"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe,
  Lock,
} from "lucide-react";
import {
  buildProjectEditorialContent,
  isOptimizableImageSrc,
  optimizeCloudinaryUrl,
  type SerializedProject,
  type ImageDimension,
} from "../lib/project-mappers";
import { useSmoothScroll } from "./SmoothScrollProvider";

interface ZoomImageState {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ProjectShowcaseProps {
  project: SerializedProject;
  previousProject?: SerializedProject | null;
  nextProject?: SerializedProject | null;
  isModal?: boolean;
  initialDimensions?: Record<string, ImageDimension>;
}

function getHostname(url?: string | null): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "live-project.com";
  }
}

// --- FULL-SCREEN ZOOM LIGHTBOX INSPECTOR ---
function ImageZoomLightbox({
  image,
  onClose,
}: {
  image: ZoomImageState;
  onClose: () => void;
}) {
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for zoom & close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.5, 3));
      } else if (e.key === "-" || e.key === "_") {
        setScale((prev) => Math.max(prev - 0.5, 1));
      } else if (e.key === "0") {
        setScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => (prev > 1 ? 1 : 2));
  };

  const highResSrc = optimizeCloudinaryUrl(image.url, 2400);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image zoom inspection"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-xl text-white animate-in fade-in duration-200 select-none"
      onClick={() => {
        if (scale === 1) onClose();
      }}
    >
      {/* Lightbox Top Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">
            Inspector
          </span>
          {image.caption && (
            <span className="text-xs text-zinc-300 truncate max-w-sm sm:max-w-md hidden sm:inline">
              · {image.caption}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-2 hidden md:inline">
            Double-click or click to zoom · Esc to close
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with pan/scroll support */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full overflow-auto flex items-center justify-center p-4 sm:p-8"
      >
        <div
          onClick={handleToggleZoom}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative max-w-full max-h-full cursor-${scale > 1 ? "zoom-out" : "zoom-in"} will-change-transform shadow-2xl`}
        >
          {image.width && image.height ? (
            <Image
              src={highResSrc}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="100vw"
              priority
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-md"
              unoptimized={!isOptimizableImageSrc(highResSrc)}
            />
          ) : (
            <div className="relative w-[90vw] max-w-6xl aspect-[16/10] max-h-[82vh]">
              <Image
                src={highResSrc}
                alt={image.alt}
                fill
                sizes="100vw"
                priority
                className="object-contain rounded-md"
                unoptimized={!isOptimizableImageSrc(highResSrc)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Toolbar Controls */}
      <div
        className="pb-6 pt-2 flex items-center justify-center z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 backdrop-blur-md shadow-2xl text-xs">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            aria-label="Zoom out"
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-zinc-300 px-2 min-w-[3.5rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            aria-label="Zoom in"
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Reset zoom"
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Fit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- EDITORIAL BROWSER WINDOW SHELL ---
function EditorialBrowserFrame({
  src,
  alt,
  url,
  dimension,
  caption,
  onInspect,
  priority = false,
  maxWidth = 1600,
}: {
  src: string;
  alt: string;
  url?: string | null;
  dimension?: ImageDimension;
  caption?: string;
  onInspect: () => void;
  priority?: boolean;
  maxWidth?: number;
}) {
  const optimizedSrc = optimizeCloudinaryUrl(src, maxWidth);
  const unoptimized = !isOptimizableImageSrc(optimizedSrc);
  const hostname = getHostname(url);

  // Compute aspect ratio style if dimensions are known
  const naturalRatioStyle =
    dimension?.width && dimension?.height
      ? { aspectRatio: `${dimension.width} / ${dimension.height}` }
      : { aspectRatio: "16 / 10" };

  return (
    <figure className="group w-full">
      <div
        onClick={onInspect}
        className="relative w-full rounded-xl md:rounded-2xl overflow-hidden border border-border/80 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 cursor-zoom-in"
      >
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/70 select-none">
          {/* macOS 3 dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-red-400/60 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-amber-400/60 transition-colors" />
            <span className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-emerald-400/60 transition-colors" />
          </div>

          {/* Center Address Pill */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-background/80 border border-border/60 text-[11px] font-mono text-muted-foreground max-w-[240px] sm:max-w-md truncate">
            <Lock className="w-2.5 h-2.5 text-muted-foreground/70 shrink-0" />
            <span className="truncate">
              {hostname ? `https://${hostname}` : alt}
            </span>
          </div>

          {/* Right Action Hint */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect</span>
          </div>
        </div>

        {/* Screenshot Image Container at Natural Proportion */}
        <div
          style={naturalRatioStyle}
          className="relative w-full bg-muted/20 overflow-hidden"
        >
          <Image
            src={optimizedSrc}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            decoding={priority ? undefined : "async"}
            unoptimized={unoptimized}
            className="object-contain object-top transition-transform duration-500 group-hover:scale-[1.01]"
          />

          {/* Subtle Hover Cue Banner */}
          <div className="absolute inset-x-0 bottom-0 py-2 px-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-between text-white text-xs">
            <span>Click to inspect at full size</span>
            <span className="font-mono text-[11px] opacity-80">Zoom supported</span>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>{caption}</span>
          <span className="font-mono text-[11px]">Natural resolution</span>
        </figcaption>
      )}
    </figure>
  );
}

// --- MAIN FULL-SCREEN PROJECT SHOWCASE COMPONENT ---
export default function ProjectShowcase({
  project,
  previousProject,
  nextProject,
  isModal = false,
  initialDimensions = {},
}: ProjectShowcaseProps) {
  const router = useRouter();
  const lenis = useSmoothScroll();
  const articleRef = useRef<HTMLElement>(null);
  const [zoomImage, setZoomImage] = useState<ZoomImageState | null>(null);

  const handleClose = useCallback(() => {
    if (isModal) {
      router.back();
    } else {
      router.push("/#work");
    }
  }, [isModal, router]);

  // Lock body scroll while modal or lightbox is active, and pause Lenis to allow natural modal scrolling
  useEffect(() => {
    if (!isModal && !zoomImage) return;

    // Pause Lenis so it does not intercept scroll/wheel events intended for the modal
    lenis?.stop();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus the modal container so Page Up/Down, Space, and Arrow keys scroll it immediately
    if (isModal && articleRef.current) {
      articleRef.current.focus({ preventScroll: true });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [isModal, zoomImage, lenis]);

  // Escape key closes modal if lightbox is not active
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !zoomImage) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModal, zoomImage, handleClose]);

  const editorial = buildProjectEditorialContent(project);

  const heroDimension = project.image_url
    ? initialDimensions[project.image_url]
    : undefined;

  const technologiesDisplay =
    editorial.technologies.length > 0
      ? editorial.technologies
      : [project.category, project.project_url ? "Production Web" : "Product Design"];

  const openHeroZoom = () => {
    if (!project.image_url) return;
    setZoomImage({
      url: project.image_url,
      alt: `${project.title} website screenshot`,
      caption: `${project.title} — Main Interface View`,
      width: heroDimension?.width,
      height: heroDimension?.height,
    });
  };

  const containerClasses = isModal
    ? "fixed inset-0 z-[60] w-full h-[100dvh] overflow-y-auto bg-background text-foreground animate-in fade-in duration-200"
    : "min-h-screen bg-background text-foreground w-full";

  return (
    <article
      ref={articleRef}
      role={isModal ? "dialog" : undefined}
      aria-modal={isModal ? "true" : undefined}
      aria-label={project.title}
      tabIndex={isModal ? -1 : undefined}
      data-lenis-prevent={isModal ? "true" : undefined}
      className={`${containerClasses} font-sans selection:bg-sky-500/20 focus:outline-none`}
    >
      {/* Lightbox Zoom Overlay when activated */}
      {zoomImage && (
        <ImageZoomLightbox
          key={zoomImage.url}
          image={zoomImage}
          onClose={() => setZoomImage(null)}
        />
      )}

      {/* --- STICKY TOP ELEGANT NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          {/* Back Action */}
          <button
            type="button"
            onClick={handleClose}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-full hover:bg-muted/70"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to projects</span>
          </button>

          {/* Center Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground truncate">
            <span className="uppercase tracking-wider font-mono text-[10px]">
              Projects
            </span>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground truncate max-w-[200px] md:max-w-xs">
              {project.title}
            </span>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-2">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full border border-sky-300/40 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
              >
                <span>Live Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {isModal && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close project view (Escape)"
                title="Close (Esc)"
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN EDITORIAL CONTENT CONTAINER --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pb-20">
        {/* --- 1. HERO SECTION --- */}
        <section className="pt-8 sm:pt-12 md:pt-16 pb-12 md:pb-16">
          {/* Eyebrow / Metadata Badges */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {project.category}
            </span>
            {project.year && (
              <>
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
                <span className="font-mono">{project.year}</span>
              </>
            )}
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {editorial.status}
            </span>
          </div>

          {/* Project Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.06] max-w-4xl">
            {project.title}
          </h1>

          {/* Concise Introduction */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {editorial.summary}
          </p>

          {/* Action Row & Tech Tags */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-6 py-3 text-sm font-semibold shadow-sm group"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}

            {project.image_url && (
              <button
                type="button"
                onClick={openHeroZoom}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card hover:bg-muted text-foreground px-5 py-3 text-sm font-medium transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
                <span>Inspect Screenshot</span>
              </button>
            )}

            {/* Scope / Tech tags */}
            {editorial.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border/80 rounded-full bg-muted/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hero Screenshot Frame (Prominently displayed, NO cropping!) */}
          <div className="mt-10 sm:mt-14">
            {project.preview_video_url ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-border/80 bg-black/5 dark:bg-white/5 shadow-xl">
                <video
                  src={optimizeCloudinaryUrl(project.preview_video_url, 1600, "video")}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  poster={
                    project.image_url
                      ? optimizeCloudinaryUrl(project.image_url, 1600)
                      : undefined
                  }
                  className="w-full h-auto block max-h-[80vh] object-contain"
                />
              </div>
            ) : project.image_url ? (
              <EditorialBrowserFrame
                src={project.image_url}
                alt={`${project.title} full screenshot`}
                url={project.project_url}
                dimension={heroDimension}
                caption="Main platform interface view — click to inspect full resolution with zoom"
                onInspect={openHeroZoom}
                priority
                maxWidth={1800}
              />
            ) : (
              <div className="w-full aspect-[16/10] rounded-2xl border border-dashed border-border flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                No Preview Screenshot Available
              </div>
            )}
          </div>
        </section>

        {/* --- 2. PROJECT OVERVIEW & EDITORIAL DETAILS --- */}
        <section
          aria-labelledby="overview-heading"
          className="border-t border-border/70 py-14 sm:py-20"
        >
          <h2 id="overview-heading" className="sr-only">
            Project Overview and Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Metadata Column */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="pb-5 border-b border-border/60">
                <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                  My Role
                </h3>
                <p className="text-sm font-semibold text-foreground">
                  {editorial.role}
                </p>
              </div>

              <div className="pb-5 border-b border-border/60 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Category
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    {project.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Year
                  </h3>
                  <p className="text-sm font-mono font-medium text-foreground">
                    {project.year || "Archive"}
                  </p>
                </div>
              </div>

              <div className="pb-5 border-b border-border/60">
                <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-2">
                  Technologies Used
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                  {technologiesDisplay.join(" · ")}
                </p>
              </div>

              {project.project_url && (
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Live Production URL
                  </h3>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{getHostname(project.project_url)}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </a>
                </div>
              )}
            </aside>

            {/* Right Narrative Column */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600 dark:text-sky-400 mb-3">
                  Overview
                </h3>
                <p className="text-base sm:text-lg leading-[1.8] text-foreground/90 max-w-2xl font-normal">
                  {editorial.overview}
                </p>
              </div>

              <div className="border-t border-border/60 pt-8">
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-3">
                  Challenge
                </h3>
                <p className="text-sm sm:text-base leading-[1.8] text-muted-foreground max-w-2xl">
                  {editorial.challenge}
                </p>
              </div>

              <div className="border-t border-border/60 pt-8">
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-3">
                  Solution & Approach
                </h3>
                <p className="text-sm sm:text-base leading-[1.8] text-muted-foreground max-w-2xl">
                  {editorial.solution}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. VISUAL SHOWCASE (SCREENSHOTS) --- */}
        {editorial.screenshots.length > 0 && (
          <section
            aria-labelledby="visual-showcase-heading"
            className="border-t border-border/70 py-14 sm:py-20"
          >
            <div className="flex items-baseline justify-between gap-4 mb-10">
              <div>
                <h2
                  id="visual-showcase-heading"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                >
                  Visual Showcase
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  High-resolution interface screenshots — click any screen to inspect with zoom
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                0{editorial.screenshots.length} Screens
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
              {editorial.screenshots.map((shot, index) => {
                const useSplitLayout =
                  editorial.screenshots.length >= 3 && index % 3 !== 0;
                const colSpanClass = useSplitLayout
                  ? "md:col-span-6"
                  : "md:col-span-12";
                const shotDimension = initialDimensions[shot.url];

                return (
                  <div key={shot.url} className={colSpanClass}>
                    <EditorialBrowserFrame
                      src={shot.url}
                      alt={
                        shot.caption ||
                        `${project.title} interface view ${index + 1}`
                      }
                      url={project.project_url}
                      dimension={shotDimension}
                      caption={
                        shot.caption ||
                        `Screen 0${index + 1} · Detailed interface view`
                      }
                      onInspect={() =>
                        setZoomImage({
                          url: shot.url,
                          alt: `${project.title} screenshot ${index + 1}`,
                          caption: shot.caption || `Screen 0${index + 1}`,
                          width: shotDimension?.width,
                          height: shotDimension?.height,
                        })
                      }
                      maxWidth={useSplitLayout ? 1200 : 1800}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* --- 4. KEY FEATURES --- */}
        {editorial.features.length > 0 && (
          <section
            aria-labelledby="features-heading"
            className="border-t border-border/70 py-14 sm:py-20"
          >
            <div className="mb-10">
              <h2
                id="features-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                Key Features
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Core capabilities and design highlights built into this platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {editorial.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="border-t border-border/60 pt-5 space-y-2"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                      0{index + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  {feature.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground pl-7">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 5. BOTTOM NAVIGATION --- */}
        <footer className="border-t border-border/70 pt-12 md:pt-16 pb-8">
          <nav
            aria-label="Project navigation"
            className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 sm:gap-4"
          >
            {/* Previous Project */}
            <div className="flex justify-start">
              {previousProject ? (
                <Link
                  href={`/work/${previousProject.slug}`}
                  className="group inline-flex flex-col items-start gap-1 text-left"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    <ArrowLeft className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-1" />
                    Previous project
                  </span>
                  <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {previousProject.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            {/* Back to Projects */}
            <div className="flex sm:justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-colors"
              >
                Back to all projects
              </button>
            </div>

            {/* Next Project */}
            <div className="flex sm:justify-end">
              {nextProject ? (
                <Link
                  href={`/work/${nextProject.slug}`}
                  className="group inline-flex flex-col sm:items-end gap-1 sm:text-right"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Next project
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>
        </footer>
      </main>
    </article>
  );
}

