import Image from 'next/image';
import { Project } from '@/lib/projects';

export default function ProjectCard({ project, onClick }: { project: Project, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') onClick() }}
      className="text-left cursor-pointer group relative flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-sm hover:shadow-xl hover:ring-zinc-300 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 block"
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
      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 text-[11px] font-semibold text-zinc-600 bg-zinc-100 rounded-md whitespace-nowrap">
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
             <span className="px-2 py-1 text-[11px] font-semibold text-zinc-400 bg-zinc-50 rounded-md whitespace-nowrap">
               +{project.tags.length - 2}
             </span>
          )}
        </div>
        
        <h3 className="text-lg font-poppins font-semibold text-zinc-900 group-hover:text-brand-600 transition-colors duration-200 line-clamp-1 mb-1.5">
          {project.title}
        </h3>
        
        <p className="text-sm text-zinc-500 font-medium line-clamp-2 mt-auto">
          {project.description}
        </p>
      </div>
    </div>
  );
}
