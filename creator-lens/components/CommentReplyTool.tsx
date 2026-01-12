"use client";

import { useState, useMemo } from "react";
import { 
  MessageSquare, Search, ThumbsUp, Sparkles, 
  Send, X, Check, AlertCircle, Loader2, 
  Filter, MoreHorizontal, CornerDownLeft
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
}

type StatusState = 'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR';

export default function CommentReplyTool() {
  // --- STATE ---
  const [videoId, setVideoId] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [manualReply, setManualReply] = useState("");
  
  // MODAL STATES
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);

  // STATUS STATE
  const [status, setStatus] = useState<StatusState>('IDLE');
  const [statusMessage, setStatusMessage] = useState("");

  // HELPER: Extract ID
  const extractVideoId = (input: string) => {
    if (!input) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

  // ACTIONS
  const fetchComments = async () => {
    if (!videoId) return;
    setLoadingComments(true);
    setComments([]);
    setSelectedIds(new Set());
    const cleanId = extractVideoId(videoId);
    
    try {
      const res = await fetch(`/api/youtube/comments?videoId=${cleanId}`);
      if (cleanId !== videoId) setVideoId(cleanId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.comments) setComments(data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const filteredComments = useMemo(() => {
    if (!filterText) return comments;
    return comments.filter(c => 
      c.text.toLowerCase().includes(filterText.toLowerCase()) || 
      c.author.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [comments, filterText]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredComments.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set(filteredComments.map(c => c.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const openModalAndGenerate = async (comment: Comment) => {
    setActiveComment(comment);
    setSmartReplies([]);
    setIsDrafting(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Act as a casual YouTuber. Provide 3 short, human-like responses to: "${comment.text}". RULES: One word or emoji only. No punctuation. Examples: Thanks, LOL, ❤️, Facts, True.`
        }),
      });
      const data = await response.json();
      const lines = data.result.split("\n").filter((l: string) => l.trim().length > 0);
      setSmartReplies(lines);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  const executeSend = async (ids: string[], text: string) => {
    if (!text) return;
    setStatus('SENDING');
    setStatusMessage(`Replying to ${ids.length} viewer(s)...`);

    let successCount = 0;
    let failCount = 0;

    for (const id of ids) {
      try {
        const res = await fetch("/api/youtube/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentId: id, text: text }),
        });
        if (res.ok) successCount++;
        else failCount++;
      } catch (e) {
        failCount++;
      }
      setStatusMessage(`Sent ${successCount}/${ids.length}...`);
    }

    if (failCount === 0) {
      setStatus('SUCCESS');
      setStatusMessage(`Replied to ${successCount} comments.`);
      setManualReply("");
      setSelectedIds(new Set());
      setActiveComment(null);
      setTimeout(() => setStatus('IDLE'), 2000);
    } else {
      setStatus('ERROR');
      setStatusMessage(`${successCount} sent, ${failCount} failed.`);
    }
  };

  const handleBulkSend = () => executeSend(Array.from(selectedIds), manualReply);
  const handleSingleSend = (text: string) => {
    if (activeComment) executeSend([activeComment.id], text);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-rose-100 text-rose-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600', 'bg-violet-100 text-violet-600'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-[650px] overflow-hidden font-sans text-slate-900 shadow-sm relative">
        
        {/* HEADER TOOLBAR */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <MessageSquare size={16} className="text-slate-500" />
              Comments
            </h3>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            
            {comments.length > 0 ? (
              <div className="relative flex-1 max-w-sm group">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter by keyword..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative flex-1 max-w-sm group">
                <input 
                  type="text" 
                  placeholder="Paste YouTube Link or Video ID..." 
                  className="w-full pl-3 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchComments()}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {comments.length === 0 ? (
              <button 
                onClick={fetchComments}
                disabled={loadingComments || !videoId}
                className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
              >
                {loadingComments ? <Loader2 size={14} className="animate-spin" /> : "Import"}
              </button>
            ) : (
              <button 
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-slate-200"
              >
                {selectedIds.size === filteredComments.length ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 relative">
          {/* Loading State */}
          {loadingComments && (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-lg border border-slate-100 animate-pulse">
                  <div className="w-8 h-8 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/4 h-3 bg-slate-100 rounded" />
                    <div className="w-3/4 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {comments.length === 0 && !loadingComments && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="text-slate-300" size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500">No comments loaded</p>
              <p className="text-xs text-slate-400 mt-1">Import a video to start managing engagement.</p>
            </div>
          )}

          {/* Comment List */}
          {comments.length > 0 && (
            <div className="divide-y divide-slate-100 bg-white min-h-full">
              {filteredComments.map((comment) => {
                const isSelected = selectedIds.has(comment.id);
                return (
                  <div 
                    key={comment.id}
                    onClick={() => openModalAndGenerate(comment)}
                    className={`group flex items-start gap-4 p-4 transition-all cursor-pointer hover:bg-slate-50/80 ${isSelected ? "bg-slate-50" : ""}`}
                  >
                    {/* Checkbox */}
                    <div className="pt-1" onClick={(e) => { e.stopPropagation(); toggleSelection(comment.id); }}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(comment.author)}`}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">{comment.author}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
                             <ThumbsUp size={10} /> {comment.likes}
                           </span>
                           <span className="text-xs text-slate-300 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                             <CornerDownLeft size={12} /> Reply
                           </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BULK ACTION BAR (Floating) */}
        {selectedIds.size > 0 && (
          <div className="absolute bottom-6 left-6 right-6 z-20 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="bg-slate-900 text-white p-2 rounded-xl shadow-2xl shadow-slate-900/20 flex items-center gap-3">
              <div className="pl-4 text-xs font-bold whitespace-nowrap text-slate-300">
                {selectedIds.size} selected
              </div>
              <div className="h-4 w-px bg-slate-700" />
              <input 
                type="text" 
                placeholder="Write a reply to all..." 
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none border-none py-2"
                value={manualReply}
                onChange={(e) => setManualReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBulkSend()}
              />
              <button 
                onClick={handleBulkSend}
                disabled={!manualReply}
                className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                Reply <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- DETAIL & REPLY MODAL --- */}
      {activeComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 ring-1 ring-black/5">
            
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(activeComment.author)}`}>
                   {activeComment.author.charAt(0).toUpperCase()}
                 </div>
                 <h3 className="font-bold text-slate-900 text-sm">{activeComment.author}</h3>
              </div>
              <button 
                onClick={() => setActiveComment(null)} 
                className="text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-50 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Viewer's Comment (Context) */}
            <div className="p-6 bg-slate-50/50">
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-1 bg-slate-200 rounded-full" />
                <p className="text-slate-700 text-base leading-relaxed pl-4 italic">
                  "{activeComment.text}"
                </p>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Suggestions</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {isDrafting ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 px-2 py-1">
                    <Loader2 size={12} className="animate-spin" /> Generating ideas...
                  </div>
                ) : (
                  smartReplies.map((reply, i) => {
                    const cleanReply = reply.replace(/^\d+\.\s*/, '').replace(/"/g, '');
                    return (
                      <button 
                        key={i}
                        onClick={() => handleSingleSend(cleanReply)}
                        className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 rounded-md text-sm font-medium transition-all text-left"
                      >
                        {cleanReply}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Custom Input */}
            <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
               <input 
                 type="text" 
                 autoFocus
                 placeholder="Type a custom reply..." 
                 className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') handleSingleSend(e.currentTarget.value);
                 }}
               />
               <button 
                 className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                 onClick={(e: any) => {
                    const input = e.currentTarget.previousSibling as HTMLInputElement;
                    handleSingleSend(input.value);
                 }}
               >
                 <Send size={16} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- STATUS TOAST --- */}
      {status !== 'IDLE' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700/50">
            {status === 'SENDING' && <Loader2 size={18} className="animate-spin text-slate-400" />}
            {status === 'SUCCESS' && <Check size={18} className="text-emerald-400" />}
            {status === 'ERROR' && <AlertCircle size={18} className="text-rose-400" />}
            
            <span className="text-sm font-medium">{statusMessage}</span>
            
            {status === 'ERROR' && (
              <button 
                onClick={() => setStatus('IDLE')}
                className="ml-2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}