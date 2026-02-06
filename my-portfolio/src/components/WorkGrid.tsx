"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import { Layers, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; 
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

// --- CONFIGURATION: Define hierarchy here ---
const CATEGORY_MAP: Record<string, string[]> = {
  "Web Design": ["Website", "Components"],
  "Graphic Design": ["Posters/Pubmats", "GFX"],
  "Video Editing": ["Reels", "Long Form"],
};

export default function WorkGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  // New State for nested filtering
  const [activeParent, setActiveParent] = useState("All");
  const [activeSub, setActiveSub] = useState("All");
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); 

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
    // 1. Clean up strings for comparison
    const pCat = project.category.trim(); 

    // 2. If "All" is selected, show everything
    if (activeParent === "All") return true;

    // 3. Get allowed sub-categories for the active parent
    const allowedSubs = CATEGORY_MAP[activeParent] || [];

    // 4. Check Parent Match (e.g., if User clicks "Web Design", show "Website" projects)
    const matchesParent = 
        pCat === activeParent || 
        allowedSubs.includes(pCat);

    // 5. If sub-filter is "All", just return parent matches
    if (activeSub === "All") {
        return matchesParent;
    }

    // 6. If sub-filter is specific (e.g. "Website"), exact match required
    return pCat === activeSub;
  });

  // --- HELPER: CHECK IF BATCH VIEW (MODAL) OR PAGE VIEW ---
  const isBatchView = (category: string) => {
    const lowerCat = category.toLowerCase();
    return lowerCat.includes("poster") || lowerCat.includes("gfx") || lowerCat.includes("graphic");
  };

  // --- HANDLE CLICK ---
  const handleProjectClick = (project: Project) => {
    if (isBatchView(project.category)) {
      setSelectedProject(project);
      setIsGalleryOpen(true);
    } else {
      router.push(`/work/${project.id}`);
    }
  };

  // --- HANDLE PARENT TAB CLICK ---
  const handleParentClick = (parent: string) => {
      setActiveParent(parent);
      setActiveSub("All"); // Reset sub-filter when switching parents
  };

  return (
    <section id="work" className="relative px-4 md:px-16 py-24 bg-background border-t border-border font-poppins">
      
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
        
        {/* --- HEADER & FILTERS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Selected Work
            </h2>
            <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
              A curated collection of digital experiences, visual design, and motion graphics.
            </p>
          </div>

          {/* PARENT FILTERS */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex flex-wrap justify-end gap-2">
                <button
                    onClick={() => handleParentClick("All")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeParent === "All"
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                    }`}
                >
                    All Work
                </button>
                {Object.keys(CATEGORY_MAP).map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleParentClick(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeParent === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>

            {/* SUB FILTERS (Animated) */}
            <AnimatePresence mode="wait">
                {activeParent !== "All" && CATEGORY_MAP[activeParent] && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap justify-end gap-2"
                    >
                        <button
                            onClick={() => setActiveSub("All")}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                activeSub === "All"
                                ? "bg-zinc-800 text-white border-zinc-800"
                                : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-800 hover:text-zinc-900"
                            }`}
                        >
                            All {activeParent}
                        </button>
                        {CATEGORY_MAP[activeParent].map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveSub(sub)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                    activeSub === sub
                                    ? "bg-zinc-800 text-white border-zinc-800"
                                    : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-800 hover:text-zinc-900"
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- GRID (2 Columns on Mobile, 3 on Desktop) --- */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Loading work...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">No projects found in this category.</div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8" // CHANGED: grid-cols-2 for mobile, gap-3 for tighter fit
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
                  className="group cursor-pointer flex flex-col gap-2 md:gap-3"
                >
                  {/* CARD IMAGE CONTAINER */}
                  <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg md:rounded-2xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 border border-border/50">
                    
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Preview</div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* INDICATOR ICONS */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 transition-all duration-300 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
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

                  {/* TEXT INFO (Smaller on mobile) */}
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
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}