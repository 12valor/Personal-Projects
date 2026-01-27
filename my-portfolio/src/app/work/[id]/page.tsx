import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
// IMPORT THE NEW COMPONENT
import ProjectImageViewer from "../../../components/ProjectImageViewer";

interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  year: string;
  description: string;
  image_url: string;
}

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
      
      {/* Navigation */}
      <nav className="px-6 md:px-12 py-8 border-b border-border flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-md z-50">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Works
        </Link>
        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent border border-accent/20 px-3 py-1 rounded-full">
          {project.category}
        </span>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            {project.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-24 border-t border-gray-200 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
            <div className="w-full md:w-1/4 space-y-8">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Role</p>
                  <p className="font-medium text-lg">{project.role || "Designer"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Year</p>
                  <p className="font-medium text-lg">{project.year || "2024"}</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-3/4">
              <p className="text-lg md:text-xl leading-relaxed text-gray-600 whitespace-pre-wrap max-w-2xl">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW IMAGE VIEWER SECTION --- */}
      <section className="px-6 md:px-12 mb-20">
        <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-backwards">
          
          {/* Replaced old image block with the new Viewer Component */}
          <ProjectImageViewer 
            imageUrl={project.image_url} 
            title={project.title} 
          />

          {/* Action Bar */}
          <div className="flex justify-between items-center mt-4">
             <p className="text-xs text-gray-400 italic">
               * Click image for full view
             </p>
             
             {project.image_url && (
               <a 
                 href={project.image_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-sm font-medium text-accent hover:underline decoration-accent underline-offset-4"
               >
                 <ExternalLink className="w-4 h-4" />
                 Open Original
               </a>
             )}
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <div className="flex justify-center mt-32 border-t border-border pt-24">
        <Link href="/" className="group flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 group-hover:text-accent transition-colors">
            Next Steps
          </span>
          <span className="text-3xl md:text-5xl font-medium text-foreground group-hover:text-gray-600 transition-colors">
            View All Projects
          </span>
        </Link>
      </div>
    </article>
  );
}