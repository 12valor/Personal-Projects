"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// --- ICONS ---
const Icons = {
  Message: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Arrow: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M5 13l4 4L19 7" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // UPDATED: Using 'recipient_id' to match the new SQL table
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id) 
          .order('created_at', { ascending: false });

        if (filter === 'unread') query = query.eq('is_read', false);

        const { data, error } = await query;
        if (data) setNotifications(data);
    }
    setLoading(false);
  };

  const handleExpand = async (id: string, isRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!isRead) {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    }
  };

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // UPDATED: Using 'recipient_id'
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-poppins">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 dark:border-white/10 pb-6 gap-6">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF0032] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF0032] rounded-full animate-pulse shadow-[0_0_10px_#FF0032]"></span>
              System Log
            </h2>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
              Notifications
            </h1>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                {['all', 'unread'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                      filter === f 
                        ? 'bg-white dark:bg-white text-black shadow-sm' 
                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
             </div>
             {filter === 'unread' && notifications.length > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="px-4 py-3 bg-red-50 dark:bg-red-900/10 text-[#FF0032] border border-red-100 dark:border-red-900/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" 
                  title="Mark all as read"
                >
                   <Icons.Check />
                </button>
             )}
          </div>
        </div>

        {/* --- LIST --- */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="py-24 text-center">
               <div className="w-8 h-8 border-4 border-slate-200 dark:border-white/10 border-t-[#FF0032] rounded-full animate-spin mx-auto mb-4"/>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">Scanning Signals...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No signals detected.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isExpanded = expandedId === n.id;
              
              return (
                <div 
                  key={n.id}
                  onClick={() => handleExpand(n.id, n.is_read)}
                  className={`
                    group relative bg-white dark:bg-[#111] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                    ${!n.is_read 
                      ? 'border-l-[6px] border-l-[#FF0032] border-y-slate-200 border-r-slate-200 dark:border-y-white/10 dark:border-r-white/10 shadow-lg' 
                      : 'border-l-[6px] border-l-slate-200 dark:border-l-white/10 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100'
                    }
                    ${isExpanded ? 'shadow-xl scale-[1.01] z-10 border-l-[#FF0032] dark:border-l-[#FF0032]' : 'hover:translate-x-1'}
                  `}
                >
                  {/* CARD HEADER */}
                  <div className="p-5 flex gap-5 items-start">
                    {/* Icon Box */}
                    <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center border transition-colors ${!n.is_read ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-[#FF0032]' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400'}`}>
                       <Icons.Message />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${!n.is_read ? 'text-[#FF0032]' : 'text-slate-400'}`}>
                            {n.type || 'Update'}
                          </span>
                          <div className="flex items-center gap-2">
                            {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[#FF0032] animate-pulse" />}
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                              {formatDistanceToNow(new Date(n.created_at))} ago
                            </span>
                          </div>
                       </div>
                       
                       <h3 className={`text-sm md:text-base font-bold leading-tight ${!n.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                         {n.content}
                       </h3>
                    </div>

                    <div className={`text-slate-300 dark:text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                       <Icons.ChevronDown />
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
                     <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                        <div className="flex items-center justify-between pt-4">
                           <div className="text-[10px] font-mono text-slate-400">
                              REF: {n.id.slice(0,8)}
                           </div>
                           
                           <Link 
                             href={n.link_url || '#'} 
                             onClick={(e) => e.stopPropagation()} 
                             className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#FF0032] dark:hover:bg-[#FF0032] dark:hover:text-white transition-colors shadow-lg"
                           >
                             View Thread <Icons.Arrow />
                           </Link>
                        </div>
                     </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}