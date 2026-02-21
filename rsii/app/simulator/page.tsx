"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap' 
});

const TALISAY_PRESETS = [
  { name: "Public Market Area", lat: 10.7305, lng: 122.9712 },
  { name: "Near City Hall", lat: 10.7342, lng: 122.9695 },
  { name: "Dos Hermanas Sector", lat: 10.7512, lng: 122.9850 },
  { name: "Concepcion Area", lat: 10.7120, lng: 122.9580 },
  { name: "Matab-ang Road", lat: 10.7250, lng: 122.9450 },
];

export default function Simulator() {
  const [status, setStatus] = useState("Ready to send test data.");
  const [isInjecting, setIsInjecting] = useState(false);

  const injectReport = async (lat: number, lng: number, name: string) => {
    setIsInjecting(true);
    setStatus(`Logging new incident for ${name}...`);

    const { error } = await supabase.from("rssi_reports").insert({
      lat: lat,
      lng: lng,
      severity_level: Math.floor(Math.random() * 5) + 1,
      hectares_affected: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      location: `SRID=4326;POINT(${lng} ${lat})`, 
    });

    if (error) {
      setStatus(`System Error: ${error.message}`);
    } else {
      setStatus(`Successfully added ${name} to the dashboard.`);
      setTimeout(() => setStatus("Ready to send test data."), 4000);
    }
    setIsInjecting(false);
  };

  return (
    <main className={`${poppins.className} min-h-screen bg-white text-slate-900 p-8`}>
      <div className="max-w-xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Test Tool</h1>
          <p className="text-lg text-slate-500 mt-2">Use these buttons to create sample reports for the LGU Dashboard.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-10">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Location</p>
          {TALISAY_PRESETS.map((loc) => (
            <button
              key={loc.name}
              disabled={isInjecting}
              onClick={() => injectReport(loc.lat, loc.lng, loc.name)}
              className="w-full text-left border border-slate-200 p-6 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-slate-800">{loc.name}</span>
                <span className="text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Create Report →</span>
              </div>
              <div className="text-sm text-slate-400 mt-1">
                Coordinates: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
              </div>
            </button>
          ))}
        </div>

        {/* Status Message */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${isInjecting ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status</span>
          </div>
          <p className="text-lg font-medium text-slate-700">{status}</p>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8 border-t border-slate-100 pt-8">
          <Link href="/dashboard" className="text-base font-semibold text-blue-600 hover:underline">
            ← Return to Dashboard
          </Link>
          <Link href="/" className="text-base font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            Open Mobile App View
          </Link>
        </nav>
      </div>
    </main>
  );
}