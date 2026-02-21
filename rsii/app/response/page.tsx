"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResponderApp() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newId, setNewId] = useState<string | null>(null);

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
            setNewId(report.id);
            setTimeout(() => setNewId(null), 30000);
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

  const updateStatus = async (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'responded' } : t));
    await supabase.from('rssi_reports').update({ status: 'responded' }).eq('id', id);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-blue-500">
      <header className="mb-6 border-b border-white/20 pb-4 flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Field Ops</h1>
        <div className="bg-blue-600 px-3 py-1 rounded text-xs font-black uppercase">Live</div>
      </header>

      <main className="grid grid-cols-2 gap-3">
        {loading ? (
          <p className="col-span-2 text-center text-blue-500 font-black text-xl animate-pulse uppercase py-20">Syncing...</p>
        ) : tasks.length === 0 ? (
          <div className="col-span-2 text-center py-20 opacity-20">
            <p className="text-2xl font-black uppercase tracking-widest">Clear</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-[#050505] border-2 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 ${
                newId === task.id ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-white/10'
              }`}
            >
              {/* Status Header */}
              <div className={`p-3 flex justify-between items-center border-b border-white/10 ${
                task.status === 'responded' ? 'bg-blue-600 text-white' : 'bg-white text-black'
              }`}>
                <span className="text-[10px] font-black uppercase">{task.status === 'responded' ? 'On Site' : 'Dispatch'}</span>
                <span className="text-[10px] font-mono font-bold opacity-70">#{task.id.toString().substring(0,4)}</span>
              </div>

              {/* Data Body */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div className="mb-4">
                    <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mb-1">Severity</p>
                    <p className="text-5xl font-black leading-none italic">0{task.severity_level}</p>
                </div>

                <div className="mb-4">
                  <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mb-1">Area</p>
                  <p className="text-4xl font-black leading-none">{task.hectares_affected}<span className="text-xs ml-1 opacity-50 italic">HA</span></p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mb-1">Sector</p>
                  <p className="text-xl font-black uppercase leading-tight line-clamp-2">{task.barangay || task.location || "Alpha"}</p>
                </div>
              </div>

              {/* Massive Action Buttons */}
              <div className="flex flex-col border-t border-white/10">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.lat},${task.lng}`)} 
                  className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest active:bg-blue-600 active:text-white"
                >
                  Nav
                </button>
                
                {task.status !== 'responded' && (
                  <button 
                    onClick={() => updateStatus(task.id)} 
                    className="w-full py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest border-t border-white/10"
                  >
                    Arrive
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}