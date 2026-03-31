"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  subItems?: NavItem[];
}

const navLinks: NavItem[] = [
  { name: 'Home', href: '/' },
  { 
    name: 'About', 
    href: '/about',
    subItems: [
      { name: 'Meet the Team', href: '/team' },
    ]
  },
  { 
    name: 'Services', 
    href: '/services',
    subItems: [
      { name: 'Pricing', href: '/services' },
      { name: 'Software', href: '/projects/software' },
      { name: 'Hardware', href: '/projects/hardware' },
    ]
  },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      const scrolled = currentScrollY > 50;
      setIsScrolled(prev => prev !== scrolled ? scrolled : prev);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(prev => prev !== false ? false : prev);
        setMobileMenuOpen(prev => prev !== false ? false : prev);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(prev => prev !== true ? true : prev);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    
    setMobileMenuOpen(false);
    setActiveDropdown(null);

    // If it's a nested route (e.g., /projects/software), navigate directly
    if (href.split('/').filter(Boolean).length > 1) {
      router.push(href);
      return;
    }

    const targetId = href === '/' ? 'home' : href.replace('/', '');

    if (pathname === '/') {
      const element = document.getElementById(targetId);
      
      if (element) {
        const navbarOffset = 100; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (href !== '/') {
        // Fallback for pages that are not sections if handled as single level
        router.push(href);
      }
    } else {
      sessionStorage.setItem('pendingSectionScroll', targetId);
      router.push('/');
    }
  };

  const toggleMobileExpand = (name: string) => {
    setMobileExpanded(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
    setHoveredNav(name);
  };

  const handleMouseLeave = () => {
    setHoveredNav(null);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header id="main-navbar" className={`fixed top-0 w-full z-[100] flex justify-center pointer-events-none font-sans transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      
      <nav 
        className={`pointer-events-auto relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isScrolled 
            ? 'mt-4 w-[95%] rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 py-2' 
            : 'mt-0 w-full rounded-none bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 py-2'
          }
        `}
      >
        <div className={`flex w-full items-center justify-between transition-all duration-700 px-6 sm:px-8 lg:px-10 max-w-none`}>
          
          <div className="flex flex-1 items-center justify-start">
            <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              className="relative flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left h-[45px]"
            >
              <Image 
                src="/8k.png" 
                alt="8K IoT Solutions Logo" 
                width={400} 
                height={133} 
                className="h-full w-auto object-contain object-left" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-none items-center justify-center space-x-1 lg:space-x-2 relative" onMouseLeave={handleMouseLeave}>
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(link.name)}
              >
                <button
                  onClick={(e) => handleNavigation(e as any, link.href)}
                  className={`relative flex items-center gap-1.5 px-5 py-2.5 text-[15px] font-poppins font-semibold transition-all duration-300 rounded-full z-10 text-zinc-950`}
                >
                  {link.name}
                  {link.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Modern Sliding Pill Background */}
                {hoveredNav === link.name && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-zinc-100/80 rounded-full -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {link.subItems && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 pt-2 w-64"
                    >
                      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 p-2 text-zinc-900 overflow-hidden">
                        {link.subItems.map((subItem, idx) => (
                          <div key={subItem.name} className="relative group/sub">
                            {/* Visual Divider */}
                            {idx > 0 && !subItem.subItems && (
                              <div className="mx-2 h-[1px] bg-gray-100 my-1" />
                            )}
                            
                            {subItem.subItems ? (
                              <div className="flex flex-col">
                                <span className="flex items-center justify-between w-full px-4 py-2 text-[14px] font-poppins font-medium text-zinc-900 mt-2 mb-1">
                                  {subItem.name}
                                </span>
                                <div className="grid grid-cols-1 gap-0">
                                  {link.subItems && subItem.subItems && subItem.subItems.map((nestedItem, nestedIdx) => (
                                    <React.Fragment key={nestedItem.name}>
                                      {nestedIdx > 0 && <div className="mx-4 h-[1px] bg-gray-100" />}
                                      <a
                                        href={nestedItem.href}
                                        onClick={(e) => handleNavigation(e, nestedItem.href)}
                                        className="flex items-center gap-3 px-4 py-3 text-[14px] font-poppins font-medium rounded-xl hover:text-brand-900 transition-all group/nested"
                                      >
                                        {nestedItem.name}
                                      </a>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <a
                                aria-label={subItem.name}
                                href={subItem.href}
                                onClick={(e) => handleNavigation(e, subItem.href)}
                                className="flex items-center justify-between px-4 py-3.5 text-[14px] font-poppins font-medium rounded-xl hover:text-brand-900 transition-all"
                              >
                                {subItem.name}
                                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-900" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <a href="https://www.facebook.com/profile.php?id=61586397291701" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[190px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 320 512" className="h-6 w-6 fill-[#1877f2]" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[140px] group-hover:pl-1">8K IoT Solutions</span>
            </a>
            <a href="https://www.tiktok.com/@8kiotsolutions" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[190px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 448 512" className="h-5 w-5 fill-[#000]" xmlns="http://www.w3.org/2000/svg"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[140px] group-hover:pl-1">@8k_solutions</span>
            </a>
          
            <a 
              href="#contact" 
              onClick={(e) => handleNavigation(e, '/contact')}
              className="group hidden lg:flex items-center justify-center gap-3 pl-5 pr-1.5 py-1.5 ml-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full transition-all duration-300 shadow-sm border border-zinc-800 h-[50px]"
            >
              <span className="text-[14px] font-poppins font-medium ml-1">Let's Talk</span>
              <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full transition-transform duration-300 group-hover:scale-[1.05]">
                <svg className="w-4 h-4 text-zinc-900 transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </a>
          </div>

          <div className="md:hidden flex flex-1 items-center justify-end">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-brand-950 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden absolute left-0 right-0 mx-auto w-[95%] pointer-events-auto z-[110] ${isScrolled ? 'top-[90px]' : 'top-[110px]'}`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex flex-col space-y-2 overflow-hidden">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  {link.subItems ? (
                    <>
                      <button 
                        onClick={() => toggleMobileExpand(link.name)}
                        className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-brand-900 hover:bg-brand-50 rounded-xl transition-colors"
                      >
                        {link.name}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded.includes(link.name) ? 'rotate-180' : ''} text-zinc-400`} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded.includes(link.name) && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 flex flex-col space-y-1 mt-1 border-l border-zinc-100 ml-4"
                          >
                            {link.subItems.map((subItem) => (
                              <div key={subItem.name}>
                                {subItem.subItems ? (
                                  <div className="py-2">
                                    <span className="block px-4 py-2 text-[14px] font-poppins font-medium text-zinc-900">{subItem.name}</span>
                                    <div className="flex flex-col space-y-0.5 mt-1">
                                      {subItem.subItems.map((nested, nestedIdx) => (
                                        <React.Fragment key={nested.name}>
                                          {nestedIdx > 0 && <div className="mx-4 h-[1px] bg-zinc-100" />}
                                          <a 
                                            href={nested.href}
                                            onClick={(e) => handleNavigation(e, nested.href)}
                                            className="block px-4 py-3 text-[14px] font-poppins font-medium text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          >
                                            {nested.name}
                                          </a>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <a 
                                    href={subItem.href} 
                                    onClick={(e) => handleNavigation(e, subItem.href)} 
                                    className="block px-4 py-3.5 text-[14px] font-poppins font-medium text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    {subItem.name}
                                  </a>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a 
                      href={link.href} 
                      onClick={(e) => handleNavigation(e, link.href)} 
                      className="block px-4 py-3.5 text-base font-bold text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}