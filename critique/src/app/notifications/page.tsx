"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'unread') query = query.eq('is_read', false);
    // Add logic for 'mentions' or 'updates' if your schema supports categories

    const { data } = await query;
    if (data) setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-foreground transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-border gap-4">
          <div className="space-y-2">
            <h2 className="text-[10px] font-black text-ytRed uppercase tracking-[0.5em] flex items-center gap-3">
              <span className="w-2 h-2 bg-ytRed rounded-full shadow-[0_0_10px_#cc0000]"></span>
              User Intelligence
            </h2>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Notifications</h1>
          </div>

          <div className="flex bg-foreground/5 p-1 border border-border rounded-sm">
            {['all', 'unread', 'mentions'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-ytRed text-white shadow-lg' : 'text-gray-500 hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-gray-500 font-black uppercase tracking-widest animate-pulse">Scanning System...</div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center text-gray-500 border-4 border-dashed border-border font-black uppercase tracking-widest italic">
              No active signals found.
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link_url || '#'}
                onClick={() => markAsRead(n.id)}
                className={`group relative flex items-center gap-6 p-6 border-4 transition-all ${
                  !n.is_read 
                    ? 'bg-ytRed/5 border-ytRed shadow-[8px_8px_0px_0px_#cc0000]' 
                    : 'bg-background border-border hover:border-foreground'
                }`}
              >
                {/* ICON TRACK */}
                <div className="w-10 h-10 flex-shrink-0 bg-foreground/5 border border-border flex items-center justify-center rounded-sm group-hover:bg-ytRed transition-colors">
                  <svg className={`w-5 h-5 ${!n.is_read ? 'text-ytRed' : 'text-gray-400'} group-hover:text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ytRed">
                      {n.category || 'System Update'}
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(n.created_at))} ago
                    </span>
                  </div>
                  <h3 className={`text-sm md:text-base font-black uppercase tracking-tight leading-tight ${!n.is_read ? 'text-foreground' : 'text-gray-400 group-hover:text-foreground'}`}>
                    {n.content}
                  </h3>
                </div>

                {/* STATUS INDICATOR */}
                {!n.is_read && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-2 w-2 rounded-full bg-ytRed shadow-[0_0_8px_#cc0000]"></span>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}