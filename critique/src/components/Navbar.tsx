"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SubmitModal } from './SubmitModal';
import { NotificationBell } from './NotificationBell';
import Link from 'next/link';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Start as null to prevent hydration mismatch and incorrect button labels
  const [isDark, setIsDark] = useState<boolean | null>(null);
  
  // Refs for click-outside logic
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Persistence Logic: Sync theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    
    // Default to dark if no preference exists
    if (storedTheme === 'light') {
      setIsDark(false);
      root.classList.remove('dark');
    } else {
      setIsDark(true);
      root.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) checkAdminRole(session.user.id);
      else setIsAdmin(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      // Logic fix: Check if click is outside Menu AND outside Hamburger Button
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [supabase]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    
    setIsDark(newIsDark);
    if (newIsDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
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
    setIsMenuOpen(false);
    window.location.reload();
  };

  const themeLabel = isDark === null ? '...' : (isDark ? 'DARK' : 'LIGHT');

  return (
    <>
      <nav className="h-[72px] w-full border-b border-border flex items-center justify-between px-6 md:px-10 bg-white dark:bg-[#000000] sticky top-0 z-[999] transition-colors duration-300">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 relative z-[1001]">
          <div className="w-9 h-7 bg-ytRed rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[10px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic text-black dark:text-white leading-none">
            Critique<span className="text-ytRed">.</span>
          </span>
        </Link>
        
        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6 relative z-[1001]">
          
          {/* UPDATED LOGIN BUTTON */}
          <button 
            type="button"
            onClick={() => { !user ? handleLogin() : setIsModalOpen(true); }}
            className="
              bg-foreground text-background border border-current
              text-[10px] md:text-[11px] font-black uppercase tracking-widest
              px-4 py-2 md:px-6 md:py-3.5
              shadow-[2px_2px_0px_0px_#cc0000] md:shadow-[4px_4px_0px_0px_#cc0000]
              active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
              hover:bg-ytRed hover:text-white hover:border-ytRed
              transition-all
            "
          >
            {/* Short text for mobile */}
            <span className="md:hidden">{user ? 'Post' : 'Login'}</span>
            {/* Full text for desktop */}
            <span className="hidden md:inline">{user ? 'Post Channel' : 'Login'}</span>
          </button>

          <button 
            ref={hamburgerRef} // Added ref here
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 md:w-10 md:h-10 flex flex-col items-center justify-center border border-border bg-background rounded-sm hover:border-ytRed transition-all"
          >
            <div className={`w-5 h-0.5 bg-foreground mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-foreground mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* HAMBURGER DROPDOWN */}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-[80px] right-6 md:right-10 w-72 bg-white dark:bg-[#000000] border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[1000] shadow-2xl rounded-md">
            
            {/* 1. ADMIN PANEL (TOP) */}
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="px-5 py-4 flex items-center gap-4 bg-ytRed/10 hover:bg-ytRed/20 transition-colors border-b border-border">
                <div className="w-5 flex justify-center text-ytRed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-ytRed">Admin Dashboard</span>
              </Link>
            )}

            {/* 2. IDENTITY */}
            {user && (
              <div className="px-5 py-5 border-b border-border flex items-center gap-4 bg-foreground/[0.02]">
                <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full border border-border" alt="" />
                <span className="text-xs font-black uppercase truncate text-foreground">{user.user_metadata.full_name}</span>
              </div>
            )}

            {/* 3. NAVIGATION (Aligned Icons) */}
            <div className="flex flex-col py-2 border-b border-border">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-foreground/[0.05] group">
                <div className="w-5 flex justify-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-foreground">Home</span>
              </Link>
              {user && (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-foreground/[0.05] group">
                    <div className="w-5 flex justify-center">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-foreground">Profile</span>
                  </Link>

                  {/* CLICKABLE NOTIFICATIONS */}
                  <Link href="/notifications" onClick={() => setIsMenuOpen(false)} className="px-5 py-3.5 flex items-center gap-4 hover:bg-foreground/[0.05] group">
                    <div className="w-5 flex justify-center pointer-events-none">
                      <NotificationBell userId={user?.id} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-foreground">Notifications</span>
                  </Link>
                </>
              )}
            </div>

            {/* 4. PREFERENCES */}
            <button onClick={toggleTheme} className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-foreground/[0.05] group transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-5 flex justify-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-foreground">Appearance</span>
              </div>
              <span className="text-[9px] font-black text-ytRed border border-ytRed/30 px-2 py-0.5">{themeLabel}</span>
            </button>

            {/* 5. LOGOUT */}
            {user && (
              <button onClick={handleLogout} className="px-5 py-5 mt-2 border-t border-border flex items-center gap-4 hover:bg-ytRed/10 group w-full text-left">
                <div className="w-5 flex justify-center text-gray-400 group-hover:text-ytRed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-ytRed uppercase">Logout</span>
              </button>
            )}
          </div>
        )}
      </nav>
      {user && <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};