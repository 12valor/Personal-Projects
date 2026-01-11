"use client";
import { useMemo, useState } from "react";
import { 
  Activity, HeartPulse, Zap, Calendar, 
  Stethoscope, Loader2
} from "lucide-react";

export default function ChannelHealth({ stats, videos }: { stats: any, videos: any[] }) {
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // --- CALCULATION ENGINE ---
  const healthData = useMemo(() => {
    if (!stats || !videos || videos.length < 5) return null;

    // 1. Consistency (Std Dev)
    const uploadDates = videos.slice(0, 6).map(v => new Date(v.publishedAt).getTime());
    let gaps = [];
    for (let i = 0; i < uploadDates.length - 1; i++) {
      gaps.push(Math.abs(uploadDates[i] - uploadDates[i+1]) / (1000 * 3600 * 24));
    }
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((a, b) => a + Math.pow(b - avgGap, 2), 0) / gaps.length;
    const stdDev = Math.sqrt(variance);
    
    let consistencyScore = Math.max(0, 100 - (stdDev * 10));
    const daysSinceLast = (Date.now() - uploadDates[0]) / (1000 * 3600 * 24);
    if (daysSinceLast > 14) consistencyScore -= 30;

    // 2. Velocity
    const recentViews = videos.slice(0, 3).reduce((acc, v) => acc + parseInt(v.views), 0);
    const prevViews = videos.slice(3, 6).reduce((acc, v) => acc + parseInt(v.views), 0) || 1; 
    const velocityRatio = recentViews / prevViews;
    let velocityScore = Math.min(100, velocityRatio * 50);
    if (velocityRatio < 0.5) velocityScore = 20;

    // 3. Engagement
    const sample = videos.slice(0, 10);
    const totalInteractions = sample.reduce((acc, v) => acc + parseInt(v.likes) + (parseInt(v.comments) * 2), 0);
    const totalSampleViews = sample.reduce((acc, v) => acc + parseInt(v.views), 0) || 1;
    const engRate = (totalInteractions / totalSampleViews) * 100;
    const engagementScore = Math.min(100, engRate * 25);

    // 4. Totals
    const totalScore = Math.round((consistencyScore * 0.3) + (engagementScore * 0.4) + (velocityScore * 0.3));

    let verdict = "Stable";
    if (totalScore > 85) verdict = "Elite";
    else if (totalScore > 70) verdict = "Healthy";
    else if (totalScore < 50) verdict = "Critical";

    return { 
      totalScore, verdict, 
      consistencyScore: Math.round(consistencyScore), 
      engagementScore: Math.round(engagementScore), 
      velocityScore: Math.round(velocityScore),
      avgGap: Math.round(avgGap),
      velocityRatio: velocityRatio.toFixed(2),
      engRate: engRate.toFixed(1)
    };
  }, [stats, videos]);

  const runDiagnosis = async () => {
    if (!healthData) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/health-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          metrics: healthData,
          recentTitles: videos.slice(0, 5).map(v => v.title)
        }),
      });
      const data = await res.json();
      console.log("🔥 RECEIVED DATA:", data); // Check Console if still broken
      setAiReport(data);
    } catch (e) {
      alert("Doctor is unavailable right now.");
    } finally {
      setLoadingAi(false);
    }
  };

  if (!healthData) return <div className="p-10 text-center text-slate-400 flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Collecting Vitals...</div>;

  // --- SAFE ACCESS HELPERS ---
  // These try multiple capitalization styles (diagnosis, Diagnosis, DIAGNOSIS)
  const getDiagnosis = () => aiReport?.diagnosis || aiReport?.Diagnosis || aiReport?.DIAGNOSIS;
  const getPrescription = () => aiReport?.prescription || aiReport?.Prescription || aiReport?.PRESCRIPTION || [];
  const getPrognosis = () => aiReport?.prognosis || aiReport?.Prognosis || aiReport?.PROGNOSIS;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="text-rose-500" /> Channel Pulse
          </h2>
          <p className="text-slate-500 text-sm">Real-time health analysis based on your last 10 uploads.</p>
        </div>
        <button 
          onClick={runDiagnosis}
          disabled={loadingAi || aiReport}
          className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          {loadingAi ? <Loader2 className="animate-spin" /> : <Stethoscope size={18} />}
          {aiReport ? "Diagnosis Complete" : "Run AI Diagnosis"}
        </button>
      </div>
      
      {/* SCORECARD */}
      <div className="bg-white p-8 rounded-3xl shadow-panel border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Health Score</p>
          <div className="flex items-baseline gap-4">
            <h1 className={`text-7xl font-black ${healthData.totalScore > 80 ? 'text-emerald-500' : healthData.totalScore < 50 ? 'text-rose-500' : 'text-yellow-500'}`}>
              {healthData.totalScore}
            </h1>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800">{healthData.verdict} Condition</span>
              <span className="text-xs text-slate-400">Based on 3 weighted metrics</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <Zap className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-2xl font-black text-slate-900">{healthData.velocityScore}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Velocity</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <Calendar className="mx-auto mb-2 text-purple-500" size={24} />
            <div className="text-2xl font-black text-slate-900">{healthData.consistencyScore}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Consistency</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <HeartPulse className="mx-auto mb-2 text-rose-500" size={24} />
            <div className="text-2xl font-black text-slate-900">{healthData.engagementScore}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mb-1">Engagement</div>
          </div>
        </div>
      </div>

      {/* AI DOCTOR REPORT (With Debug Fallback) */}
      {aiReport && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700">
           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-rose-500 blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
              
              {/* If we have a Diagnosis, show the UI */}
              {getDiagnosis() ? (
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="p-2 bg-white/10 rounded-lg"><Stethoscope className="text-rose-400" /></div>
                     <div>
                        <h3 className="text-lg font-bold">Dr. Gemini's Report</h3>
                        <p className="text-xs text-slate-400">Generated specifically for your channel data</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Diagnosis</span>
                        <p className="text-xl font-medium mt-1 leading-relaxed">"{getDiagnosis()}"</p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                           <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">Prescription (Do This)</span>
                           <ul className="space-y-3">
                              {getPrescription().map((item: string, i: number) => (
                                 <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <span className="bg-emerald-500/20 text-emerald-400 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold mt-0.5">{i+1}</span>
                                    {item}
                                 </li>
                              ))}
                           </ul>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                           <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block mb-3">Prognosis (If unchanged)</span>
                           <p className="text-sm text-slate-300 leading-relaxed opacity-80">
                              {getPrognosis()}
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                // --- DEBUG VIEW (Shows if UI is blank) ---
                <div className="relative z-10 font-mono text-xs">
                  <h3 className="text-rose-400 font-bold mb-2">⚠️ DEBUG: RAW DATA RECEIVED</h3>
                  <p className="mb-4 text-slate-400">The AI replied, but the format was unexpected. Here is the raw data:</p>
                  <pre className="bg-black/50 p-4 rounded-lg overflow-auto border border-white/10">
                    {JSON.stringify(aiReport, null, 2)}
                  </pre>
                </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
}