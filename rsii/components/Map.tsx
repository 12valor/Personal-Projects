'use client'

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * 1. HEATLAYER SUB-COMPONENT
 * Handles the logic for rendering the intensity gradient.
 */
function HeatLayer({ points }: { points: any[] }) {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    import('leaflet.heat');

    if (!map || !points.length) return;

    const heatData = points.map(p => [
      Number(p.lat), 
      Number(p.lng), 
      Number(p.severity_level) / 5 
    ]);

    // @ts-ignore
    const heatLayer = L.heatLayer(heatData, {
      radius: 50,      
      blur: 35,        
      maxZoom: 13,
      minOpacity: 0.4,
      gradient: { 
        0.4: '#3b82f6', 0.6: '#22d3ee', 0.7: '#10b981', 0.8: '#fbbf24', 1.0: '#ef4444' 
      }
    }).addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}

/**
 * 2. ASSETS & HELPERS
 */
const AlertIconRed = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35], 
  iconAnchor: [17, 35], 
  popupAnchor: [0, -35],
});

const AlertIconGreen = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', 
  iconSize: [35, 35], 
  iconAnchor: [17, 35], 
  popupAnchor: [0, -35],
  className: 'hue-rotate-[240deg]' 
});

/**
 * 3. MAIN MAP COMPONENT
 */
export default function Map({ hotZoneBarangay }: { hotZoneBarangay?: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [invertedMask, setInvertedMask] = useState<any>(null);

  const fetchReports = async () => {
    const { data } = await supabase.from('rssi_reports').select('*');
    if (data) setReports(data);
  };

  useEffect(() => {
    fetch('/talisay-boundary.json')
      .then(res => res.json())
      .then(data => {
        setBoundaryData(data);
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

    fetchReports();

    const channel = supabase.channel('map-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rssi_reports' }, () => fetchReports())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /**
   * RESTORED: Status Update Logic
   */
  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic Update
    setReports((prev) => 
      prev.map((report) => 
        report.id === id ? { ...report, status: newStatus } : report
      )
    );

    const updateData: any = { status: newStatus };
    
    // If responding, set the timestamp for your response velocity metric
    if (newStatus === 'responded') {
      updateData.responded_at = new Date().toISOString();
    }

    const { error } = await supabase.from('rssi_reports').update(updateData).eq('id', id);
    if (error) console.error("Database Update Failed:", error);
  };

  const activeReports = reports.filter(r => r.lat && r.lng && r.status !== 'archived');

  return (
    <div className="h-full w-full bg-[#020617] overflow-hidden relative transform-gpu">
      <MapContainer 
        center={[10.7305, 122.9712]} 
        zoom={13} 
        className="h-full w-full" 
        attributionControl={false}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />

        <HeatLayer points={activeReports} />

        {invertedMask && (
          <GeoJSON 
            data={invertedMask} 
            style={{ fillColor: "#020617", fillOpacity: 0.7, color: "#22d3ee", weight: 2 }} 
            interactive={false}
          />
        )}

        {boundaryData && (
          <GeoJSON 
            data={boundaryData}
            style={(f) => {
              const isHot = f.properties?.NAME_2 === hotZoneBarangay || f.properties?.barangay === hotZoneBarangay;
              return {
                fillColor: isHot ? "#ef4444" : "transparent",
                fillOpacity: isHot ? 0.2 : 0,
                color: isHot ? "#22d3ee" : "transparent",
                weight: 4,
                dashArray: isHot ? "5, 10" : "0"
              };
            }}
            interactive={false}
          />
        )}

        {activeReports.map((report) => (
          <Marker 
            key={report.id}
            position={[Number(report.lat), Number(report.lng)]}
            icon={report.status === 'responded' ? AlertIconGreen : AlertIconRed}
          >
            <Popup>
              <div className="p-1 min-w-[200px] font-sans">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-neutral-800 uppercase text-[10px] tracking-tight">Intelligence File</h3>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-sm uppercase text-white ${
                    report.status === 'responded' ? 'bg-teal-600' : 
                    report.status === 'dispatched' ? 'bg-orange-600' : 'bg-red-600'
                  }`}>
                    {report.status || 'pending'}
                  </span>
                </div>

                <div className="text-[11px] border-t border-slate-100 pt-3 space-y-2 mb-4">
                  <p className="flex justify-between"><span className="text-neutral-400 font-bold uppercase text-[9px]">Node ID</span> <span className="font-mono">{report.id.substring(0,8).toUpperCase()}</span></p>
                  <p className="flex justify-between"><span className="text-neutral-400 font-bold uppercase text-[9px]">Liaison</span> <span className="font-bold">{report.farmer_name || "N/A"}</span></p>
                  <p className="flex justify-between"><span className="text-neutral-400 font-bold uppercase text-[9px]">Impact</span> <span className="font-bold">{report.hectares_affected} HA</span></p>
                </div>

                {/* RESTORED: Tactical Action Buttons */}
                <div className="space-y-1">
                  {(!report.status || report.status === 'pending') && (
                    <button 
                      onClick={() => updateStatus(report.id, 'dispatched')} 
                      className="w-full py-2 text-[9px] font-black uppercase tracking-widest rounded-sm bg-black text-white hover:bg-neutral-800 transition-colors"
                    >
                      Dispatch Team
                    </button>
                  )}
                  {report.status === 'dispatched' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'responded')} 
                      className="w-full py-2 text-[9px] font-black uppercase tracking-widest rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Confirm Arrival
                    </button>
                  )}
                  {report.status === 'responded' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'archived')} 
                      className="w-full py-2 text-[9px] font-black uppercase tracking-widest rounded-sm bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                    >
                      Resolve & Clear
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}