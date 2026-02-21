"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface ChatPanelProps {
  reportId: string;
  currentUserRole: 'admin' | 'responder';
  status: string; // Added to track if the incident is active or resolved
}

export default function ChatPanel({ reportId, currentUserRole, status }: ChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In your workflow, 'archived' is the terminal state for a resolved report
  const isResolved = status === 'archived';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('incident_chats')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      scrollToBottom();
    };
    fetchMessages();

    const channel = supabase.channel(`chat-${reportId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'incident_chats',
        filter: `report_id=eq.${reportId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reportId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isResolved) return;

    const textToSend = newMessage.trim();
    setNewMessage(""); 

    await supabase.from('incident_chats').insert({
      report_id: reportId,
      sender_role: currentUserRole,
      message: textToSend
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      {/* Clean Header */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-sm text-slate-700">
        Incident Chat
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[400px]">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 mt-10">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_role === currentUserRole;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-1 capitalize">
                  {msg.sender_role} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={`px-3 py-2 text-sm max-w-[85%] rounded-md ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Disables if resolved) */}
      <form onSubmit={handleSend} className="p-2 bg-slate-50 border-t border-slate-200 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isResolved ? "Chat ended. Incident resolved." : "Type a message..."} 
          disabled={isResolved}
          className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || isResolved}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}