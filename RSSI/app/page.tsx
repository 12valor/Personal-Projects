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
  
  // New State for Contact and Photos
  const [contactNumber, setContactNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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

  // Preserved Database Logic with New Fields
  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coordinates.lat || !coordinates.lng) {
      setStatus("Please capture your location before submitting.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Processing evidence...");

    let finalPhotoUrl = null;

    // Handle Photo Upload if a file exists
    if (file) {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        setStatus("Image upload failed, but attempting to send report...");
      } else {
        const { data: urlData } = supabase.storage.from('report-photos').getPublicUrl(filePath);
        finalPhotoUrl = urlData.publicUrl;
      }
      setIsUploading(false);
    }

    setStatus("Sending official record...");

    const { error } = await supabase.from("rssi_reports").insert({
      farmer_name: farmerName,
      contact_number: contactNumber, // New field
      photo_url: finalPhotoUrl,      // New field
      barangay: barangay,
      severity_level: severity,
      hectares_affected: Number(hectares),
      lat: coordinates.lat,
      lng: coordinates.lng,
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
      setContactNumber("");
      setFile(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-900">

      <form 
        onSubmit={submitReport}
        className="w-full max-w-xl p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-8"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Report an Incident
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Provide accurate information to help track and respond to field outbreaks.
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
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number</label>
            <input 
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="0912 345 6789" 
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
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
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              required 
            />
          </div>
        </div>

        {/* 2. Incident & Evidence */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
            Incident Details & Evidence
          </h3>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Photo Evidence</label>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all"
              />
              {file && (
                <p className="text-[10px] font-bold text-blue-600 uppercase italic px-2">
                  Ready to upload: {file.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estimated Area Affected (Hectares)</label>
            <input 
              type="number"
              step="0.1"
              min="0.1"
              value={hectares}
              onChange={(e) => setHectares(e.target.value)}
              placeholder="e.g. 1.5" 
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Severity Level</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full p-3.5 text-base text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
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
            Location Data
          </h3>

          <button 
            type="button" 
            onClick={captureLocation}
            disabled={isLocating}
            className={`w-full p-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98] border ${
              coordinates.lat 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
          >
            {isLocating ? "Acquiring Signal..." : coordinates.lat ? "Location Verified" : "Capture Current Location"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Latitude</label>
              <input 
                type="text"
                value={coordinates.lat || ''} 
                readOnly
                placeholder="---" 
                className="w-full p-2.5 text-sm font-mono bg-slate-50 border border-slate-200 text-slate-600 rounded-lg focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Longitude</label>
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

        {status && (
          <div className={`p-4 text-sm font-semibold rounded-xl text-center ${
            status.includes("Failed") || status.includes("Unable") || status.includes("Please capture") 
              ? "bg-rose-50 text-rose-700 border border-rose-100" 
              : status.includes("successfully") 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
              : "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
          }`}>
            {status}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting || !coordinates.lat}
          className="w-full bg-[#002244] text-white p-5 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:translate-y-[1px]"
        >
          {isSubmitting ? 'Transmitting...' : 'Submit Official Record'}
        </button>
      </form>
    </div>
  );
}