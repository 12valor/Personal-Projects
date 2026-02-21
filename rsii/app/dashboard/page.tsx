"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Dynamic import for the Map to prevent SSR errors
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-100 animate-pulse text-slate-400 font-bold">
      Loading Outbreak Map...
    </div>
  )
});

export default function Dashboard() {
  const [stats, setStats] = useState({ totalHectares: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      const { data, error } = await supabase
        .from('rssi_reports')
        .select('hectares_affected');
      
      if (data) {
        const total = data.reduce((sum, row) => sum + (Number(row.hectares_affected) || 0), 0);
        setStats({
          totalHectares: total,
          count: data.length
        });
      }
      setLoading(false);
    }

    getStats();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            TALISAY <span className="text-red-600 font-black">RSSI</span> TRACKER
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Regional Monitoring System</p>
        </div>
        <Link 
          href="/" 
          className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
        >
          <span>+</span> New Field Report
        </Link>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Area Affected</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-red-600">
                  {loading ? "..." : stats.totalHectares.toFixed(2)}
                </span>
                <span className="text-slate-500 font-bold">Hectares</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sites Reported</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">
                  {loading ? "..." : stats.count}
                </span>
                <span className="text-slate-500 font-bold">Locations</span>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="text-lg font-bold text-green-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                System Live
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden h-[600px] relative z-0">
              <Map />
            </div>

            {/* Sidebar Instructions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-black text-slate-800 uppercase mb-4">Map Visuals</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-600/50 border-2 border-red-600 mt-0.5"></div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Area Circles</p>
                      <p className="text-xs text-slate-500">Radius reflects actual hectares affected in the field.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300 mt-0.5"></div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Heat Intensity</p>
                      <p className="text-xs text-slate-500">Darker red circles indicate higher severity (Level 4-5).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-blue-800 font-bold text-sm uppercase tracking-wider">Analysis Tip</h3>
                <p className="text-blue-700 text-xs mt-2 leading-relaxed font-medium">
                  Clusters of circles indicate a potential mass outbreak. Focus eradication efforts on the largest "Area Circles" first.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}