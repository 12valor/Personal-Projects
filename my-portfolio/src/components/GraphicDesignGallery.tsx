"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
} from "lucide-react";
import {
  isOptimizableImageSrc,
  optimizeCloudinaryUrl,
  KNOWN_URL_DIMENSIONS,
  type ImageDimension,
} from "../lib/project-mappers";
import type { Project } from "./WorkGrid";

export interface IndividualGraphicItem {
  id: string;
  projectId: number;
  title: string;
  category: string;
  image_url: string;
  description?: string | null;
  ratio: number;
  width?: number;
  height?: number;
  tags: string[];
}

interface GraphicDesignGalleryProps {
  items: Project[];
  initialDimensions?: Record<string, ImageDimension>;
}

// Derive tags from item content to support real category filtering
function getGraphicTags(item: {
  title: string;
  category: string;
  description?: string | null;
}): string[] {
  const text = `${item.title} ${item.category} ${item.description || ""}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("poster") || text.includes("tupv day")) {
    tags.push("Posters");
  }
  if (text.includes("pubmat") || text.includes("blast")) {
    tags.push("Pubmats");
  }
  if (
    text.includes("festival") ||
    text.includes("day") ||
    text.includes("akwe") ||
    text.includes("graduation") ||
    text.includes("blast")
  ) {
    tags.push("Events");
  }
  if (
    text.includes("shirt") ||
    text.includes("apparel") ||
    text.includes("club shirt") ||
    text.includes("departmental")
  ) {
    tags.push("Apparel");
  }

  if (tags.length === 0) {
    if (item.category.toLowerCase().includes("poster")) tags.push("Posters");
    else tags.push("Pubmats");
  }

  return tags;
}

// --- FULL-SCREEN ARTWORK VIEWER WITH ZOOM, PAN, AND KEYBOARD NAVIGATION ---
interface ArtworkViewerProps {
  graphics: IndividualGraphicItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function ArtworkViewer({
  graphics,
  currentIndex,
  onClose,
  onNavigate,
}: ArtworkViewerProps) {
  const [scale, setScale] = useState<number>(1);
  const touchStartX = useRef<number>(0);
  const currentGraphic = graphics[currentIndex];
  const total = graphics.length;

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (scale > 1) {
          setScale(1);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        setScale((prev) => Math.min(prev + 0.5, 3));
      } else if (e.key === "-" || e.key === "_") {
        setScale((prev) => Math.max(prev - 0.5, 1));
      } else if (e.key === "0") {
        setScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, handlePrev, handleNext, scale]);

  // Mobile touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
  };

  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => (prev > 1 ? 1 : 2));
  };

  if (!currentGraphic) return null;

  const highResUrl = optimizeCloudinaryUrl(currentGraphic.image_url, 2400);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentGraphic.title}
      className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-2xl text-white select-none animate-in fade-in duration-200 font-sans"
      onClick={() => {
        if (scale === 1) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- TOP BAR --- */}
      <div
        className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 sm:gap-4 truncate">
          <span className="font-mono text-xs text-zinc-400 shrink-0">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="w-px h-3.5 bg-white/20 shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 shrink-0 hidden sm:inline">
            {currentGraphic.category}
          </span>
          <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
            {currentGraphic.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400 mr-2 hidden md:inline">
            Use ← → arrows to browse · Esc to close
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- MAIN ARTWORK VIEWPORT (CONTAIN-FIT, ZERO CROPPING) --- */}
      <div className="relative flex-1 w-full overflow-auto flex items-center justify-center p-3 sm:p-6 md:p-10">
        {/* Previous Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous artwork"
            className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-xl transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* The Contain-Fit Image */}
        <div
          onClick={handleToggleZoom}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative max-w-full max-h-full cursor-${scale > 1 ? "zoom-out" : "zoom-in"} will-change-transform shadow-2xl flex items-center justify-center`}
        >
          {currentGraphic.width && currentGraphic.height ? (
            <Image
              src={highResUrl}
              alt={currentGraphic.title}
              width={currentGraphic.width}
              height={currentGraphic.height}
              sizes="100vw"
              priority
              className="max-h-[76vh] w-auto max-w-full object-contain rounded-sm"
              unoptimized={!isOptimizableImageSrc(highResUrl)}
            />
          ) : (
            <div
              className="relative w-[88vw] max-w-5xl max-h-[76vh]"
              style={{ aspectRatio: `${currentGraphic.ratio}` }}
            >
              <Image
                src={highResUrl}
                alt={currentGraphic.title}
                fill
                sizes="100vw"
                priority
                className="object-contain rounded-sm"
                unoptimized={!isOptimizableImageSrc(highResUrl)}
              />
            </div>
          )}
        </div>

        {/* Next Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next artwork"
            className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-xl transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* --- BOTTOM CONTROLS & THUMBNAIL STRIP --- */}
      <div
        className="pb-4 sm:pb-6 pt-2 flex flex-col items-center gap-3 z-30 bg-gradient-to-t from-black via-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Zoom Toolbar */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 backdrop-blur-md shadow-2xl text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScale((prev) => Math.max(prev - 0.5, 1));
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              setScale((prev) => Math.min(prev + 0.5, 3));
            }}
            disabled={scale >= 3}
            aria-label="Zoom in"
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setScale(1);
            }}
            aria-label="Reset zoom"
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Fit</span>
          </button>
        </div>

        {/* Artwork Description if available */}
        {currentGraphic.description && (
          <p className="text-xs text-zinc-300 text-center max-w-xl px-4 truncate">
            {currentGraphic.description}
          </p>
        )}

        {/* Thumbnail Carousel Strip */}
        {total > 1 && (
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto max-w-[92vw] px-4 py-1 no-scrollbar items-center">
            {graphics.map((item, idx) => {
              const thumbSrc = optimizeCloudinaryUrl(item.image_url, 180);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(idx);
                  }}
                  aria-label={`Jump to ${item.title}`}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 border ${
                    isActive
                      ? "ring-2 ring-sky-400 border-sky-400 opacity-100 scale-105 shadow-md"
                      : "border-white/20 opacity-40 hover:opacity-80 hover:scale-105"
                  }`}
                >
                  <Image
                    src={thumbSrc}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized={!isOptimizableImageSrc(thumbSrc)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- MAIN GRAPHIC DESIGN GALLERY COMPONENT ---
export default function GraphicDesignGallery({
  items,
  initialDimensions = {},
}: GraphicDesignGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Flatten projects and gallery variants into individual graphic items with calculated ratios and tags
  const allGraphics = useMemo(() => {
    const list: IndividualGraphicItem[] = [];

    items.forEach((p) => {
      if (p.image_url) {
        const dim = initialDimensions[p.image_url] ?? KNOWN_URL_DIMENSIONS[p.image_url];
        const ratio = dim?.ratio || 1.0;
        const tags = getGraphicTags({
          title: p.title,
          category: p.category,
          description: p.description,
        });

        list.push({
          id: `${p.id}-main`,
          projectId: p.id,
          title: p.title,
          category: p.category,
          image_url: p.image_url,
          description: p.description,
          ratio,
          width: dim?.width,
          height: dim?.height,
          tags,
        });
      }

      if (p.gallery_urls && Array.isArray(p.gallery_urls)) {
        p.gallery_urls.forEach((url, i) => {
          if (url && url !== p.image_url) {
            const dim = initialDimensions[url] ?? KNOWN_URL_DIMENSIONS[url];
            const ratio = dim?.ratio || 1.0;
            const tags = getGraphicTags({
              title: `${p.title} (Variant ${i + 1})`,
              category: p.category,
              description: p.description,
            });

            list.push({
              id: `${p.id}-variant-${i}`,
              projectId: p.id,
              title: `${p.title} (Variant)`,
              category: p.category,
              image_url: url,
              description: p.description,
              ratio,
              width: dim?.width,
              height: dim?.height,
              tags,
            });
          }
        });
      }
    });

    return list;
  }, [items, initialDimensions]);

  // Compute category counts for understated filter tabs
  const filterCategories = useMemo(() => {
    const categories = ["All", "Posters", "Pubmats", "Events", "Apparel"];
    return categories.map((cat) => {
      const count =
        cat === "All"
          ? allGraphics.length
          : allGraphics.filter((g) => g.tags.includes(cat)).length;
      return { name: cat, count };
    });
  }, [allGraphics]);

  // Filtered graphic list
  const filteredGraphics = useMemo(() => {
    if (activeFilter === "All") return allGraphics;
    return allGraphics.filter((g) => g.tags.includes(activeFilter));
  }, [allGraphics, activeFilter]);

  if (allGraphics.length === 0) {
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
    <div className="w-full flex flex-col gap-10 md:gap-14">
      {/* Full-Screen Artwork Viewer */}
      {viewerIndex !== null && (
        <ArtworkViewer
          key={filteredGraphics[viewerIndex]?.id || viewerIndex}
          graphics={filteredGraphics}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={(newIdx) => setViewerIndex(newIdx)}
        />
      )}

      {/* --- SECTION HEADER & INTRODUCTION --- */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto px-4">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-600 dark:text-sky-400">
          Visual Design & Art Direction
        </span>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Graphic Designs
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          A curated exhibition of posters, event publication materials, digital graphics, and apparel created with a focus on bold typography, dynamic composition, and visual storytelling.
        </p>

        {/* --- UNDERSTATED CATEGORY FILTERING --- */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-4">
          {filterCategories.map((filter) => {
            if (filter.count === 0 && filter.name !== "All") return null;
            const isActive = activeFilter === filter.name;
            return (
              <button
                key={filter.name}
                type="button"
                onClick={() => setActiveFilter(filter.name)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-sm scale-105"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                }`}
              >
                <span>{filter.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- REFINED RESPONSIVE MASONRY-STYLE GALLERY --- */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [column-fill:_balance]">
        {filteredGraphics.map((graphic, index) => {
          const optimizedSrc = optimizeCloudinaryUrl(graphic.image_url, 1200);

          return (
            <div
              key={graphic.id}
              onClick={() => setViewerIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setViewerIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${graphic.title}`}
              className="break-inside-avoid mb-6 md:mb-8 group relative rounded-xl md:rounded-2xl overflow-hidden border border-border/80 bg-card hover:border-foreground/30 hover:shadow-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring [contain:layout_style] [content-visibility:auto] [contain-intrinsic-size:auto_380px]"
            >
              {/* Artwork Container at Natural Aspect Ratio (Zero Cropping!) */}
              <div
                className="relative w-full overflow-hidden bg-muted/20"
                style={{
                  aspectRatio: `${graphic.ratio}`,
                }}
              >
                <Image
                  src={optimizedSrc}
                  alt={graphic.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                  loading="lazy"
                  decoding="async"
                  unoptimized={!isOptimizableImageSrc(optimizedSrc)}
                />

                {/* Elegant Hover Overlay Reveal (Unobtrusive & Pure When Inactive) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6 text-white pointer-events-none">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400 mb-1">
                    {graphic.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug drop-shadow-sm">
                    {graphic.title}
                  </h4>
                  {graphic.description && (
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-normal">
                      {graphic.description}
                    </p>
                  )}
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to inspect full size</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
