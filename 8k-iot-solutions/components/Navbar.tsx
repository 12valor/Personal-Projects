"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only set state if the boolean flag would actually change
      const scrolled = currentScrollY > 50;
      setIsScrolled(prev => prev !== scrolled ? scrolled : prev);

      // Smart scroll behavior - use functional updates to check previous state
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

  // Custom function to handle smooth scrolling or routing to sections
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Always close mobile menu on click
    setMobileMenuOpen(false);

    const targetId = href === '/' ? 'home' : href.replace('/', '');

    // If we're on the homepage, scroll smoothly
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
      }
    } else {
      // If we're not on the homepage, store our intended destination and client-side route to home
      sessionStorage.setItem('pendingSectionScroll', targetId);
      router.push('/');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header id="main-navbar" className={`fixed top-0 w-full z-50 flex justify-center pointer-events-none font-sans transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      
      {/* Morphing Navbar Container */}
      <nav 
        className={`pointer-events-auto relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isScrolled 
            ? 'mt-4 md:mt-6 w-[98%] max-w-[1728px] rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 py-2' 
            : 'mt-0 w-full rounded-none bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 py-3'
          }
        `}
      >
        {/* Inner Content Wrapper - This pulls the elements together to match the hero width */}
        <div className={`flex w-full items-center justify-between max-w-[1728px] transition-all duration-700 px-4 sm:px-10 lg:px-16 xl:px-20`}>
          
          {/* 1. Left: Logo Area */}
          <div className="flex flex-1 items-center justify-start">
            <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, '/')}
              className={`relative flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left 
                ${isScrolled ? 'h-[45px]' : 'h-[65px]'}`
              }
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

          {/* 2. Center: Navigation Links */}
          <div className="hidden md:flex flex-none items-center justify-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className="text-[15px] font-poppins font-medium relative group text-zinc-900 hover:text-brand-900 transition-colors duration-300 py-2 tracking-wide"
              >
                {link.name}
                <span className="absolute bottom-1 left-0 w-0 h-[2px] transition-all duration-300 ease-out group-hover:w-full bg-brand-500 rounded-full opacity-0 group-hover:opacity-100"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            {/* Facebook */}
            <a href="https://www.facebook.com/profile.php?id=61586397291701" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[190px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 320 512" className="h-6 w-6 fill-[#1877f2]" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[140px] group-hover:pl-1">8K IoT Solutions</span>
            </a>
        
            <a href="#" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[190px] hover:rounded-[8px] overflow-hidden border border-gray-100">
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
      <div className={`md:hidden absolute left-0 right-0 mx-auto w-[95%] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top pointer-events-auto ${mobileMenuOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'} ${isScrolled ? 'top-[90px]' : 'top-[110px]'}`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col space-y-1 mt-2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavigation(e, link.href)} 
              className="block px-4 py-3.5 text-base font-medium text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}