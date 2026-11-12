import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  buildProjectEditorialContent,
  isOptimizableImageSrc,
  optimizeCloudinaryUrl,
  resolveImageDimensions,
  type ImageDimension,
} from "../../../lib/project-mappers";
import {
  getProjectDetailBySlugOrId,
  getPublishedProjects,
} from "../../../lib/supabase";
import { ScrollReveal } from "../../../components/ScrollReveal";

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

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Live Project";
  }
}

function ProjectImageFrame({
  src,
  alt,
  dimension,
  sizes,
  maxWidth,
  priority = false,
}: {
  src: string;
  alt: string;
  dimension?: ImageDimension;
  sizes: string;
  maxWidth: number;
  priority?: boolean;
}) {
  const optimizedSrc = optimizeCloudinaryUrl(src, maxWidth);
  const unoptimized = !isOptimizableImageSrc(optimizedSrc);

  if (dimension?.width && dimension?.height) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        width={dimension.width}
        height={dimension.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        unoptimized={unoptimized}
        className="w-full h-auto block bg-muted/30"
      />
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] bg-muted/30">
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding={priority ? undefined : "async"}
        unoptimized={unoptimized}
        className="object-cover object-top"
      />
    </div>
  );
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

  const editorial = buildProjectEditorialContent(project);
  const mediaUrlsToProbe = [
    project.image_url,
    ...editorial.screenshots.map((item) => item.url),
  ].filter(Boolean);

  const dimensions = await resolveImageDimensions(mediaUrlsToProbe);
  const heroDimension = project.image_url
    ? dimensions[project.image_url]
    : undefined;
  const technologiesDisplay =
    editorial.technologies.length > 0
      ? editorial.technologies
      : [project.category, project.project_url ? "Production Web" : "Product Design"];

  return (
    <article className="min-h-screen bg-background text-foreground font-sans selection:bg-sky-500/20">
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 md:pt-36">
        {/* Top Utility Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border/70">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to projects
          </Link>

          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <span>{getHostname(project.project_url)}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>

        {/* 1. HERO SECTION */}
        <header className="pt-10 md:pt-14 pb-12 md:pb-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted-foreground mb-5">
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {project.category}
            </span>
            {project.year && (
              <>
                <span aria-hidden="true" className="text-border">
                  /
                </span>
                <span>{project.year}</span>
              </>
            )}
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span>{editorial.status}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-foreground leading-[1.08] max-w-4xl">
            {project.title}
          </h1>

          <p className="mt-5 md:mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {editorial.summary}
          </p>

          {editorial.tags.length > 0 && (
            <ul
              aria-label="Project technologies and scope"
              className="mt-6 flex flex-wrap gap-2"
            >
              {editorial.tags.map((tag) => (
                <li
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border rounded bg-background"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Large Hero Preview Media */}
          <div className="mt-10 md:mt-14 overflow-hidden rounded-lg border border-border/80 bg-muted/30">
            {project.preview_video_url ? (
              <video
                src={optimizeCloudinaryUrl(project.preview_video_url, 1600, "video")}
                autoPlay
                muted
                loop
                playsInline
                controls
                poster={
                  project.image_url
                    ? optimizeCloudinaryUrl(project.image_url, 1600)
                    : undefined
                }
                className="w-full h-auto block max-h-[75vh] object-contain bg-black/5 dark:bg-white/5"
              />
            ) : project.image_url ? (
              <ProjectImageFrame
                src={project.image_url}
                alt={`${project.title} preview`}
                dimension={heroDimension}
                sizes="(max-width: 768px) 100vw, 960px"
                maxWidth={1600}
                priority
              />
            ) : (
              <div className="w-full aspect-[16/10] flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                No Preview Available
              </div>
            )}
          </div>
        </header>

        {/* 2. PROJECT INFORMATION */}
        <section
          aria-labelledby="project-info-heading"
          className="border-t border-border/70 py-14 md:py-20"
        >
          <h2 id="project-info-heading" className="sr-only">
            Project Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Metadata Column */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="pb-5 border-b border-border/60">
                <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                  My Role
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {editorial.role}
                </p>
              </div>

              <div className="pb-5 border-b border-border/60 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Category
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    {project.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Year
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    {project.year || "Archive"}
                  </p>
                </div>
              </div>

              <div className="pb-5 border-b border-border/60">
                <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-2">
                  Technologies Used
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {technologiesDisplay.join(" · ")}
                </p>
              </div>

              {project.project_url && (
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">
                    Live Link
                  </h3>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                  >
                    <span>Visit website</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              )}
            </aside>

            {/* Right Editorial Narrative Column */}
            <div className="lg:col-span-8 space-y-10">
              <ScrollReveal yOffset={12} scale={1} duration={0.45}>
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600 dark:text-sky-400 mb-3">
                  Overview
                </h3>
                <p className="text-base md:text-lg leading-[1.75] text-foreground/90 max-w-2xl">
                  {editorial.overview}
                </p>
              </ScrollReveal>

              <ScrollReveal
                yOffset={12}
                scale={1}
                duration={0.45}
                className="border-t border-border/60 pt-8"
              >
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-3">
                  Challenge
                </h3>
                <p className="text-sm md:text-base leading-[1.75] text-muted-foreground max-w-2xl">
                  {editorial.challenge}
                </p>
              </ScrollReveal>

              <ScrollReveal
                yOffset={12}
                scale={1}
                duration={0.45}
                className="border-t border-border/60 pt-8"
              >
                <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-foreground mb-3">
                  Solution
                </h3>
                <p className="text-sm md:text-base leading-[1.75] text-muted-foreground max-w-2xl">
                  {editorial.solution}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 3. PROJECT SCREENSHOTS */}
        {editorial.screenshots.length > 0 && (
          <section
            aria-labelledby="project-screenshots-heading"
            className="border-t border-border/70 py-14 md:py-20"
          >
            <div className="flex items-baseline justify-between gap-4 mb-10">
              <h2
                id="project-screenshots-heading"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground"
              >
                Project Screenshots
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {String(editorial.screenshots.length).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
              {editorial.screenshots.map((shot, index) => {
                const useSplitLayout =
                  editorial.screenshots.length >= 3 && index % 3 !== 0;
                const colSpanClass = useSplitLayout
                  ? "md:col-span-6"
                  : "md:col-span-12";
                const shotDimension = dimensions[shot.url];

                return (
                  <ScrollReveal
                    key={shot.url}
                    yOffset={14}
                    scale={1}
                    duration={0.5}
                    className={colSpanClass}
                  >
                    <figure className="group">
                      <div className="overflow-hidden rounded-lg border border-border/80 bg-muted/30">
                        <ProjectImageFrame
                          src={shot.url}
                          alt={
                            shot.caption ||
                            `${project.title} screenshot ${index + 1}`
                          }
                          dimension={shotDimension}
                          sizes={
                            useSplitLayout
                              ? "(max-width: 768px) 100vw, 480px"
                              : "(max-width: 768px) 100vw, 960px"
                          }
                          maxWidth={useSplitLayout ? 1100 : 1600}
                        />
                      </div>
                      <figcaption className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {shot.caption ||
                            `Screen ${String(index + 1).padStart(2, "0")}`}
                        </span>
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. FEATURES */}
        {editorial.features.length > 0 && (
          <section
            aria-labelledby="project-features-heading"
            className="border-t border-border/70 py-14 md:py-20"
          >
            <div className="mb-10">
              <h2
                id="project-features-heading"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground"
              >
                Key Features
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {editorial.features.map((feature, index) => (
                <ScrollReveal
                  key={feature.title}
                  yOffset={10}
                  scale={1}
                  duration={0.4}
                  delay={index * 0.04}
                  className="border-t border-border/60 pt-5"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base md:text-lg font-medium text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  {feature.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground pl-7">
                      {feature.description}
                    </p>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* 5. BOTTOM NAVIGATION */}
        <footer className="border-t border-border/70 py-12 md:py-16">
          <nav
            aria-label="Project navigation"
            className="grid grid-cols-1 sm:grid-cols-3 items-center gap-8"
          >
            {/* Previous Project */}
            <div className="flex justify-start">
              {previousProject ? (
                <Link
                  href={`/work/${previousProject.slug}`}
                  className="group inline-flex flex-col items-start gap-1 text-left"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    <ArrowLeft className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    Previous project
                  </span>
                  <span className="text-sm md:text-base font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {previousProject.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>

            {/* Back to Projects */}
            <div className="flex sm:justify-center">
              <Link
                href="/#work"
                className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-colors"
              >
                Back to projects
              </Link>
            </div>

            {/* Next Project */}
            <div className="flex sm:justify-end">
              {nextProject ? (
                <Link
                  href={`/work/${nextProject.slug}`}
                  className="group inline-flex flex-col sm:items-end gap-1 sm:text-right"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Next project
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-sm md:text-base font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>
        </footer>
      </div>
    </article>
  );
}
