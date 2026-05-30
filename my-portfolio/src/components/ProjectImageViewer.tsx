"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectImageViewerProps {
  imageUrl: string;
  galleryUrls?: string[] | null;
  title: string;
}

export default function ProjectImageViewer({ imageUrl, galleryUrls, title }: ProjectImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine the main image with the gallery images, filtering out duplicates and empty strings
  const allImages = Array.from(new Set([imageUrl, ...(galleryUrls || [])].filter(Boolean)));

  // Sync scroll lock with modal open state
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, allImages.length]);

  return (
    <div className="space-y-8">
      {/* --- FEATURED MAIN IMAGE --- */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Project Asset</p>
        <div 
          onClick={() => {
            setCurrentIndex(0);
            setIsOpen(true);
          }}
          className="group relative w-full aspect-video md:aspect-[21/9] bg-muted/30 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-zoom-in"
        >
          {/* Hint Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/65 backdrop-blur-md px-5 py-2.5 rounded-full text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-lg">
               <ZoomIn className="w-4 h-4" /> Click for Immersive View
            </div>
          </div>

          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title}
              fill
              className="object-cover object-top transition-[object-position] duration-[15s] ease-linear group-hover:object-bottom"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/50">
              No Featured Image Available
            </div>
          )}
        </div>
      </div>

      {/* --- ADDITIONAL GALLERY IMAGES --- */}
      {allImages.length > 1 && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Project Mockups & Assets</h3>
            <p className="text-xs text-muted-foreground mt-1">Additional views, screenshots, and visual iterations of the project.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allImages.slice(1).map((img, index) => {
              const actualIndex = index + 1;
              return (
                <div
                  key={actualIndex}
                  onClick={() => {
                    setCurrentIndex(actualIndex);
                    setIsOpen(true);
                  }}
                  className="group relative aspect-video bg-muted/20 border border-border/60 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-border transition-all duration-300 cursor-zoom-in"
                >
                  <Image
                    src={img}
                    alt={`${title} - Gallery Image ${actualIndex}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Subtle dark overlay that fades on hover */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- FULLSCREEN LIGHTBOX SLIDESHOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between py-6 px-4 md:px-12 select-none"
          >
            {/* Lightbox Header / Toolbar */}
            <div className="flex justify-between items-center z-50 w-full pb-4 border-b border-white/10">
              <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                {title} <span className="text-white/30 mx-2">|</span> {currentIndex + 1} of {allImages.length}
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Main Image & Pagination Buttons */}
            <div className="relative flex-1 w-full flex items-center justify-center py-8" onClick={() => setIsOpen(false)}>
              
              {/* Previous Button */}
              {allImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-0 md:left-4 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image Container with smooth fade transition */}
              <div 
                className="relative max-w-7xl max-h-[75vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentIndex}
                    src={allImages[currentIndex]} 
                    alt={`${title} - View ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/5"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              {allImages.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-0 md:right-4 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Footer with indicator dots */}
            <div className="w-full flex flex-col items-center gap-4 pt-4 border-t border-white/10">
              {allImages.length > 1 && (
                <div className="flex gap-2.5">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                          ? "bg-white scale-125" 
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
              <p className="text-[10px] text-white/40 tracking-wider uppercase">
                Use Arrow Keys ← → to navigate · Esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}