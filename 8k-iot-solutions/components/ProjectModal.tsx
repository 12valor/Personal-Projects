'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Project } from '@/lib/projects';

export default function ProjectModal({
  project,
  onClose
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const lightboxIndexRef = useRef<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = () => {
    setLightboxIndex(null);
    lightboxIndexRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndexRef.current !== null) closeLightbox();
        else onClose();
      } else if (e.key === 'ArrowLeft' && lightboxIndexRef.current !== null) {
        setLightboxIndex(prev => {
          if (prev === null) return null;
          const newIdx = Math.max(0, prev - 1);
          lightboxIndexRef.current = newIdx;
          return newIdx;
        });
      } else if (e.key === 'ArrowRight' && lightboxIndexRef.current !== null && project?.galleryImages) {
        setLightboxIndex(prev => {
          if (prev === null) return null;
          const newIdx = Math.min(project.galleryImages!.length - 1, prev + 1);
          lightboxIndexRef.current = newIdx;
          return newIdx;
        });
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('project-modal-open');
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.classList.remove('project-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Lightbox Overlay */}
      {lightboxIndex !== null && project.galleryImages && (
        <div 
           className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/95 backdrop-blur-md transition-opacity duration-300"
           aria-modal="true"
           role="dialog"
           onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 bg-black/20 rounded-full backdrop-blur-sm transition">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const newIdx = Math.max(0, lightboxIndex - 1);
              setLightboxIndex(newIdx);
              lightboxIndexRef.current = newIdx;
            }}
            className={`absolute left-2 md:left-6 text-white/70 hover:text-white p-3 z-50 bg-black/20 rounded-full backdrop-blur-sm transition ${lightboxIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            disabled={lightboxIndex === 0}
            aria-label="Previous image"
          >
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="relative w-full max-w-6xl h-4/5 px-16 md:px-24 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto">
              <Image 
                 src={project.galleryImages[lightboxIndex]} 
                 alt={`Gallery view ${lightboxIndex + 1}`}
                 fill
                 className="object-contain drop-shadow-2xl"
                 sizes="100vw"
                 priority
              />
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              const newIdx = Math.min(project.galleryImages!.length - 1, lightboxIndex + 1);
              setLightboxIndex(newIdx);
              lightboxIndexRef.current = newIdx;
            }}
            className={`absolute right-2 md:right-6 text-white/70 hover:text-white p-3 z-50 bg-black/20 rounded-full backdrop-blur-sm transition ${lightboxIndex === project.galleryImages.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            disabled={lightboxIndex === project.galleryImages.length - 1}
            aria-label="Next image"
          >
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm font-sans tracking-widest uppercase font-semibold">
            {lightboxIndex + 1} / {project.galleryImages.length}
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl md:rounded-[2rem] shadow-2xl animate-heroPop flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl md:rounded-[2rem]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-50/50 via-white to-white opacity-80" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all shadow-sm ring-1 ring-zinc-200"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content Wrapper */}
        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
          <div className="flex flex-col">
            {/* Header Image */}
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-zinc-900/10 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 text-white text-left">
                <span className="inline-block px-3 py-1.5 mb-4 text-[10px] md:text-xs font-poppins font-bold tracking-[0.1em] uppercase bg-brand-900 text-white rounded-lg shadow-xl shadow-brand-900/20">
                  {project.category}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-200 leading-tight">
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
              {/* Main Content */}
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-xl font-poppins font-semibold text-zinc-900 mb-4">About the Project</h3>
                  <p className="text-base text-zinc-600 font-sans leading-relaxed whitespace-pre-wrap">
                    {project.fullDescription || project.description}
                  </p>
                </div>

                {project.features && project.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-zinc-900 mb-4">Key Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-zinc-600 font-sans">
                          <svg className="w-5 h-5 text-brand-500 mr-2 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gallery Features */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <div>
                    <h3 className="text-xl font-poppins font-semibold text-zinc-900 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {project.galleryImages.slice(0, 6).map((img, idx) => {
                        const isLastAndMore = idx === 5 && project.galleryImages.length > 6;
                        const remainingCount = project.galleryImages.length - 5;
                        
                        return (
                          <div 
                            key={idx} 
                            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-zinc-100"
                            onClick={() => {
                              setLightboxIndex(idx);
                              lightboxIndexRef.current = idx;
                            }}
                            role="button"
                            aria-label={isLastAndMore ? `View ${remainingCount} more gallery images` : `View gallery image ${idx + 1}`}
                          >
                            <Image 
                              src={img} 
                              alt={`Gallery thumbnail ${idx + 1}`} 
                              fill 
                              className={`object-cover transition duration-500 ${isLastAndMore ? 'scale-105 blur-[2px]' : 'group-hover:scale-105'}`} 
                              sizes="(max-width: 768px) 50vw, 300px" 
                            />
                            
                            {isLastAndMore ? (
                              <div className="absolute inset-0 bg-zinc-900/50 flex flex-col items-center justify-center transition duration-300 group-hover:bg-zinc-900/60">
                                <span className="text-white font-bold text-xl md:text-2xl">+{remainingCount}</span>
                                <span className="text-white/90 text-xs md:text-sm font-medium mt-1">More Photos</span>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/10 transition duration-300 flex items-center justify-center">
                                 <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                 </svg>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Details */}
              <div className="w-full lg:w-72 shrink-0 space-y-6">
                <div className="p-6 bg-white/60 backdrop-blur-sm border border-zinc-200/50 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h4 className="text-sm font-poppins font-semibold text-zinc-900 mb-6 uppercase tracking-wider relative z-10">Project Details</h4>
                  <div className="space-y-5 font-sans text-sm relative z-10">
                    {project.client && (
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">Client</span>
                        <span className="font-semibold text-zinc-900">{project.client}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-3">Technologies & Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-brand-900 text-white whitespace-nowrap shadow-md shadow-brand-900/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
