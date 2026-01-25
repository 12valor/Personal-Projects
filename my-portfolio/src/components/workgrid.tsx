"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Mock Data
const projects = [
  { id: 1, title: "Lumina Interface", category: "UI/UX Design", src: "/p1.jpg" },
  { id: 2, title: "TechReview 2024", category: "YouTube Editing", src: "/p2.jpg" },
  { id: 3, title: "Apex Branding", category: "UI/UX Design", src: "/p3.jpg" },
  { id: 4, title: "Minimalist Daily", category: "YouTube Editing", src: "/p4.jpg" },
];

export default function WorkGrid() {
  return (
    <section id="work" className="px-6 md:px-16 py-24 bg-background">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-16 border-b border-border pb-6">
        <h2 className="text-3xl font-medium text-foreground">Selected Works</h2>
        <span className="text-sm text-gray-400 hidden md:block">(04) Projects</span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {projects.map((project) => (
          <Link 
            href={`/work/${project.id}`} 
            key={project.id} 
            className="group cursor-pointer block"
          >
            {/* Image Container (Editorial Crop) */}
            <div className="overflow-hidden mb-6 border border-gray-100 bg-gray-50 relative aspect-[4/3]">
              <motion.div
                whileHover={{ scale: 1.03 }} // "Image slightly zooms (scale 1.03 max)"
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                {/* Ensure p1.jpg, p2.jpg etc exist in public/ folder */}
                <Image 
                  src={project.src} 
                  alt={project.title} 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Text Content - No "Card" Background */}
            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-accent">
                {project.category}
              </span>
              
              <div className="relative inline-block">
                <h3 className="text-2xl font-medium text-foreground">
                  {project.title}
                </h3>
                {/* "Thin underline slides in from left" */}
                <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}