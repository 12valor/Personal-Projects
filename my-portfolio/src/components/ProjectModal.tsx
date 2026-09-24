"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import type { SerializedProject } from "../lib/project-mappers";
import { Button } from "./ui/button";

interface ProjectModalProps {
  project: SerializedProject;
}

export default function ProjectModal({ project }: ProjectModalProps) {
  const router = useRouter();
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-card text-foreground rounded-2xl md:rounded-3xl border border-border shadow-2xl no-scrollbar animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col"
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-card/90 backdrop-blur-md border-b border-border/60">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Case Study Modal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/work/${project.id}`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-muted"
            >
              Standalone View <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 hover:rotate-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Media */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted">
          {project.preview_video_url ? (
            <video
              src={project.preview_video_url}
              autoPlay
              muted
              loop
              playsInline
              poster={project.image_url || undefined}
              className="w-full h-full object-cover object-top"
            />
          ) : project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover object-top"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
              No Cover Preview
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="px-6 md:px-12 py-8 md:py-12 space-y-8">
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              {project.title}
            </h2>
            {project.description && (
              <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl whitespace-pre-wrap">
                {project.description}
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border/60 pt-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
                Category
              </span>
              <p className="text-sm font-semibold">{project.category}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
                Role
              </span>
              <p className="text-sm font-semibold">{project.role || "Developer / Designer"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
                Year
              </span>
              <p className="text-sm font-semibold">{project.year || "2025"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
                Link
              </span>
              {project.project_url ? (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold hover:text-accent-hover transition-colors inline-flex items-center gap-1 group"
                >
                  Live Demo <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Private</p>
              )}
            </div>
          </div>

          {/* Gallery Images Unrolled */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-border/60">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                Project Gallery
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {project.gallery_urls.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-[16/10] overflow-hidden rounded-xl md:rounded-2xl bg-muted border border-border/50"
                  >
                    <Image
                      src={url}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full px-6"
            >
              Back to Works
            </Button>

            {project.project_url && (
              <Button asChild className="rounded-full px-6">
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Visit Project <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
