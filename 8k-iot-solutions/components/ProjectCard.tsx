import Image from 'next/image';
import { Project } from '@/lib/projects';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') onClick() }}
      className="text-left cursor-pointer group relative flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-sm hover:shadow-xl hover:ring-brand-900/20 transition-all duration-200 ease-out hover:-translate-y-1 block min-h-[44px] font-poppins"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {project.image && (
          <Image 
            src={project.image} 
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}
        
        {/* Subtle Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-brand-900 text-white whitespace-nowrap">
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
             <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-zinc-100 text-zinc-500 whitespace-nowrap">
               +{project.tags.length - 2}
             </span>
          )}
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 group-hover:text-brand-900 transition-colors duration-200 line-clamp-1 mb-2">
          {project.title}
        </h3>
        
        <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-8">
          {project.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-5 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 font-bold mb-0.5">Client</span>
            <span className="text-xs font-bold text-zinc-800">{project.client || "Proprietary"}</span>
          </div>
          <div className="flex items-center text-xs font-bold text-brand-900 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View Project
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
