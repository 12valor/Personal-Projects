import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
import ProjectImageViewer from "../../../components/ProjectImageViewer";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-accent/20">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 flex justify-between items-center">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            <div className="p-1 rounded-full bg-transparent group-hover:bg-accent/10 transition-colors">
                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span>Back to Works</span>
          </Link>

          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-accent border border-accent/20 px-3 py-1.5 rounded-full bg-accent/5">
            {project.category}
          </span>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="px-4 sm:px-6 md:px-12 pt-12 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 md:mb-12 leading-[1.1] tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            {project.title}
          </h1>

          {/* Content Grid: Stacks on mobile, Columns on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 md:gap-16 border-t border-border pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
            
            {/* Metadata Column (Horizontal on mobile, Vertical on Desktop) */}
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
      <section className="px-4 sm:px-6 md:px-12 mb-20">
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

      {/* --- FOOTER --- */}
      <div className="flex justify-center mt-20 md:mt-32 px-4 border-t border-border pt-20 md:pt-24">
        <Link href="/" className="group flex flex-col items-center gap-3 text-center">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground group-hover:text-accent transition-colors">
            Next Steps
          </span>
          <span className="text-2xl md:text-5xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
            View All Projects
          </span>
        </Link>
      </div>

    </article>
  );
}