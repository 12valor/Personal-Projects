'use client'

import { useState, useEffect } from 'react'
import { submitOutbreakReport } from '@/app/actions'
import { supabase } from '@/lib/supabase'

export default function ReportForm() {
  const [coords, setCoords] = useState({ lat: '', lng: '' })
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    const handleMapClick = (e: any) => {
      setCoords({ 
        lat: e.detail.lat.toFixed(6), 
        lng: e.detail.lng.toFixed(6) 
      })
    }
    window.addEventListener('map-click', handleMapClick)
    return () => window.removeEventListener('map-click', handleMapClick)
  }, [])

  const getDeviceLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          })
          setIsLocating(false)
        },
        (error) => {
          console.error("GPS Error:", error)
          alert("ERROR: Unable to retrieve device coordinates. Verify location permissions.")
          setIsLocating(false)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      alert("ERROR: Hardware location services not supported by this browser.")
      setIsLocating(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `reports/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('report-photos')
        .getPublicUrl(filePath)

      setPhotoUrl(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    // Execution falls through to submitOutbreakReport
  }

  return (
    <form 
      action={submitOutbreakReport} 
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 md:p-8 bg-white border-2 border-neutral-900 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-8 font-sans"
    >
      <div className="border-b-4 border-neutral-900 pb-4">
        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight">
          Official Incident Report
        </h2>
        <p className="text-sm text-neutral-600 font-bold mt-1 uppercase tracking-widest">
          Department of Agriculture • RSSI Monitoring
        </p>
      </div>
      
      <input type="hidden" name="photo_url" value={photoUrl} />

      {/* 1. REPORTING ENTITY */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b-2 border-neutral-200 w-full pb-2 mb-4">
          Reporting Entity Identification
        </legend>
        
        <div>
          <label htmlFor="farmer_name" className="block text-sm font-bold text-neutral-900 uppercase mb-2">Registered Farmer Name</label>
          <input 
            type="text"
            id="farmer_name"
            name="farmer_name" 
            placeholder="ENTER FULL NAME" 
            className="w-full p-4 text-base font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none focus:border-black focus:ring-0 outline-none transition-colors uppercase placeholder:text-neutral-400" 
            required 
          />
        </div>

        <div>
          <label htmlFor="contact_number" className="block text-sm font-bold text-neutral-900 uppercase mb-2">Contact Number</label>
          <input 
            type="tel"
            id="contact_number"
            name="contact_number" 
            placeholder="09XXXXXXXXX" 
            className="w-full p-4 text-base font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none focus:border-black focus:ring-0 outline-none transition-colors uppercase placeholder:text-neutral-400" 
            required 
          />
        </div>

        <div>
          <label htmlFor="barangay" className="block text-sm font-bold text-neutral-900 uppercase mb-2">Barangay Location</label>
          <input 
            type="text"
            id="barangay"
            name="barangay" 
            placeholder="ENTER BARANGAY" 
            className="w-full p-4 text-base font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none focus:border-black focus:ring-0 outline-none transition-colors uppercase placeholder:text-neutral-400" 
            required 
          />
        </div>
      </fieldset>

      {/* 2. INCIDENT EVIDENCE & METRICS */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b-2 border-neutral-200 w-full pb-2 mb-4">
          Evidence & Assessment Metrics
        </legend>

        <div>
          <label className="block text-sm font-bold text-neutral-900 uppercase mb-2">Evidence Photo</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-3 text-sm font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-black file:uppercase file:bg-neutral-900 file:text-white hover:file:bg-black"
          />
          {isUploading && <p className="text-[10px] font-bold text-neutral-500 mt-2 uppercase animate-pulse">Uploading evidence...</p>}
          {photoUrl && <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase">✓ Photo attached to record</p>}
        </div>

        <div>
          <label htmlFor="hectares_affected" className="block text-sm font-bold text-neutral-900 uppercase mb-2">Estimated Affected Area (Hectares)</label>
          <input 
            type="number"
            step="0.1"
            min="0.1"
            id="hectares_affected"
            name="hectares_affected" 
            placeholder="0.0" 
            className="w-full p-4 text-lg font-mono font-medium text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none focus:border-black focus:ring-0 outline-none transition-colors" 
            required 
          />
        </div>

        <div>
          <label htmlFor="severity_level" className="block text-sm font-bold text-neutral-900 uppercase mb-2">Observed Severity Level</label>
          <select 
            id="severity_level"
            name="severity_level" 
            className="w-full p-4 text-base font-bold text-neutral-900 bg-neutral-50 border-2 border-neutral-300 rounded-none focus:border-black focus:ring-0 outline-none transition-colors appearance-none uppercase"
            required
            defaultValue="3"
          >
            <option value="1">LEVEL 1 - MINIMAL DAMAGE</option>
            <option value="2">LEVEL 2 - LOCALIZED SPREAD</option>
            <option value="3">LEVEL 3 - MODERATE THREAT</option>
            <option value="4">LEVEL 4 - SEVERE OUTBREAK</option>
            <option value="5">LEVEL 5 - CRITICAL EMERGENCY</option>
          </select>
        </div>
      </fieldset>

      {/* 3. GEOSPATIAL DATA */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b-2 border-neutral-200 w-full pb-2 mb-4">
          Geospatial Coordinates
        </legend>

        <button 
          type="button" 
          onClick={getDeviceLocation}
          disabled={isLocating}
          className="w-full p-4 bg-neutral-200 border-2 border-neutral-400 text-neutral-900 rounded-none font-bold text-sm uppercase tracking-widest flex items-center justify-center hover:bg-neutral-300 transition-all active:scale-[0.99]"
        >
          {isLocating ? "ACQUIRING SATELLITE FIX..." : "ACQUIRE DEVICE COORDINATES"}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Latitude</label>
            <input 
              type="text"
              id="lat"
              name="lat" 
              value={coords.lat} 
              readOnly
              placeholder="00.000000" 
              className="w-full p-3 text-base font-mono bg-neutral-100 border-2 border-neutral-200 text-neutral-600 rounded-none focus:outline-none" 
              required 
            />
          </div>
          <div>
            <label htmlFor="lng" className="block text-xs font-bold text-neutral-500 uppercase mb-1">Longitude</label>
            <input 
              type="text"
              id="lng"
              name="lng" 
              value={coords.lng} 
              readOnly
              placeholder="000.000000" 
              className="w-full p-3 text-base font-mono bg-neutral-100 border-2 border-neutral-200 text-neutral-600 rounded-none focus:outline-none" 
              required 
            />
          </div>
        </div>
      </fieldset>
      
      <button 
        type="submit" 
        disabled={isSubmitting || isUploading}
        className="w-full bg-neutral-900 text-white p-5 rounded-none font-black text-lg uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 border-2 border-transparent"
      >
        {isSubmitting ? 'TRANSMITTING DATA...' : 'SUBMIT OFFICIAL RECORD'}
      </button>
    </form>
  )
}