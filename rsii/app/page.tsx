"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  // Preserved State
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [severity, setSeverity] = useState(3);
  const [hectares, setHectares] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [barangay, setBarangay] = useState("");
  
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Hardware GPS Capture
  const captureLocation = () => {
    setIsLocating(true);
    setStatus("Finding your location...");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
          });
          setStatus("Location captured successfully.");
          setIsLocating(false);
        },
        (error) => {
          setStatus(`Unable to get location: ${error.message}`);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setStatus("GPS is not supported by your browser.");
      setIsLocating(false);
    }
  };

  // Preserved Database Logic
  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordinates.lat || !coordinates.lng) {
      setStatus("Please capture your location before submitting.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending report...");

    const { error } = await supabase.from("rssi_reports").insert({
      farmer_name: farmerName,
      barangay: barangay,
      severity_level: severity,
      hectares_affected: Number(hectares),
      lat: coordinates.lat,
      lng: coordinates.lng,
      // Preserved PostGIS spatial formatting
      location: `SRID=4326;POINT(${coordinates.lng} ${coordinates.lat})`,
    });

    if (error) {
      console.error(error);
      setStatus("Failed to send report: " + error.message);
    } else {
      setStatus("Report submitted successfully. Thank you!");
      // Reset form
      setCoordinates({ lat: null, lng: null });
      setSeverity(3);
      setHectares("");
      setFarmerName("");
      setBarangay("");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-900">
      
      {/* Navigation to Dashboard */}
      <div className="w-full max-w-xl mb-4 flex justify-end">
        <Link 
          href="/dashboard" 
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          View Live Map &rarr;
        </Link>
      </div>

      <form 
        onSubmit={submitReport}
        className="w-full max-w-xl p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-8"
      >
        {/* Header Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Report an Incident
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Help the Talisay Agriculture Office track and respond to field outbreaks by providing accurate information below.
          </p>
        </div>
        
        {/* 1. Personal Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
            Your Information
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="e.g. Juan Dela Cruz" 
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Barangay</label>
            <input 
              type="text"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              placeholder="e.g. Concepcion" 
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400" 
              required 
            />
          </div>
        </div>

        {/* 2. Incident Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
            Incident Details
          </h3>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Area Affected (Hectares)</label>
            <input 
              type="number"
              step="0.1"
              min="0.1"
              value={hectares}
              onChange={(e) => setHectares(e.target.value)}
              placeholder="e.g. 1.5" 
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observed Severity Level</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
              required
            >
              <option value="1">Level 1 - Minimal Damage</option>
              <option value="2">Level 2 - Localized Issue</option>
              <option value="3">Level 3 - Moderate Spread</option>
              <option value="4">Level 4 - Severe Threat</option>
              <option value="5">Level 5 - Critical Emergency</option>
            </select>
          </div>
        </div>

        {/* 3. Location Capture */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
            Location
          </h3>

          <button 
            type="button" 
            onClick={captureLocation}
            disabled={isLocating}
            className={`w-full p-4 rounded-xl font-semibold text-base flex items-center justify-center transition-all active:scale-[0.98] ${
              coordinates.lat 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            }`}
          >
            {isLocating ? "Acquiring GPS Signal..." : coordinates.lat ? "Location Captured" : "Tap to get current location"}
          </button>

          {/* Coordinates Display (Subtle) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Latitude</label>
              <input 
                type="text"
                value={coordinates.lat || ''} 
                readOnly
                placeholder="---" 
                className="w-full p-2.5 text-sm font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Longitude</label>
              <input 
                type="text"
                value={coordinates.lng || ''} 
                readOnly
                placeholder="---" 
                className="w-full p-2.5 text-sm font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Status Messaging */}
        {status && (
          <div className={`p-4 text-sm font-medium rounded-xl flex items-center justify-center text-center ${
            status.includes("Failed") || status.includes("Unable") || status.includes("Please capture") 
              ? "bg-red-50 text-red-700 border border-red-100" 
              : status.includes("successfully") 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
              : "bg-slate-50 text-slate-600 border border-slate-200 animate-pulse"
          }`}>
            {status}
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting || !coordinates.lat}
          className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:translate-y-[1px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </main>
  );
}