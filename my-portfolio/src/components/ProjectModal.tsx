"use client";

import React from "react";
import ProjectShowcase from "./ProjectShowcase";
import type { SerializedProject, ImageDimension } from "../lib/project-mappers";

interface ProjectModalProps {
  project: SerializedProject;
  previousProject?: SerializedProject | null;
  nextProject?: SerializedProject | null;
  initialDimensions?: Record<string, ImageDimension>;
}

export default function ProjectModal({
  project,
  previousProject,
  nextProject,
  initialDimensions,
}: ProjectModalProps) {
  return (
    <ProjectShowcase
      project={project}
      previousProject={previousProject}
      nextProject={nextProject}
      isModal={true}
      initialDimensions={initialDimensions}
    />
  );
}
