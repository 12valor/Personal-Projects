"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SubmitModal } from './SubmitModal';
import { AuthModal } from './AuthModal';
import { NotificationBell } from './NotificationBell';
import Link from 'next/link';

// --- SOCIAL ICONS COMPONENT ---
const SocialIcon = ({ type, href }: { type: 'discord' | 'x' | 'instagram', href: string }) => {
  const icons = {
    discord: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.64 1.316 18.067 18.067 0 0 0-5.43 0 14.237 14.237 0 0 0-.642-1.316.077.077 0 0 0-.08-.037 19.736 19.736 0 0 0-4.88 1.515.069.069 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>,
    x: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  };

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-ytRed hover:bg-ytRed/5 p-2 rounded-full transition-all duration-300">
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

  const toggleTheme = (mode: 'light' | 'dark') => {
    const root = document.documentElement;
    if (mode === 'dark') {
      setIsDark(true);
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDark(false);
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
            <span 
              className={`absolute h-[2px] bg-foreground rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'w-5 rotate-45' : 'w-5 -translate-y-1.5'}
              `} 
            />
            <span 
              className={`absolute h-[2px] bg-foreground w-5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}
              `} 
            />
            <span 
              className={`absolute h-[2px] bg-foreground rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isMenuOpen ? 'w-5 -rotate-45' : 'w-5 translate-y-1.5'}
              `} 
            />
          </button>
        </div>

        {/* --- REFINED DROPDOWN MENU --- */}
        <div 
            ref={menuRef} 
            className={`
              absolute top-[80px] right-6 md:right-10 w-[340px] 
              bg-white dark:bg-[#121212] 
              border border-zinc-200 dark:border-zinc-800 rounded-2xl 
              shadow-2xl shadow-black/10 dark:shadow-black/40
              overflow-hidden transform origin-top-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible pointer-events-none'}
            `}
        >
            
            {/* SECTION: USER IDENTITY */}
            {user && (
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={user.user_metadata.avatar_url} className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover" alt="User Avatar" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.user_metadata.full_name}</span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: NAVIGATION */}
            <div className="py-3 px-2">
              <div className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Menu</div>
              
              <div className="flex flex-col gap-1">
                {/* Admin Link */}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-ytRed group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="text-sm font-bold text-ytRed">Admin Dashboard</span>
                  </Link>
                )}

                <Link href="/" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Platform Feed</span>
                </Link>

                {user && (
                  <>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">My Profile</span>
                    </Link>

                    <Link href="/notifications" onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                         <NotificationBell userId={user?.id} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Notifications</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* SECTION: PREFERENCES (Segmented Control) */}
            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Appearance</span>
               </div>
               
               <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl flex items-center">
                  <button 
                    onClick={() => toggleTheme('light')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${!isDark ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Light
                  </button>
                  <button 
                    onClick={() => toggleTheme('dark')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${isDark ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    Dark
                  </button>
               </div>
            </div>

            {/* SECTION: FOOTER / LOGOUT */}
            <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                {/* Mobile Socials Row */}
                <div className="md:hidden flex justify-center gap-6 py-3 mb-2">
                   <SocialIcon type="discord" href="https://discord.gg/Eu8bPDrC" />
                   <SocialIcon type="x" href="https://twitter.com" />
                   <SocialIcon type="instagram" href="https://instagram.com" />
                </div>

                {user ? (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log Out
                  </button>
                ) : (
                  <div className="text-center py-2">
                    <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="text-xs font-black uppercase text-ytRed hover:underline">Log In to Account</button>
                  </div>
                )}
            </div>

        </div>

      </nav>

      {/* MODALS */}
      {user && <SubmitModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};