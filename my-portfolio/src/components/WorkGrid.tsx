"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import { Layers, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Import Router
import GalleryModal from "./GalleryModal"; 

// --- TYPES ---
interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[] | null;
  description: string;
}

const CATEGORIES = ["All", "Web Design", "Graphic Design", "Video Editing"];

export default function WorkGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); // Initialize Router

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });
      
      if (data) setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // --- FILTER LOGIC ---
  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Graphic Design") return project.category.includes("Graphic") || project.category.includes("Posters") || project.category === "GFX";
    if (activeCategory === "Video Editing") return project.category.includes("Video") || project.category.includes("Reels");
    return project.category === activeCategory;
  });

  // --- HELPER: CHECK IF BATCH VIEW (MODAL) OR PAGE VIEW ---
  const isBatchView = (category: string) => {
    const lowerCat = category.toLowerCase();
    return lowerCat.includes("poster") || lowerCat.includes("gfx") || lowerCat.includes("graphic");
  };

  // --- HANDLE CLICK ---
  const handleProjectClick = (project: Project) => {
    if (isBatchView(project.category)) {
      // CASE 1: POSTERS/GFX -> Open Modal (Batch View)
      setSelectedProject(project);
      setIsGalleryOpen(true);
    } else {
      // CASE 2: WEBSITE/COMPONENTS -> Navigate to Page
      router.push(`/work/${project.id}`);
    }
  };

  return (
    <section id="work" className="relative px-6 md:px-16 py-24 bg-background border-t border-border font-poppins">
      
      {/* --- GALLERY MODAL (Only used for Posters/GFX) --- */}
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
        
        {/* --- HEADER & FILTERS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Selected Work
            </h2>
            <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
              A curated collection of digital experiences, visual design, and motion graphics.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID --- */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Loading work...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No projects found in this category.</div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  {/* CARD IMAGE CONTAINER */}
                  <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 border border-border/50">
                    
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Preview</div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* INDICATOR ICONS: Dynamic based on Category */}
                    <div className="absolute top-4 right-4 transition-all duration-300 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                        {isBatchView(project.category) ? (
                            <div className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full">
                                <Layers size={16} />
                            </div>
                        ) : (
                            <div className="bg-white text-black p-2 rounded-full">
                                <ArrowUpRight size={16} />
                            </div>
                        )}
                    </div>
                  </div>

                  {/* TEXT INFO */}
                  <div className="px-1">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground font-medium">{project.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}