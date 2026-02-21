'use client'

import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Custom alert icons
const AlertIconRed = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35], 
  iconAnchor: [17, 35], 
  popupAnchor: [0, -35],
});

// A green version of the icon for "responded" using a CSS hue-rotate trick
const AlertIconGreen = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35], 
  iconAnchor: [17, 35], 
  popupAnchor: [0, -35],
  className: 'hue-rotate-[240deg]' 
});

const getRadiusInMeters = (hectares: number) => Math.sqrt((hectares * 10000) / Math.PI);
const getSeverityColor = (level: number) => level >= 5 ? '#ef4444' : level >= 3 ? '#fb923c' : '#facc15';

export default function Map() {
  const [reports, setReports] = useState<any[]>([])
  const [invertedMask, setInvertedMask] = useState<any>(null)
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch Boundary Mask
    fetch('/talisay-boundary.json')
      .then(res => res.json())
      .then(data => {
        if (data.features) {
          const cityFeature = data.features.find((f: any) => 
            f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
          );
          if (cityFeature) {
            const worldCoords = [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]];
            setInvertedMask({
              type: "Feature",
              geometry: { type: "Polygon", coordinates: [...worldCoords, ...cityFeature.geometry.coordinates] }
            });
          }
        }
      });

    // 2. Initial Data Fetch
    const fetchReports = async () => {
      const { data } = await supabase.from('rssi_reports').select('*');
      if (data) setReports(data);
    };
    fetchReports();

    // 3. Realtime Listener
    const channel = supabase.channel('realtime-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rssi_reports' }, 
        (payload) => setReports(prev => [...prev, payload.new]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rssi_reports' }, 
        (payload) => setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new : r)))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [])

  // ADMIN ACTION: Optimistic UI Update for Instant Interaction
  const updateStatus = async (id: string, newStatus: string) => {
    // 1. Instantly update the local state so the UI reacts without waiting for the network
    setReports((prev) => 
      prev.map((report) => 
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
    
    // 2. Immediately close the popup if we are archiving/clearing the map
    if (newStatus === 'archived') {
      setActiveReportId(null); 
    }

    // 3. Fire the database update in the background
    const { error } = await supabase.from('rssi_reports').update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error("Failed to update status in DB:", error);
    }
  };

  // FILTER: 'archived' items vanish from the map completely
  const activeReports = reports.filter(r => r.lat && r.lng && r.status !== 'archived');

  return (
    // Added transform-gpu here to force hardware acceleration during swipes
    <div className="h-full w-full bg-[#020617] overflow-hidden relative transform-gpu">
      <MapContainer 
        center={[10.7305, 122.9712]} 
        zoom={13} 
        className="h-full w-full" 
        attributionControl={false}
        preferCanvas={true} // Switched to canvas rendering for better performance with markers/polygons
      >
        <TileLayer 
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" 
          keepBuffer={8}            // Massively increases the pre-rendered off-screen tiles
          updateWhenIdle={false}    // Forces tiles to download while your finger is swiping
          updateWhenZooming={false} // Keeps tiles downloading smoothly while pinching
        />

        {invertedMask && (
          <GeoJSON 
            data={invertedMask} 
            style={{ fillColor: "#020617", fillOpacity: 0.7, color: "#22d3ee", weight: 2 }} 
            interactive={false}
          />
        )}

        {activeReports.map((report) => (
          <div key={report.id}>
            <Marker 
              position={[Number(report.lat), Number(report.lng)]}
              icon={report.status === 'responded' ? AlertIconGreen : AlertIconRed}
              eventHandlers={{ click: () => setActiveReportId(report.id) }}
            >
              <Popup onClose={() => setActiveReportId(null)}>
                <div className="p-2 min-w-[180px] font-sans">
                  {/* Status Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-neutral-800 uppercase text-xs">Site Intel</h3>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest text-white ${
                      report.status === 'responded' ? 'bg-teal-600' : 
                      report.status === 'dispatched' ? 'bg-orange-600' : 'bg-red-600'
                    }`}>
                      {report.status || 'pending'}
                    </span>
                  </div>
                  
                  {/* Incident Details */}
                  <div className="text-xs border-t border-slate-200 pt-3 space-y-2 mb-4">
                    <p className="flex justify-between"><span className="text-neutral-500 font-semibold">Severity</span> <strong>Lvl {report.severity_level}</strong></p>
                    <p className="flex justify-between"><span className="text-neutral-500 font-semibold">Impact Area</span> <strong>{report.hectares_affected} ha</strong></p>
                    {report.farmer_name && <p className="flex justify-between"><span className="text-neutral-500 font-semibold">Contact</span> <strong>{report.farmer_name}</strong></p>}
                  </div>

                  {/* ADMIN CONTROLS */}
                  {(!report.status || report.status === 'pending') && (
                    <button onClick={() => updateStatus(report.id, 'dispatched')} className="w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded bg-black text-white hover:bg-neutral-800 transition-colors">
                      Dispatch Response Team
                    </button>
                  )}
                  {report.status === 'dispatched' && (
                    <div className="w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded bg-neutral-200 text-neutral-500 text-center">
                      Awaiting Team Arrival
                    </div>
                  )}
                  {report.status === 'responded' && (
                    <button onClick={() => updateStatus(report.id, 'archived')} className="w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md">
                      Acknowledge & Clear Map
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Impact Area Circle */}
            {activeReportId === report.id && (
              <Circle
                center={[Number(report.lat), Number(report.lng)]}
                radius={getRadiusInMeters(report.hectares_affected || 1)}
                pathOptions={{
                  fillColor: getSeverityColor(report.severity_level),
                  color: "white",
                  weight: 2,
                  fillOpacity: 0.4,
                  dashArray: "5, 10"
                }}
              />
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  )
}