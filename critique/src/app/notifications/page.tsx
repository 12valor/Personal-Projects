"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// --- INDUSTRIAL ICONS ---
const Icons = {
  Critique: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  System: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  ArrowRight: () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Check: () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Plus: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Minus: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
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
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id) 
          .order('created_at', { ascending: false });

        if (filter === 'unread') query = query.eq('is_read', false);

        const { data } = await query;
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
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] dark:bg-[#050505] text-[#111] dark:text-[#eee] font-sans selection:bg-[#FF0032] selection:text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-black dark:border-white/20 pb-6 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-[#FF0032]"></div>
               <span className="text-[10px] font-mono font-bold uppercase text-gray-500">System_Log_v2.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Notifications
            </h1>
          </div>

          {/* Brutalist Toggle Switch */}
          <div className="flex bg-white dark:bg-[#111] border border-black dark:border-white/20 p-1 rounded-sm">
             {['all', 'unread'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f as 'all' | 'unread')}
                 className={`text-[10px] font-bold uppercase tracking-widest px-6 py-2 transition-all rounded-sm ${
                   filter === f 
                     ? 'bg-black text-white dark:bg-white dark:text-black' 
                     : 'text-gray-400 hover:text-black dark:hover:text-white'
                 }`}
               >
                 {f}
               </button>
             ))}

             {filter === 'unread' && notifications.length > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="ml-2 px-3 border-l border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#FF0032] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                  title="Mark All Read"
                >
                   READ <Icons.Check />
                </button>
             )}
          </div>
        </div>

        {/* --- NOTIFICATION FEED --- */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10 rounded-sm">
               <div className="w-5 h-5 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-3"/>
               <span className="text-[10px] font-mono font-bold uppercase text-gray-400">Fetching_Data...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10 rounded-sm">
              <span className="text-xl font-black uppercase text-gray-300 dark:text-gray-700 mb-2">Null Set</span>
              <p className="text-[10px] font-mono text-gray-400 uppercase">No new signals detected.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isExpanded = expandedId === n.id;
              const isSystem = n.type === 'System Update';
              const isUnread = !n.is_read;
              
              return (
                <div 
                  key={n.id}
                  className={`
                    relative group transition-all duration-200
                    bg-white dark:bg-[#0a0a0a]
                    ${isUnread 
                        ? 'border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' 
                        : 'border border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-gray-400'
                    }
                    rounded-sm
                  `}
                >
                  
                  {/* --- TOP BAR (CLICKABLE) --- */}
                  <div 
                    onClick={() => handleExpand(n.id, n.is_read)}
                    className="cursor-pointer p-4 md:p-5 flex items-start gap-5 relative z-10"
                  >
                      {/* STATUS MARKER (Left Edge) */}
                      {isUnread && (
                        <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${isSystem ? 'bg-amber-500' : 'bg-[#FF0032]'}`}></div>
                      )}

                      {/* ICON BOX */}
                      <div className={`
                         hidden md:flex items-center justify-center w-10 h-10 border rounded-sm flex-shrink-0
                         ${isSystem 
                           ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-600' 
                           : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'}
                      `}>
                         {isSystem ? <Icons.System /> : <Icons.Critique />}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0 pt-0.5">
                         <div className="flex items-center gap-3 mb-1.5">
                            <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border rounded-sm
                               ${isSystem 
                                 ? 'border-amber-200 text-amber-700 bg-amber-50' 
                                 : 'border-gray-200 text-gray-500 bg-gray-50 dark:border-white/20 dark:bg-white/5 dark:text-gray-400'}
                            `}>
                              {n.type || 'LOG'}
                            </span>
                            <span className="text-[9px] font-mono text-gray-400 uppercase">
                              {formatDistanceToNow(new Date(n.created_at))} ago
                            </span>
                         </div>
                         
                         <p className={`text-sm md:text-base font-bold leading-tight ${isUnread ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                           {n.content}
                         </p>
                      </div>

                      {/* EXPAND TOGGLE */}
                      <div className={`
                         w-8 h-8 flex items-center justify-center border rounded-sm transition-colors
                         ${isExpanded ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-400'}
                      `}>
                         {isExpanded ? <Icons.Minus /> : <Icons.Plus />}
                      </div>
                  </div>

                  {/* --- EXPANDED AREA (DATA VIEW) --- */}
                  <div className={`
                    overflow-hidden transition-[max-height,opacity] duration-200 ease-linear
                    ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                     <div className="mx-4 mb-4 md:mx-5 md:mb-5 p-4 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-sm flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black uppercase text-gray-400">Ref_ID</span>
                           <span className="text-[10px] font-mono text-gray-600 dark:text-gray-300">{n.id}</span>
                        </div>
                        
                        {(n.link_url && n.link_url !== '#') ? (
                          <Link 
                            href={n.link_url} 
                            onClick={(e) => e.stopPropagation()} 
                            className="group/btn flex items-center gap-2 pl-4 pr-3 py-2 bg-white dark:bg-[#1a1a1a] border border-black dark:border-white text-black dark:text-white text-[10px] font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                          >
                            Open Context
                            <Icons.ArrowRight />
                          </Link>
                        ) : (
                           <span className="text-[10px] font-mono font-bold uppercase text-gray-400 px-3 py-2 border border-transparent">
                             Read_Only
                           </span>
                        )}
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