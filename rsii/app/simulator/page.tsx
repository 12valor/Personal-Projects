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
  const [status, setStatus] = useState("Idle");
  const [isInjecting, setIsInjecting] = useState(false);

  const injectReport = async (lat: number, lng: number, name: string) => {
    setIsInjecting(true);
    setStatus(`Processing: ${name}`);

    const { error } = await supabase.from("rssi_reports").insert({
      lat: lat,
      lng: lng,
      severity_level: Math.floor(Math.random() * 5) + 1,
      hectares_affected: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      location: `SRID=4326;POINT(${lng} ${lat})`, 
    });

    if (error) {
      setStatus("Error: " + error.message);
    } else {
      setStatus(`Added: ${name}`);
    }
    setIsInjecting(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 font-mono">
      <div className="max-w-md">
        <div className="mb-8">
          <h1 className="text-xl font-bold">SIMULATOR</h1>
          <p className="text-sm text-gray-500">Database Injection Utility</p>
        </div>

        <div className="space-y-2 mb-8">
          {TALISAY_PRESETS.map((loc) => (
            <button
              key={loc.name}
              disabled={isInjecting}
              onClick={() => injectReport(loc.lat, loc.lng, loc.name)}
              className="w-full text-left border border-white p-3 hover:bg-white hover:text-black disabled:opacity-30"
            >
              <div className="flex justify-between">
                <span>{loc.name}</span>
                <span>[INJECT]</span>
              </div>
              <div className="text-[10px] opacity-50">
                {loc.lat}, {loc.lng}
              </div>
            </button>
          ))}
        </div>

        <div className="border border-white p-4 mb-8">
          <p className="text-sm">Status: {status}</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="underline text-sm">Return to Dashboard</Link>
          <Link href="/" className="underline text-sm">Return to Reporter</Link>
        </nav>
      </div>
    </main>
  );
}