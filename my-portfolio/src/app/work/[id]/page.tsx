import { prisma } from "../../../../lib/prisma";
import { serializeProject } from "../../../lib/project-mappers";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
import ProjectImageViewer from "../../../components/ProjectImageViewer";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      select: { id: true },
    });
    return projects.map((project) => ({
      id: String(project.id),
    }));
  } catch (error) {
    console.warn("Database connection failed during build inside generateStaticParams. Skipping static page pre-generation.", error);
    return [];
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const projectRecord = await prisma.project.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  if (!projectRecord) {
    notFound();
  }

  const project = serializeProject(projectRecord);

  return (
    <article className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-accent-light/35">
      
      {/* --- RESPONSIVE STICKY NAVIGATION --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex justify-between items-center">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            <div className="p-1 rounded-full bg-transparent group-hover:bg-accent transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span>Back to Works</span>
          </Link>

          <Badge variant="outline" className="px-3.5 py-1 text-xs uppercase tracking-widest bg-accent-light/10 text-accent-hover border-accent-hover/20">
            {project.category}
          </Badge>
        </div>
      </nav>

      {/* --- CONTENT LAYOUT --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Sticky Project Information */}
          <div className="lg:sticky lg:top-28 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Title & Category Badge */}
            <div className="space-y-4">
              <Badge className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider bg-black text-white hover:bg-black/90">
                {project.category}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                {project.title}
              </h1>
            </div>

            {/* Project Metadata Cards */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-border/80 py-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-accent-hover" /> Role
                </span>
                <p className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                  {project.role || "Designer"}
                </p>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent-hover" /> Year
                </span>
                <p className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                  {project.year || "2024"}
                </p>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">About the Project</h3>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {project.description || "No description provided."}
              </p>
            </div>

            {/* Live Site CTA Link (Fixed Contrast!) */}
            {project.project_url && (
              <div className="pt-4 border-t border-border/40">
                <Button asChild size="lg" className="w-full justify-center bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-transform rounded-lg shadow-sm font-semibold tracking-wide text-sm flex items-center gap-2">
                  <a 
                    href={project.project_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Visit Live Project <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Scrollable Project Media */}
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
            <ProjectImageViewer 
              imageUrl={project.image_url} 
              galleryUrls={project.gallery_urls}
              title={project.title} 
            />
            
            {/* Action Bar (underneath the viewer) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-border/50 gap-4 text-xs text-muted-foreground">
              <p className="italic flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-accent-hover animate-pulse"></span>
                Click any mockup image to open in immersive view
              </p>
              {project.image_url && (
                <a 
                  href={project.image_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-medium hover:text-accent-hover transition-colors py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Original Asset
                </a>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 mt-20 md:mt-32 border-t border-border/40 py-16 md:py-24">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="group flex flex-col items-center gap-3 text-center">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground group-hover:text-accent-hover transition-colors font-bold">
              Next Steps
            </span>
            <span className="text-3xl md:text-5xl font-bold text-foreground group-hover:text-muted-foreground transition-colors tracking-tight">
              View All Projects
            </span>
          </Link>
        </div>
      </footer>

    </article>
  );
}
