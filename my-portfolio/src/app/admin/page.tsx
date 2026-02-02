"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MessageSquare, Trash2, Mail, Lock, LogOut } from "lucide-react"; 
import { verifyAdminPassword, checkAuth, logout } from "../actions"; // <--- Import Actions

// --- CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = "ddjrj0ymx";
const CLOUDINARY_PRESET = "Portfolio";

interface Project {
  id: number;
  title: string;
  category: string;
  role: string;
  year: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

interface Inquiry {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
}

export default function AdminPanel() {
  const router = useRouter();
  
  // --- AUTH STATE (NEW) ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- DATA STATE ---
  const [activeTab, setActiveTab] = useState("add"); 
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); 
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "", category: "Web Design", role: "", year: "", description: "", is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- 1. CHECK AUTH ON LOAD ---
  useEffect(() => {
    checkAuth().then((isLoggedIn) => {
      if (isLoggedIn) setIsAuthenticated(true);
      setAuthLoading(false);
    });
  }, []);

  // --- 2. FETCH DATA ONLY IF AUTHENTICATED ---
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "list") fetchProjects();
      else if (activeTab === "inquiries") fetchInquiries();
    }
  }, [activeTab, isAuthenticated]);

  // --- LOGIN HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await verifyAdminPassword(passwordInput);
    if (isValid) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  // --- EXISTING FUNCTIONS (Unchanged) ---
  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (data) setProjects(data);
  };

  const fetchInquiries = async () => {
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
  };

  const uploadToCloudinary = async (file: File) => {
    if (!CLOUDINARY_PRESET) throw new Error("Misconfigured: CLOUDINARY_PRESET is missing.");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Upload failed");
    }
    const fileData = await res.json();
    return fileData.secure_url; 
  };

  const handleEdit = (project: Project) => {
    setEditId(project.id);
    setFormData({
      title: project.title, category: project.category, role: project.role || "", year: project.year || "", description: project.description || "", is_featured: project.is_featured || false,
    });
    setSelectedFile(null); 
    setActiveTab("add");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      if (imageUrl && imageUrl.includes("/portfolio/")) {
        const path = imageUrl.split("/portfolio/")[1];
        if (path) await supabase.storage.from("portfolio").remove([path]);
      }
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
      alert("Project deleted.");
    } catch (err) { console.error(err); alert("Error deleting project."); }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
      fetchInquiries(); 
    } catch (err) { console.error(err); alert("Error deleting inquiry."); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus("");
    try {
      let imageUrl = editId ? projects.find((p) => p.id === editId)?.image_url : "";
      if (selectedFile) {
          setUploadStatus("Uploading to Cloudinary...");
          imageUrl = await uploadToCloudinary(selectedFile);
          setUploadStatus("Upload complete!");
      }
      const payload = {
          title: formData.title, category: formData.category, role: formData.role, year: formData.year, description: formData.description, image_url: imageUrl, is_featured: formData.is_featured,
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
      resetForm();
      if (editId) setActiveTab("list");
    } catch (error) { console.error(error); alert("Error saving project."); } finally { setLoading(false); setUploadStatus(""); }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ title: "", category: "Web Design", role: "", year: "", description: "", is_featured: false });
    setSelectedFile(null);
  };

  const getCategoryColor = (cat: string) => {
    if (cat.includes("Web")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (cat.includes("Video")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (cat.includes("Graphic") || cat === "GFX") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // --- RENDER 1: LOADING SPINNER ---
  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;

  // --- RENDER 2: LOGIN SCREEN (If not authenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Admin Access</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Please enter the master password.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="Password"
            />
            {loginError && <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>}
            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Unlock Panel
            </button>
          </form>
          <div className="mt-6 text-center">
             <a href="/" className="text-xs text-gray-400 hover:text-black transition-colors">← Back to Portfolio</a>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 3: REAL ADMIN PANEL (If Authenticated) ---
  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <h1 className="font-semibold text-lg text-black">Portfolio Admin</h1>
        </div>
        <div className="flex items-center gap-6">
            <a href="/" target="_blank" className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
            View Live Site ↗
            </a>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button 
            onClick={() => { setActiveTab("add"); resetForm(); }}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === "add" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
          >
            {editId ? "Editing Project..." : "Add New Project"}
          </button>
          <button 
            onClick={() => setActiveTab("list")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${activeTab === "list" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
          >
            Edit Projects
          </button>
          <button 
            onClick={() => setActiveTab("inquiries")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === "inquiries" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"}`}
          >
            <MessageSquare className="w-4 h-4" />
            Inquiries
          </button>
        </div>

        {/* --- ADD / EDIT FORM --- */}
        {activeTab === "add" && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6">
                  {/* CATEGORY SELECT */}
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
                  
                  {/* FEATURED TOGGLE */}
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 text-black rounded border-gray-300 focus:ring-black cursor-pointer" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">Feature in Highlights?</span>
                    </label>
                  </div>
              </div>

              {/* STANDARD FIELDS */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Project Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="e.g. Lumina Interface" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Role</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="e.g. Lead Designer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Year</label>
                    <input type="text" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="e.g. 2024" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Description</label>
                  <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="Optional description..." />
                </div>
              </div>

              {/* IMAGE UPLOAD (Cloudinary) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {editId ? "Replace Image" : "Project Image (Supports Large Files)"}
                </label>
                <div className="border border-gray-300 rounded px-4 py-3 bg-gray-50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-500" 
                  />
                </div>
                {uploadStatus && (
                  <p className="text-sm text-blue-600 font-medium animate-pulse mt-1">
                    {uploadStatus}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                {editId && (
                  <button type="button" onClick={resetForm} className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-black">
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-8 py-2.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? (uploadStatus ? "Uploading..." : "Saving...") : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- LIST VIEW --- */}
        {activeTab === "list" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-in fade-in duration-500">
            {projects.length === 0 ? (
              <div className="p-12 text-center text-gray-400"><p>No projects found.</p></div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-700">Preview</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Title</th>
                    <th className="px-6 py-4 font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 font-medium text-right text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 w-24">
                        <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden border border-gray-200">
                          {project.image_url ? (
                            <Image src={project.image_url} alt="" fill className="object-cover" />
                          ) : "No Img"}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900 text-base">{project.title}</td>
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
                                <button onClick={() => handleEdit(project)} className="text-blue-600 hover:text-blue-800 font-bold">Edit</button>
                                <button onClick={() => handleDelete(project.id, project.image_url)} className="text-gray-400 hover:text-red-600 font-medium">Delete</button>
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

        {/* --- INQUIRIES VIEW --- */}
        {activeTab === "inquiries" && (
          <div className="space-y-4 animate-in fade-in duration-500">
             {inquiries.length === 0 ? (
               <div className="bg-white p-12 text-center text-gray-400 rounded-lg border border-gray-200">
                 <p>No messages yet.</p>
               </div>
             ) : (
               inquiries.map((msg) => (
                 <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                             <Mail className="w-5 h-5" />
                          </div>
                          <div>
                             <h3 className="font-bold text-gray-900">{msg.name}</h3>
                             <p className="text-sm text-gray-500">{msg.email}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(msg.created_at).toLocaleDateString()} <br/>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                       </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded text-gray-700 text-sm leading-relaxed mb-4">
                       {msg.message}
                    </div>

                    <div className="flex justify-end">
                       <button 
                         onClick={() => handleDeleteInquiry(msg.id)}
                         className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                       >
                         <Trash2 className="w-4 h-4" /> Delete Message
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        )}

      </main>
    </div>
  );
}