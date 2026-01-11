"use client";

import { useState, useMemo } from "react";

interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
}

// Types for our new Status Modal
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

  // STATUS MODAL STATE (The replacement for alerts)
  const [status, setStatus] = useState<StatusState>('IDLE');
  const [statusMessage, setStatusMessage] = useState("");

  // Helper: Extract Video ID
  const extractVideoId = (input: string) => {
    if (!input) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

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
      // Small inline error, not a big alert
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
          text: `
            Act as a casual YouTuber. Provide 3 short, human-like responses to: "${comment.text}".
            RULES: One word or emoji only. No punctuation.
            Examples: Thanks, LOL, ❤️, Facts, True.
            Output format: 3 words/emojis separated by newlines.
          `
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

  // --- THE NEW SEND LOGIC ---
  const executeSend = async (ids: string[], text: string) => {
    if (!text) return;
    
    // 1. Show Loading Modal
    setStatus('SENDING');
    setStatusMessage(`Replying to ${ids.length} comment(s)...`);

    let successCount = 0;
    let failCount = 0;

    // 2. Loop through IDs and Post
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
      
      // Update message live
      setStatusMessage(`Sent ${successCount}/${ids.length}...`);
    }

    // 3. Show Final Result
    if (failCount === 0) {
      setStatus('SUCCESS');
      setStatusMessage(`Successfully replied to ${successCount} comment(s)!`);
      // Cleanup
      setManualReply("");
      setSelectedIds(new Set());
      setActiveComment(null); // Close the detail modal if open
    } else {
      setStatus('ERROR');
      setStatusMessage(`Finished: ${successCount} sent, ${failCount} failed.`);
    }

    // 4. Auto-close success modal after 2s
    if (failCount === 0) {
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  const handleBulkSend = () => {
    executeSend(Array.from(selectedIds), manualReply);
  };

  const handleSingleSend = (text: string) => {
    if (activeComment) {
      executeSend([activeComment.id], text);
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[650px] overflow-hidden font-sans relative z-0">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Comments</h3>
            {comments.length > 0 && (
               <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                 {comments.length}
               </span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              {comments.length > 0 ? (
                <input 
                  type="text" 
                  placeholder="Filter comments..." 
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-transparent group-hover:bg-gray-100 focus:bg-white focus:border-gray-200 rounded-xl text-sm transition-all outline-none"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              ) : (
                <input 
                  type="text" 
                  placeholder="Paste Video Link..." 
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-transparent group-hover:bg-gray-100 focus:bg-white focus:border-gray-200 rounded-xl text-sm transition-all outline-none"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                />
              )}
            </div>
            
            {comments.length === 0 && (
              <button 
                onClick={fetchComments}
                disabled={loadingComments || !videoId}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
              >
                {loadingComments ? "Loading..." : "Import"}
              </button>
            )}

            {comments.length > 0 && (
               <button 
                 onClick={toggleSelectAll}
                 className="text-sm font-semibold text-gray-500 hover:text-black px-2 transition-colors"
               >
                 {selectedIds.size === filteredComments.length ? "None" : "All"}
               </button>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-white">
          {comments.length === 0 && !loadingComments && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10">
              <div className="text-4xl mb-4 opacity-20">💬</div>
              <p className="text-sm">Import a video to manage comments</p>
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {filteredComments.map((comment) => (
              <div 
                key={comment.id}
                className={`group flex items-start gap-4 p-4 transition-all hover:bg-gray-50 cursor-pointer ${selectedIds.has(comment.id) ? "bg-blue-50/50" : ""}`}
                onClick={() => openModalAndGenerate(comment)}
              >
                <div className="pt-1" onClick={(e) => { e.stopPropagation(); toggleSelection(comment.id); }}>
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded-full border-gray-300 text-black focus:ring-black cursor-pointer"
                    checked={selectedIds.has(comment.id)}
                    onChange={() => {}} 
                  />
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(comment.author)}`}>
                  {comment.author.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{comment.author}</h4>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      ❤️ {comment.likes}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BULK ACTIONS DECK */}
        {selectedIds.size > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex items-center gap-2 animate-in slide-in-from-bottom-4 z-20">
            <div className="pl-3 pr-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
              {selectedIds.size} selected
            </div>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <input 
              type="text" 
              placeholder="Reply to all..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              value={manualReply}
              onChange={(e) => setManualReply(e.target.value)}
            />
            <button 
              onClick={handleBulkSend}
              disabled={!manualReply}
              className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              Reply
            </button>
          </div>
        )}
      </div>

      {/* --- SINGLE COMMENT DETAIL MODAL --- */}
      {activeComment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/20">
            {/* Header */}
            <div className="bg-gray-50/50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${getAvatarColor(activeComment.author)}`}>
                   {activeComment.author.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900">{activeComment.author}</h3>
                   <p className="text-xs text-gray-500 font-medium">Viewer Comment</p>
                 </div>
              </div>
              <button 
                onClick={() => setActiveComment(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Comment Body */}
            <div className="p-8">
              <p className="text-gray-700 text-lg font-medium leading-relaxed relative z-10">
                "{activeComment.text}"
              </p>
            </div>

            {/* Reply Actions */}
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Replies</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {smartReplies.map((reply, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSingleSend(reply.replace(/^\d+\.\s*/, '').replace(/"/g, ''))}
                    className="px-5 py-2.5 bg-white hover:bg-black hover:text-white border border-gray-200 hover:border-black rounded-full text-sm font-semibold shadow-sm transition-all transform active:scale-95"
                  >
                    {reply.replace(/^\d+\.\s*/, '').replace(/"/g, '')}
                  </button>
                ))}
                {isDrafting && <div className="text-xs text-gray-400 p-2 animate-pulse">Drafting...</div>}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Type a custom reply..." 
                   className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') handleSingleSend(e.currentTarget.value);
                   }}
                 />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STATUS MODAL (Success / Error / Loading) --- */}
      {status !== 'IDLE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col items-center gap-4 min-w-[200px] animate-in zoom-in-95 duration-200 pointer-events-auto">
            
            {status === 'SENDING' && (
              <>
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900">Sending Replies</h4>
                  <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>
                </div>
              </>
            )}

            {status === 'SUCCESS' && (
              <>
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">✓</div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900">Sent!</h4>
                  <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>
                </div>
              </>
            )}

            {status === 'ERROR' && (
              <>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">✕</div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900">Error</h4>
                  <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>
                </div>
                <button 
                  onClick={() => setStatus('IDLE')}
                  className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700"
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}