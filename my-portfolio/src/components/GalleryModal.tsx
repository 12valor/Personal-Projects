"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import Image from "next/image";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[] | null;
  title: string;
}

export default function GalleryModal({ isOpen, onClose, images, title }: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ensure images is always an array
  const safeImages = images || [];

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen]);

  // Handle Keyboard Navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  }, [onClose, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleKeyDown]);


  if (!isOpen || safeImages.length === 0) return null;

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // Use Poppins font, deeper blurred background for a cleaner look
          className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center font-poppins"
          onClick={onClose} // Close when clicking background
        >
          {/* Close Button - Clean icon look */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-50 p-2 text-zinc-400 hover:text-white transition-colors group"
            aria-label="Close gallery"
          >
            <X size={28} strokeWidth={1.5} className="group-hover:scale-110 transition-transform"/>
          </button>

          {/* Counter & Title - Clean typography */}
          <div className="absolute top-6 left-6 z-50 flex items-center gap-3 text-zinc-100 pointer-events-none">
             <Layers size={20} className="text-zinc-500" strokeWidth={1.5} />
             <span className="text-sm font-medium tracking-tight leading-none">
                {currentIndex + 1} <span className="text-zinc-600 mx-1">/</span> {safeImages.length} 
                <span className="mx-3 text-zinc-600">|</span> 
                <span className="text-zinc-300">{title}</span>
             </span>
          </div>

          {/* Main Slider */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
            
            {/* Prev Button - Minimalist icon */}
            {safeImages.length > 1 && (
              <button 
                onClick={prevSlide}
                className="absolute left-2 md:left-8 z-50 p-4 text-zinc-400 hover:text-white transition-all hover:scale-110 focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft size={40} strokeWidth={1.5} />
              </button>
            )}

            {/* The Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full max-w-7xl max-h-[80vh] flex items-center justify-center"
            >
              <Image
                src={safeImages[currentIndex]}
                alt={`${title} - image ${currentIndex + 1}`}
                fill
                className="object-contain shadow-2xl drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Next Button - Minimalist icon */}
            {safeImages.length > 1 && (
              <button 
                onClick={nextSlide}
                className="absolute right-2 md:right-8 z-50 p-4 text-zinc-400 hover:text-white transition-all hover:scale-110 focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight size={40} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Thumbnails - Clean selection state */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-[90vw] p-2 no-scrollbar z-50" onClick={(e) => e.stopPropagation()}>
                {safeImages.map((img, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ease-out ${
                    idx === currentIndex 
                        ? "ring-2 ring-white opacity-100 scale-105 shadow-lg" 
                        : "opacity-40 hover:opacity-80 hover:scale-105"
                    }`}
                >
                    <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
                ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}