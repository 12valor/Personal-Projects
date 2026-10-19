"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { SerializedProject } from "@/src/lib/project-mappers";
import { isHardwareProject } from "@/src/components/HardwareProjects";

interface HardwareManagerProps {
  projects: SerializedProject[];
  onRefreshProjects: () => Promise<void>;
  uploadFilesClientSide: (files: File[]) => Promise<string[]>;
  uploadVideoClientSide: (file: File) => Promise<string>;
}

export const LAYOUT_PRESETS: {
  id: "feature" | "landscape" | "portrait" | "compact";
  title: string;
  span: string;
  description: string;
}[] = [
  {
    id: "feature",
    title: "Feature",
    span: "8 Cols / Hero",
    description: "Dominant hero presentation. Large footprint for complex builds.",
  },
  {
    id: "portrait",
    title: "Portrait",
    span: "4 Cols / Tall",
    description: "Vertical orientation. Great for tower enclosures and tall prototypes.",
  },
  {
    id: "landscape",
    title: "Landscape",
    span: "8 Cols / Wide",
    description: "Cinematic horizontal layout. Ideal for desktop builds and wide instruments.",
  },
  {
    id: "compact",
    title: "Compact",
    span: "4 Cols / Standard",
    description: "Balanced supporting card. Clean, modular footprint for focused items.",
  },
];

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

  // Simplified fields for collage display: name, image, preset, order, status
  const [title, setTitle] = useState("");
  const [layoutPreset, setLayoutPreset] = useState<"feature" | "landscape" | "portrait" | "compact">("compact");
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  // Filter hardware projects
  const hardwareProjects = useMemo(() => {
    return projects
      .filter((p) => isHardwareProject(p))
      .sort((a, b) => a.display_index - b.display_index);
  }, [projects]);

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setLayoutPreset("compact");
    setDisplayIndex(0);
    setIsPublished(true);
    setImageUrl("");
    setPreviewVideoUrl("");
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
    setDisplayIndex(project.display_index ?? 0);
    setIsPublished(project.is_published !== false);
    setImageUrl(project.image_url || "");
    setPreviewVideoUrl(project.preview_video_url || "");

    const cs = project.case_study;
    setLayoutPreset(cs?.layout_preset || "compact");

    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage("Uploading photo...");
    try {
      const [url] = await uploadFilesClientSide([file]);
      setImageUrl(url);
      setStatusMessage("Photo uploaded.");
    } catch (err) {
      alert(`Photo upload failed: ${err}`);
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
      setStatusMessage("Video uploaded.");
    } catch (err) {
      alert(`Video upload failed: ${err}`);
      setStatusMessage("");
    }
  };

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
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
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
      alert("Please provide a project name.");
      return;
    }

    setLoading(true);
    setStatusMessage("Saving hardware project...");

    try {
      const payload = {
        title: title.trim(),
        category: "Hardware",
        image_url: imageUrl || null,
        preview_video_url: previewVideoUrl.trim() || null,
        is_published: publishState,
        display_index: Number(displayIndex) || 0,
        case_study: {
          layout_preset: layoutPreset,
        },
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
            <span>Hardware Projects Collage</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage the photography and names displayed in the asymmetric homepage collage.
          </p>
        </div>

        {viewMode === "list" ? (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hardware Item</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode("list")}
            className="rounded-lg border border-gray-300 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>
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
                Add your first hardware project to showcase physical builds and circuit photography in the homepage collage.
              </p>
              <button
                onClick={startCreate}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hardware Item</span>
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-mono uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Project Name &amp; Photo</th>
                    <th className="px-4 py-3 text-center">Collage Preset</th>
                    <th className="px-4 py-3 text-center">Order</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hardwareProjects.map((proj) => {
                    const isPub = proj.is_published !== false;
                    const cs = proj.case_study;
                    const currentPreset = cs?.layout_preset || "compact";

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
                            <div className="font-semibold text-gray-900">{proj.title}</div>
                          </div>
                        </td>

                        {/* Collage Preset Badge */}
                        <td className="px-4 py-3.5 text-center">
                          {(() => {
                            const badgeStyles: Record<string, string> = {
                              feature: "bg-blue-50 text-blue-700 border-blue-200",
                              portrait: "bg-purple-50 text-purple-700 border-purple-200",
                              landscape: "bg-emerald-50 text-emerald-700 border-emerald-200",
                              compact: "bg-gray-100 text-gray-700 border-gray-200",
                            };
                            return (
                              <span
                                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-semibold uppercase border ${
                                  badgeStyles[currentPreset] || badgeStyles.compact
                                }`}
                              >
                                {currentPreset}
                              </span>
                            );
                          })()}
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

      {/* --- FORM VIEW (CREATE / EDIT COLLAGE ITEM) --- */}
      {viewMode === "form" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Section 1: Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-700" />
              <span>Project Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart LoRa Environmental Station"
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black"
                />
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

            {/* Collage Layout Preset Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-700" />
                  <span>Collage Layout Preset *</span>
                </label>
                <span className="text-[11px] text-gray-500 font-mono">
                  Controls item size &amp; emphasis in the 12-column collage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {LAYOUT_PRESETS.map((preset) => {
                  const isSelected = layoutPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLayoutPreset(preset.id)}
                      className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-black bg-gray-950 text-white shadow-md ring-2 ring-black"
                          : "border-gray-200 bg-gray-50/50 text-gray-800 hover:border-gray-400 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="font-bold text-sm tracking-tight">{preset.title}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {preset.span}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {preset.description}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-gray-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-gray-300 w-4 h-4 text-black focus:ring-black"
                />
                <span>Publish Immediately (Checked = Public on Homepage, Unchecked = Draft)</span>
              </label>
            </div>
          </div>

          {/* Section 2: Media */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-gray-700" />
              <span>Project Photography</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Cover Photo
                </label>
                {imageUrl && (
                  <div className="relative h-44 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
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
                  Optional Video Clip (Looping Background)
                </label>
                {previewVideoUrl && (
                  <div className="relative h-44 w-full rounded-lg overflow-hidden border border-gray-200 bg-black mb-2">
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

            {/* Live Collage Card Preview */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-6 space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Live Collage Preview (Image &amp; Name Only)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">
                  Preset: <strong className="uppercase text-gray-800">{layoutPreset}</strong>
                </span>
              </div>

              {/* Preview Canvas */}
              <div className="flex justify-center p-2 sm:p-4 bg-gray-900/5 rounded-xl border border-dashed border-gray-300">
                <div
                  className={`relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-2xl transition-all w-full ${
                    layoutPreset === "feature"
                      ? "max-w-2xl min-h-[360px] sm:min-h-[420px]"
                      : layoutPreset === "landscape"
                      ? "max-w-2xl min-h-[260px] sm:min-h-[300px]"
                      : layoutPreset === "portrait"
                      ? "max-w-sm min-h-[440px]"
                      : "max-w-md min-h-[300px]"
                  }`}
                >
                  {/* Media Background */}
                  <div className="absolute inset-0 w-full h-full">
                    {previewVideoUrl ? (
                      <video
                        src={previewVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover object-center"
                      />
                    ) : imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Preview Card"
                        fill
                        className="object-cover object-center"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-600 gap-2 p-6 text-center">
                        <Cpu className="w-12 h-12 stroke-[1.25] text-gray-500" />
                        <span className="text-xs font-mono text-gray-400">
                          Upload a photo above to preview
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10 pointer-events-none" />

                  {/* Bottom: Only Project Name */}
                  <div className="relative z-20 p-6 sm:p-8">
                    <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-white drop-shadow-sm">
                      {title || "Project Name"}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic text-center">
                This preview renders with only the project photograph and title, matching the homepage collage.
              </p>
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
                  <span>Publish Item</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
