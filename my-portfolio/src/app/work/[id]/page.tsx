"use client";
import React from "react"; // Explicit import for React.use
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock Data (matches your Grid)
const projects = [
  { 
    id: 1, 
    title: "Lumina Interface", 
    category: "UI/UX Design", 
    year: "2024",
    description: "A comprehensive interface overhaul for a smart home lighting system. The goal was to reduce cognitive load while increasing accessibility. We utilized a stark, monochromatic palette to let the content shine.",
    src: "/p1.jpg",
    content: "/p1-detail.jpg" // You can use the same image for now
  },
  { 
    id: 2, 
    title: "TechReview 2024", 
    category: "YouTube Editing", 
    year: "2023",
    description: "High-retention editing for a tech channel with 500k subscribers. Focus on rhythm, sound design, and information density without overwhelming the viewer.",
    src: "/p2.jpg",
    content: "/p2-detail.jpg"
  },
  // Add more if needed matching your Grid IDs
  { id: 3, title: "Apex Branding", category: "UI/UX Design", year: "2023", description: "Identity design.", src: "/p3.jpg", content: "/p3.jpg" },
  { id: 4, title: "Minimalist Daily", category: "YouTube Editing", year: "2024", description: "Vlog editing.", src: "/p4.jpg", content: "/p4.jpg" },
];

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params);
  
  // Find project
  const project = projects.find((p) => p.id.toString() === resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-24">
      {/* Navigation / Back Button */}
      <nav className="px-6 md:px-12 py-8 border-b border-border flex justify-between items-center sticky top-0 bg-background/90 backdrop-blur-sm z-50">
        <Link href="/" className="group flex items-center gap-2 text-sm font-medium">
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to Works
        </Link>
        <span className="text-xs font-semibold tracking-widest uppercase text-accent">
          {project.category}
        </span>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-semibold mb-6 leading-tight"
          >
            {project.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-start gap-8 md:gap-24 border-t border-gray-100 pt-8"
          >
            <div className="w-full md:w-1/3">
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="font-medium">{project.category}</p>
            </div>
            <div className="w-full md:w-1/3">
              <p className="text-sm text-gray-400 mb-1">Year</p>
              <p className="font-medium">{project.year}</p>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-lg leading-relaxed text-gray-700">
                {project.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Large Image Display */}
      <section className="px-6 md:px-12 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative w-full aspect-video md:aspect-[21/9] bg-gray-50 border border-gray-100 rounded-sm overflow-hidden"
        >
          {/* Using the same image as placeholder if 'content' image is missing */}
          <Image 
            src={project.content || project.src} 
            alt="Project Detail"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Next Project (Optional Micro-interaction) */}
      <div className="flex justify-center mt-32">
        <Link href="/" className="text-2xl md:text-4xl font-medium hover:text-accent transition-colors">
          Next Project →
        </Link>
      </div>
    </article>
  );
}