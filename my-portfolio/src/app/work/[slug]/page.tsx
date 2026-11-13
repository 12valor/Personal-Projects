import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildProjectEditorialContent,
  resolveImageDimensions,
} from "../../../lib/project-mappers";
import {
  getProjectDetailBySlugOrId,
  getPublishedProjects,
} from "../../../lib/supabase";
import ProjectShowcase from "../../../components/ProjectShowcase";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProjectDetailBySlugOrId(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const editorial = buildProjectEditorialContent(project);
  const title = project.case_study?.seo_title || `${project.title} — AG Diaz Evangelista`;
  const description =
    project.case_study?.seo_description ||
    editorial.summary ||
    `Case study for ${project.title}`;

  const ogUrl = `/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(
    project.category || "Case Study"
  )}&role=${encodeURIComponent(editorial.role)}`;

  return {
    title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [ogUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const projects = await getPublishedProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.warn(
      "Supabase connection failed during build inside generateStaticParams. Skipping static pre-generation.",
      error
    );
    return [];
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project, previousProject, nextProject } =
    await getProjectDetailBySlugOrId(slug);

  if (!project) {
    notFound();
  }

  const mediaUrls = [
    project.image_url,
    ...(project.gallery_urls ?? []),
  ].filter(Boolean);

  const dimensions = await resolveImageDimensions(mediaUrls);

  return (
    <ProjectShowcase
      project={project}
      previousProject={previousProject}
      nextProject={nextProject}
      isModal={false}
      initialDimensions={dimensions}
    />
  );
}
