"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Bot, AlertCircle, 
  Copy, Check, Trash2, Loader2,
  Wand2
} from "lucide-react";

interface AICoachProps {
  prefill?: string;
}

export default function AICoach({ prefill }: AICoachProps) {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync with parent prefill
  useEffect(() => {
    if (prefill) {
      setInputText(prefill);
      setAnalysis(""); 
      setError("");
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [prefill]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysis("");

    if (!inputText.trim()) {
      setError("Please enter a topic, script, or idea first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze content");
      }

      setAnalysis(data.result);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setAnalysis("");
    setError("");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden font-sans text-slate-900 flex flex-col h-[600px]">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Strategy Coach</h2>
            <p className="text-xs text-slate-500 font-medium">AI-powered script & content feedback.</p>
          </div>
        </div>
        
        {inputText && (
          <button 
            onClick={handleClear}
            className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-md hover:bg-slate-50"
            title="Clear All"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: INPUT AREA */}
        <div className={`flex flex-col relative transition-all duration-500 ease-in-out ${analysis ? 'w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200' : 'w-full'}`}>
          <div className="flex-1 relative bg-slate-50/30">
            <textarea
              ref={textareaRef}
              className="w-full h-full p-6 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 font-medium"
              placeholder="Paste your video idea, script segment, or title here...&#10;&#10;Example:&#10;I want to make a video about Roblox updates, but I'm not sure how to make the intro engaging. Can you review my hook?"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            {/* Action Bar (Floating) */}
            <div className="absolute bottom-6 right-6 left-6 flex items-center justify-between pointer-events-none">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 backdrop-blur-sm px-2 py-1 rounded">
                 {inputText.length} chars
               </div>
               <button
                onClick={handleAnalyze}
                disabled={loading || !inputText}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-slate-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 pointer-events-auto"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-indigo-300" /> Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: OUTPUT AREA */}
        {analysis && (
          <div className="w-full md:w-1/2 flex flex-col bg-white animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Wand2 size={14} className="text-indigo-500" />
                Coach's Feedback
              </h3>
              <button 
                onClick={handleCopy}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-slate-600 leading-7 text-sm font-medium">
                  {analysis}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
              <p className="text-xs text-slate-400 font-medium">AI insights are generated based on YouTube best practices.</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !analysis && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

      </div>
    </div>
  );
}