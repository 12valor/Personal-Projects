"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { SubmitModal } from './SubmitModal';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    };
    checkUser();

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) checkAdminRole(session.user.id);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (uid: string) => {
    const { data } = await supabase.from('profiles').select('role').eq('id', uid).single();
    if (data?.role === 'admin') setIsAdmin(true);
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="h-16 border-b border-border flex items-center justify-between px-8 bg-background sticky top-0 z-50 transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-6 bg-ytRed rounded-lg flex items-center justify-center shadow-yt-glow group-hover:scale-105 transition-transform">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic text-foreground">Critique.</span>
        </Link>
        
        <div className="flex gap-6 items-center">
          {/* Admin Link (Only visible to Admins) */}
          {isAdmin && (
            <Link href="/admin" className="text-xs font-black text-ytRed uppercase tracking-widest border border-ytRed/50 px-3 py-1 rounded hover:bg-ytRed hover:text-white transition-colors">
              Admin Panel
            </Link>
          )}

          {/* Login / Logout Logic */}
          {!user ? (
            <button 
              onClick={handleLogin}
              className="text-xs font-bold text-gray-500 hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Sign In (Google)
            </button>
          ) : (
            <div className="flex items-center gap-4">
               <button onClick={handleLogout} className="text-[10px] font-bold text-gray-600 hover:text-ytRed uppercase tracking-widest">
                 Sign Out
               </button>
               {/* Google Avatar */}
               <div className="w-8 h-8 rounded-full bg-border overflow-hidden border border-border">
                  <img src={user.user_metadata.avatar_url} alt="User" referrerPolicy="no-referrer" />
               </div>
            </div>
          )}

          <button 
            onClick={() => {
              if (!user) handleLogin();
              else setIsModalOpen(true);
            }}
            className="bg-foreground text-background text-xs font-black px-5 py-3 shadow-tactile active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest hover:bg-ytRed hover:text-white hover:shadow-yt-glow"
          >
            {user ? 'Post Channel' : 'Login to Post'}
          </button>
        </div>
      </nav>
      {user && <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};