"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Adjust path if needed (../../lib/supabase)
import { useRouter } from "next/navigation";
import Image from "next/image";

// Match your DB structure
interface Project {
  id: number;
  title: string;
  category: string;
  role: string;     // New field
  year: string;     // New field
  description: string;
  image_url: string;
}

export default function AdminPanel() {
  const router = useRouter();
  
  // UI State
  const [activeTab, setActiveTab] = useState("add"); // "add" | "list"
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Form State
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "UI/UX Design",
    role: "",       // New
    year: "",       // New
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch projects whenever we switch to the "List" tab
  useEffect(() => {
    if (activeTab === "list") {
      fetchProjects();
    }
  }, [activeTab]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });
      
    if (data) setProjects(data);
    if (error) console.error("Error fetching projects:", error);
  };

  // --- Handlers ---

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    // Pre-fill form
    setFormData({
      title: project.title,
      category: project.category,
      role: project.role || "",
      year: project.year || "",
      description: project.description || "",
    });
    // Switch to form view
    setActiveTab("add");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      // 1. Delete image from Storage if it exists
      if (imageUrl && imageUrl.includes("/portfolio/")) {
        const path = imageUrl.split("/portfolio/")[1];
        if (path) {
          await supabase.storage.from("portfolio").remove([path]);
        }
      }

      // 2. Delete row from DB
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      // 3. Update UI
      fetchProjects();
      router.refresh();
      alert("Project deleted.");
    } catch (err) {
      console.error(err);
      alert("Error deleting project.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editId 
        ? projects.find((p) => p.id === editId)?.image_url 
        : "";

      // 1. Upload NEW Image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      // 2. Prepare Data Payload
      const payload = {
        title: formData.title,
        category: formData.category,
        role: formData.role,       // Save role
        year: formData.year,       // Save year
        description: formData.description,
        image_url: imageUrl,
      };

      // 3. Insert or Update
      if (editId) {
        // UPDATE
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editId);
        if (error) throw error;
        alert("Project updated successfully!");
      } else {
        // INSERT
        const { error } = await supabase
          .from("projects")
          .insert([payload]);
        if (error) throw error;
        alert("Project created successfully!");
      }

      // 4. Cleanup & Refresh
      resetForm();
      router.refresh(); 
      if (editId) setActiveTab("list");

    } catch (error) {
      console.error(error);
      alert("Error saving project.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", category: "UI/UX Design", role: "", year: "", description: "" });
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <h1 className="font-semibold text-lg">Portfolio Admin</h1>
        </div>
        <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-accent transition-colors">
          View Live Site ↗
        </a>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => { setActiveTab("add"); resetForm(); }}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "add" 
              ? "border-accent text-accent" 
              : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {editId ? "Editing Project..." : "Add New Project"}
          </button>
          <button 
            onClick={() => setActiveTab("list")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "list" 
              ? "border-accent text-accent" 
              : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Edit Existing
          </button>
        </div>

        {/* --- FORM VIEW --- */}
        {activeTab === "add" && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Lumina Interface"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm bg-white focus:outline-none focus:border-accent"
                  >
                    <option>UI/UX Design</option>
                    <option>YouTube Editing</option>
                    <option>Graphic Design</option>
                    <option>Branding</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Role & Year (NEW FIELDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">My Role</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    placeholder="e.g. Lead Designer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Year</label>
                  <input 
                    type="text" 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all resize-y"
                  placeholder="Describe the project goal, your contribution, and the outcome..."
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {editId ? "Replace Image (Optional)" : "Project Image"}
                </label>
                <div className="border border-gray-300 rounded px-4 py-3 bg-gray-50">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-foreground hover:file:bg-gray-300 transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                {editId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2.5 bg-foreground text-white text-sm font-medium rounded hover:bg-black transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? "Saving..." : (editId ? "Update Project" : "Save Project")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- LIST VIEW --- */}
        {activeTab === "list" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-in fade-in duration-500">
            {projects.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <p>No projects found. Add your first one!</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Preview</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0">
                      <td className="px-6 py-3">
                        <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                          {project.image_url ? (
                            <Image src={project.image_url} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-foreground">
                        {project.title}
                        <div className="text-xs text-gray-400 font-normal mt-0.5">{project.category}</div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {project.role || "—"}
                      </td>
                      <td className="px-6 py-3 text-right space-x-4">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="text-accent hover:text-green-700 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id, project.image_url)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </main>
    </div>
  );
}