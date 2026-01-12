"use client";

import { useState } from "react";
import { 
  ArrowRight, Search, MousePointerClick, 
  LayoutTemplate, Key, ShieldCheck, 
  CheckCircle2, AlertCircle, Sparkles, Target, Loader2
} from "lucide-react";

export default function TitleRater() {
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  const analyzeTitle = async () => {
    if (!title) return;
    setIsAnalyzing(true);
    setReport(null);

    try {
      const res = await fetch("/api/rate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">YouTube Title Evaluator</h2>
        <p className="text-slate-500">AI-powered analysis using viral psychology & SEO data.</p>
      </div>

      {/* INPUT */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-slate-900">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your video title..."
          className="flex-1 px-4 py-3 bg-transparent outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300"
          onKeyDown={(e) => e.key === 'Enter' && analyzeTitle()}
        />
        <button 
          onClick={analyzeTitle}
          disabled={!title || isAnalyzing}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <>Analyze <ArrowRight size={16} /></>}
        </button>
      </div>

      {/* REPORT CARD */}
      {report && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. OVERALL SCORE CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-sm">
            {/* Subtle Gradient Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${report.score >= 80 ? 'from-emerald-500/10' : report.score >= 50 ? 'from-amber-500/10' : 'from-rose-500/10'} to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

            <div className="flex flex-col items-center text-center z-10">
              <div className={`text-6xl font-black tracking-tighter ${report.score >= 80 ? 'text-emerald-600' : report.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                {report.score}<span className="text-2xl text-slate-300 font-bold">/100</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Overall Score</span>
            </div>

            <div className="h-px w-full md:w-px md:h-24 bg-slate-100" />

            <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4 z-10">
              <ScoreItem label="Relevance" score={report.criteria.relevance} icon={Search} />
              <ScoreItem label="Clarity" score={report.criteria.clarity} icon={CheckCircle2} />
              <ScoreItem label="CTR Potential" score={report.criteria.ctr} icon={MousePointerClick} />
              <ScoreItem label="Structure" score={report.criteria.structure} icon={LayoutTemplate} />
              <ScoreItem label="Keywords" score={report.criteria.keywords} icon={Key} />
              <ScoreItem label="Trust" score={report.criteria.trust} icon={ShieldCheck} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 2. STRENGTHS & WEAKNESSES */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Analysis Breakdown</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {report.strengths?.length ? report.strengths.map((s:string, i:number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2 bg-emerald-50/50 p-2 rounded-md">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {s}
                      </li>
                    )) : <li className="text-sm text-slate-400 italic">No significant strengths found.</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-rose-500 uppercase mb-3 flex items-center gap-2">
                    <AlertCircle size={14} /> Improvements
                  </h4>
                  <ul className="space-y-2">
                    {report.weaknesses?.length ? report.weaknesses.map((w:string, i:number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2 bg-rose-50/50 p-2 rounded-md">
                        <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" /> {w}
                      </li>
                    )) : <li className="text-sm text-slate-400 italic">No critical weaknesses detected.</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. AI SUGGESTIONS */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-sm h-full">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Target size={16} /> AI Suggestions
              </h3>
              
              <div className="space-y-4">
                <SuggestionBox label="Search Optimized (SEO)" title={report.suggestions.search} color="border-l-blue-500" />
                <SuggestionBox label="High CTR (Viral)" title={report.suggestions.ctr} color="border-l-rose-500" />
                <SuggestionBox label="Balanced (Recommended)" title={report.suggestions.balanced} color="border-l-emerald-500" />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const ScoreItem = ({ label, score, icon: Icon }: any) => {
  let color = "text-slate-400";
  let bg = "bg-slate-50";
  
  if (score >= 8) { color = "text-emerald-600"; bg = "bg-emerald-50"; }
  else if (score >= 5) { color = "text-amber-500"; bg = "bg-amber-50"; }
  else { color = "text-rose-500"; bg = "bg-rose-50"; }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`p-2 rounded-md ${bg} ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={`text-lg font-bold leading-none ${color}`}>{score}/10</div>
      </div>
    </div>
  );
};

const SuggestionBox = ({ label, title, color }: any) => (
  <div className={`pl-4 border-l-4 ${color} py-2 bg-white rounded-r-lg border-y border-r border-slate-200/50 shadow-sm`}>
    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</div>
    <div className="text-sm font-bold text-slate-800">{title}</div>
  </div>
);