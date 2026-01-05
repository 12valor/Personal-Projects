"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// --- ICONS (Inline SVGs for zero dependencies) ---
const Icons = {
  Lock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Time: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Tag: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>,
  Empty: () => <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
};

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
  const [isLockedState, setIsLockedState] = useState(initialLocked);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchComments();
    checkUser();
  }, [submissionId]);

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
    if (isLockedState) {
      setErrorMsg("⛔ Thread is locked.");
      return;
    }
    if (!currentUser || !newComment.trim()) return;

    const { error } = await supabase.from('comments').insert([{
      submission_id: submissionId,
      content: newComment,
      tags: selectedTags,
      timestamp: timestamp || null,
      user_id: currentUser.id,
      author_name: "Legacy" // You might want to remove this if utilizing Profiles relations
    }]);

    if (error) {
      if (error.code === '42501') {
        setIsLockedState(true);
        setErrorMsg("⛔ Failed: This thread is locked by admins.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } else {
      setNewComment("");
      setTimestamp("");
      setSelectedTags([]);
      setErrorMsg("");
      fetchComments();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          Critiques <span className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs px-2 py-1 rounded-full">{comments.length}</span>
        </h3>
        {isLockedState && (
           <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
             <Icons.Lock /> LOCKED
           </span>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      {isLockedState ? (
        <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl p-8 mb-12 flex flex-col items-center justify-center text-center opacity-70">
           <div className="w-12 h-12 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 mb-3">
             <Icons.Lock />
           </div>
           <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Comments have been turned off for this submission.</p>
        </div>
      ) : (
        <div className={`
          relative bg-white dark:bg-[#0a0a0a] border rounded-xl shadow-sm transition-all duration-300 mb-12 group
          ${isFocused ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200 dark:border-white/10'}
        `}>
          {!currentUser && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-xl">
              <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white mb-3">Join the discussion</p>
              <button className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-6 py-2 rounded-full text-xs uppercase tracking-wide hover:scale-105 transition-transform">
                Login to Critique
              </button>
            </div>
          )}

          {/* Top Bar: Timestamp & Label */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] rounded-t-xl">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               New Critique
             </span>
             {submissionType === 'video' && (
               <div className="flex items-center gap-2">
                 <div className="text-slate-400"><Icons.Time /></div>
                 <input 
                   value={timestamp}
                   onChange={(e) => setTimestamp(e.target.value)}
                   placeholder="0:00"
                   className="w-16 bg-transparent text-right text-xs font-mono font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-300 focus:outline-none focus:text-indigo-500"
                 />
               </div>
             )}
          </div>

          {/* Text Area */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What actionable feedback can you give?"
            className="w-full bg-transparent p-4 min-h-[120px] text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium resize-none focus:outline-none"
          />

          {/* Bottom Bar: Tags & Post */}
          <div className="px-4 py-3 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                      px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1
                      ${isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-105' 
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }
                    `}
                  >
                    {isSelected && <span className="text-[8px] mr-1">●</span>}
                    {tag}
                  </button>
                )
              })}
            </div>

            <button 
              onClick={postComment}
              disabled={!newComment.trim()}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-black px-5 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Post <Icons.Send />
            </button>
          </div>
          
          {errorMsg && (
            <div className="absolute -bottom-10 left-0 right-0 text-center animate-pulse">
              <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* --- COMMENTS LIST --- */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-50">
             <Icons.Empty />
             <p className="text-sm font-bold text-slate-500">No critiques yet.</p>
             <p className="text-xs text-slate-400">Be the first to provide value.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Avatar Column */}
              <div className="flex-shrink-0 pt-1">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-[2px] shadow-sm">
                   <img 
                     src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.full_name}&background=random`} 
                     className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#0a0a0a]"
                     alt="avatar"
                   />
                 </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-4 rounded-2xl rounded-tl-none shadow-sm group-hover:shadow-md transition-shadow">
                 
                 {/* Metadata Header */}
                 <div className="flex justify-between items-start mb-2">
                    <div>
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                         {comment.profiles?.full_name || "Anonymous Creator"}
                       </h4>
                       <span className="text-[10px] font-medium text-slate-400">
                         {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>

                    {/* Tags & Time */}
                    <div className="flex flex-wrap gap-2 justify-end">
                       {comment.timestamp && (
                         <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/30">
                           <Icons.Time /> {comment.timestamp}
                         </div>
                       )}
                       {comment.tags?.map((tag: string) => (
                         <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded">
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>

                 <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-3" />

                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                   {comment.content}
                 </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};