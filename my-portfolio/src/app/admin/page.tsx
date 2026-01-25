"use client";
import React, { useState } from "react";

export default function AdminPanel() {
  // Simple state to handle form switching (Add vs Edit) - optional
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen bg-gray-50 text-foreground font-sans selection:bg-accent selection:text-white">
      {/* Admin Header - Strictly Functional */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 bg-accent rounded-sm"></div>
          <h1 className="font-semibold text-lg tracking-tight">Portfolio Admin</h1>
        </div>
        <a href="/" target="_blank" className="text-sm text-gray-500 hover:text-accent transition-colors">
          View Live Site ↗
        </a>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        
        {/* Functional Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab("add")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "add" 
              ? "border-b-2 border-accent text-accent" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Add New Project
          </button>
          <button 
            onClick={() => setActiveTab("list")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ml-6 ${
              activeTab === "list" 
              ? "border-b-2 border-accent text-accent" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Edit Existing (04)
          </button>
        </div>

        {/* The Form */}
        <div className="bg-white border border-gray-200 rounded-md p-8 shadow-sm">
          <form className="space-y-8">
            
            {/* Row 1: Basics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lumina Interface" 
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                <select className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white">
                  <option value="ui">UI/UX Design</option>
                  <option value="video">YouTube Editing</option>
                  <option value="brand">Branding</option>
                </select>
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Short Description</label>
              <textarea 
                rows={4} 
                placeholder="Brief role and outcome description..." 
                className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
              ></textarea>
              <p className="text-xs text-gray-400 text-right">0 / 250 characters</p>
            </div>

            {/* Row 3: Images */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Thumbnail</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="text-gray-400 group-hover:text-accent mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-foreground font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button type="button" className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Cancel
              </button>
              <button type="button" className="px-8 py-2.5 bg-foreground text-white text-sm font-medium rounded hover:bg-black transition-colors shadow-sm">
                Save Project
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}