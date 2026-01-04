"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SubmitModal } from './SubmitModal';
import { NotificationBell } from './NotificationBell';
import Link from 'next/link';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // 1. Auth Check
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    };
    checkUser();

    // 2. Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) checkAdminRole(session.user.id);
      else setIsAdmin(false);
    });

    // 3. Theme Init
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

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
    window.location.reload();
  };

  return (
    <>
      <nav className="h-16 border-b border-border flex items-center justify-between px-6 md:px-8 bg-panel sticky top-0 z-50 transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-6 bg-ytRed rounded-lg flex items-center justify-center shadow-yt-glow group-hover:scale-105 transition-transform">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic text-foreground">Critique.</span>
        </Link>
        
        <div className="flex gap-4 md:gap-6 items-center">
          {isAdmin && (
            <Link href="/admin" className="hidden md:block text-xs font-black text-ytRed uppercase tracking-widest border border-ytRed/50 px-3 py-1 rounded hover:bg-ytRed hover:text-white transition-colors">
              Admin
            </Link>
          )}

          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-ytRed transition-colors"
            title="Toggle Theme"
          >
            {isDark ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {!user ? (
            <button 
              onClick={handleLogin}
              className="text-xs font-bold text-gray-500 hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-4">
               {/* NOTIFICATION BELL */}
               <NotificationBell userId={user.id} />

               <button onClick={handleLogout} className="hidden md:block text-[10px] font-bold text-gray-600 hover:text-ytRed uppercase tracking-widest">
                 Sign Out
               </button>
               <Link href="/profile" className="w-8 h-8 rounded-full bg-border overflow-hidden border border-border hover:border-ytRed transition-colors shadow-sm">
                  <img src={user.user_metadata.avatar_url} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover"/>
               </Link>
            </div>
          )}

          <button 
            onClick={() => {
              if (!user) handleLogin();
              else setIsModalOpen(true);
            }}
            className="bg-foreground text-background text-xs font-black px-5 py-3 shadow-tactile active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-widest hover:bg-ytRed hover:text-white hover:shadow-yt-glow"
          >
            {user ? 'Post Channel' : 'Login'}
          </button>
        </div>
      </nav>
      {user && <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};