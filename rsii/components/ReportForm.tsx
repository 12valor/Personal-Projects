'use client'

import { useState, useEffect } from 'react'
import { submitOutbreakReport } from '@/app/actions'

export default function ReportForm() {
  const [coords, setCoords] = useState({ lat: '', lng: '' })
  const [isLocating, setIsLocating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    // Execution will fall through to the submitOutbreakReport Server Action
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

      {/* 2. INCIDENT METRICS */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b-2 border-neutral-200 w-full pb-2 mb-4">
          Incident Assessment Metrics
        </legend>

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
        disabled={isSubmitting}
        className="w-full bg-neutral-900 text-white p-5 rounded-none font-black text-lg uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 border-2 border-transparent"
      >
        {isSubmitting ? 'TRANSMITTING DATA...' : 'SUBMIT OFFICIAL RECORD'}
      </button>
    </form>
  )
}