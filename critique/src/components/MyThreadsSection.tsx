"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SubmissionCard } from './SubmissionCard';
import Link from 'next/link';

// --- SUB-COMPONENT: Handles the "Read" Logic per Card ---
const MyThreadItem = ({ post }: { post: any }) => {
  const [hasNewComments, setHasNewComments] = useState(false);
  const commentCount = post.comments?.[0]?.count || 0;
  const storageKey = `seen_comments_${post.id}`;

  // 1. Check if there are new comments on mount
  useEffect(() => {
    if (commentCount === 0) return;

    // Get the count we last saw
    const lastSeenCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

    // If current count is higher than what we stored, show badge
    if (commentCount > lastSeenCount) {
      setHasNewComments(true);
    }
  }, [commentCount, storageKey]);

  // 2. Mark as read when clicked
  const handleCardClick = () => {
    // Save the current count as "seen"
    localStorage.setItem(storageKey, commentCount.toString());
    setHasNewComments(false); // Hide badge instantly
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleCardClick}>
      {/* NOTIFICATION BADGE: Only shows if Unread & Has Comments */}
      {hasNewComments && (
        <div className="absolute -top-3 -right-3 z-30 animate-in fade-in zoom-in duration-300 pointer-events-none">
          <div className="bg-[#FF0032] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg border-2 border-white dark:border-black flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            New
          </div>
        </div>
      )}
      {/* We wrap SubmissionCard in a div that handles the click 
         bubbling from the Link inside the card 
      */}
      <SubmissionCard channel={post} />
    </div>
  );
};

// --- MAIN COMPONENT ---
export const MyThreadsSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check Session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      // 2. Fetch User's Posts
      const { data } = await supabase
        .from('submissions')
        .select(`*, profiles (full_name, avatar_url), comments (count)`)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (!loading && !user) return null;

  if (loading) return (
    <div className="w-full h-32 flex items-center justify-center bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/10">
      <div className="w-6 h-6 border-2 border-[#FF0032] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <section className="bg-white dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="h-8 w-2 bg-[#FF0032] rounded-full shadow-[0_0_15px_#cc0000]" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
                My <span className="text-[#FF0032]">Threads</span>
              </h2>
           </div>
           {posts.length > 0 && (
             <Link href="/profile" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               Manage Posts →
             </Link>
           )}
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post) => (
              // Use the new sub-component here
              <MyThreadItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">No active threads</p>
            <p className="text-xs text-slate-500">Post your channel to see it here.</p>
          </div>
        )}
      </div>
    </section>
  );
};