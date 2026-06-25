"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Layers, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation"; 
import GalleryModal from "./GalleryModal"; 

// --- TYPES ---
export interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[] | null;
  description: string;
}

interface WorkGridProps {
  initialProjects: Project[];
}

// --- CONFIGURATION ---
const CATEGORY_MAP: Record<string, string[]> = {
  "Web Design": ["Website", "Components"],
  "Graphic Design": ["Posters/Pubmats", "GFX"],
  "Video Editing": ["Reels", "Long Form"],
};

export default function WorkGrid({ initialProjects }: WorkGridProps) {
  const [projects] = useState<Project[]>(initialProjects);
  
  // State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  
  const router = useRouter(); 

  // --- HELPER LOGIC ---
  const isBatchView = (category: string) => {
    const lowerCat = category.toLowerCase();
    return lowerCat.includes("poster") || lowerCat.includes("gfx") || lowerCat.includes("graphic");
  };

  const handleProjectClick = (project: Project) => {
    if (isBatchView(project.category)) {
      setSelectedProject(project);
      setIsGalleryOpen(true);
    } else {
      router.push(`/work/${project.id}`);
    }
  };

  const getProjectsByCategory = (parentCategory: string) => {
    return projects.filter((project) => {
      const pCat = project.category.trim();
      const allowedSubs = CATEGORY_MAP[parentCategory] || [];
      return pCat === parentCategory || allowedSubs.includes(pCat);
    });
  };

  const websiteProjects = getProjectsByCategory("Web Design");
  const graphicDesignProjects = getProjectsByCategory("Graphic Design");
  const videoEditingProjects = getProjectsByCategory("Video Editing");

  const WebsiteProjectList = ({ items }: { items: Project[] }) => {
    if (items.length === 0) {
      return <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">No website projects found.</div>;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {items.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.4, 
              delay: (i % 6) * 0.05, 
              type: "spring", 
              stiffness: 250, 
              damping: 25 
            }}
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="group cursor-pointer flex flex-col bg-white dark:bg-zinc-950 transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 h-full shadow-sm hover:shadow-md"
          >
            {/* IMAGE AREA */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Preview Available</div>
              )}
            </div>

            {/* CONTENT AREA */}
            <div className="p-6 md:p-8 flex flex-col flex-grow justify-between gap-6">
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {project.category}
                    </p>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
              
              {/* CTA */}
              <div className="flex items-center text-sm font-semibold text-foreground">
                View Project 
                <ArrowUpRight 
                  size={16} 
                  className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const GraphicDesignMarquee = ({ items }: { items: Project[] }) => {
    if (items.length === 0) {
      return <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">No graphic work found.</div>;
    }

    return (
      <div className="relative w-full overflow-hidden mask-edges py-4 marquee-wrapper">
        <div className="marquee-container flex w-max group/marquee">
            {[0, 1].map((blockIdx) => (
              <div 
                key={blockIdx} 
                className="marquee-content flex gap-4 md:gap-6 pr-4 md:pr-6"
                aria-hidden={blockIdx === 1}
              >
                {items.map((project, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                        key={`${blockIdx}-${project.id}`}
                        onClick={() => handleProjectClick(project)}
                        className="group cursor-pointer flex flex-col w-[260px] md:w-[320px] shrink-0"
                    >
                        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/60 shadow-sm transition-colors duration-500 hover:border-zinc-300 dark:hover:border-zinc-700">
                          {project.image_url ? (
                              <Image
                                  src={project.image_url}
                                  alt={project.title}
                                  fill
                                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 768px) 260px, 320px"
                              />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Preview Available</div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />
                          
                          {/* Action Icon */}
                          <div className="absolute top-3 right-3 md:top-4 md:right-4 transition-all duration-500 translate-y-1 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 z-30">
                              <div className="bg-white text-black p-2 rounded-full shadow-md">
                                  {isBatchView(project.category) ? <Layers size={14} /> : <ArrowUpRight size={14} />}
                              </div>
                          </div>
                        </div>
                        {/* Title caption below */}
                        <div className="mt-3 px-1">
                            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{project.title}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{project.category}</p>
                        </div>
                    </motion.div>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const ProjectList = ({ items }: { items: Project[] }) => {
    if (items.length === 0) {
      return <div className="h-32 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-2xl">No projects found in this category.</div>;
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {items.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.4, 
              delay: (i % 6) * 0.05, 
              type: "spring", 
              stiffness: 250, 
              damping: 25 
            }}
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="group cursor-pointer flex flex-col gap-2 md:gap-3 h-full"
          >
            {/* IMAGE */}
            <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900 rounded-lg md:rounded-2xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-white/[0.05] group-hover:-translate-y-1.5 border border-border/50">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs italic">No Preview Available</div>
              )}
              
              {/* Bespoke Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-lg md:rounded-2xl z-20" />
              
              {/* Action Icons */}
              <div className="absolute top-2 right-2 md:top-4 md:right-4 transition-all duration-500 translate-y-2 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 z-30">
                  {isBatchView(project.category) ? (
                      <div className="bg-black/50 backdrop-blur-md text-white p-1.5 md:p-2 rounded-full">
                          <Layers size={14} className="md:w-4 md:h-4" />
                      </div>
                  ) : (
                      <div className="bg-white text-black p-1.5 md:p-2 rounded-full">
                          <ArrowUpRight size={14} className="md:w-4 md:h-4" />
                      </div>
                  )}
              </div>
            </div>

            {/* TEXT */}
            <div className="px-1">
              <h3 className="font-bold text-sm md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <div className="flex items-center justify-between mt-0.5 md:mt-1">
                  <p className="text-[10px] md:text-sm text-muted-foreground font-medium">{project.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.section 
      id="work" 
      ref={containerRef}
      style={{ opacity: sectionOpacity }}
      className="relative px-4 py-14 md:px-16 md:py-20 bg-background border-t border-border font-poppins"
    >
      
      {/* --- GALLERY MODAL --- */}
      <GalleryModal 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={
            selectedProject?.gallery_urls && selectedProject.gallery_urls.length > 0
            ? selectedProject.gallery_urls 
            : [selectedProject?.image_url || ""]
        }
        title={selectedProject?.title || "Project"}
      />

      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-4 mb-12 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed hidden md:block">
            Browse selected websites, visual layouts, and video edits built across design, motion, and code.
          </p>
        </div>

        {/* --- SECTIONS --- */}
        <div className="flex flex-col gap-16 md:gap-24">
            
            {/* WEBSITES */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    SELECTED WEBSITES
                </h3>
                <WebsiteProjectList items={websiteProjects} />
            </div>

            {/* GRAPHIC DESIGN */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    GRAPHIC WORK
                </h3>
                <GraphicDesignMarquee items={graphicDesignProjects} />
            </div>

            {/* VIDEO EDITING */}
            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    VIDEO EDITS
                </h3>
                {videoEditingProjects.length > 0 ? (
                    <ProjectList items={videoEditingProjects} />
                ) : (
                    <div className="h-32 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
                        More projects coming soon.
                    </div>
                )}
            </div>

        </div>
      </div>
      {/* Hide Scrollbar Style Helper & Marquee CSS */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        
        .marquee-container {
          animation: slide-marquee 40s linear infinite;
        }

        .marquee-container:hover {
          animation-play-state: paused;
        }

        @keyframes slide-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-container {
            animation: none !important;
          }
          .marquee-wrapper {
            overflow-x: auto;
            -webkit-mask-image: none;
            mask-image: none;
          }
          .marquee-wrapper::-webkit-scrollbar {
            display: none;
          }
          .marquee-wrapper {
            scrollbar-width: none;
          }
          .marquee-content:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </motion.section>
  );
}
