"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SubmitModal } from './SubmitModal';
import { AuthModal } from './AuthModal';
import { NotificationBell } from './NotificationBell';
import Link from 'next/link';

// --- SOCIAL ICONS COMPONENT (Refined Hover) ---
const SocialIcon = ({ type, href }: { type: 'discord' | 'x' | 'instagram', href: string }) => {
  const icons = {
    discord: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.64 1.316 18.067 18.067 0 0 0-5.43 0 14.237 14.237 0 0 0-.642-1.316.077.077 0 0 0-.08-.037 19.736 19.736 0 0 0-4.88 1.515.069.069 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>,
    x: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ytRed hover:bg-ytRed/10 p-2 rounded-full transition-all duration-300">
      {icons[type]}
    </a>
  );
};

export const Navbar = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState<boolean | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- THEME & AUTH LOGIC ---
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    window.location.reload();
  };

  const themeLabel = isDark === null ? '...' : (isDark ? 'Dark Mode' : 'Light Mode');

  return (
    <>
      <nav 
        className={`
          h-[72px] w-full fixed top-0 z-[999] transition-all duration-500 ease-in-out px-6 md:px-10 flex items-center justify-between
          ${scrolled 
            ? 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border-b border-black/5 dark:border-white/5' 
            : 'bg-transparent border-b border-transparent'
          }
        `}
      >
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 relative z-[1001] group">
          <div className="w-9 h-7 bg-ytRed rounded-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[10px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic text-black dark:text-white leading-none">
            Critique<span className="text-ytRed">.</span>
          </span>
        </Link>
        
        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6 relative z-[1001]">
          
          {/* SOCIALS (DESKTOP) */}
          <div className="hidden md:flex items-center gap-4 mr-4">
            <SocialIcon type="discord" href="https://discord.gg/Eu8bPDrC" />
            <SocialIcon type="x" href="https://twitter.com" />
            <SocialIcon type="instagram" href="https://instagram.com" />
          </div>

          {/* ACTION BUTTON */}
          <button 
            type="button"
            onClick={() => { 
                if (!user) {
                    setIsAuthModalOpen(true);
                } else {
                    setIsSubmitModalOpen(true);
                }
            }}
            className="
              relative overflow-hidden group
              bg-foreground text-background 
              text-[10px] md:text-[11px] font-black uppercase tracking-widest
              px-5 py-2.5 md:px-7 md:py-3 rounded-full
              hover:bg-ytRed hover:text-white transition-colors duration-300
              shadow-lg shadow-black/5 dark:shadow-white/5
            "
          >
            <span className="relative z-10 md:hidden">{user ? 'Submit' : 'Login'}</span>
            <span className="relative z-10 hidden md:inline">{user ? 'Submit Entry' : 'Login'}</span>
          </button>

          {/* ANIMATED HAMBURGER BUTTON */}
          <button 
            ref={hamburgerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              relative w-10 h-10 flex flex-col items-center justify-center 
              bg-transparent rounded-full hover:bg-black/5 dark:hover:bg-white/10 
              transition-colors duration-200 group z-[1002]
            "
            aria-label="Toggle Menu"
          >
            {/* Top Line */}
            <span 
              className={`absolute h-[2px] bg-foreground rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'w-5 rotate-45' : 'w-5 -translate-y-1.5'}
              `} 
            />
            {/* Middle Line */}
            <span 
              className={`absolute h-[2px] bg-foreground w-5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}
              `} 
            />
            {/* Bottom Line */}
            <span 
              className={`absolute h-[2px] bg-foreground rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'w-5 -rotate-45' : 'w-5 translate-y-1.5'}
              `} 
            />
          </button>
        </div>

        {/* --- PREMIUM DROPDOWN MENU --- */}
        <div 
            ref={menuRef} 
            className={`
              absolute top-[80px] right-6 md:right-10 w-[320px] 
              bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl 
              border border-white/20 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]
              overflow-hidden transform origin-top-right transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible pointer-events-none'}
            `}
        >
            
            {/* SECTION: USER / ADMIN */}
            {(user || isAdmin) && (
              <div className="bg-gradient-to-b from-black/[0.02] to-transparent border-b border-black/5 dark:border-white/5">
                {/* Admin Link */}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="px-6 py-4 flex items-center gap-3 bg-ytRed/5 hover:bg-ytRed/10 transition-colors border-b border-ytRed/10">
                    <div className="w-5 flex justify-center text-ytRed">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-ytRed">Admin Dashboard</span>
                  </Link>
                )}
                
                {/* User Identity */}
                {user && (
                  <div className="px-6 py-5 flex items-center gap-4">
                    <div className="relative">
                      <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 shadow-sm object-cover" alt="User Avatar" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</span>
                      <span className="text-sm font-black uppercase truncate text-foreground leading-tight">{user.user_metadata.full_name}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION: PLATFORM */}
            <div className="py-3">
              <div className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400/60">Platform</div>
              
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 group transition-all duration-200">
                <div className="w-5 flex justify-center">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-ytRed transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-foreground group-hover:translate-x-1 transition-all">Feed</span>
              </Link>
              
              {user && (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 group transition-all duration-200">
                    <div className="w-5 flex justify-center">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-ytRed transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-foreground group-hover:translate-x-1 transition-all">My Profile</span>
                  </Link>

                  <Link href="/notifications" onClick={() => setIsMenuOpen(false)} className="px-6 py-3 flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/5 group transition-all duration-200">
                    <div className="w-5 flex justify-center pointer-events-none">
                       <NotificationBell userId={user?.id} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-foreground group-hover:translate-x-1 transition-all">Notifications</span>
                  </Link>
                </>
              )}
            </div>

            {/* SECTION: SETTINGS & UTILS */}
            <div className="py-3 border-t border-black/5 dark:border-white/5">
              <div className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400/60">Preferences</div>
              
              <button onClick={toggleTheme} className="w-full px-6 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 group transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-5 flex justify-center">
                    {isDark ? (
                       <svg className="w-5 h-5 text-gray-400 group-hover:text-ytRed transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    ) : (
                       <svg className="w-5 h-5 text-gray-400 group-hover:text-ytRed transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-foreground">Theme</span>
                </div>
                <span className="text-[9px] font-black text-foreground bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded">{themeLabel}</span>
              </button>
            </div>
            
            {/* MOBILE ONLY SOCIALS */}
            <div className="md:hidden py-5 border-t border-black/5 dark:border-white/5 flex justify-center gap-8 bg-black/[0.02]">
               <SocialIcon type="discord" href="https://discord.gg/Eu8bPDrC" />
               <SocialIcon type="x" href="https://twitter.com" />
               <SocialIcon type="instagram" href="https://instagram.com" />
            </div>

            {/* LOGOUT */}
            {user && (
              <button onClick={handleLogout} className="w-full px-6 py-4 border-t border-black/5 dark:border-white/5 flex items-center gap-4 hover:bg-red-500/5 group text-left transition-colors">
                <div className="w-5 flex justify-center text-gray-400 group-hover:text-ytRed transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </div>
                <span className="text-xs font-black text-gray-500 group-hover:text-ytRed uppercase tracking-wider transition-colors">Log Out</span>
              </button>
            )}
        </div>

      </nav>

      {/* MODALS */}
      {user && <SubmitModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};