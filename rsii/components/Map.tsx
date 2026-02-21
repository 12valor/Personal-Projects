'use client'

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// PERMANENT FIX: Reliable CDN for traditional Leaflet map pins
const baseIconOptions = {
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};

const IconRed = new L.Icon({ 
  ...baseIconOptions, 
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' 
});
const IconOrange = new L.Icon({ 
  ...baseIconOptions, 
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png' 
});
const IconBlue = new L.Icon({ 
  ...baseIconOptions, 
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png' 
});

function HeatLayer({ points }: { points: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !map.getContainer() || !points.length) return;

    let heatLayerInstance: any;

    const initHeat = async () => {
      // @ts-ignore
      await import('leaflet.heat');

      const size = map.getSize();
      if (size.y === 0) {
        map.invalidateSize();
        requestAnimationFrame(initHeat);
        return;
      }

      const heatData = points.map(p => [Number(p.lat), Number(p.lng), Number(p.severity_level) / 5]);
      
      // @ts-ignore
      heatLayerInstance = L.heatLayer(heatData, {
        radius: 50, blur: 35, maxZoom: 13, minOpacity: 0.4,
        gradient: { 0.4: '#3b82f6', 0.6: '#22d3ee', 0.7: '#10b981', 0.8: '#fbbf24', 1.0: '#ef4444' }
      });
      
      if (map && map.getContainer()) {
          heatLayerInstance.addTo(map);
      }
    };

    const timer = setTimeout(initHeat, 250);

    return () => {
      clearTimeout(timer);
      if (heatLayerInstance && map && map.hasLayer(heatLayerInstance)) {
        map.removeLayer(heatLayerInstance);
      }
    };
  }, [map, points]);

  return null;
}

export default function Map({ hotZoneBarangay }: { hotZoneBarangay?: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [invertedMask, setInvertedMask] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchReports = async () => {
    const { data } = await supabase.from('rssi_reports').select('*');
    if (data) setReports(data);
  };

  useEffect(() => {
    setIsMounted(true);
    
    fetch('/talisay-boundary.json').then(res => res.json()).then(data => {
      setBoundaryData(data);
      if (data.features) {
        const cityFeature = data.features.find((f: any) => f.geometry.type.includes("Polygon"));
        if (cityFeature) {
          const worldCoords = [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]];
          setInvertedMask({ type: "Feature", geometry: { type: "Polygon", coordinates: [...worldCoords, ...cityFeature.geometry.coordinates] } });
        }
      }
    }).catch(err => console.error("Error loading boundary:", err));
    
    fetchReports();
    
    const channel = supabase.channel('map-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rssi_reports' }, () => fetchReports())
        .subscribe();
        
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    const updateData: any = { status: newStatus };
    if (newStatus === 'responded') updateData.responded_at = new Date().toISOString();
    await supabase.from('rssi_reports').update(updateData).eq('id', id);
  };

  const activeReports = reports.filter(r => r.lat && r.lng && r.status !== 'archived');

  if (!isMounted) return null;

  return (
    <div className="h-full w-full bg-[#020617] overflow-hidden relative">
      <MapContainer 
        center={[10.7305, 122.9712]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
        attributionControl={false}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
        
        <HeatLayer points={activeReports} />
        
        {invertedMask && (
            <GeoJSON 
                key="inverted-mask" 
                data={invertedMask} 
                style={{ fillColor: "#020617", fillOpacity: 0.7, color: "#22d3ee", weight: 2 }} 
                interactive={false} 
            />
        )}
        
        {boundaryData && (
          <GeoJSON 
            key={`boundary-${hotZoneBarangay || 'none'}`}
            data={boundaryData} 
            style={(f) => ({
              fillColor: f.properties?.NAME_2 === hotZoneBarangay ? "#ef4444" : "transparent",
              fillOpacity: f.properties?.NAME_2 === hotZoneBarangay ? 0.2 : 0,
              color: f.properties?.NAME_2 === hotZoneBarangay ? "#22d3ee" : "transparent",
              weight: 4, 
              dashArray: "5, 10"
            })} 
            interactive={false} 
          />
        )}

        {activeReports.map((report) => (
          <Marker 
            key={report.id} 
            position={[Number(report.lat), Number(report.lng)]} 
            icon={
              report.status === 'responded' ? IconBlue : 
              report.status === 'dispatched' || report.status === 'navigating' ? IconOrange : 
              IconRed
            }
          >
            <Popup>
              <div className="p-1 min-w-[200px] font-sans text-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-slate-900 text-xs">Incident #{report.id.toString().substring(0,6)}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${
                    report.status === 'responded' ? 'bg-blue-100 text-blue-700' : 
                    report.status === 'dispatched' || report.status === 'navigating' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {report.status || 'pending'}
                  </span>
                </div>

                <div className="text-xs border-y border-slate-100 py-2.5 mb-3 space-y-1.5">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Reported By</span> 
                    <span className="font-medium">{report.farmer_name || "Anonymous"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Impact Area</span> 
                    <span className="font-medium">{report.hectares_affected} ha</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  {/* ADMIN ACTION: Dispatch */}
                  {(!report.status || report.status === 'pending') && (
                    <button onClick={() => updateStatus(report.id, 'dispatched')} className="w-full py-2 text-xs font-medium rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors">Dispatch Team</button>
                  )}
                  
                  {/* READ-ONLY STATUS: Waiting for responder to arrive */}
                  {(report.status === 'dispatched' || report.status === 'navigating') && (
                    <div className="w-full py-2 text-xs font-medium rounded bg-orange-50 text-orange-700 text-center border border-orange-100">
                      Team En Route
                    </div>
                  )}

                  {/* ADMIN ACTION: Resolve */}
                  {report.status === 'responded' && (
                    <button onClick={() => updateStatus(report.id, 'archived')} className="w-full py-2 text-xs font-medium rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Resolve & Clear</button>
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