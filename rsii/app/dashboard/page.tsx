"use client";

import ChatPanel from "@/components/ChatPanel";
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
  loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-400">Loading map...</div>
});

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null); 
  const [emergencyAlert, setEmergencyAlert] = useState<any | null>(null); 
  
  const [toast, setToast] = useState<{ title: string, message: string, type: 'new' | 'update' | 'message', id: number } | null>(null);
  
  // State for global sidebar chat feed
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const showToast = (title: string, message: string, type: 'new' | 'update' | 'message' = 'new') => {
    const id = Date.now();
    setToast({ title, message, type, id });
    setTimeout(() => {
      setToast((current) => current?.id === id ? null : current);
    }, 5000); 
  };

  const fetchData = async () => {
    // 1. Fetch active reports
    const { data: reportsData } = await supabase
      .from('rssi_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (reportsData) setReports(reportsData);
    setLoading(false);

    // 2. Fetch recent global messages for the sidebar
    const { data: chatData } = await supabase
      .from('incident_chats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (chatData) setRecentMessages(chatData);
  };

  useEffect(() => {
    fetchData();

    const reportChannel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rssi_reports' }, (payload) => {
        setEmergencyAlert(payload.new);
        setReports(prev => [payload.new, ...prev]);
        showToast(
          "New Incident Detected", 
          `Location: ${payload.new.barangay || 'Sector Unspecified'}`, 
          'new'
        );
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rssi_reports' }, (payload) => {
        fetchData();
        showToast(
          "Incident Updated", 
          `Reference #${payload.new.id.substring(0,8).toUpperCase()}`, 
          'update'
        );
      })
      .subscribe();

    const chatChannel = supabase.channel('dashboard-chat-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_chats' }, (payload) => {
        
        // Add new message to the top of the sidebar feed
        setRecentMessages(prev => [payload.new, ...prev].slice(0, 20));

        if (payload.new.sender_role === 'responder') {
          showToast(
            "New Message Received", 
            "Field unit has updated the incident log", 
            'message'
          );
        }
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(reportChannel); 
      supabase.removeChannel(chatChannel); 
    };
  }, []);

  // Function to open report directly from sidebar chat click
  const handleOpenReportFromChat = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
    } else {
      showToast("Notice", "This incident has already been cleared or archived.", "update");
    }
  };

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

  // --- NEW METRICS LOGIC ---
  const criticalCount = reports.filter(r => Number(r.severity_level) >= 4 && r.status !== 'archived').length;

  const getVerificationRate = () => {
    if (reports.length === 0) return "0";
    const verified = reports.filter(r => r.farmer_name && r.farmer_name !== "Anonymous").length;
    return ((verified / reports.length) * 100).toFixed(0);
  };

  const getHotZoneData = () => {
    if (!reports || reports.length === 0) return { name: "Clear", count: 0 };
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      if (Number(r.severity_level) >= 4 && r.barangay) {
        counts[r.barangay] = (counts[r.barangay] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : { name: "Clear", count: 0 };
  };

  const hotZone = getHotZoneData();

  return (
    <div className={`${poppins.className} flex h-screen bg-slate-50 text-slate-800 overflow-hidden relative`}>
      
      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-6 right-6 z-[300] transition-all duration-300 transform ${
        toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {toast && (
          <div className="bg-white px-5 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-start gap-3 min-w-[320px]">
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
              toast.type === 'new' ? 'bg-red-500 animate-pulse' : 
              toast.type === 'message' ? 'bg-indigo-500 animate-pulse' : 'bg-blue-500'
            }`}></div>
            <div>
              <p className="text-sm font-medium text-slate-900">{toast.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* EXTENDED SIDEBAR WITH LIVE CHAT FEED */}
      <aside className="w-20 lg:w-80 bg-[#002244] border-r border-slate-900 hidden md:flex flex-col shrink-0 z-20 h-full overflow-hidden">
        <div className="h-20 flex items-center lg:px-6 border-b border-white/10 bg-slate-900/20 shrink-0">
          <h1 className="text-xl font-bold text-white tracking-tight hidden lg:block">Talisay LGU</h1>
        </div>
        
        <nav className="py-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-4 px-6 py-4 bg-white/5 text-white border-l-4 border-blue-500">
            <span className="text-sm font-medium hidden lg:block">Operations Console</span>
          </Link>
        </nav>

        {/* LIVE COMMS SIDEBAR FEED */}
        <div className="flex-1 hidden lg:flex flex-col border-t border-white/10 overflow-hidden bg-slate-900/10">
          <div className="px-6 py-4 bg-[#002244] border-b border-white/5 shrink-0 shadow-sm flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Comms Feed
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active communications.</p>
            ) : (
              recentMessages.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => handleOpenReportFromChat(msg.report_id)}
                  className="bg-slate-800/60 p-3.5 rounded-lg border border-white/5 hover:border-white/20 hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      msg.sender_role === 'admin' ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {msg.sender_role === 'admin' ? 'Command' : 'Field Unit'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-300 transition-colors">
                      #{msg.report_id.substring(0,6)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-3 leading-snug">{msg.message}</p>
                  <p className="text-[9px] text-slate-500 mt-2 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
            <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Active Operations</h2>
          </div>

          {/* --- UPDATED METRICS GRID --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Critical Alerts</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {loading ? "--" : criticalCount}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">High Priority</span>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Verified Reports</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{loading ? "--" : getVerificationRate()}%</span>
                  <span className="text-sm text-slate-400 font-medium">Identity Match</span>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Impact Area</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{loading ? "--" : totalArea.toFixed(1)}</span>
                  <span className="text-sm text-slate-400 font-medium">Hectares</span>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Avg. Response</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{loading ? "--" : calculateAvgResponseTime()}</span>
                  <span className="text-sm text-slate-400 font-medium">Hours</span>
                </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 text-sm font-medium text-slate-700">Live Map</div>
            <div className="relative z-0 w-full h-[500px]">
              <Map hotZoneBarangay={hotZone.name} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Reported By</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {reports.slice(0, 15).map((report) => (
                  <tr key={report.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{report.id.toString().substring(0, 8)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{report.farmer_name || "Anonymous"}</td>
                    <td className="px-6 py-4">
                      {report.barangay ? <p className="text-slate-700">{report.barangay}</p> : <p className="text-slate-400 italic">Sector Unspecified</p>}
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{report.lat}, {report.lng}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedReport(report)} className="text-sm font-medium text-blue-600 hover:text-blue-800">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* EMERGENCY ALERT MODAL */}
      {emergencyAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6">
              <h3 className="text-lg font-medium text-slate-900">New Incident Reported</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                A new report has been filed in <strong className="text-slate-700">{emergencyAlert.barangay || "an unspecified sector"}</strong>.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setEmergencyAlert(null)} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Dismiss
              </button>
              <button 
                onClick={() => { setSelectedReport(emergencyAlert); setEmergencyAlert(null); }} 
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL & CHAT */}
      {selectedReport && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-medium text-slate-900">
                Incident Details <span className="text-slate-400 text-base ml-2 font-normal">#{selectedReport.id.substring(0, 8)}</span>
              </h3>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-8 space-y-8 flex-1 custom-scrollbar">
              {selectedReport.photo_url ? (
                <img src={selectedReport.photo_url} alt="Incident Evidence" className="w-full h-80 object-cover rounded-lg border border-slate-200" />
              ) : (
                <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-base">No photo attached to this report.</div>
              )}
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <span className="block text-sm text-slate-500 mb-1">Reported By</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.farmer_name || "Anonymous"}</p>
                  <p className="text-base text-blue-600 font-normal mt-1">{selectedReport.contact_number || "No contact provided"}</p>
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-1">Location</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.barangay || "Unspecified Sector"}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedReport.lat}, {selectedReport.lng}</p>
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-1">Impact Area</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.hectares_affected} Hectares</p>
                </div>
                <div>
                  <span className="block text-sm text-slate-500 mb-1">Current Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      selectedReport.status === 'responded' ? 'bg-blue-500' : 
                      selectedReport.status === 'archived' ? 'bg-emerald-500' :
                      selectedReport.status === 'dispatched' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <p className="text-lg text-slate-900 font-normal capitalize">{selectedReport.status || 'Pending'}</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100">
                <h4 className="text-lg font-medium text-slate-900 mb-4">Communications</h4>
                <div className="h-[400px]">
                  <ChatPanel reportId={selectedReport.id} currentUserRole="admin" status={selectedReport.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Optional: Add minimal scrollbar styling globally or in global.css */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); }
      `}</style>

    </div>
  );
}