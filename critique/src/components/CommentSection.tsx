"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const FEEDBACK_TAGS = ["Hook", "Editing", "Audio", "Pacing", "Thumbnail", "Content"];

interface CommentSectionProps {
  submissionId: string;
  submissionType?: 'channel' | 'video';
  isLocked?: boolean;
}

export const CommentSection = ({ submissionId, submissionType = 'channel', isLocked: initialLocked = false }: CommentSectionProps) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Local state to handle "Locked" updates instantly
  const [isLockedState, setIsLockedState] = useState(initialLocked);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchComments();
    checkUser();
  }, [submissionId]);

  // Sync prop changes (if parent re-renders)
  useEffect(() => {
    setIsLockedState(initialLocked);
  }, [initialLocked]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`*, profiles (full_name, avatar_url)`)
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });

    if (data) setComments(data);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else if (selectedTags.length < 2) setSelectedTags([...selectedTags, tag]);
  };

const postComment = async () => {
    // 1. Client-Side Pre-Check
    if (isLockedState) {
      setErrorMsg("⛔ Thread is locked.");
      return;
    }
    if (!currentUser || !newComment.trim()) return;

    // 2. Database Attempt
    const { error } = await supabase.from('comments').insert([{
      submission_id: submissionId,
      content: newComment,
      tags: selectedTags,
      timestamp: timestamp || null,
      user_id: currentUser.id,
      author_name: "Legacy"
    }]);

    // 3. Error Handling
    if (error) {
      console.error("Post Error:", error);
      
      // Code 42501 = RLS Policy Violation (The SQL we just ran)
      if (error.code === '42501') {
        setIsLockedState(true); // Force UI to lock immediately
        setErrorMsg("⛔ Failed: This thread is locked by admins.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } else {
      // Success
      setNewComment("");
      setTimestamp("");
      setSelectedTags([]);
      setErrorMsg("");
      fetchComments();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-10">
      
      {/* LOCKED BANNER vs INPUT FORM */}
      {isLockedState ? (
        <div className="bg-panel border-l-4 border-red-900 bg-red-900/5 p-6 mb-12 flex items-center gap-4 shadow-sm animate-in fade-in">
           <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center text-red-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <div>
              <h3 className="text-sm font-black uppercase text-red-500 tracking-widest">Thread Locked</h3>
              <p className="text-xs text-gray-500 font-medium">This submission has been locked by moderators. No further critiques can be posted.</p>
           </div>
        </div>
      ) : (
        <div className="bg-panel border border-border p-6 shadow-tactile mb-12 relative group focus-within:border-ytRed/50 transition-colors">
          {!currentUser && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
               <p className="text-sm font-bold uppercase tracking-widest text-white">Login to critique</p>
             </div>
          )}

          <div className="flex justify-between items-center mb-4">
             <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">
               Critique this {submissionType}
             </label>
             
             {submissionType === 'video' && (
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold uppercase text-gray-500">Timestamp:</span>
                 <input 
                   value={timestamp}
                   onChange={(e) => setTimestamp(e.target.value)}
                   placeholder="0:00"
                   className="w-16 bg-background border border-border p-1 text-xs font-mono text-center focus:border-ytRed focus:outline-none"
                 />
               </div>
             )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {FEEDBACK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all
                  ${selectedTags.includes(tag) 
                    ? 'bg-ytRed border-ytRed text-white shadow-yt-glow' 
                    : 'bg-background border-border text-gray-500 hover:border-gray-400'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Give actionable feedback..."
            className="w-full bg-transparent text-foreground placeholder:text-gray-700 font-medium text-sm focus:outline-none min-h-[80px] resize-none"
          />
          
          {errorMsg && (
            <div className="mt-2 p-2 bg-red-900/10 border border-red-500/50 rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <span className="text-xs font-bold text-red-500">{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border mt-2">
            <button 
              onClick={postComment}
              disabled={!newComment.trim()}
              className="bg-foreground text-background font-black px-6 py-2 text-xs uppercase tracking-widest hover:bg-ytRed hover:text-white transition-colors disabled:opacity-50"
            >
              Post Critique
            </button>
          </div>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-panel border border-border p-4 relative animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-2">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                    <img src={comment.profiles?.avatar_url || "https://ui-avatars.com/api/?background=random"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">{comment.profiles?.full_name || "Anonymous"}</span>
                    <span className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  {comment.timestamp && (
                    <span className="text-[10px] font-mono font-bold text-ytRed border border-ytRed/30 bg-ytRed/10 px-2 py-0.5 rounded">
                      @{comment.timestamp}
                    </span>
                  )}
                  {comment.tags?.map((tag: string) => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-gray-500 border border-border px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pl-11">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};