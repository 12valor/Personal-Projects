"use client";

import { useState } from "react";
import { Sparkles, Copy, RefreshCw, Check, Hash, FileText } from "lucide-react";

export default function MetadataGenerator() {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ description: string; tags: string[] } | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const generateMetadata = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, script }),
      });
      const data = await res.json();
      if (!data.error) setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'desc' | 'tags') => {
    navigator.clipboard.writeText(text);
    if (type === 'desc') {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (result) {
      setResult({ ...result, tags: result.tags.filter(t => t !== tagToRemove) });
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans text-slate-900 pb-20">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          Metadata Generator
        </h2>
        <p className="text-slate-500 mt-2">
          Turn your raw ideas into SEO-optimized descriptions and tags in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: INPUT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-panel border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Video Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-medium"
              placeholder="e.g., How to Bake Sourdough Bread for Beginners"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-panel border border-slate-100 h-96 flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Video Script / Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none text-sm"
              placeholder="Paste your script, rough notes, or key talking points here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </div>

          <button
            onClick={generateMetadata}
            disabled={!title || loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? "Optimizing..." : "Generate Metadata"}
          </button>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="space-y-6">
          
          {/* DESCRIPTION OUTPUT */}
          <div className="bg-white p-6 rounded-xl shadow-panel border border-slate-100 relative group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Optimized Description
              </h3>
              {result && (
                <button 
                  onClick={() => copyToClipboard(result.description, 'desc')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded transition-colors"
                >
                  {copiedDesc ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedDesc ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            
            {result ? (
              <textarea
                className="w-full h-64 text-sm leading-relaxed text-slate-700 bg-transparent outline-none resize-none"
                value={result.description}
                onChange={(e) => setResult({ ...result, description: e.target.value })}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg">
                Generated description will appear here...
              </div>
            )}
          </div>

          {/* TAGS OUTPUT */}
          <div className="bg-white p-6 rounded-xl shadow-panel border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Hash size={16} /> Smart Tags
              </h3>
              {result && (
                <button 
                  onClick={() => copyToClipboard(result.tags.join(", "), 'tags')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded transition-colors"
                >
                  {copiedTags ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedTags ? "Copied!" : "Copy All"}
                </button>
              )}
            </div>

            {result ? (
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md flex items-center gap-2 group hover:border-rose-200 transition-colors">
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg">
                Tags will appear here...
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}