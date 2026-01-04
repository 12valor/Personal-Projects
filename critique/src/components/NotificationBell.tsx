"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const NotificationBell = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchNotifications();
    
    // Realtime Subscription
    const channel = supabase
      .channel('realtime_notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` }, 
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(c => c + 1);
        }
      )
      .subscribe();

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (id: string, entityId: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
    setIsOpen(false);

    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    router.push(`/channel/${entityId}`);
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', userId);
  };

  // Helper to format text based on type
  const getNotificationContent = (type: string) => {
    switch(type) {
      case 'reply': return { icon: '💬', text: 'New reply to your thread' };
      case 'first_feedback': return { icon: '🎉', text: 'First feedback received!' };
      case 'pin': return { icon: '📌', text: 'Your comment was pinned' };
      case 'locked': return { icon: '🔒', text: 'Your thread has been locked' };
      default: return { icon: '🔔', text: 'New notification' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-foreground transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-ytRed rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-panel border border-border shadow-2xl rounded-sm z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-3 border-b border-border bg-background/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold text-ytRed hover:underline">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs italic">
                No new notifications.
              </div>
            ) : (
              notifications.map((notif) => {
                const { icon, text } = getNotificationContent(notif.type);
                return (
                  <div 
                    key={notif.id}
                    onClick={() => markAsRead(notif.id, notif.entity_id)}
                    className={`p-4 border-b border-border last:border-0 hover:bg-background transition-colors cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-background/50' : ''}`}
                  >
                    <div className="text-lg">{icon}</div>
                    <div>
                      <p className={`text-sm ${!notif.is_read ? 'font-bold text-foreground' : 'font-medium text-gray-500'}`}>
                        {text}
                      </p>
                      <span className="text-[10px] text-gray-600">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {!notif.is_read && (
                      <div className="ml-auto w-1.5 h-1.5 bg-ytRed rounded-full mt-2"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};