'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { submitOutbreakReport } from '@/app/actions'

export default function ReportForm() {
  // We'll store the coordinates in state
  const [coords, setCoords] = useState({ lat: '', lng: '' })

  // We'll listen for a custom event from the Map component
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

  return (
    <form action={submitOutbreakReport} className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Log New RSSI Outbreak</h2>
      
      {/* LAT/LNG Inputs (Now controlled by state) */}
      <div className="grid grid-cols-2 gap-2">
        <input 
          name="lat" 
          value={coords.lat} 
          onChange={(e) => setCoords({...coords, lat: e.target.value})}
          placeholder="Lat (Click Map)" 
          className="p-2 border rounded bg-gray-50 font-mono text-sm" 
          required 
        />
        <input 
          name="lng" 
          value={coords.lng} 
          onChange={(e) => setCoords({...coords, lng: e.target.value})}
          placeholder="Lng (Click Map)" 
          className="p-2 border rounded bg-gray-50 font-mono text-sm" 
          required 
        />
      </div>

      <input name="location" placeholder="Location Name" className="w-full p-2 border rounded" required />
      <select name="severity" className="w-full p-2 border rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <textarea name="notes" placeholder="Notes..." className="w-full p-2 border rounded h-20" />
      
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
        Submit Report
      </button>
    </form>
  )
}