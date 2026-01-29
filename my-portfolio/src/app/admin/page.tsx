"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react"; // Make sure you have lucide-react installed

interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  year: string;
  description: string;
  image_url: string;
  is_featured: boolean; // <--- NEW FIELD
}

export default function AdminPanel() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("add"); 
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Design",
    role: "",       
    year: "",       
    description: "",
    is_featured: false, // <--- NEW STATE
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // BATCH CONFIG
  const BATCH_CATEGORIES = ["GFX", "Posters/Pubmats"];
  const isBatchMode = BATCH_CATEGORIES.includes(formData.category) && !editId;

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

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      role: project.role || "",
      year: project.year || "",
      description: project.description || "",
      is_featured: project.is_featured || false, // <--- LOAD VALUE
    });
    setSelectedFiles([]); 
    setActiveTab("add");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      if (imageUrl && imageUrl.includes("/portfolio/")) {
        const path = imageUrl.split("/portfolio/")[1];
        if (path) {
          await supabase.storage.from("portfolio").remove([path]);
        }
      }
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
      router.refresh();
      alert("Project deleted.");
    } catch (err) {
      console.error(err);
      alert("Error deleting project.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // === BRANCH A: BATCH UPLOAD ===
      if (isBatchMode && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from("portfolio").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);
            const autoTitle = file.name.replace(/\.[^/.]+$/, ""); 

            const payload = {
                title: autoTitle, 
                category: formData.category,
                role: "", year: "", description: "",
                image_url: data.publicUrl,
                is_featured: false, // Batch uploads default to NOT featured
            };
            const { error: insertError } = await supabase.from("projects").insert([payload]);
            if (insertError) throw insertError;
        }
        alert(`Successfully uploaded ${selectedFiles.length} items!`);
      } 
      
      // === BRANCH B: STANDARD SINGLE UPLOAD ===
      else {
        let imageUrl = editId ? projects.find((p) => p.id === editId)?.image_url : "";

        if (selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from("portfolio").upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);
            imageUrl = data.publicUrl;
        }

        const payload = {
            title: formData.title,
            category: formData.category,
            role: formData.role,
            year: formData.year,
            description: formData.description,
            image_url: imageUrl,
            is_featured: formData.is_featured, // <--- SAVE TOGGLE
        };

        if (editId) {
            const { error } = await supabase.from("projects").update(payload).eq("id", editId);
            if (error) throw error;
            alert("Project updated successfully!");
        } else {
            const { error } = await supabase.from("projects").insert([payload]);
            if (error) throw error;
            alert("Project created successfully!");
        }
      }

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
    setFormData({ title: "", category: "Web Design", role: "", year: "", description: "", is_featured: false });
    setSelectedFiles([]);
  };

  const getCategoryColor = (cat: string) => {
    if (cat.includes("Web")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (cat.includes("Video")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (cat.includes("Graphic") || cat === "GFX") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <h1 className="font-semibold text-lg text-black">Portfolio Admin</h1>
        </div>
        <a href="/" target="_blank" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
          View Live Site ↗
        </a>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => { setActiveTab("add"); resetForm(); }}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "add" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
          >
            {editId ? "Editing Project..." : "Add New Project"}
          </button>
          <button 
            onClick={() => setActiveTab("list")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "list" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
          >
            Edit Existing
          </button>
        </div>

        {/* --- FORM VIEW --- */}
        {activeTab === "add" && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6">
                  {/* CATEGORY */}
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-3 text-sm bg-white focus:outline-none focus:border-black"
                    >
                      <optgroup label="Web Design">
                        <option value="Website">Website</option>
                        <option value="Components">Components</option>
                      </optgroup>
                      <optgroup label="Graphic Design">
                        <option value="Posters/Pubmats">Posters/Pubmats</option>
                        <option value="GFX">GFX</option>
                      </optgroup>
                      <optgroup label="Video Editing">
                        <option value="Reels">Reels</option>
                        <option value="Long Form">Long Form</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* FEATURED TOGGLE (NEW) */}
                  {!isBatchMode && (
                      <div className="flex items-end pb-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                                className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                                Feature in Highlights?
                            </span>
                        </label>
                      </div>
                  )}
              </div>

              {isBatchMode && (
                 <p className="text-xs text-orange-600 font-medium">
                    ✨ Batch Mode Active: Multiple files allowed. "Featured" is disabled for batch uploads.
                 </p>
              )}

              {/* STANDARD FIELDS */}
              {!isBatchMode && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Project Title</label>
                    <input 
                      type="text" 
                      required={!isBatchMode}
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="e.g. Lumina Interface"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">My Role</label>
                      <input 
                        type="text" 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black"
                        placeholder="e.g. Lead Designer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Year</label>
                      <input 
                        type="text" 
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black"
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Description</label>
                    <textarea 
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black transition-all resize-y"
                      placeholder="Describe the project goal, your contribution, and the outcome..."
                    ></textarea>
                  </div>
                </div>
              )}

              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {editId ? "Replace Image (Optional)" : (isBatchMode ? "Select Images (Batch Upload)" : "Project Image")}
                </label>
                <div className={`border rounded px-4 py-3 bg-gray-50 ${isBatchMode ? "border-orange-300 bg-orange-50" : "border-gray-300"}`}>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple={isBatchMode}
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-foreground hover:file:bg-gray-300 transition-colors cursor-pointer"
                  />
                  {isBatchMode && selectedFiles.length > 0 && (
                     <p className="text-xs text-gray-600 mt-2 font-medium">
                        {selectedFiles.length} files selected ready for upload.
                     </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                {editId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading 
                    ? (isBatchMode && selectedFiles.length > 1 ? "Uploading Batch..." : "Saving...") 
                    : (editId ? "Update Project" : (isBatchMode ? `Upload ${selectedFiles.length || 0} Projects` : "Save Project"))}
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
                    <th className="px-6 py-4 font-medium text-gray-700">Preview</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Title</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 font-medium text-right text-gray-700">Details & Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0">
                      
                      <td className="px-6 py-3 w-24">
                        <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                          {project.image_url ? (
                            <Image src={project.image_url} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3 font-medium text-gray-900 text-base">
                        {project.title}
                      </td>

                      {/* NEW: STATUS COLUMN (Shows Star if Featured) */}
                      <td className="px-6 py-3">
                         {project.is_featured && (
                             <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full w-fit">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span>Featured</span>
                             </div>
                         )}
                      </td>

                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getCategoryColor(project.category)}`}>
                                {project.category}
                            </span>
                            <div className="flex items-center gap-4">
                                <button 
                                onClick={() => handleEdit(project)}
                                className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                                >
                                Edit
                                </button>
                                <button 
                                onClick={() => handleDelete(project.id, project.image_url)}
                                className="text-gray-400 hover:text-red-600 font-medium transition-colors"
                                >
                                Delete
                                </button>
                            </div>
                        </div>
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