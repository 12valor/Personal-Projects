"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  Upload,
  Layers,
  Wrench,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import type {
  HardwareCaseStudyData,
  HardwareComponent,
  ImplementationStep,
  ChallengeSolution,
  TestingResult,
} from "@/src/lib/supabase";
import { slugify, type SerializedProject } from "@/src/lib/project-mappers";
import { isHardwareProject } from "@/src/components/HardwareProjects";

interface HardwareManagerProps {
  projects: SerializedProject[];
  onRefreshProjects: () => Promise<void>;
  uploadFilesClientSide: (files: File[]) => Promise<string[]>;
  uploadVideoClientSide: (file: File) => Promise<string>;
}

const HARDWARE_CATEGORIES = [
  "Embedded Systems",
  "IoT",
  "Arduino",
  "Electronics",
  "Robotics",
  "Hardware",
  "Firmware",
];

const STATUS_OPTIONS = [
  "Working Prototype",
  "Completed",
  "Field Tested",
  "In Development",
  "Concept / Design",
];

interface GalleryItem {
  url: string;
  caption: string;
}

export default function HardwareManager({
  projects,
  onRefreshProjects,
  uploadFilesClientSide,
  uploadVideoClientSide,
}: HardwareManagerProps) {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Base Info State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [manualSlug, setManualSlug] = useState(false);
  const [category, setCategory] = useState("Embedded Systems");
  const [status, setStatus] = useState("Working Prototype");
  const [role, setRole] = useState("Hardware Designer & Firmware Developer");
  const [duration, setDuration] = useState("");
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  // Media
  const [imageUrl, setImageUrl] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [blockDiagramUrl, setBlockDiagramUrl] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Case Study Sections
  const [problemStatement, setProblemStatement] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [architecture, setArchitecture] = useState("");
  const [operatingPrinciple, setOperatingPrinciple] = useState("");
  const [hardwareComponents, setHardwareComponents] = useState<HardwareComponent[]>([
    { name: "", role: "", spec: "", count: 1, link: "" },
  ]);
  const [softwareToolsInput, setSoftwareToolsInput] = useState("");
  const [implementationSteps, setImplementationSteps] = useState<ImplementationStep[]>([
    { title: "", description: "", image_url: "", caption: "" },
  ]);
  const [challengesSolutions, setChallengesSolutions] = useState<ChallengeSolution[]>([
    { challenge: "", solution: "" },
  ]);
  const [testingResults, setTestingResults] = useState<TestingResult[]>([
    { test: "", result: "", verified: true },
  ]);
  const [reflectionAndImprovements, setReflectionAndImprovements] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Filter hardware projects
  const hardwareProjects = useMemo(() => {
    return projects
      .filter((p) => isHardwareProject(p))
      .sort((a, b) => a.display_index - b.display_index);
  }, [projects]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!manualSlug) {
      setSlug(slugify(val));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setSlug("");
    setManualSlug(false);
    setCategory("Embedded Systems");
    setStatus("Working Prototype");
    setRole("Hardware Designer & Firmware Developer");
    setDuration("");
    setDisplayIndex(0);
    setIsFeatured(false);
    setIsPublished(true);
    setDescription("");
    setProjectUrl("");
    setImageUrl("");
    setPreviewVideoUrl("");
    setBlockDiagramUrl("");
    setGalleryItems([]);
    setProblemStatement("");
    setObjectives([""]);
    setArchitecture("");
    setOperatingPrinciple("");
    setHardwareComponents([{ name: "", role: "", spec: "", count: 1, link: "" }]);
    setSoftwareToolsInput("");
    setImplementationSteps([{ title: "", description: "", image_url: "", caption: "" }]);
    setChallengesSolutions([{ challenge: "", solution: "" }]);
    setTestingResults([{ test: "", result: "", verified: true }]);
    setReflectionAndImprovements("");
    setSeoTitle("");
    setSeoDescription("");
    setStatusMessage("");
  };

  const startCreate = () => {
    resetForm();
    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (project: SerializedProject) => {
    resetForm();
    setEditId(project.id);
    setTitle(project.title);
    setSlug(project.slug || slugify(project.title));
    setManualSlug(true);
    setCategory(project.category || "Embedded Systems");
    setRole(project.role || "Hardware Designer & Firmware Developer");
    setDuration(project.year || "");
    setDisplayIndex(project.display_index ?? 0);
    setIsFeatured(project.is_featured);
    setIsPublished(project.is_published !== false);
    setDescription(project.description || "");
    setProjectUrl(project.project_url || "");
    setImageUrl(project.image_url || "");
    setPreviewVideoUrl(project.preview_video_url || "");

    const cs: HardwareCaseStudyData = project.case_study || {};
    setStatus(cs.status || "Working Prototype");
    if (cs.duration) setDuration(cs.duration);
    setProblemStatement(cs.problem_statement || "");
    setObjectives(cs.objectives && cs.objectives.length > 0 ? cs.objectives : [""]);
    setArchitecture(cs.system_design?.architecture || "");
    setOperatingPrinciple(cs.system_design?.operating_principle || "");
    setBlockDiagramUrl(cs.system_design?.block_diagram_url || cs.system_design?.schematic_url || "");
    setHardwareComponents(
      cs.hardware_components && cs.hardware_components.length > 0
        ? cs.hardware_components
        : [{ name: "", role: "", spec: "", count: 1, link: "" }]
    );
    setSoftwareToolsInput(cs.software_tools ? cs.software_tools.join(", ") : "");
    setImplementationSteps(
      cs.implementation_steps && cs.implementation_steps.length > 0
        ? cs.implementation_steps
        : [{ title: "", description: "", image_url: "", caption: "" }]
    );
    setChallengesSolutions(
      cs.challenges_solutions && cs.challenges_solutions.length > 0
        ? cs.challenges_solutions
        : [{ challenge: "", solution: "" }]
    );
    setTestingResults(
      cs.testing_results && cs.testing_results.length > 0
        ? cs.testing_results
        : [{ test: "", result: "", verified: true }]
    );
    setReflectionAndImprovements(cs.reflection_and_improvements || "");
    setSeoTitle(cs.seo_title || "");
    setSeoDescription(cs.seo_description || "");

    if (cs.gallery_media && cs.gallery_media.length > 0) {
      setGalleryItems(cs.gallery_media.map((m) => ({ url: m.url, caption: m.caption || "" })));
    } else if (project.gallery_urls && project.gallery_urls.length > 0) {
      setGalleryItems(project.gallery_urls.map((url) => ({ url, caption: "" })));
    }

    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Upload Handlers
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage("Uploading cover image...");
    try {
      const [url] = await uploadFilesClientSide([file]);
      setImageUrl(url);
      setStatusMessage("Cover image uploaded.");
    } catch (err) {
      alert(`Cover upload failed: ${err}`);
      setStatusMessage("");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage("Uploading preview video...");
    try {
      const url = await uploadVideoClientSide(file);
      setPreviewVideoUrl(url);
      setStatusMessage("Preview video uploaded.");
    } catch (err) {
      alert(`Video upload failed: ${err}`);
      setStatusMessage("");
    }
  };

  const handleDiagramUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage("Uploading block diagram...");
    try {
      const [url] = await uploadFilesClientSide([file]);
      setBlockDiagramUrl(url);
      setStatusMessage("Diagram uploaded.");
    } catch (err) {
      alert(`Diagram upload failed: ${err}`);
      setStatusMessage("");
    }
  };

  const handleStepImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage(`Uploading step ${index + 1} image...`);
    try {
      const [url] = await uploadFilesClientSide([file]);
      setImplementationSteps((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], image_url: url };
        return copy;
      });
      setStatusMessage("Step image uploaded.");
    } catch (err) {
      alert(`Step image upload failed: ${err}`);
      setStatusMessage("");
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setStatusMessage(`Uploading ${files.length} gallery image(s)...`);
    try {
      const urls = await uploadFilesClientSide(files);
      setGalleryItems((prev) => [
        ...prev,
        ...urls.map((url) => ({ url, caption: "" })),
      ]);
      setStatusMessage("Gallery uploaded.");
    } catch (err) {
      alert(`Gallery upload failed: ${err}`);
      setStatusMessage("");
    }
  };

  // Quick Publish/Unpublish toggle from table
  const handleTogglePublish = async (project: SerializedProject) => {
    const nextStatus = !project.is_published;
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: nextStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      await onRefreshProjects();
    } catch (err) {
      alert(`Error toggling publication: ${err}`);
    }
  };

  const handleDelete = async (project: SerializedProject) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      await onRefreshProjects();
      alert("Project deleted.");
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  };

  const handleSubmit = async (publishState: boolean) => {
    if (!title.trim()) {
      alert("Please provide a project title.");
      return;
    }

    setLoading(true);
    setStatusMessage("Saving case study...");

    try {
      const finalSlug = slug.trim() ? slugify(slug) : slugify(title);

      // Construct structured case study object
      const caseStudyPayload: HardwareCaseStudyData = {
        status,
        duration: duration.trim() || undefined,
        problem_statement: problemStatement.trim() || undefined,
        objectives: objectives.map((o) => o.trim()).filter(Boolean),
        system_design: {
          architecture: architecture.trim() || undefined,
          operating_principle: operatingPrinciple.trim() || undefined,
          block_diagram_url: blockDiagramUrl || undefined,
        },
        hardware_components: hardwareComponents.filter((c) => c.name.trim()),
        software_tools: softwareToolsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        implementation_steps: implementationSteps.filter(
          (s) => s.title.trim() || s.description.trim()
        ),
        challenges_solutions: challengesSolutions.filter(
          (cs) => cs.challenge.trim() && cs.solution.trim()
        ),
        testing_results: testingResults.filter(
          (tr) => tr.test.trim() && tr.result.trim()
        ),
        gallery_media: galleryItems.map((item) => ({
          url: item.url,
          caption: item.caption.trim() || undefined,
          media_type: "image",
        })),
        reflection_and_improvements: reflectionAndImprovements.trim() || undefined,
        seo_title: seoTitle.trim() || undefined,
        seo_description: seoDescription.trim() || undefined,
      };

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        category,
        role: role.trim() || null,
        year: duration.trim() || null,
        description: description.trim() || null,
        image_url: imageUrl || null,
        gallery_urls: galleryItems.map((g) => g.url),
        preview_video_url: previewVideoUrl.trim() || null,
        is_featured: isFeatured,
        is_published: publishState,
        project_url: projectUrl.trim() || null,
        display_index: Number(displayIndex) || 0,
        case_study: caseStudyPayload,
      };

      const endpoint = editId ? `/api/projects/${editId}` : "/api/projects";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save hardware project");
      }

      await onRefreshProjects();
      alert(
        editId
          ? `Project updated (${publishState ? "Published" : "Draft saved"})!`
          : `Project created (${publishState ? "Published" : "Draft saved"})!`
      );
      setViewMode("list");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(`Save error: ${err instanceof Error ? err.message : err}`);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gray-700" />
            <span>Hardware Projects &amp; Case Studies</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage circuit designs, BOM components, firmware architecture, and technical documentation.
          </p>
        </div>

        {viewMode === "list" ? (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Hardware Project</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {editId && (
              <a
                href={`/hardware/${slug || editId}?preview=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </a>
            )}
          </div>
        )}
      </div>

      {statusMessage && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs font-medium text-blue-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* --- LIST VIEW --- */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {hardwareProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
              <Cpu className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <h3 className="text-sm font-semibold text-gray-900">No hardware projects registered</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Create your first hardware project case study to showcase PCB layouts, embedded firmware, and physical builds.
              </p>
              <button
                onClick={startCreate}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Build</span>
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-mono uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Category &amp; Status</th>
                    <th className="px-4 py-3 text-center">Order</th>
                    <th className="px-4 py-3 text-center">Publication</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hardwareProjects.map((proj) => {
                    const isPub = proj.is_published !== false;
                    const cs = proj.case_study;

                    return (
                      <tr key={proj.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              {proj.image_url ? (
                                <Image
                                  src={proj.image_url}
                                  alt={proj.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <Cpu className="w-full h-full p-3 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{proj.title}</div>
                              <div className="text-[11px] font-mono text-gray-500">
                                /hardware/{proj.slug || proj.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Status */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-medium text-gray-700">
                              {proj.category}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {cs?.status || "Prototype"}
                            </span>
                          </div>
                        </td>

                        {/* Display Index */}
                        <td className="px-4 py-3.5 text-center font-mono text-xs text-gray-600 font-bold">
                          {proj.display_index}
                        </td>

                        {/* Publication Toggle */}
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => handleTogglePublish(proj)}
                            title={isPub ? "Click to set as Draft" : "Click to Publish"}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold transition-colors ${
                              isPub
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPub ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {isPub ? "Published" : "Draft"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/hardware/${proj.slug || proj.id}?preview=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Preview Case Study"
                              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => startEdit(proj)}
                              title="Edit Project"
                              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(proj)}
                              title="Delete Project"
                              className="rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- FORM VIEW (CREATE / EDIT CASE STUDY) --- */}
      {viewMode === "form" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-10 shadow-sm">
          {/* Section 1: Overview */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-700" />
              <span>1. Project Overview &amp; Routing</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Smart LoRa Environmental Station"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    URL Slug *
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">
                    /hardware/{slug || "slug"}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setManualSlug(true);
                  }}
                  placeholder="smart-lora-station"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                >
                  {HARDWARE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Project Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={displayIndex}
                  onChange={(e) => setDisplayIndex(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  My Role &amp; Responsibilities
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Hardware Designer & Firmware Developer"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Timeline / Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 Months (Q3 2026)"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Short Summary (For Grid Previews &amp; SEO)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level engineering summary of the hardware build..."
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Project Source / Repository URL (Optional)
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-gray-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 w-4 h-4 text-black focus:ring-black"
                />
                <span>Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-gray-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-gray-300 w-4 h-4 text-black focus:ring-black"
                />
                <span>Publish Immediately (Checked = Public, Unchecked = Draft)</span>
              </label>
            </div>
          </div>

          {/* Section 2: Media */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-gray-700" />
              <span>2. Cover Photography &amp; Video Media</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Cover Image
                </label>
                {imageUrl && (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                    <Image
                      src={imageUrl}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>

              {/* Preview Video */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Preview Video (Optional Hover Reel)
                </label>
                {previewVideoUrl && (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 bg-black mb-2">
                    <video
                      src={previewVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Narrative */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-gray-700" />
              <span>3. Engineering Motivation &amp; Objectives</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Problem Statement &amp; Motivation
              </label>
              <textarea
                rows={4}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Why was this hardware device needed? What physical or operational constraints had to be solved?"
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>

            {/* Objectives */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Project Objectives &amp; Requirements
                </label>
                <button
                  type="button"
                  onClick={() => setObjectives((prev) => [...prev, ""])}
                  className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Goal
                </button>
              </div>

              {objectives.map((obj, idx) => (
                <div key={`obj-inp-${idx}`} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const copy = [...objectives];
                      copy[idx] = e.target.value;
                      setObjectives(copy);
                    }}
                    placeholder="e.g. Battery life > 180 days on a single 18650 cell"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setObjectives(objectives.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: System Architecture */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-700" />
              <span>4. System Design &amp; Architecture</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Architecture Description
              </label>
              <textarea
                rows={4}
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                placeholder="Explain the relationship between the MCU, power rails, sensor bus (I2C/SPI), radio transceivers, and firmware sleep routines..."
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Block Diagram / Schematic Image
              </label>
              {blockDiagramUrl && (
                <div className="relative h-44 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                  <Image
                    src={blockDiagramUrl}
                    alt="Diagram Preview"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleDiagramUpload}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Operating Principle
              </label>
              <textarea
                rows={3}
                value={operatingPrinciple}
                onChange={(e) => setOperatingPrinciple(e.target.value)}
                placeholder="Duty-cycle operating state machine, sampling frequency, interrupt handling, or telemetry telemetry transmission logic..."
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 5: Hardware BOM Manager */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-700" />
                <span>5. Hardware Bill of Materials (BOM)</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setHardwareComponents((prev) => [
                    ...prev,
                    { name: "", role: "", spec: "", count: 1, link: "" },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Component
              </button>
            </div>

            <div className="space-y-3">
              {hardwareComponents.map((comp, idx) => (
                <div
                  key={`bom-row-${idx}`}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-lg border border-gray-200 bg-gray-50/50"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => {
                        const copy = [...hardwareComponents];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setHardwareComponents(copy);
                      }}
                      placeholder="Component Name (e.g. ESP32-WROOM)"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={comp.role || ""}
                      onChange={(e) => {
                        const copy = [...hardwareComponents];
                        copy[idx] = { ...copy[idx], role: e.target.value };
                        setHardwareComponents(copy);
                      }}
                      placeholder="Subsystem (e.g. Main MCU)"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={comp.spec || ""}
                      onChange={(e) => {
                        const copy = [...hardwareComponents];
                        copy[idx] = { ...copy[idx], spec: e.target.value };
                        setHardwareComponents(copy);
                      }}
                      placeholder="Specification / Value"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      min={1}
                      value={comp.count || 1}
                      onChange={(e) => {
                        const copy = [...hardwareComponents];
                        copy[idx] = { ...copy[idx], count: parseInt(e.target.value) || 1 };
                        setHardwareComponents(copy);
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-center font-mono bg-white focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setHardwareComponents(hardwareComponents.filter((_, i) => i !== idx))
                      }
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Software &amp; Firmware Toolchain (Comma Separated)
              </label>
              <input
                type="text"
                value={softwareToolsInput}
                onChange={(e) => setSoftwareToolsInput(e.target.value)}
                placeholder="C/C++, ESP-IDF, FreeRTOS, KiCad, PlatformIO, MQTT, InfluxDB"
                className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 6: Implementation Steps */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-700" />
                <span>6. Ordered Development &amp; Assembly Steps</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setImplementationSteps((prev) => [
                    ...prev,
                    { title: "", description: "", image_url: "", caption: "" },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-4">
              {implementationSteps.map((step, idx) => (
                <div
                  key={`step-edit-${idx}`}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-700">
                      Step {idx + 1}
                    </span>
                    {implementationSteps.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setImplementationSteps(implementationSteps.filter((_, i) => i !== idx))
                        }
                        className="text-gray-400 hover:text-red-500 text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Step
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const copy = [...implementationSteps];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setImplementationSteps(copy);
                    }}
                    placeholder="Step Title (e.g. PCB Routing & Thermal Relief Verification)"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                  />

                  <textarea
                    rows={3}
                    value={step.description}
                    onChange={(e) => {
                      const copy = [...implementationSteps];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      setImplementationSteps(copy);
                    }}
                    placeholder="Technical description of the step..."
                    className="w-full border border-gray-300 rounded p-3 text-xs sm:text-sm bg-white focus:outline-none focus:border-black"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStepImageUpload(idx, e)}
                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[11px] file:bg-gray-200 file:text-gray-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={step.caption || ""}
                        onChange={(e) => {
                          const copy = [...implementationSteps];
                          copy[idx] = { ...copy[idx], caption: e.target.value };
                          setImplementationSteps(copy);
                        }}
                        placeholder="Image caption (optional)"
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {step.image_url && (
                    <div className="relative h-28 w-44 rounded overflow-hidden border border-gray-200 bg-white">
                      <Image
                        src={step.image_url}
                        alt="Step Image"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Challenges & Solutions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gray-700" />
                <span>7. Technical Challenges &amp; Implemented Solutions</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setChallengesSolutions((prev) => [
                    ...prev,
                    { challenge: "", solution: "" },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Challenge
              </button>
            </div>

            <div className="space-y-4">
              {challengesSolutions.map((cs, idx) => (
                <div
                  key={`cs-edit-${idx}`}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-700">
                      Challenge #{idx + 1}
                    </span>
                    {challengesSolutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setChallengesSolutions(challengesSolutions.filter((_, i) => i !== idx))
                        }
                        className="text-gray-400 hover:text-red-500 text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={cs.challenge}
                    onChange={(e) => {
                      const copy = [...challengesSolutions];
                      copy[idx] = { ...copy[idx], challenge: e.target.value };
                      setChallengesSolutions(copy);
                    }}
                    placeholder="Observed hardware or firmware issue (e.g. Inrush current causing MCU reset)"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                  />

                  <textarea
                    rows={2}
                    value={cs.solution}
                    onChange={(e) => {
                      const copy = [...challengesSolutions];
                      copy[idx] = { ...copy[idx], solution: e.target.value };
                      setChallengesSolutions(copy);
                    }}
                    placeholder="How it was diagnosed and resolved..."
                    className="w-full border border-gray-300 rounded p-3 text-xs sm:text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Testing & Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-gray-700" />
                <span>8. Testing Methodology &amp; Validation Results</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setTestingResults((prev) => [
                    ...prev,
                    { test: "", result: "", verified: true },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Test Vector
              </button>
            </div>

            <div className="space-y-4">
              {testingResults.map((tr, idx) => (
                <div
                  key={`tr-edit-${idx}`}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-700">
                      Test Case #{idx + 1}
                    </span>
                    {testingResults.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setTestingResults(testingResults.filter((_, i) => i !== idx))
                        }
                        className="text-gray-400 hover:text-red-500 text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={tr.test}
                    onChange={(e) => {
                      const copy = [...testingResults];
                      copy[idx] = { ...copy[idx], test: e.target.value };
                      setTestingResults(copy);
                    }}
                    placeholder="Test description (e.g. Current draw in ESP32 Deep Sleep)"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                  />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      value={tr.result}
                      onChange={(e) => {
                        const copy = [...testingResults];
                        copy[idx] = { ...copy[idx], result: e.target.value };
                        setTestingResults(copy);
                      }}
                      placeholder="Observed measurement (e.g. 14.2 µA measured via multimeter)"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none focus:border-black"
                    />

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-gray-700 shrink-0">
                      <input
                        type="checkbox"
                        checked={tr.verified !== false}
                        onChange={(e) => {
                          const copy = [...testingResults];
                          copy[idx] = { ...copy[idx], verified: e.target.checked };
                          setTestingResults(copy);
                        }}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span>Verified Result</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Gallery Documentation */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-700" />
              <span>9. Documentation Gallery &amp; Captions</span>
            </h3>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />

            {galleryItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {galleryItems.map((item, idx) => (
                  <div
                    key={`gal-item-${idx}`}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2 relative group"
                  >
                    <div className="relative h-32 w-full rounded overflow-hidden bg-white">
                      <Image
                        src={item.url}
                        alt="Gallery"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryItems(galleryItems.filter((_, i) => i !== idx))
                        }
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => {
                        const copy = [...galleryItems];
                        copy[idx] = { ...copy[idx], caption: e.target.value };
                        setGalleryItems(copy);
                      }}
                      placeholder="Add image caption..."
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 10: Reflection & Next Steps */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gray-700" />
              <span>10. Reflection &amp; Future Scope</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Lessons Learned, Known Limitations &amp; Next Revisions
              </label>
              <textarea
                rows={4}
                value={reflectionAndImprovements}
                onChange={(e) => setReflectionAndImprovements(e.target.value)}
                placeholder="What worked well? What would you change in Rev B of the board?"
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 11: SEO Meta */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-700" />
              <span>11. SEO &amp; Social Share Metadata</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Custom Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to '[Project Title] — Hardware Case Study'"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Custom Meta Description
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Defaults to short project summary"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="text-xs font-semibold text-gray-500 hover:text-black py-2.5 px-4"
            >
              Cancel &amp; Discard
            </button>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {editId && (
                <a
                  href={`/hardware/${slug || editId}?preview=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Draft</span>
                </a>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 w-full sm:w-auto shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Publish Case Study</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
