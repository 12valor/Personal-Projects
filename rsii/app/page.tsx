"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [severity, setSeverity] = useState(1);
  const [hectares, setHectares] = useState(1);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureLocation = () => {
    setStatus("Acquiring GPS signal...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setStatus("Location locked. Ready to submit.");
        },
        (error) => setStatus(`Location error: ${error.message}`),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setStatus("Geolocation is not supported by your browser.");
    }
  };

  const submitReport = async () => {
    if (!coordinates.lat || !coordinates.lng) {
      setStatus("Please pin your location first!");
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending report to database...");

    const { error } = await supabase.from("rssi_reports").insert({
      severity_level: severity,
      hectares_affected: hectares,
      lat: coordinates.lat,
      lng: coordinates.lng,
      // OPTION 2 UPDATE: Added SRID=4326 to specify the spatial reference system
      location: `SRID=4326;POINT(${coordinates.lng} ${coordinates.lat})`,
    });

    if (error) {
      console.error(error);
      setStatus("Error saving report: " + error.message);
    } else {
      setStatus("Report submitted successfully!");
      // Reset form
      setCoordinates({ lat: null, lng: null });
      setSeverity(1);
      setHectares(1);
    }
    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100 text-slate-900">
      <div className="flex flex-col items-center p-8 space-y-6 bg-white shadow-xl rounded-2xl w-full max-w-md border border-slate-200">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-red-700 italic">RSSI Field Reporter</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Talisay City Outbreak Tracking</p>
        </div>

        {/* Step 1: GPS Capture */}
        <button
          onClick={captureLocation}
          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold w-full transition-all active:scale-95 ${
            coordinates.lat 
              ? "bg-green-100 text-green-700 border-2 border-green-500" 
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
          }`}
        >
          {coordinates.lat ? "✅ Location Captured" : "📍 1. Pin My Field Location"}
        </button>

        {/* Step 2: Details */}
        <div className="flex flex-col space-y-4 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex flex-col">
            <label className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-1">
              Severity Level (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs font-bold mt-2 px-1 text-slate-400">
              <span>Low</span>
              <span className="text-red-600 text-lg">{severity}</span>
              <span>Extreme</span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-1">
              Hectares Affected
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={hectares}
              onChange={(e) => setHectares(Number(e.target.value))}
              className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-semibold"
            />
          </div>
        </div>

        {/* Step 3: Submit */}
        <button
          onClick={submitReport}
          disabled={!coordinates.lat || isSubmitting}
          className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold w-full disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          {isSubmitting ? "Processing..." : "🚀 2. Submit Report"}
        </button>

        {/* Status Messaging */}
        <p className="text-xs font-bold text-slate-500 text-center h-4 animate-pulse">
          {status}
        </p>

        <hr className="w-full border-slate-100" />

        {/* Navigation to Dashboard */}
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 transition-transform hover:translate-x-1"
        >
          View Live Outbreak Map →
        </Link>
      </div>
      
      <footer className="mt-8 text-[10px] text-slate-400 uppercase tracking-[0.2em]">
        Agriculture Monitoring System v1.0
      </footer>
    </main>
  );
}