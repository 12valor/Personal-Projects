"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap' 
});

const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" />
});

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null); 
  const [emergencyAlert, setEmergencyAlert] = useState<any | null>(null); 

  const fetchData = async () => {
    const { data } = await supabase
      .from('rssi_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rssi_reports' }, (payload) => {
        setEmergencyAlert(payload.new);
        setReports(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rssi_reports' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- REFINED ANALYTICS LOGIC ---

  const activeReports = reports.filter(r => r.status !== 'archived');
  const totalArea = activeReports.reduce((sum, r) => sum + (Number(r.hectares_affected) || 0), 0);

  const calculateAvgResponseTime = () => {
    const responded = reports.filter(r => r.created_at && r.responded_at);
    if (responded.length === 0) return "0.0";
    const totalMinutes = responded.reduce((acc, curr) => {
      const diff = new Date(curr.responded_at).getTime() - new Date(curr.created_at).getTime();
      return acc + (diff / (1000 * 60));
    }, 0);
    return ((totalMinutes / responded.length) / 60).toFixed(1);
  };

  const resolutionEfficiency = () => {
    const resolved = reports.filter(r => r.status === 'responded' || r.status === 'archived').length;
    return reports.length > 0 ? ((resolved / reports.length) * 100).toFixed(0) : "0";
  };

  /**
   * FIX: Robust Hot Zone logic to prevent "null" values.
   * Returns an object containing the name and the count of critical reports.
   */
  const getHotZoneData = () => {
    if (!reports || reports.length === 0) return { name: "Clear", count: 0 };
    
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      // Force Number conversion to ensure comparison works regardless of DB type
      if (Number(r.severity_level) >= 4 && r.barangay) {
        counts[r.barangay] = (counts[r.barangay] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : { name: "Clear", count: 0 };
  };

  const hotZone = getHotZoneData();

  const getResponseTime = (created: string, responded: string | null) => {
    if (!responded) return "Pending";
    const diff = (new Date(responded).getTime() - new Date(created).getTime()) / (1000 * 60);
    return diff < 60 ? `${Math.round(diff)}m` : `${(diff / 60).toFixed(1)}h`;
  };

  return (
    <div className={`${poppins.className} flex h-screen bg-slate-50 text-slate-800 overflow-hidden`}>
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-[#002244] border-r border-slate-900 hidden md:flex flex-col shrink-0 z-20">
        <div className="h-20 flex items-center lg:px-6 border-b border-white/10 bg-slate-900/20">
          <h1 className="text-xl font-bold text-white uppercase tracking-tight hidden lg:block">Talisay LGU</h1>
        </div>
        <nav className="flex-1 py-8">
          <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 bg-white/5 text-white border-l-4 border-white">
            <span className="text-xs uppercase tracking-[0.2em] font-medium hidden lg:block">Operations Console</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
            <h2 className="text-2xl font-medium text-slate-900 uppercase tracking-tight">Intelligence Feed</h2>
          </div>

          {/* ANALYTICS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-2">Active Impact</p>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className="text-3xl font-normal tracking-tighter text-slate-900 truncate">
                    {loading ? "--" : totalArea.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium uppercase shrink-0">HA</span>
                </div>
            </div>

            {/* HOT ZONE METRIC WITH TOOLTIP */}
            <div className="bg-white p-6 border border-slate-200 shadow-sm relative group cursor-help">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-2">Hot Zone (Critical)</p>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className="text-3xl font-normal tracking-tighter text-red-600 truncate">{hotZone.name}</span>
                  <span className="text-[9px] text-slate-400 font-medium uppercase shrink-0">Sector</span>
                </div>

                {/* TOOLTIP: Detailed Density Intel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 hidden group-hover:block w-48 z-50 transition-all">
                  <div className="bg-slate-900 text-white p-3 text-[10px] shadow-xl border border-slate-800">
                    <p className="font-bold uppercase tracking-widest text-slate-400 mb-1">Density Intel</p>
                    <p className="font-medium text-sm">Detected {hotZone.count} High-Severity cases in this sector.</p>
                    <div className="w-2 h-2 bg-slate-900 absolute left-1/2 -bottom-1 -translate-x-1/2 rotate-45"></div>
                  </div>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-2">Resolution Rate</p>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className="text-3xl font-normal tracking-tighter text-slate-900 truncate">
                    {loading ? "--" : resolutionEfficiency()}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium uppercase shrink-0">Total</span>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-2">Response Velocity</p>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <span className="text-3xl font-normal tracking-tighter text-slate-900 truncate">
                    {loading ? "--" : calculateAvgResponseTime()}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium uppercase shrink-0">Hrs Avg</span>
                </div>
            </div>
          </div>

          {/* MAP CANVAS */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-4 border border-slate-200 bg-white min-h-[500px] flex flex-col shadow-sm">
              <div className="h-12 border-b border-slate-100 flex items-center px-6 bg-slate-50/50">
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Live Sector Deployment</span>
              </div>
              <div className="flex-1 relative z-0">
                <Map hotZoneBarangay={hotZone.name} />
              </div>
            </div>
          </div>

          {/* DATA LOG TABLE */}
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-medium tracking-widest">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Farmer</th>
                  <th className="px-6 py-4">Sector</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {reports.slice(0, 15).map((report) => (
                  <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">TL-{report.id.toString().substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4">{report.farmer_name || "Anonymous"}</td>
                    <td className="px-6 py-4 uppercase text-xs text-slate-500">{report.barangay}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedReport(report)} className="text-[10px] font-medium text-blue-600 uppercase tracking-widest hover:text-blue-800">View File</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* EMERGENCY ALERT MODAL (Incoming Trigger) */}
      {emergencyAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg border-t-[10px] border-red-600 shadow-2xl overflow-hidden">
            <div className="p-6 bg-red-50 flex items-center gap-4 border-b border-red-100">
              <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="text-[10px] font-medium text-red-600 uppercase tracking-[0.2em]">Priority Alert</h3>
                <p className="text-2xl font-medium text-slate-900 leading-tight">Incoming Incident</p>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-1">Reporter</label>
                  <p className="text-sm font-medium">{emergencyAlert.farmer_name || "Anonymous"}</p>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-1">Sector</label>
                  <p className="text-sm font-medium uppercase">{emergencyAlert.barangay}</p>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-1">Severity</label>
                  <span className="text-xl font-medium text-red-600">LVL 0{emergencyAlert.severity_level}</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-1">Impact</label>
                  <p className="text-xl font-medium text-slate-900">{emergencyAlert.hectares_affected} HA</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={() => setEmergencyAlert(null)} className="flex-1 py-4 text-[10px] font-medium text-slate-500 uppercase tracking-widest">Dismiss</button>
              <button onClick={() => { setSelectedReport(emergencyAlert); setEmergencyAlert(null); }} className="flex-1 py-4 bg-red-600 text-white text-[10px] font-medium uppercase tracking-widest hover:bg-black transition-all">Access File</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (Manual Review) */}
      {selectedReport && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-2xl border border-slate-300 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <p className="text-sm font-medium text-slate-900 uppercase tracking-tight font-mono text-xs">REF: {selectedReport.id.toUpperCase()}</p>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-8 space-y-8">
              {selectedReport.photo_url ? (
                <img src={selectedReport.photo_url} alt="Evidence" className="w-full h-72 object-cover border border-slate-200 shadow-sm" />
              ) : (
                <div className="h-40 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 uppercase font-medium">Visual Evidence Not Filed</div>
              )}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-2">Personnel</label>
                  <p className="text-base font-medium">{selectedReport.farmer_name || "Anonymous"}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{selectedReport.contact_number || "---"}</p>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-2">Sector</label>
                  <p className="text-base font-medium uppercase">{selectedReport.barangay}</p>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-2">Impact</label>
                  <p className="text-2xl font-normal text-slate-900">{selectedReport.hectares_affected} HA</p>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium uppercase mb-2">Deployment</label>
                  <p className="text-[10px] font-medium text-slate-500 uppercase">Reso Time: {getResponseTime(selectedReport.created_at, selectedReport.responded_at)}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedReport(null)} className="px-6 py-2.5 text-[10px] font-medium text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">Close Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}