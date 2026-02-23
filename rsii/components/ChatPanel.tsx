"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500'],
  display: 'swap' 
});

interface ChatPanelProps {
  reportId: string;
  currentUserRole: 'admin' | 'responder';
  status: string;
}

export default function ChatPanel({ reportId, currentUserRole, status }: ChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('incident_chats')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase.channel(`chat-${reportId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'incident_chats', 
        filter: `report_id=eq.${reportId}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reportId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    const { error } = await supabase.from('incident_chats').insert({
      report_id: reportId,
      sender_role: currentUserRole,
      message: newMessage.trim(),
    });

    if (!error) setNewMessage("");
    setIsSending(false);
  };

  const isArchived = status === 'archived';

  return (
    <div className={`${inter.className} flex flex-col h-full bg-white`}>
      {/* COMMS LOG DISPLAY */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-base font-medium text-slate-500 uppercase tracking-wide">
            No communications logged.
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-5">
                {/* Structured Avatar Component */}
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xs font-medium uppercase tracking-widest shrink-0 border ${
                  msg.sender_role === 'admin' 
                    ? 'bg-slate-200 text-slate-700 border-slate-300' 
                    : 'bg-white text-slate-500 border-slate-300'
                }`}>
                  {msg.sender_role === 'admin' ? 'CMD' : 'FLD'}
                </div>
                
                {/* Message Body */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-baseline gap-4 mb-1">
                    <span className="text-base font-medium text-slate-900 uppercase tracking-wide">
                      {msg.sender_role === 'admin' ? 'Command Center' : 'Field Unit'}
                    </span>
                    <span className="text-sm font-medium text-slate-500 tabular-nums">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-lg text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRANSMISSION INPUT */}
      <div className="p-6 bg-white border-t border-slate-300 shrink-0">
        {isArchived ? (
          <div className="w-full text-center py-5 bg-slate-100 border border-slate-300 text-base font-medium text-slate-600 uppercase tracking-wide">
            Incident Archived — Transmission Closed
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter operational update..."
              className="flex-1 bg-white border border-slate-300 px-6 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-shadow rounded-sm"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim()}
              className="px-10 py-4 bg-slate-900 text-white text-base font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide transition-colors rounded-sm"
            >
              {isSending ? 'Transmitting' : 'Transmit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}