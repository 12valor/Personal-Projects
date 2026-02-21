'use client'

import { MapContainer, TileLayer, Circle, Popup, GeoJSON, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// 1. Custom Alert Icon
// Using a warning/alert icon for high visibility
const AlertIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const getRadiusInMeters = (hectares: number) => Math.sqrt((hectares * 10000) / Math.PI);
const getSeverityColor = (level: number) => level >= 5 ? '#ef4444' : level >= 3 ? '#fb923c' : '#facc15';

export default function Map() {
  const [reports, setReports] = useState<any[]>([])
  const [invertedMask, setInvertedMask] = useState<any>(null)
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  useEffect(() => {
    // 2. Load and filter Boundary for the Inverted Shroud
    fetch('/talisay-boundary.json')
      .then(res => res.json())
      .then(data => {
        if (data.features) {
          // EXCLUSION LOGIC: Keep only Polygons. This removes any blue pins or points
          // that might be bundled in the GeoJSON export.
          const cityFeature = data.features.find((f: any) => 
            f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
          );

          if (cityFeature) {
            // World Coordinates (Outer Ring)
            const worldCoords = [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]];
            // City Coordinates (Inner Hole)
            const cityCoords = cityFeature.geometry.coordinates;

            setInvertedMask({
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [...worldCoords, ...cityCoords]
              }
            });
          }
        }
      });

    // 3. Fetch Initial Reports
    const fetchReports = async () => {
      const { data } = await supabase.from('rssi_reports').select('*');
      if (data) setReports(data);
    };
    fetchReports();

    // 4. Real-time Subscription
    const channel = supabase.channel('realtime-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rssi_reports' }, 
      (payload) => setReports(prev => [...prev, payload.new]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [])

  return (
    <div className="h-full w-full bg-[#020617] overflow-hidden relative">
      <MapContainer 
        center={[10.7305, 122.9712]} 
        zoom={13} 
        className="h-full w-full"
        attributionControl={false}
      >
        {/* BASE LAYER: Satellite Imagery */}
        <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

        {/* MASK LAYER: The Black Shroud (Excludes everything outside Talisay) */}
        {invertedMask && (
          <GeoJSON 
            data={invertedMask} 
            style={{
              fillColor: "#020617", 
              fillOpacity: 0.65, 
              color: "#22d3ee", // Cyan Border
              weight: 2,
            }} 
            interactive={false}
          />
        )}

        {/* DYNAMIC LAYERS: Alerts and Interactive Zones */}
        {reports.filter(r => r.lat && r.lng).map((report) => (
          <div key={report.id}>
            {/* The Pin - Always Visible */}
            <Marker 
              position={[Number(report.lat), Number(report.lng)]}
              icon={AlertIcon}
              eventHandlers={{
                click: () => setActiveReportId(report.id),
              }}
            >
              <Popup onClose={() => setActiveReportId(null)}>
                <div className="p-1 min-w-[120px]">
                  <h3 className="font-black text-red-600 uppercase text-[10px] mb-1">Outbreak Site</h3>
                  <div className="text-[11px] border-t pt-2 space-y-1">
                    <p><strong>Severity:</strong> Lvl {report.severity_level}</p>
                    <p><strong>Impact:</strong> {report.hectares_affected} ha</p>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* The Circle - Only Visible when the corresponding Pin is active */}
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

      {/* Optional: Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white pointer-events-none">
        <h4 className="text-[9px] uppercase tracking-widest font-bold mb-2 text-slate-400">Alert Priority</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Level 5 (Extreme)
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-2 h-2 rounded-full bg-[#fb923c]"></div> Level 3 (Moderate)
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-2 h-2 rounded-full bg-[#facc15]"></div> Level 1 (Low)
          </div>
        </div>
      </div>
    </div>
  )
}