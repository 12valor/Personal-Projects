"use client";
import { useState } from "react";
import { Sparkles, Copy, Loader2, Lightbulb, Gamepad2, PenTool } from "lucide-react";

export default function IdeaGenerator() {
  const [topic, setTopic] = useState("");
  const [gameName, setGameName] = useState("Steal A Brainrot");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

const generateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setIdeas([]); 

    try {
      const res = await fetch("/api/ai/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, gameName }),
      });
      
      const data = await res.json();
      
      if (data.titles && data.titles.length > 0) {
        setIdeas(data.titles);
      } else {
        // Fallback if the server returns empty for some reason
        alert("Inputs too long. Try shortening your topic name.");
      }
    } catch (error) {
      alert("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: "${text}"`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="text-purple-500 fill-purple-500" /> Viral Idea Generator
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Generates titles in the specific style: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">"Subject + Action + In Game"</span>
        </p>
      </div>

      {/* INPUT FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={generateIdeas} className="grid md:grid-cols-2 gap-6">
          
          {/* Game Context */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Gamepad2 size={14} /> Game / Niche Name
            </label>
            <input 
              type="text" 
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="e.g. Steal A Brainrot"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PenTool size={14} /> Video Topic
            </label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The new gravity gun"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading || !topic}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Lightbulb className="fill-white" />}
              {loading ? "Cloning Style..." : "Generate Titles"}
            </button>
          </div>
        </form>
      </div>

      {/* RESULTS GRID */}
      {ideas.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Generated Concepts</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{ideas.length} Results</span>
          </div>

          <div className="grid gap-3">
            {ideas.map((title, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                onClick={() => copyToClipboard(title)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-black text-lg w-6">#{idx + 1}</span>
                  <p className="font-bold text-slate-800 text-lg">{title}</p>
                </div>
                <button className="text-slate-300 group-hover:text-purple-500 transition-colors">
                  <Copy size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-3 opacity-50">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

    </div>
  );
}