import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  AlertCircle,
  Lightbulb,
  FileText,
  ExternalLink,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../../../lib/supabase";
import { serializeProject, type SerializedProject } from "../../../lib/project-mappers";
import { checkAuth } from "../../actions";
import { Button } from "../../../components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

async function getProjectBySlugOrId(slugOrId: string): Promise<PortfolioProjectRow | null> {
  const supabase = getSupabaseServerClient();

  // Try matching slug first
  const { data: bySlug, error: slugError } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slugOrId)
    .maybeSingle<PortfolioProjectRow>();

  if (!slugError && bySlug) {
    return bySlug;
  }

  // If not found by slug, and slugOrId is numeric, try matching ID
  const numericId = Number(slugOrId);
  if (!Number.isNaN(numericId)) {
    const { data: byId } = await supabase
      .from("projects")
      .select("*")
      .eq("id", numericId)
      .maybeSingle<PortfolioProjectRow>();

    if (byId) return byId;
  }

  // Fallback scan (for projects where slug wasn't stored in a dedicated column)
  const { data: allProjects } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false })
    .returns<PortfolioProjectRow[]>();

  if (allProjects) {
    const matched = allProjects.find((p) => {
      const serialized = serializeProject(p);
      return serialized.slug === slugOrId || String(serialized.id) === slugOrId;
    });
    if (matched) return matched;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projectRecord = await getProjectBySlugOrId(slug);

  if (!projectRecord) {
    return { title: "Hardware Project Not Found" };
  }

  const project = serializeProject(projectRecord);
  const caseStudy = project.case_study;

  const pageTitle = caseStudy?.seo_title || `${project.title} — Hardware Case Study`;
  const pageDescription =
    caseStudy?.seo_description ||
    project.description ||
    `Technical hardware case study and system architecture for ${project.title}.`;

  const ogUrl = `/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(
    project.category || "Hardware Case Study"
  )}&role=${encodeURIComponent(project.role || "Hardware Engineer")}`;

  const canonicalUrl = `https://12valor.vercel.app/hardware/${project.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} Hardware Case Study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogUrl],
    },
  };
}

export default async function HardwareCaseStudyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isPreviewMode = resolvedSearchParams?.preview === "true";

  const projectRecord = await getProjectBySlugOrId(slug);
  if (!projectRecord) {
    notFound();
  }

  const project: SerializedProject = serializeProject(projectRecord);
  const isAuthenticated = await checkAuth();

  // Security gate: If project is unpublished, only authenticated admins can view it
  if (project.is_published === false && !isAuthenticated && !isPreviewMode) {
    notFound();
  }

  const caseStudy = project.case_study;
  const status = caseStudy?.status || "Working Prototype";
  const duration = caseStudy?.duration || project.year;
  const role = project.role || "Hardware Designer & Firmware Developer";

  // Fetch related hardware projects if available
  let relatedProjects: SerializedProject[] = [];
  try {
    const supabase = getSupabaseServerClient();
    const { data: candidateProjects } = await supabase
      .from("projects")
      .select("*")
      .neq("id", project.id)
      .limit(6)
      .returns<PortfolioProjectRow[]>();

    if (candidateProjects) {
      relatedProjects = candidateProjects
        .map(serializeProject)
        .filter((p) => p.is_published !== false)
        .slice(0, 2);
    }
  } catch {
    relatedProjects = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.description,
    image: project.image_url ? [project.image_url] : undefined,
    author: {
      "@type": "Person",
      name: "AG Diaz Evangelista",
      url: "https://12valor.vercel.app",
    },
    publisher: {
      "@type": "Person",
      name: "AG Diaz Evangelista",
    },
    datePublished: project.created_at,
    dateModified: project.updated_at,
  };

  return (
    <article className="min-h-screen bg-background text-foreground pb-20 selection:bg-accent-light/35">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Draft Preview Notification Banner */}
      {project.is_published === false && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md">
          <AlertCircle className="w-4 h-4" />
          <span>DRAFT PREVIEW MODE — This hardware project is currently unpublished and hidden from public visitors.</span>
        </div>
      )}

      {/* --- RESPONSIVE STICKY NAVIGATION --- */}
      <nav className={`fixed top-0 z-50 w-full bg-gradient-to-b from-background/90 via-background/60 to-transparent backdrop-blur-md border-b border-border/40 text-foreground transition-all duration-300 ${project.is_published === false ? "mt-8" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 md:h-20 flex justify-between items-center">
          <Link
            href="/#hardware"
            className="group flex items-center gap-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 rounded-full bg-muted/60 group-hover:-translate-x-1 transition-transform duration-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="tracking-wide">Back to Hardware Projects</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-mono uppercase text-muted-foreground">
              {project.category}
            </span>
            {project.project_url && (
              <Button asChild size="sm" variant="outline" className="rounded-full gap-1.5 text-xs font-medium">
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <span>Repository / Specs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for sticky header */}
      <div className={`h-24 md:h-28 ${project.is_published === false ? "pt-8" : ""}`} />

      {/* --- 1. PROJECT OVERVIEW & HERO SECTION --- */}
      <header className="max-w-5xl mx-auto px-6 md:px-10 pt-4 pb-12 md:pb-16">
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
          {status && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {status}
            </span>
          )}
          {duration && (
            <span className="text-xs font-mono text-muted-foreground/80 ml-auto">
              {duration}
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-8">
          {project.title}
        </h1>

        {project.description && (
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-4xl font-normal">
            {project.description}
          </p>
        )}

        {/* Overview Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border/60 pt-8 mt-10">
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Category</h4>
            <p className="mt-1 text-sm font-medium text-foreground">{project.category}</p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Role</h4>
            <p className="mt-1 text-sm font-medium text-foreground">{role}</p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Timeline / Duration</h4>
            <p className="mt-1 text-sm font-medium text-foreground">{duration || "Documented Build"}</p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Status</h4>
            <p className="mt-1 text-sm font-medium text-foreground">{status}</p>
          </div>
        </div>
      </header>

      {/* --- HERO MEDIA CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 mb-16 md:mb-24">
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border border-border/60 bg-muted/20 shadow-xl shadow-black/5 dark:shadow-black/25">
          {project.preview_video_url ? (
            <video
              src={project.preview_video_url}
              autoPlay
              muted
              loop
              playsInline
              controls
              poster={project.image_url || undefined}
              className="w-full h-full object-cover object-center"
            />
          ) : project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
              <Cpu className="w-16 h-16 stroke-1 mb-2 opacity-50" />
              <span className="text-xs uppercase tracking-widest font-mono">Hardware Build Documentation</span>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN TECHNICAL CONTENT BODY --- */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 space-y-20 md:space-y-28">

        {/* --- 2. PROBLEM & MOTIVATION --- */}
        {caseStudy?.problem_statement && (
          <section className="space-y-4 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span>Problem &amp; Motivation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              The Engineering Challenge
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {caseStudy.problem_statement}
            </div>
          </section>
        )}

        {/* --- 3. PROJECT OBJECTIVES --- */}
        {caseStudy?.objectives && caseStudy.objectives.length > 0 && (
          <section className="space-y-6 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Project Objectives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Design Goals &amp; Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseStudy.objectives.map((obj, idx) => (
                <div
                  key={`obj-${idx}`}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm"
                >
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90">{obj}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 4. SYSTEM DESIGN & ARCHITECTURE --- */}
        {(caseStudy?.system_design?.architecture ||
          caseStudy?.system_design?.operating_principle ||
          caseStudy?.system_design?.block_diagram_url ||
          caseStudy?.system_design?.schematic_url) && (
          <section className="space-y-8 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Layers className="w-4 h-4 text-accent" />
              <span>System Design &amp; Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              How the Hardware &amp; Firmware Interact
            </h2>

            {caseStudy.system_design.architecture && (
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {caseStudy.system_design.architecture}
              </p>
            )}

            {/* Circuit / Block Diagram Media */}
            {(caseStudy.system_design.block_diagram_url || caseStudy.system_design.schematic_url) && (
              <div className="space-y-4">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/70 bg-card/60 p-4">
                  <Image
                    src={caseStudy.system_design.block_diagram_url || caseStudy.system_design.schematic_url!}
                    alt="System Architecture Diagram"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="text-center text-xs font-mono text-muted-foreground">
                  Figure 1.0 — System block diagram &amp; inter-modular communication bus.
                </p>
              </div>
            )}

            {caseStudy.system_design.operating_principle && (
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8 space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Operating Principle
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {caseStudy.system_design.operating_principle}
                </p>
              </div>
            )}
          </section>
        )}

        {/* --- 5. COMPONENTS & TECHNOLOGIES (BOM & TOOLCHAIN) --- */}
        {((caseStudy?.hardware_components && caseStudy.hardware_components.length > 0) ||
          (caseStudy?.software_tools && caseStudy.software_tools.length > 0)) && (
          <section className="space-y-8 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Cpu className="w-4 h-4 text-accent" />
              <span>Components &amp; Technologies</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Hardware Bill of Materials &amp; Toolchain
            </h2>

            {/* Hardware BOM Table */}
            {caseStudy?.hardware_components && caseStudy.hardware_components.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border/60 bg-muted/30 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3.5 font-semibold">Component</th>
                        <th className="px-5 py-3.5 font-semibold">Role / Subsystem</th>
                        <th className="px-5 py-3.5 font-semibold">Specification</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono text-xs sm:text-sm">
                      {caseStudy.hardware_components.map((comp, idx) => (
                        <tr key={`comp-row-${idx}`} className="hover:bg-muted/10 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            {comp.link ? (
                              <a
                                href={comp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-accent inline-flex items-center gap-1"
                              >
                                {comp.name}
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            ) : (
                              comp.name
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{comp.role || "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{comp.spec || "—"}</td>
                          <td className="px-5 py-3.5 text-right text-foreground">{comp.count || 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Software & Firmware Tools Chips */}
            {caseStudy?.software_tools && caseStudy.software_tools.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Firmware &amp; Software Toolchain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.software_tools.map((tool, idx) => (
                    <span
                      key={`tool-tag-${idx}`}
                      className="rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-mono font-medium text-foreground shadow-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- 6. IMPLEMENTATION PROCESS --- */}
        {caseStudy?.implementation_steps && caseStudy.implementation_steps.length > 0 && (
          <section className="space-y-8 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Wrench className="w-4 h-4 text-accent" />
              <span>Implementation Process</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Step-by-Step Engineering Build
            </h2>

            <div className="space-y-12">
              {caseStudy.implementation_steps.map((step, idx) => {
                const stepNum = step.step_number || idx + 1;
                return (
                  <div
                    key={`step-${idx}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start p-6 sm:p-8 rounded-2xl border border-border/60 bg-card/30"
                  >
                    {/* Step description */}
                    <div className={step.image_url ? "md:col-span-7 space-y-3" : "md:col-span-12 space-y-3"}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground font-mono text-xs font-bold">
                          {String(stepNum).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap pl-10">
                        {step.description}
                      </p>
                    </div>

                    {/* Optional step illustration */}
                    {step.image_url && (
                      <div className="md:col-span-5 space-y-2">
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border/60 bg-muted/20">
                          <Image
                            src={step.image_url}
                            alt={step.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        {step.caption && (
                          <p className="text-xs font-mono text-muted-foreground/80 text-center">
                            {step.caption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* --- 7. CHALLENGES & SOLUTIONS --- */}
        {caseStudy?.challenges_solutions && caseStudy.challenges_solutions.length > 0 && (
          <section className="space-y-6 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Debugging &amp; Problem Solving</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Technical Challenges Encountered &amp; Resolved
            </h2>

            <div className="space-y-4">
              {caseStudy.challenges_solutions.map((item, idx) => (
                <div
                  key={`challenge-${idx}`}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                      Obstacle {idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-medium text-foreground">
                      {item.challenge}
                    </h3>
                  </div>

                  <div className="pl-4 border-l-2 border-emerald-500/60 ml-2 space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                      Implemented Resolution
                    </span>
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 8. TESTING & RESULTS --- */}
        {caseStudy?.testing_results && caseStudy.testing_results.length > 0 && (
          <section className="space-y-6 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Validation &amp; Verification</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Testing Methodology &amp; Observed Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.testing_results.map((tr, idx) => (
                <div
                  key={`test-${idx}`}
                  className="flex flex-col justify-between p-6 rounded-2xl border border-border/60 bg-card/40 space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                        Test Vector #{idx + 1}
                      </span>
                      {tr.verified !== false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-600 border border-amber-500/20">
                          Expected / Target
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      {tr.test}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Result:</strong> {tr.result}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- 9. GALLERY & DOCUMENTATION MEDIA --- */}
        {((caseStudy?.gallery_media && caseStudy.gallery_media.length > 0) ||
          (project.gallery_urls && project.gallery_urls.length > 0)) && (
          <section className="space-y-8 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <FileText className="w-4 h-4 text-accent" />
              <span>Gallery &amp; Documentation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Physical Assembly &amp; Oscilloscope Records
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Prefer structured gallery_media if present */}
              {caseStudy?.gallery_media && caseStudy.gallery_media.length > 0
                ? caseStudy.gallery_media.map((item, idx) => (
                    <figure key={`media-${idx}`} className="space-y-2 group">
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 bg-muted/20">
                        {item.media_type === "video" ? (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt={item.caption || `${project.title} documentation ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-102"
                            unoptimized
                          />
                        )}
                      </div>
                      {item.caption && (
                        <figcaption className="text-xs font-mono text-muted-foreground text-center px-2">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))
                : project.gallery_urls?.map((url, idx) => (
                    <figure key={`gal-${idx}`} className="space-y-2 group">
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 bg-muted/20">
                        <Image
                          src={url}
                          alt={`${project.title} documentation photo ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-102"
                          unoptimized
                        />
                      </div>
                    </figure>
                  ))}
            </div>
          </section>
        )}

        {/* --- 10. REFLECTION & FUTURE IMPROVEMENTS --- */}
        {caseStudy?.reflection_and_improvements && (
          <section className="space-y-4 border-t border-border/40 pt-12 md:pt-16">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Lightbulb className="w-4 h-4 text-accent" />
              <span>Reflection &amp; Future Scope</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Lessons Learned &amp; Hardware Iteration Roadmap
            </h2>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {caseStudy.reflection_and_improvements}
              </p>
            </div>
          </section>
        )}

        {/* --- 11. RELATED PROJECTS & FOOTER NAVIGATION --- */}
        <section className="border-t border-border/40 pt-16 md:pt-24 space-y-12">
          {relatedProjects.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Explore More Projects
                </h3>
                <Link
                  href="/#hardware"
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <span>All Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProjects.map((rel) => (
                  <Link
                    key={`rel-${rel.id}`}
                    href={`/hardware/${rel.slug || rel.id}`}
                    className="group flex gap-4 p-4 rounded-xl border border-border/60 bg-card/30 hover:border-border transition-all"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted/30">
                      {rel.image_url ? (
                        <Image
                          src={rel.image_url}
                          alt={rel.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Cpu className="w-full h-full p-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">
                        {rel.category}
                      </span>
                      <h4 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {rel.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-border/40">
            <Button asChild size="lg" variant="outline" className="rounded-full px-6 gap-2">
              <Link href="/#hardware">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Hardware Projects</span>
              </Link>
            </Button>

            {project.project_url && (
              <Button asChild size="lg" className="rounded-full px-8 gap-2 font-medium">
                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                  <span>View Project Source</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </section>

      </main>
    </article>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}
