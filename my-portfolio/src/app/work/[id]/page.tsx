import { supabase } from "../../../lib/supabase"; // Go up 3 levels to find lib
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// 1. Define the exact shape of your database row
interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  year: string;
  description: string;
  image_url: string;
}

// 2. Server Component: Fetches data before rendering
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 3. Fetch the specific project from Supabase DB
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  // If ID doesn't exist in DB, show 404
  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-24 font-sans">
      {/* Navigation / Back Button */}
      <nav className="px-6 md:px-12 py-8 border-b border-border flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <Link href="/" className="group flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors">
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
          {/* Title with simple CSS animation */}
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {project.title}
          </h1>

          {/* Details Grid */}
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-24 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
            
            <div className="w-full md:w-1/3 space-y-6">
              {/* Role Section */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Role</p>
                <p className="font-medium text-lg">{project.role || "Designer"}</p>
              </div>

              {/* Year Section */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Year</p>
                <p className="font-medium text-lg">{project.year || "2024"}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="w-full md:w-2/3">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Large Image Display */}
      <section className="px-6 md:px-12 mb-20">
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-gray-50 border border-gray-100 rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-backwards">
          {project.image_url ? (
            <Image 
              src={project.image_url} 
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              No Image Available
            </div>
          )}
        </div>
      </section>

      {/* Next Project Link */}
      <div className="flex justify-center mt-32">
        <Link href="/" className="text-2xl md:text-4xl font-medium hover:text-accent transition-colors">
          View All Projects →
        </Link>
      </div>
    </article>
  );
}