"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectImageViewerProps {
  imageUrl: string;
  title: string;
}

export default function ProjectImageViewer({ imageUrl, title }: ProjectImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle scrolling for the body when modal is open
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  return (
    <>
      {/* --- PREVIEW CARD (On the Page) --- */}
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative w-full aspect-video md:aspect-[21/9] bg-gray-50 border border-gray-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-zoom-in"
      >
        {/* Hint Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-xs uppercase tracking-widest font-medium flex items-center gap-2">
             <ZoomIn className="w-4 h-4" /> Click for Full View
          </div>
        </div>

        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            // UPDATED: Changed duration to [15s] (Slower)
            // Added ease-linear so the speed is consistent
            className="object-cover object-top transition-[object-position] duration-[15s] ease-linear group-hover:object-bottom"
            sizes="100vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            No Image Available
          </div>
        )}
      </div>

      {/* --- FULLSCREEN LIGHTBOX (The "Another Way") --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl overflow-y-auto"
          >
            {/* Toolbar */}
            <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-background to-transparent">
              <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                Viewing: {title}
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="min-h-screen w-full flex justify-center py-24 px-4 md:px-12" onClick={() => setIsOpen(false)}>
              {/* The Full Image (Natural Height) */}
              <div className="relative w-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="w-full h-auto rounded-sm shadow-2xl border border-gray-200"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}