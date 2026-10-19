"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Loader2,
} from "lucide-react";
import type { SerializedProject } from "@/src/lib/project-mappers";
import { isHardwareProject } from "@/src/components/HardwareProjects";

interface HardwareManagerProps {
  projects: SerializedProject[];
  onRefreshProjects: () => Promise<void>;
  uploadFilesClientSide: (files: File[]) => Promise<string[]>;
  uploadVideoClientSide?: (file: File) => Promise<string>;
}

export default function HardwareManager({
  projects,
  onRefreshProjects,
  uploadFilesClientSide,
}: HardwareManagerProps) {
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Only Image and Name
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Filter hardware projects
  const hardwareProjects = useMemo(() => {
    return projects
      .filter((p) => isHardwareProject(p))
      .sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [projects]);

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setImageUrl("");
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
    setImageUrl(project.image_url || "");
    setViewMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusMessage("Uploading image...");
    try {
      const [url] = await uploadFilesClientSide([file]);
      setImageUrl(url);
      setStatusMessage("Image uploaded.");
    } catch (err) {
      alert(`Image upload failed: ${err}`);
      setStatusMessage("");
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
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a project name.");
      return;
    }

    setLoading(true);
    setStatusMessage("Saving...");

    try {
      const payload = {
        title: title.trim(),
        category: "Hardware",
        image_url: imageUrl || null,
        is_published: true,
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
        throw new Error(data?.error || "Failed to save project");
      }

      await onRefreshProjects();
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gray-700" />
            <span>Hardware Projects</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage the hardware project photos and names for the homepage collage.
          </p>
        </div>

        {viewMode === "list" ? (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
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
        <div>
          {hardwareProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
              <Cpu className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <h3 className="text-sm font-semibold text-gray-900">No hardware projects yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Add a hardware project with an image and name to display it in the collage.
              </p>
              <button
                onClick={startCreate}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-mono uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3 w-28">Image</th>
                    <th className="px-5 py-3">Project Name</th>
                    <th className="px-5 py-3 text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hardwareProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-5 py-3">
                        <div className="relative h-14 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          {proj.image_url ? (
                            <Image
                              src={proj.image_url}
                              alt={proj.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Cpu className="w-6 h-6 stroke-1" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Project Name */}
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-900">{proj.title}</div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(proj)}
                            title="Edit Project"
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj)}
                            title="Delete Project"
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- FORM VIEW (ONLY IMAGE AND NAME) --- */}
      {viewMode === "form" && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
            {editId ? "Edit Project" : "New Hardware Project"}
          </h3>

          {/* Project Name */}
          <div className="space-y-2">
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

          {/* Project Image */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Project Image
            </label>

            {imageUrl && (
              <div className="relative h-56 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                <Upload className="w-4 h-4" />
                <span>{imageUrl ? "Change Image" : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editId ? "Update Project" : "Add Project"}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
