"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react"; // Added Layers icon
import { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import GalleryModal from "./GalleryModal"; // Ensure you import this here too!

interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  gallery_urls?: string[] | null; // Ensure this is in type
  is_featured?: boolean;
}

const CATEGORY_MAP: Record<string, string[]> = {
  "Web Design": ["Website", "Components"],
  "Graphic Design": ["Posters/Pubmats", "GFX"],
  "Video Editing": ["Reels", "Long Form"],
};

// Helper to determine view mode
const isBatchView = (category: string) => {
    const lowerCat = category.toLowerCase();
    return lowerCat.includes("poster") || lowerCat.includes("gfx") || lowerCat.includes("graphic");
};

// --- UPDATED CARD COMPONENT ---
// Now accepts an onOpenModal callback instead of hardcoding Links
const ParallaxCard = ({ 
    project, 
    index, 
    onOpenModal 
}: { 
    project: Project; 
    index: number; 
    onOpenModal: (p: Project) => void;
}) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.15]);
  
  const isModal = isBatchView(project.category);

  // Common inner content
  const CardContent = (
    <>
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 border border-gray-100 mb-6 shadow-sm rounded-sm">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-20 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full items-center justify-center hidden group-hover:flex opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
               {/* Show different icon based on interaction type */}
               {isModal ? <Layers className="w-5 h-5 text-black" /> : <ArrowUpRight className="w-5 h-5 text-black" />}
            </div>
          </div>
          <motion.div style={{ y, scale }} className="relative w-full h-full">
            {project.image_url ? (
              <Image src={project.image_url} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                <span className="text-xs uppercase tracking-widest">No Preview</span>
              </div>
            )}
          </motion.div>
        </div>
        <div className="flex flex-col items-start space-y-3 pr-8">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent/80 pl-[1px]">
            {project.category}
          </span>
          <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
        </div>
    </>
  );

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index % 2 === 0 ? 0 : 0.2 }}
      className="group w-full cursor-pointer"
    >
      {/* Conditional Wrapping: Link vs Div */}
      {isModal ? (
        <div onClick={() => onOpenModal(project)} className="block w-full">
            {CardContent}
        </div>
      ) : (
        <Link href={`/work/${project.id}`} className="block w-full">
            {CardContent}
        </Link>
      )}
    </motion.div>
  );
};

export default function WorkParallax({ projects }: { projects: Project[] }) {
  const [activeParent, setActiveParent] = useState("Highlights");
  const [activeSub, setActiveSub] = useState("All");
  
  // -- NEW STATE FOR MODAL --
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const clean = (str: string) => str.toLowerCase().trim();

    if (activeParent === "Highlights") {
      return projects.filter((p) => p.is_featured === true);
    }

    const allowedSubs = CATEGORY_MAP[activeParent] || [];

    if (activeSub === "All") {
      return projects.filter((p) => {
        const cat = clean(p.category);
        return cat === clean(activeParent) || allowedSubs.some(sub => clean(sub) === cat);
      });
    }

    return projects.filter((p) => clean(p.category) === clean(activeSub));
  }, [activeParent, activeSub, projects]);

  const handleParentClick = (parent: string) => {
    setActiveParent(parent);
    setActiveSub("All");
  };

  return (
    <div className="flex flex-col gap-12">
      
      {/* --- ADDED GALLERY MODAL --- */}
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

      {/* FILTERS */}
      <div className="flex flex-col gap-8 items-center md:items-start">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
           <button
              onClick={() => handleParentClick("Highlights")}
              className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeParent === "Highlights" ? "bg-foreground text-background shadow-md transform scale-105" : "bg-transparent text-gray-500 hover:text-foreground hover:bg-gray-100"}`}
            >
              Highlights
          </button>
          
          {Object.keys(CATEGORY_MAP).map((parent) => (
            <button
              key={parent}
              onClick={() => handleParentClick(parent)}
              className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${activeParent === parent ? "bg-foreground text-background shadow-md transform scale-105" : "bg-transparent text-gray-500 hover:text-foreground hover:bg-gray-100"}`}
            >
              {parent}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeParent !== "Highlights" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-gray-100"
            >
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Filter:</span>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={() => setActiveSub("All")}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${activeSub === "All" ? "bg-gray-800 text-white border-gray-800 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-gray-800 hover:text-gray-900"}`}
                >
                  All {activeParent}
                </button>
                {CATEGORY_MAP[activeParent].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSub(sub)}
                    className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${activeSub === sub ? "bg-gray-800 text-white border-gray-800 shadow-md" : "bg-white text-gray-600 border-gray-300 hover:border-gray-800 hover:text-gray-900"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GRID */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 md:gap-y-32">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ParallaxCard 
                key={project.id} 
                project={project} 
                index={index} 
                onOpenModal={(p) => {
                    setSelectedProject(p);
                    setIsGalleryOpen(true);
                }}
            />
          ))}
        </AnimatePresence>
        {filteredProjects.length === 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 py-24 text-center text-gray-400 font-light">
             No projects found.
           </motion.div>
        )}
      </motion.div>
    </div>
  );
}