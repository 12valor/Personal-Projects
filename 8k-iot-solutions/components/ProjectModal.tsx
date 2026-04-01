'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Project } from '@/lib/projects';

export default function ProjectModal({
  project,
  onClose
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-[2rem] shadow-2xl animate-heroPop flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all shadow-sm ring-1 ring-zinc-200"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10 flex flex-col">
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
  );
}
