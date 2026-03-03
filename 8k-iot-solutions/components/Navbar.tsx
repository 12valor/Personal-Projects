"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pointer-events-none font-sans">
      
      {/* Morphing Navbar Container */}
      <nav 
        className={`pointer-events-auto relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isScrolled 
            ? 'mt-4 md:mt-6 w-[98%] max-w-7xl rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 py-2' 
            : 'mt-0 w-full rounded-none bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 py-3'
          }
        `}
      >
        {/* Inner Content Wrapper - This pulls the elements together to match the hero width */}
        <div className={`flex w-full items-center justify-between max-w-7xl transition-all duration-700 px-4 sm:px-6 lg:px-8`}>
          
          {/* 1. Left: Logo Area */}
          <div className="flex flex-1 items-center justify-start">
            <Link 
              href="#home" 
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
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[15px] font-semibold relative group text-brand-950 hover:text-brand-600 transition-colors duration-300 py-2 tracking-wide"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 ease-out group-hover:w-full bg-brand-500 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* 3. Right: Social Buttons */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            {/* Facebook */}
            <a href="#" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[170px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 320 512" className="h-6 w-6 fill-[#1877f2]" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[110px] group-hover:pl-1">8K IoT Solutions</span>
            </a>

            {/* TikTok */}
            <a href="#" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[170px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 448 512" className="h-5 w-5 fill-[#000]" xmlns="http://www.w3.org/2000/svg"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[110px] group-hover:pl-1">@8k_solutions</span>
            </a>

            {/* GitHub */}
            <a href="#" className="shrink-0 group flex items-center justify-start h-[50px] w-[50px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition-all duration-300 hover:w-[170px] hover:rounded-[8px] overflow-hidden border border-gray-100">
              <div className="flex items-center justify-center min-w-[50px] h-[50px]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#333]" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </div>
              <span className="w-0 overflow-hidden whitespace-nowrap text-left text-[15px] font-bold text-black transition-all duration-300 group-hover:w-[110px] group-hover:pl-1">8k-solutions</span>
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
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
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3.5 text-base font-medium text-brand-900 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}