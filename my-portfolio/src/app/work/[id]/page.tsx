import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";
import ProjectDetailContent from "../../../components/ProjectDetailContent";

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

      {/* --- CONTENT --- */}
      <div className="px-4 sm:px-6 md:px-12 pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <ProjectDetailContent project={project} />
        </div>
      </div>

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