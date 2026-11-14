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
import { useSmoothScroll } from "./SmoothScrollProvider";
import { ProjectCardReveal } from "./ScrollReveal";

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
  is_featured?: boolean;
}

interface GraphicDesignGalleryProps {
  items: Project[];
  initialDimensions?: Record<string, ImageDimension>;
}

// Curated visual order for balanced editorial flow across 3 columns (desktop) and 2 columns (tablet)
const CURATED_GRAPHIC_ORDER: string[] = [
  "56-main",      // Summer Beach Festival (Portrait)
  "54-main",      // DP Blast 4 (Square)
  "40-main",      // Technowatch AKWE Day 1 (Square)
  "8-main",       // Departmental Shirt (Square)
  "50-main",      // Technowatch Pubmat (Landscape)

  "42-main",      // TUPV Day Trophy (Portrait)
  "52-main",      // DP Blast 3 Take Off (Square)
  "38-main",      // Technowatch AKWE WhatsApp (Square)
  "9-main",       // Club Shirt (Square)

  "46-main",      // Graduation Pubmat Agus (Portrait)
  "48-main",      // Signature Hunt (Square)
  "36-main",      // Technowatch AKWE Golden Mirror (Square)
  "8-variant-0",  // Departmental Shirt Chinese Collar (Square)
  "44-main",      // DP Blast 2 Computer Eng Tech (Square)
];

