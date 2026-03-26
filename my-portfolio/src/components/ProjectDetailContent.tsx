"use client";
import React from "react";
import { User, Calendar, ExternalLink } from "lucide-react";
import ProjectImageViewer from "./ProjectImageViewer";
import { Project } from "./WorkGrid";

interface ProjectDetailContentProps {
  project: Project & {
    role?: string;
    year?: string;
  };
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <section className="pt-8 md:pt-12 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 md:mb-12 leading-[1.1] tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            {project.title}
          </h1>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 md:gap-16 border-t border-border pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
            
            {/* Metadata Column */}
            <div className="flex flex-row md:flex-col gap-6 md:gap-8 flex-wrap">
              <div className="flex items-start gap-3 min-w-[140px]">
                <div className="p-2 bg-accent/5 rounded-lg">
                    <User className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">Role</p>
                  <p className="font-medium text-base md:text-lg leading-tight">{project.role || "Designer"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-[140px]">
                <div className="p-2 bg-accent/5 rounded-lg">
                    <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-semibold">Year</p>
                  <p className="font-medium text-base md:text-lg leading-tight">{project.year || "2024"}</p>
                </div>
              </div>
            </div>
            
            {/* Description Column */}
            <div className="w-full">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-wrap max-w-3xl">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMAGE VIEWER SECTION --- */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-backwards">
          
          <ProjectImageViewer 
            imageUrl={project.image_url} 
            title={project.title} 
          />

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
             <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/50"></span>
                Click image for immersive view
             </p>
             
             {project.image_url && (
               <a 
                 href={project.image_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors py-1"
               >
                 <ExternalLink className="w-4 h-4" />
                 Open Original
               </a>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
