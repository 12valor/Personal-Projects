"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const TALISAY_PRESETS = [
  { name: "Public Market Area", lat: 10.7305, lng: 122.9712 },
  { name: "Near City Hall", lat: 10.7342, lng: 122.9695 },
  { name: "Dos Hermanas Sector", lat: 10.7512, lng: 122.9850 },
  { name: "Concepcion Area", lat: 10.7120, lng: 122.9580 },
  { name: "Matab-ang Road", lat: 10.7250, lng: 122.9450 },
];

export default function Simulator() {
  const [status, setStatus] = useState("Standing by...");
  const [isInjecting, setIsInjecting] = useState(false);

  const injectReport = async (lat: number, lng: number, name: string) => {
    setIsInjecting(true);
    setStatus(`Injecting report for ${name}...`);

    const { error } = await supabase.from("rssi_reports").insert({
      lat: lat,
      lng: lng,
      severity_level: Math.floor(Math.random() * 5) + 1,
      hectares_affected: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      // OPTION 2 UPDATE: Matches the main reporter geometry format
      location: `SRID=4326;POINT(${lng} ${lat})`, 
    });

    if (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    } else {
      setStatus(`Success! Added ${name} to the Real Map.`);
    }
    setIsInjecting(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-orange-500 tracking-tighter">DATA INJECTOR</h1>
            <p className="text-slate-400 mt-2">Simulate field reports without leaving your desk.</p>
          </div>
          <Link 
            href="/dashboard" 
            className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            ← Back to Map
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Talisay City Presets</h2>
          {TALISAY_PRESETS.map((loc) => (
            <button
              key={loc.name}
              disabled={isInjecting}
              onClick={() => injectReport(loc.lat, loc.lng, loc.name)}
              className="bg-slate-800 hover:bg-slate-700 p-5 rounded-2xl border border-slate-700 flex justify-between items-center transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="text-left">
                <p className="font-bold text-lg">{loc.name}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">
                  LAT: {loc.lat} / LNG: {loc.lng}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-orange-500 font-black text-sm">INJECT 🚀</span>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Instant Sync</span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-black/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isInjecting ? 'bg-orange-500 animate-ping' : 'bg-green-500'}`}></div>
            <p className="text-sm font-mono text-slate-300 italic">{status}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Link 
            href="/" 
            className="block text-center bg-slate-700 p-4 rounded-xl font-bold hover:bg-slate-600 transition-all text-sm"
            >
            Reporter View
            </Link>
            <Link 
            href="/dashboard" 
            className="block text-center bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-900/20"
            >
            Live Dashboard
            </Link>
        </div>
      </div>

      <footer className="max-w-2xl mx-auto mt-12 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">Developer Sandbox Mode</p>
      </footer>
    </main>
  );
}