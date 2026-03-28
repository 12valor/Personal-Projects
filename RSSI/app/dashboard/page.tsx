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
  loading: () => <div className="h-[500px] w-full bg-slate-50 flex items-center justify-center text-sm font-medium uppercase tracking-widest text-slate-400 border border-slate-200">Initializing Map Interface...</div>
});

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null); 
  const [emergencyAlert, setEmergencyAlert] = useState<any | null>(null); 
  const [toast, setToast] = useState<{ title: string, message: string, type: 'new' | 'update' | 'message', id: number } | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [weather, setWeather] = useState<{ temp: number; wind: number; humidity: number; direction: string } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const getWindDirection = (degree: number) => {
    const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return sectors[Math.round(degree / 45) % 8];
  };

  const showToast = (title: string, message: string, type: 'new' | 'update' | 'message' = 'new') => {
    const id = Date.now();
    setToast({ title, message, type, id });
    setTimeout(() => {
      setToast((current) => current?.id === id ? null : current);
    }, 5000); 
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.7305&longitude=122.9712&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m');
      const data = await res.json();
      setWeather({
        temp: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        wind: Math.round(data.current.wind_speed_10m),
        direction: getWindDirection(data.current.wind_direction_10m)
      });
    } catch (err) {
      console.error("Failed to fetch atmospheric data:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('rssi_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reportsError) console.error("Reports Fetch Error:", reportsError);
      if (reportsData) setReports(reportsData);

      const { data: chatData, error: chatError } = await supabase
        .from('incident_chats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (chatError) console.error("Chat Fetch Error:", chatError);
      if (chatData) setRecentMessages(chatData);
      
    } catch (err) {
      console.error("Unexpected error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchData();
    fetchWeather();

    const reportChannel = supabase.channel('dashboard-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rssi_reports' }, (payload) => {
        setEmergencyAlert(payload.new);
        setReports(prev => [payload.new, ...(prev || [])]);
        showToast("New Incident Logged", `Sector: ${payload.new.barangay || 'Unspecified'}`, 'new');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rssi_reports' }, (payload) => {
        fetchData();
        showToast("Status Updated", `REF: #${payload.new.id.substring(0,8).toUpperCase()}`, 'update');
      })
      .subscribe();

    const chatChannel = supabase.channel('dashboard-chat-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_chats' }, (payload) => {
        setRecentMessages(prev => [payload.new, ...(prev || [])].slice(0, 20));
        if (payload.new.sender_role === 'responder') {
          showToast("Comms Update", "Field unit added to log", 'message');
        }
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(reportChannel); 
      supabase.removeChannel(chatChannel); 
    };
  }, []);

  const handleOpenReportFromChat = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
    } else {
      showToast("Notice", "Record cleared or archived.", "update");
    }
  };

  const safeReports = reports || [];
  const activeReports = safeReports.filter(r => r.status !== 'archived');
  
  const totalArea = activeReports.reduce((sum, r) => sum + (Number(r.hectares_affected) || 0), 0);
  const criticalCount = activeReports.filter(r => Number(r.severity_level) >= 4).length;

  const getVerificationRate = () => {
    if (safeReports.length === 0) return "0";
    const verified = safeReports.filter(r => r.farmer_name && r.farmer_name !== "Anonymous").length;
    return ((verified / safeReports.length) * 100).toFixed(0);
  };

  const getSlaCompliance = () => {
    const handled = safeReports.filter(r => r.responded_at && r.created_at);
    if (handled.length === 0) return "100";
    const metSla = handled.filter(r => {
      const mins = (new Date(r.responded_at).getTime() - new Date(r.created_at).getTime()) / 60000;
      return mins <= 60;
    });
    return ((metSla.length / handled.length) * 100).toFixed(0);
  };

  const activeDeployments = safeReports.filter(r => r.status === 'dispatched' || r.status === 'navigating').length;
  const affectedHouseholds = Math.round(totalArea * 1.5);

  const getHotZoneData = () => {
    if (safeReports.length === 0) return { name: "Clear", count: 0 };
    const counts: Record<string, number> = {};
    safeReports.forEach(r => {
      if (Number(r.severity_level) >= 4 && r.barangay) {
        counts[r.barangay] = (counts[r.barangay] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : { name: "Clear", count: 0 };
  };

  const hotZone = getHotZoneData();

  const handlePrintBriefing = () => {
    window.print();
  };

  if (!isMounted) {
    return (
      <div className={`${poppins.className} flex h-screen bg-slate-50 items-center justify-center`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Establishing Secure Connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} flex h-screen bg-slate-50 text-slate-800 overflow-hidden relative print:bg-white print:h-auto print:overflow-visible`}>
      
      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-6 right-6 z-[300] transition-all duration-300 transform print:hidden ${
        toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {toast && (
          <div className="bg-white px-5 py-4 border border-slate-200 shadow-sm flex items-start gap-4 min-w-[320px]">
            <div className={`mt-1.5 w-2 h-2 shrink-0 ${toast.type === 'new' ? 'bg-red-600 animate-pulse' : toast.type === 'message' ? 'bg-indigo-600 animate-pulse' : 'bg-blue-600'}`}></div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-900">{toast.title}</p>
              <p className="text-sm text-slate-600 mt-1">{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* OPERATIONS CONSOLE SIDEBAR */}
      <aside className="w-20 lg:w-80 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shrink-0 z-20 h-full overflow-hidden print:hidden">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-800 shrink-0">
          <h1 className="text-lg font-medium text-slate-100 tracking-wide hidden lg:block">Talisay LGU</h1>
        </div>
        
        <nav className="py-6 shrink-0 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-4 px-8 py-3 bg-slate-800/30 text-white border-l-2 border-blue-500">
            <span className="text-sm font-medium tracking-wide hidden lg:block">Operations Console</span>
          </Link>
        </nav>

        <div className="flex-1 hidden lg:flex flex-col overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Comms Feed
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8 font-mono">No active transmissions</p>
            ) : (
              recentMessages.map(msg => (
                <div key={msg.id} onClick={() => handleOpenReportFromChat(msg.report_id)} className="px-8 py-4 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${msg.sender_role === 'admin' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-300">
                        {msg.sender_role === 'admin' ? 'Command' : 'Field Unit'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{msg.message}</p>
                  <div className="mt-2 flex justify-start">
                    <span className="text-xs text-slate-500 font-mono group-hover:text-blue-400 transition-colors">REF: #{msg.report_id.substring(0,8).toUpperCase()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 print:p-0 print:overflow-visible">
        <div className="max-w-[1600px] mx-auto space-y-8 print:space-y-8">
          
          <div className="hidden print:block text-center border-b border-slate-800 pb-8 mb-10 mt-6">
            <h1 className="text-3xl font-medium text-slate-900 tracking-wide">City of Talisay</h1>
            <h2 className="text-xl font-normal text-slate-700 mt-2">CDRRMO Daily Operations Briefing</h2>
            <p className="text-sm text-slate-500 mt-4 font-mono">
              Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="border-b border-slate-200 pb-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 print:hidden">
            <div>
              <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Active Operations</h2>
              <p className="text-sm text-slate-500 mt-2 tracking-wide">CDRRMO Command Center</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-5 px-5 py-3 bg-white text-slate-700 border border-slate-200 text-sm tabular-nums">
                {weatherLoading ? (
                  <span className="text-slate-400 font-medium">Synchronizing telemetry...</span>
                ) : weather ? (
                  <>
                    <div className="flex items-center gap-2" title="Local Temperature">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Temp</span>
                      <span className="text-base font-medium text-slate-800">{weather.temp}°C</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-2" title="Relative Humidity">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Hum</span>
                      <span className="text-base font-medium text-slate-800">{weather.humidity}%</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-2" title="Wind Speed & Direction">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Wind</span>
                      <span className="text-base font-medium text-slate-800">{weather.wind} km/h {weather.direction}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Telemetry Offline</span>
                )}
              </div>

              <button onClick={handlePrintBriefing} className="px-6 py-3 bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-colors shrink-0">
                Generate Official Report
              </button>
            </div>
          </div>

          {/* LGU METRICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-6 print:page-break-inside-avoid">
            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Critical Alerts</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-4xl leading-none ${criticalCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>{loading ? "--" : criticalCount}</span>
                  <span className="text-sm text-slate-400">Lvl 4-5 Severity</span>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Active Deployments</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl leading-none text-slate-800">{loading ? "--" : activeDeployments}</span>
                  <span className="text-sm text-slate-400">Units in Field</span>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">SLA Compliance</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-4xl leading-none ${Number(getSlaCompliance()) >= 90 ? 'text-slate-800' : 'text-orange-600'}`}>{loading ? "--" : getSlaCompliance()}%</span>
                  <span className="text-sm text-slate-400">&lt; 60m Response</span>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Total Impact Area</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl leading-none text-slate-800">{loading ? "--" : totalArea.toFixed(1)}</span>
                  <span className="text-sm text-slate-400">Hectares</span>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Est. Households</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl leading-none text-slate-800">{loading ? "--" : affectedHouseholds}</span>
                  <span className="text-sm text-slate-400">Families Affected</span>
                </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 exact-color">
                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wide">Verified Identity</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl leading-none text-slate-800">{loading ? "--" : getVerificationRate()}%</span>
                  <span className="text-sm text-slate-400">Non-Anonymous</span>
                </div>
            </div>
          </div>

          {/* MAP */}
          <div className="border border-slate-200 bg-white print:hidden">
            <div className="h-16 border-b border-slate-200 flex items-center px-8">
              <h3 className="text-sm font-medium text-slate-800 uppercase tracking-wide">Live Map Overview</h3>
            </div>
            <div className="relative z-0 w-full h-[550px]">
              <Map hotZoneBarangay={hotZone.name} />
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="bg-white border border-slate-200 print:border-slate-300 print:mt-12">
            <div className="h-16 border-b border-slate-200 px-8 flex items-center">
              <h3 className="text-sm font-medium text-slate-800 uppercase tracking-wide">Official Incident Log</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 print:bg-slate-50 exact-color">
                  <th className="px-8 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Reference</th>
                  <th className="px-8 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Reported By</th>
                  <th className="px-8 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Location</th>
                  <th className="px-8 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-8 py-4 text-xs font-medium text-slate-500 uppercase tracking-wide text-right print:hidden">Action</th>
                </tr>
              </thead>
              <tbody>
                {safeReports.slice(0, 15).map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-slate-500">#{report.id.toString().substring(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-800">{report.farmer_name || "Anonymous"}</td>
                    <td className="px-8 py-5">
                      {report.barangay ? <p className="text-sm text-slate-800">{report.barangay}</p> : <p className="text-sm text-slate-400 italic">Sector Unspecified</p>}
                      <p className="text-xs text-slate-500 font-mono mt-1">{report.lat}, {report.lng}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium uppercase tracking-wide exact-color ${
                        report.status === 'responded' ? 'text-blue-700 bg-blue-50' : 
                        report.status === 'archived' ? 'text-emerald-700 bg-emerald-50' :
                        report.status === 'dispatched' ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {report.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right print:hidden">
                      <button onClick={() => setSelectedReport(report)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Review Log</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {emergencyAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <div className="bg-white w-full max-w-md border border-slate-200">
            <div className="p-8 border-b border-slate-200">
              <h3 className="text-base font-medium text-red-600 uppercase tracking-wide flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                Incident Alert
              </h3>
              <p className="text-slate-600 mt-4 text-base leading-relaxed">
                New report filed in sector: <strong className="text-slate-900 font-medium">{emergencyAlert.barangay || "Unspecified"}</strong>.
              </p>
            </div>
            <div className="px-8 py-5 bg-slate-50 flex justify-end gap-4">
              <button onClick={() => setEmergencyAlert(null)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Dismiss</button>
              <button onClick={() => { setSelectedReport(emergencyAlert); setEmergencyAlert(null); }} className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-colors">Assess Target</button>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <div className="bg-white w-full max-w-4xl flex flex-col max-h-[90vh] border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center shrink-0 bg-white">
              <h3 className="text-base font-medium text-slate-800 uppercase tracking-wide">
                Incident Report <span className="text-slate-400 ml-3 font-mono">REF: #{selectedReport.id.substring(0, 8).toUpperCase()}</span>
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto p-8 space-y-10 flex-1 custom-scrollbar">
              {selectedReport.photo_url ? (
                <img src={selectedReport.photo_url} alt="Field Evidence" className="w-full h-80 object-cover border border-slate-200" />
              ) : (
                <div className="h-48 bg-slate-50 border border-slate-200 flex items-center justify-center text-sm font-medium text-slate-400 uppercase tracking-widest">No Visual Evidence Attached</div>
              )}
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Reported By</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.farmer_name || "Anonymous"}</p>
                  <p className="text-sm text-slate-500 font-mono mt-1">{selectedReport.contact_number || "No contact provided"}</p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Location Data</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.barangay || "Unspecified Sector"}</p>
                  <p className="text-sm text-slate-500 font-mono mt-1">{selectedReport.lat}, {selectedReport.lng}</p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Impact Assessment</span>
                  <p className="text-lg text-slate-900 font-normal">{selectedReport.hectares_affected} Hectares</p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Current Status</span>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium uppercase tracking-wide exact-color ${
                        selectedReport.status === 'responded' ? 'text-blue-700 bg-blue-50' : 
                        selectedReport.status === 'archived' ? 'text-emerald-700 bg-emerald-50' :
                        selectedReport.status === 'dispatched' ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {selectedReport.status || 'pending'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-800 uppercase tracking-wide mb-6">Communications Channel</h4>
                <div className="h-[400px] border border-slate-200">
                  <ChatPanel reportId={selectedReport.id} currentUserRole="admin" status={selectedReport.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.4); border-radius: 0px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.7); }
        
        aside .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
        aside .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.3); }

        @media print {
          .exact-color {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            margin: 1.5cm;
            size: landscape;
          }
        }
      `}</style>
    </div>
  );
}