// --- FULL-SCREEN ARTWORK VIEWER WITH ZOOM, PAN, TOUCH AND KEYBOARD NAVIGATION ---
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
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lenis = useSmoothScroll();

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);

  const currentGraphic = graphics[currentIndex];
  const total = graphics.length;

  const handlePrev = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(Number((prev + 0.5).toFixed(1)), 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(Number((prev - 0.5).toFixed(1)), 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleToggleZoom = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScale((prev) => {
      if (prev > 1) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  }, []);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (scale > 1) {
          handleResetZoom();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleResetZoom();
      }
    };

    lenis?.stop();
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [onClose, handlePrev, handleNext, handleZoomIn, handleZoomOut, handleResetZoom, scale, lenis]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaY) > 20) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  // Mobile touch interactions (pan when zoomed, swipe when 1x, pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      if (scale > 1) {
        setIsDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartRef.current = { ...pan };
      }
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && scale > 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchDistanceRef.current;
      if (Math.abs(delta) > 12) {
        if (delta > 0) {
          setScale((prev) => Math.min(prev + 0.05, 3.5));
        } else {
          setScale((prev) => {
            const next = Math.max(prev - 0.05, 1);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
          });
        }
        touchDistanceRef.current = dist;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    touchDistanceRef.current = null;
    if (scale === 1 && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      if (Math.abs(deltaX) > 45 && Math.abs(deltaY) < 65 && deltaTime < 400) {
        if (deltaX > 0) handlePrev();
        else handleNext();
      }
    }
  };

  if (!currentGraphic) return null;

  const highResUrl = optimizeCloudinaryUrl(currentGraphic.image_url, 2400);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentGraphic.title}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[150] flex flex-col bg-black/95 backdrop-blur-2xl text-white select-none animate-in fade-in duration-200 font-sans"
      onClick={() => {
        if (scale === 1) onClose();
      }}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* --- TOP BAR: SWISS EDITORIAL METADATA & CLOSE --- */}
      <div
        className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-white/10 bg-black/60 backdrop-blur-md z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 sm:gap-4 truncate">
          <span className="font-mono text-xs text-zinc-400 tracking-wider shrink-0">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="w-px h-3.5 bg-white/20 shrink-0" />
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400 shrink-0 hidden sm:inline">
            {currentGraphic.category}
          </span>
          <span className="w-px h-3.5 bg-white/20 shrink-0 hidden sm:inline" />
          <span className="text-sm sm:text-base font-semibold text-white tracking-tight truncate max-w-xs sm:max-w-md">
            {currentGraphic.title}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400 mr-2 hidden lg:inline">
            ← → to browse · Esc to close · drag to pan
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close artwork viewer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- MAIN ARTWORK VIEWPORT (CONTAIN-FIT, ZERO CROPPING) --- */}
      <div
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center p-3 sm:p-6 md:p-8"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Previous Navigation Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous artwork"
            className="absolute left-3 sm:left-6 z-40 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-2xl transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* The Contain-Fit Image with Zoom & Pan */}
        <div
          onClick={scale === 1 ? handleToggleZoom : undefined}
          onDoubleClick={handleToggleZoom}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative max-w-full max-h-full ${
            scale > 1
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-zoom-in"
          } will-change-transform flex items-center justify-center`}
        >
          {currentGraphic.width && currentGraphic.height ? (
            <Image
              src={highResUrl}
              alt={currentGraphic.title}
              width={currentGraphic.width}
              height={currentGraphic.height}
              sizes="100vw"
              priority
              draggable={false}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-md shadow-2xl pointer-events-none select-none"
              unoptimized={!isOptimizableImageSrc(highResUrl)}
            />
          ) : (
            <div
              className="relative w-[90vw] max-w-5xl max-h-[75vh]"
              style={{ aspectRatio: `${currentGraphic.ratio}` }}
            >
              <Image
                src={highResUrl}
                alt={currentGraphic.title}
                fill
                sizes="100vw"
                priority
                draggable={false}
                className="object-contain rounded-md shadow-2xl pointer-events-none select-none"
                unoptimized={!isOptimizableImageSrc(highResUrl)}
              />
            </div>
          )}
        </div>

        {/* Next Navigation Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next artwork"
            className="absolute right-3 sm:right-6 z-40 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-2xl transition-all hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
        {/* Floating Zoom & Pan Toolbar */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 backdrop-blur-md shadow-2xl text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            disabled={scale <= 1}
            aria-label="Zoom out"
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-zinc-300 px-2 min-w-[3.5rem] text-center text-xs">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            disabled={scale >= 3.5}
            aria-label="Zoom in"
            className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetZoom();
            }}
            aria-label="Reset zoom and fit to screen"
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-mono px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Fit</span>
          </button>
        </div>

        {/* Artwork Description if available */}
        {currentGraphic.description && (
          <p className="text-xs text-zinc-300/90 text-center max-w-xl px-6 truncate font-normal">
            {currentGraphic.description}
          </p>
        )}

        {/* Thumbnail Carousel Strip */}
        {total > 1 && (
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto max-w-[94vw] px-4 py-1 no-scrollbar items-center">
            {graphics.map((item, idx) => {
              const thumbSrc = optimizeCloudinaryUrl(item.image_url, 180);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
                    setPan({ x: 0, y: 0 });
                    onNavigate(idx);
                  }}
                  aria-label={`Jump to ${item.title}`}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 border ${
                    isActive
                      ? "ring-2 ring-white border-white opacity-100 scale-105 shadow-lg"
                      : "border-white/20 opacity-40 hover:opacity-85 hover:scale-105"
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
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [loadedDimensions, setLoadedDimensions] = useState<Record<string, { ratio: number }>>({});

  // Flatten projects and gallery variants into individual graphic items with calculated ratios
  const allGraphics = useMemo(() => {
    const list: IndividualGraphicItem[] = [];

    items.forEach((p) => {
      if (p.image_url) {
        const dim = initialDimensions[p.image_url] ?? KNOWN_URL_DIMENSIONS[p.image_url];
        const dynamicRatio = loadedDimensions[p.image_url]?.ratio;
        const ratio = dynamicRatio || dim?.ratio || 1.0;

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
          is_featured: p.is_featured,
        });
      }

      if (p.gallery_urls && Array.isArray(p.gallery_urls)) {
        p.gallery_urls.forEach((url, i) => {
          if (url && url !== p.image_url) {
            const dim = initialDimensions[url] ?? KNOWN_URL_DIMENSIONS[url];
            const dynamicRatio = loadedDimensions[url]?.ratio;
            const ratio = dynamicRatio || dim?.ratio || 1.0;

            list.push({
              id: `${p.id}-variant-${i}`,
              projectId: p.id,
              title: `${p.title} (Variant ${i + 1})`,
              category: p.category,
              image_url: url,
              description: p.description,
              ratio,
              width: dim?.width,
              height: dim?.height,
              is_featured: p.is_featured,
            });
          }
        });
      }
    });

    return list;
  }, [items, initialDimensions, loadedDimensions]);

  // Sort graphics into a curated, balanced sequence that distributes heights harmoniously across columns
  const sortedGraphics = useMemo(() => {
    const orderMap = new Map<string, number>();
    CURATED_GRAPHIC_ORDER.forEach((id, idx) => orderMap.set(id, idx));

    return [...allGraphics].sort((a, b) => {
      const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
      const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
      return idxA - idxB;
    });
  }, [allGraphics]);

  // Dynamic image load handler to ensure zero cropping for any unknown dimensions
  const handleImageLoad = useCallback((url: string, naturalWidth: number, naturalHeight: number) => {
    if (naturalWidth && naturalHeight) {
      const naturalRatio = naturalWidth / naturalHeight;
      setLoadedDimensions((prev) => {
        if (prev[url] && Math.abs(prev[url].ratio - naturalRatio) < 0.01) return prev;
        return { ...prev, [url]: { ratio: naturalRatio } };
      });
    }
  }, []);

  if (sortedGraphics.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">
        <p className="text-sm font-medium">No graphic design projects published yet.</p>
        <p className="text-xs text-muted-foreground/70">
          Add graphic designs, posters, or publication materials from the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10 md:gap-14">
      {/* Full-Screen Artwork Viewer */}
      {viewerIndex !== null && (
        <ArtworkViewer
          key={sortedGraphics[viewerIndex]?.id || viewerIndex}
          graphics={sortedGraphics}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={(newIdx) => setViewerIndex(newIdx)}
        />
      )}

      {/* --- SECTION HEADER: CLEAN & EDITORIAL (SWISS MINIMALISM) --- */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Graphic Designs
        </h3>
        <div className="w-12 h-px bg-border mt-6" />
      </div>

      {/* --- REFINED RESPONSIVE EDITORIAL GALLERY --- */}
      {/* 
        Desktop: 3 columns with balanced heights and no oversized billboard breaks
        Tablet: 2 columns
        Mobile: 1 column
        Consistent gutters, pure aspect ratio containment, and subtle interactions
      */}
      <div className="graphic-project-grid columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 [column-fill:_balance]">
        {sortedGraphics.map((graphic, index) => {
          const optimizedSrc = optimizeCloudinaryUrl(graphic.image_url, 1200);

          return (
            <ProjectCardReveal
              key={graphic.id}
              index={index}
              staggerGroupSize={3}
              className="break-inside-avoid mb-6 md:mb-8"
            >
              <div
                onClick={() => setViewerIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setViewerIndex(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View full size artwork: ${graphic.title}`}
                className="graphic-project-card group relative rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-card hover:border-foreground/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Artwork Container at 100% Exact Aspect Ratio (Contain-Fit, Zero Cropping) */}
                <div
                  className="graphic-project-preview relative w-full overflow-hidden bg-muted/20"
                  style={{
                    aspectRatio: `${graphic.ratio}`,
                  }}
                >
                  <Image
                    src={optimizedSrc}
                    alt={graphic.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                    unoptimized={!isOptimizableImageSrc(optimizedSrc)}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) {
                        handleImageLoad(graphic.image_url, img.naturalWidth, img.naturalHeight);
                      }
                    }}
                  />

                  {/* Elegant Minimalist Hover/Focus Reveal (Swiss Style Scrim) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6 text-white pointer-events-none">
                    <span className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-300 mb-1">
                      {graphic.category}
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold tracking-tight text-white leading-snug drop-shadow-sm">
                      {graphic.title}
                    </h4>
                    {graphic.description && (
                      <p className="text-xs text-zinc-200/90 line-clamp-1 mt-1 font-normal font-sans">
                        {graphic.description}
                      </p>
                    )}
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-300">
                      <Maximize2 className="w-3 h-3 text-white/90" />
                      <span>Inspect artwork</span>
                    </div>
                  </div>
                </div>
              </div>
            </ProjectCardReveal>
          );
        })}
      </div>
    </div>
  );
}
