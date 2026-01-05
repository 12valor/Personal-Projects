"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { AuthModal } from './AuthModal';

interface CommentSectionProps {
  submissionId: string;
  submissionType: 'video' | 'channel';
  isLocked?: boolean;
}

export const CommentSection = ({ submissionId, submissionType, isLocked }: CommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null); // NEW: Holds the actual DB profile
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // NEW: If logged in, fetch the specific row from 'profiles' table
      if (session?.user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id) // Ensure this column name matches your DB (id vs user_id)
            .single();
        
        if (profile) setUserProfile(profile);
      }
    };

    fetchSessionAndProfile();
    fetchComments();

    const channel = supabase
      .channel('comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `submission_id=eq.${submissionId}` }, 
      (payload) => {
        fetchComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [submissionId]);

  const fetchComments = async () => {
    setIsLoading(true);
    
    // We select profiles data via the foreign key relationship
    // Note: Ensure your foreign key in supabase is named 'profiles' or matches the table name
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
            full_name,
            avatar_url
        )
      `)
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching comments:", error);
    } else if (data) {
        setComments(data);
    }
    
    setIsLoading(false);
  };

  // --- HELPER: GET AVATAR ---
  // If no DB image, generate one using UI Avatars service
  const getAvatarUrl = (url: string | null, name: string) => {
    if (url) return url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  };

  // --- HELPER: GET CURRENT USER NAME ---
  // Prioritize DB Profile -> then Auth Meta -> then 'Creator'
  const getCurrentUserDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return 'Creator';
  };

  const currentDisplayName = getCurrentUserDisplayName();
  const currentAvatar = getAvatarUrl(userProfile?.avatar_url, currentDisplayName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setIsLoading(true);

    let finalContent = newComment;
    if (submissionType === 'video' && timestamp) {
      finalContent = `[${timestamp}] ${newComment}`;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        content: finalContent,
        submission_id: submissionId,
        user_id: user.id,
        // We still save the snapshot name, but we prefer fetching dynamic profiles
        author_name: currentDisplayName, 
      })
      .select();

    if (error) {
      console.error("Supabase Write Error:", error);
      alert(`Error: ${error.message}`);
    } else {
      setNewComment('');
      setTimestamp('');
      fetchComments(); 
    }
    
    setIsLoading(false);
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9:]/g, '');
    if (val.length === 2 && !val.includes(':') && timestamp.length < 2) {
        val = val + ':';
    }
    if (val.length > 5) return;
    setTimestamp(val);
  };

  const parseComment = (content: string) => {
    const timeMatch = content.match(/^\[([0-9]{1,2}:[0-9]{2})\]\s(.+)/);
    if (timeMatch && submissionType === 'video') {
      return { time: timeMatch[1], text: timeMatch[2] };
    }
    return { time: null, text: content };
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
          Critique Log
        </h3>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
          {comments.length} ENTRIES
        </span>
      </div>

      {isLocked ? (
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl text-center mb-12">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">This thread is locked.</p>
        </div>
      ) : user ? (
        <form onSubmit={handleSubmit} className="mb-14 group relative z-10">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-indigo-500 rounded-2xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
          <div className="relative bg-white dark:bg-[#111] rounded-2xl overflow-hidden shadow-2xl">
            
            {submissionType === 'video' && (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-[#151515] border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-[#FF0032]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">Timecode</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="00:00"
                        value={timestamp}
                        onChange={handleTimestampChange}
                        className="w-24 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF0032] focus:ring-1 focus:ring-[#FF0032] transition-all text-center placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    />
                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2" />
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                        Flag specific moments for review.
                    </span>
                </div>
            )}

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your critique..."
              className="w-full bg-transparent p-5 min-h-[120px] outline-none text-slate-700 dark:text-slate-200 resize-none placeholder:text-slate-400 text-sm md:text-base leading-relaxed"
            />
            
            <div className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-[#151515]">
              <div className="flex items-center gap-2 pl-2">
                 {/* UPDATED: Uses DB avatar or generated fallback */}
                 <img src={currentAvatar} className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 opacity-70" alt="" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase hidden sm:inline-block">
                   Posting as <span className="text-slate-900 dark:text-white">{currentDisplayName}</span>
                 </span>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !newComment.trim()}
                className="bg-[#FF0032] text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/20"
              >
                {isLoading ? 'Sending...' : 'Post Entry'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-100 dark:bg-white/5 p-8 rounded-2xl text-center mb-12 border border-dashed border-slate-300 dark:border-white/10">
           <p className="text-sm font-bold text-slate-500 mb-4">Log in to leave a critique.</p>
           <button 
             onClick={() => setIsAuthModalOpen(true)}
             className="text-xs font-black uppercase tracking-widest text-[#FF0032] hover:underline"
           >
             Sign In Now
           </button>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <div className="space-y-6 relative">
        {comments.length > 0 && (
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200 dark:bg-white/10 hidden md:block z-0" />
        )}

        {comments.map((comment) => {
            const { time, text } = parseComment(comment.content);
            const isTimestamped = !!time;
            
            // UPDATED LOGIC: Check 'profiles' object first
            const authorName = comment.profiles?.full_name || comment.author_name || 'Anonymous';
            // UPDATED LOGIC: Use DB URL, if null generate from name
            const avatarUrl = getAvatarUrl(comment.profiles?.avatar_url, authorName);
            
            return (
                <div key={comment.id} className="relative z-10 flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 group">
                    <div className="shrink-0 pt-1">
                        <div className={`w-10 h-10 rounded-full border-2 overflow-hidden relative z-10 transition-transform group-hover:scale-110 ${isTimestamped ? 'border-red-500 shadow-[0_0_10px_rgba(255,0,50,0.3)]' : 'border-white dark:border-[#222] bg-white dark:bg-black'}`}>
                             <img 
                                src={avatarUrl} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/10 transition-all">
                            <div className="flex items-baseline justify-between mb-2 border-b border-slate-50 dark:border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                        {authorName}
                                    </span>
                                    {isTimestamped && (
                                        <span className="hidden sm:inline-block bg-red-500 text-white text-[9px] font-bold px-1.5 rounded uppercase tracking-wider">
                                            Timestamped
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {time && (
                                    <div className="inline-block mr-2 mb-1">
                                        <span className="inline-flex items-center gap-1.5 bg-[#FF0032] text-white px-2 py-0.5 rounded text-[11px] font-bold font-mono shadow-sm cursor-pointer hover:bg-red-700 transition-colors">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            {time}
                                        </span>
                                    </div>
                                )}
                                {text}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
        {comments.length === 0 && (
            <div className="text-center py-16 opacity-50">
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <p className="text-slate-500 font-medium text-sm">No critiques yet. Start the conversation.</p>
            </div>
        )}
      </div>
    </div>
  );
};