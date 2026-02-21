"use client";

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

    const channel = supabase.channel('responder-feed')
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

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleNavigation = (id: string, lat: number, lng: number) => {
    setNavigatedTasks(prev => new Set(prev).add(id));
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const updateStatus = async (id: string) => {
    const arrivalTime = new Date().toISOString(); // Capture exact arrival time

    // Optimistic local update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'responded', responded_at: arrivalTime } : t));
    
    // Database update with timestamp
    const { error } = await supabase
      .from('rssi_reports')
      .update({ 
        status: 'responded',
        responded_at: arrivalTime 
      })
      .eq('id', id);

    if (error) console.error("Timestamp update failed:", error);
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-slate-50 p-3 sm:p-5 text-slate-700`}>
      <header className="mb-6 pb-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-xl font-medium text-slate-900 leading-none">Field Operations</h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Unit Response Terminal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">Live Feed</span>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-3 sm:gap-5 max-w-4xl mx-auto">
        {loading ? (
          <div className="col-span-2 py-20 text-center text-slate-400 font-medium text-sm italic">
            Synchronizing telemetry...
          </div>
        ) : tasks.length === 0 ? (
          <div className="col-span-2 py-20 text-center text-slate-400">
            <p className="text-xs font-medium uppercase tracking-[0.2em]">Zero Active Assignments</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              <div className="px-3 py-2 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-[9px] font-medium text-slate-400 uppercase font-mono tracking-tighter">NODE: {task.id.toString().substring(0,6).toUpperCase()}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${
                  task.status === 'responded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {task.status === 'responded' ? 'On Site' : 'Intercept'}
                </span>
              </div>

              {task.photo_url && (
                <div className="w-full h-24 sm:h-32 bg-slate-100 border-b border-slate-100 overflow-hidden">
                  <img 
                    src={task.photo_url} 
                    alt="Evidence" 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}

              <div className="p-4 flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-medium mb-0.5 tracking-widest">Severity</span>
                    <span className="text-2xl font-normal text-slate-900 tracking-tighter italic">0{task.severity_level}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-slate-400 uppercase font-medium mb-0.5 tracking-widest">Impact Area</span>
                    <span className="text-xl font-normal text-slate-800">{task.hectares_affected}<span className="text-[9px] ml-0.5 opacity-40 italic">HA</span></span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-50">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase font-medium mb-1 tracking-widest">Assigned Sector</span>
                    <p className="text-xs font-medium text-slate-900 leading-tight line-clamp-2 uppercase">
                      {task.barangay || task.location || "Sector Unspecified"}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100">
                    <span className="block text-[8px] text-slate-400 uppercase font-medium mb-0.5 tracking-widest">Point of Contact</span>
                    <p className="text-[10px] font-medium text-slate-800 truncate">{task.farmer_name || "Liaison Anonymous"}</p>
                    <a href={`tel:${task.contact_number}`} className="text-[10px] text-blue-600 font-medium mt-0.5 block">{task.contact_number || "Contact Restricted"}</a>
                  </div>
                </div>
              </div>

              <div className="p-2.5 pt-0 space-y-2">
                <button 
                  onClick={() => handleNavigation(task.id, Number(task.lat), Number(task.lng))} 
                  className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium text-[10px] uppercase tracking-widest rounded hover:bg-slate-200 transition-colors"
                >
                  Launch Navigation
                </button>
                
                {task.status !== 'responded' ? (
                  <button 
                    disabled={!navigatedTasks.has(task.id)}
                    onClick={() => updateStatus(task.id)} 
                    className={`w-full py-3 rounded font-medium text-[10px] uppercase tracking-[0.2em] transition-all ${
                      navigatedTasks.has(task.id) 
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 shadow-blue-200" 
                        : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-100"
                    }`}
                  >
                    Confirm Site Arrival
                  </button>
                ) : (
                  <div className="w-full py-3 bg-emerald-50 text-emerald-600 font-medium text-[9px] uppercase tracking-[0.2em] text-center rounded border border-emerald-100">
                    Arrived: {new Date(task.responded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="mt-8 py-6 text-center border-t border-slate-200">
        <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Standard Protocol 2026-F.OPS</p>
      </footer>
    </div>
  );
}