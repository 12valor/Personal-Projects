import { serializeProject } from "../../../lib/project-mappers";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Image from "next/image";

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseServerClient();
    const { data: projects, error } = await supabase.from("projects").select("id");

    if (error) throw error;

    return projects.map((project) => ({
      id: String(project.id),
    }));
  } catch (error) {
    console.warn("Supabase connection failed during build inside generateStaticParams. Skipping static page pre-generation.", error);
    return [];
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const supabase = getSupabaseServerClient();
  const { data: projectRecord, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", Number(resolvedParams.id))
    .maybeSingle<PortfolioProjectRow>();

  if (error) {
    throw error;
  }

  if (!projectRecord) {
    notFound();
  }

  const project = serializeProject(projectRecord);

  return (
    <article className="min-h-screen bg-background text-foreground pb-0 font-sans selection:bg-accent-light/35">
      
      {/* --- RESPONSIVE STICKY NAVIGATION --- */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex justify-between items-start pt-6">
          <Link 
            href="/" 
            className="group flex items-center gap-3 text-sm font-semibold hover:opacity-80 transition-opacity py-2 pointer-events-auto"
          >
            <div className="p-1.5 rounded-full bg-white/10 backdrop-blur-md group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="tracking-wide">Back to Works</span>
          </Link>
        </div>
      </nav>

      {/* --- IMMERSIVE HERO SECTION --- */}
      <section className="relative w-full aspect-[4/3] md:aspect-[21/9]">
        {project.image_url ? (
          <>
            <Image 
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover object-top"
              priority
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
             <span className="text-muted-foreground uppercase tracking-widest text-xs">No Cover Image</span>
          </div>
        )}
      </section>

      {/* --- STARK TYPOGRAPHY & METADATA --- */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-foreground leading-[1.05]">
            {project.title}
          </h1>
          
          {project.description && (
            <div className="max-w-3xl">
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/60 pt-16 mt-8">
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Category</h4>
            <p className="text-sm font-medium">{project.category}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Role</h4>
            <p className="text-sm font-medium">{project.role || "Designer"}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Year</h4>
            <p className="text-sm font-medium">{project.year || "2024"}</p>
          </div>
          {project.project_url && (
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Link</h4>
              <a 
                href={project.project_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-accent-hover transition-colors inline-flex items-center gap-1.5 group"
              >
                Live Site <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* --- INTERLEAVED NARRATIVE --- */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-20">
        <div className="space-y-20 md:space-y-32">
          
          {/* Gallery Unrolled */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="space-y-12 md:space-y-24">
              {project.gallery_urls.map((url, index) => (
                <div key={index} className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-muted">
                   <Image 
                     src={url}
                     alt={`${project.title} gallery image ${index + 1}`}
                     fill
                     className="object-cover object-top"
                   />
                </div>
              ))}
            </div>
          )}
          
          {/* Bottom CTA */}
          {project.project_url && (
            <div className="pt-16 border-t border-border/40 flex justify-center">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-semibold tracking-wide flex items-center gap-2 group">
                <a 
                  href={project.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Visit Live Project <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-border/40 py-24 md:py-32 bg-accent-light/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center">
          <Link href="/" className="group flex flex-col items-center gap-4 text-center">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground group-hover:text-accent-hover transition-colors font-bold">
              Next Steps
            </span>
            <span className="text-4xl md:text-6xl font-bold text-foreground group-hover:text-muted-foreground transition-colors tracking-tighter">
              View All Projects
            </span>
          </Link>
        </div>
      </footer>

    </article>
  );
}
