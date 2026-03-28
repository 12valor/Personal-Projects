"use client";

import ChatPanel from "@/components/ChatPanel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500'],
  display: 'swap' 
});

export default function ResponderApp() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatedTasks, setNavigatedTasks] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(Date.now());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // TOAST STATE
  const [toast, setToast] = useState<{ title: string, message: string, id: number } | null>(null);

  const showToast = (title: string, message: string) => {
    const id = Date.now();
    setToast({ title, message, id });
    setTimeout(() => {
      setToast((current) => current?.id === id ? null : current);
    }, 5000); 
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase
        .from('rssi_reports')
        .select('*')
        .in('status', ['dispatched', 'responded'])
        .order('created_at', { ascending: false });

      if (data) setTasks(data);
      setLoading(false);
    };
    fetchTasks();

    const reportChannel = supabase.channel('responder-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rssi_reports' }, (payload: any) => {
        const report = payload.new;
        if (report.status === 'dispatched') {
          setTasks(prev => {
            if (prev.find(t => t.id === report.id)) return prev.map(t => t.id === report.id ? report : t);
            return [report, ...prev];
          });
        } 
        else if (report.status === 'archived') {
          setTasks(prev => prev.filter(t => t.id !== report.id));
        } 
        else if (report.status === 'responded') {
          setTasks(prev => prev.map(t => t.id === report.id ? report : t));
        }
      }).subscribe();

    // Listen for Global Chat changes
    const chatChannel = supabase.channel('responder-chat-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_chats' }, (payload) => {
        if (payload.new.sender_role === 'admin') {
          showToast("Command Center", "New message received from admin");
        }
      })
      .subscribe();

    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => { 
      supabase.removeChannel(reportChannel);
      supabase.removeChannel(chatChannel);
      clearInterval(interval);
    };
  }, []);

  const handleNavigation = (id: string, lat: number, lng: number) => {
    setNavigatedTasks(prev => new Set(prev).add(id));
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const updateStatus = async (id: string) => {
    const arrivalTime = new Date().toISOString(); 
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'responded', responded_at: arrivalTime } : t));
    
    const { error } = await supabase
      .from('rssi_reports')
      .update({ status: 'responded', responded_at: arrivalTime })
      .eq('id', id);

    if (error) console.error("Timestamp update failed:", error);
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-slate-50 p-3 sm:p-5 text-slate-700 relative`}>
      <style jsx global>{`
        @keyframes urgentGlow {
          0% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); border-color: #ef4444; }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); border-color: #f87171; }
          100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.4); border-color: #ef4444; }
        }
        .urgent-card {
          animation: urgentGlow 1.5s infinite ease-in-out;
          border-width: 2px !important;
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-4 right-4 z-[300] transition-all duration-300 transform ${
        toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {toast && (
          <div className="bg-white px-5 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 flex items-start gap-3 min-w-[300px]">
            <div className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 bg-indigo-500 animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-slate-900">{toast.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      <header className="mb-6 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-xl font-medium text-slate-900 leading-none">Field Operations</h1>
          <p className="text-xs text-slate-500 mt-1">Unit Response Terminal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">Online</span>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {loading ? (
          <div className="col-span-1 md:col-span-2 py-20 text-center text-slate-500 text-sm">Loading active assignments...</div>
        ) : tasks.length === 0 ? (
          <div className="col-span-1 md:col-span-2 py-20 text-center text-slate-500"><p className="text-sm font-medium">No active assignments at this time.</p></div>
        ) : (
          tasks.map((task) => {
            const createdTime = new Date(task.created_at).getTime();
            const isUrgent = now - createdTime < 30000;

            return (
              <div 
                key={task.id} 
                className={`bg-white border rounded-xl flex flex-col overflow-hidden shadow-sm transition-all duration-500 ${
                  isUrgent ? 'urgent-card' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                <div className={`px-4 py-3 border-b flex justify-between items-center ${isUrgent ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                  <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-slate-600'}`}>
                    {isUrgent ? 'New Assignment' : `Incident #${task.id.toString().substring(0,6)}`}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    task.status === 'responded' ? 'bg-emerald-100 text-emerald-700' : isUrgent ? 'bg-red-600 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status === 'responded' ? 'On Site' : 'En Route'}
                  </span>
                </div>

                {task.photo_url && (
                  <div className="w-full h-40 bg-slate-100 border-b border-slate-100 overflow-hidden">
                    <img src={task.photo_url} alt="Evidence" className="w-full h-full object-cover transition-transform hover:scale-105" />
                  </div>
                )}

                <div className="p-5 flex-grow space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Severity</span>
                      <span className={`text-2xl font-medium ${isUrgent ? 'text-red-600' : 'text-slate-900'}`}>Level {task.severity_level}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Impact Area</span>
                      <span className="text-2xl font-medium text-slate-900">{task.hectares_affected}<span className="text-sm ml-1 text-slate-500">ha</span></span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="block text-xs text-slate-500 mb-1">Location</span>
                      <p className="text-base font-medium text-slate-900">{task.barangay || "Unspecified"}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="block text-xs text-slate-500 mb-1">Contact Person</span>
                      <p className="text-sm font-medium text-slate-900">{task.farmer_name || "Anonymous"}</p>
                      <a href={`tel:${task.contact_number}`} className="text-sm text-blue-600 hover:underline mt-1 block">{task.contact_number || "No number provided"}</a>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleNavigation(task.id, Number(task.lat), Number(task.lng))} 
                      className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Get Directions
                    </button>
                    <button 
                      onClick={() => setActiveChatId(activeChatId === task.id ? null : task.id)}
                      className={`px-5 py-3 font-medium text-sm rounded-lg transition-colors ${
                        activeChatId === task.id ? 'bg-slate-800 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {activeChatId === task.id ? 'Close Chat' : 'Chat'}
                    </button>
                  </div>

                  {activeChatId === task.id && (
                    <div className="mt-2 mb-2 h-[350px]">
                      <ChatPanel reportId={task.id} currentUserRole="responder" status={task.status} />
                    </div>
                  )}
                  
                  {task.status !== 'responded' ? (
                    <button 
                      disabled={!navigatedTasks.has(task.id)}
                      onClick={() => updateStatus(task.id)} 
                      className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                        navigatedTasks.has(task.id) 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Confirm Arrival
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-emerald-50 text-emerald-700 font-medium text-sm text-center rounded-lg border border-emerald-100">
                      Arrived at {new Date(task.responded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}