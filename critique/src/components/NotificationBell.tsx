"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface NotificationBellProps {
  userId: string;
  unreadCount?: number; // Assume your parent component or hook provides this
}

export const NotificationBell = ({ userId, unreadCount = 0 }: NotificationBellProps) => {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/notifications')}
      className="relative flex items-center justify-center w-5 h-5 group"
      aria-label="View Notifications"
    >
      <svg 
        className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-ytRed' : 'text-gray-400 group-hover:text-foreground'}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeWidth="2" 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ytRed opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-ytRed text-[7px] font-black text-white items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </span>
      )}
    </button>
  );
};