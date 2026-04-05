"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FooterLink = ({ href, children, sectionId, target, rel }: { href: string; children: React.ReactNode; sectionId?: string; target?: string; rel?: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (sectionId) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="w-fit">
      <a 
        href={href}
        onClick={handleClick}
        target={target}
        rel={rel}
        className="relative text-[14px] text-slate-500 font-sans transition-all duration-300 hover:text-brand-600 hover:-translate-y-0.5 flex items-center group py-1"
      >
        {children}
        <span className="absolute -bottom-0 left-0 w-0 h-[1px] bg-brand-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
      </a>
    </div>
  );
};

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#f8fafc] pt-20 pb-10 overflow-hidden z-0 font-sans border-t border-slate-200">
      
      {/* ----- BACKGROUND EFFECTS ----- */}
      {/* Faint white/grey textured surface grid for light mode depth */}
      <div 
        className="absolute inset-0 z-[-2] opacity-60" 
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ----- INTEGRATED FOOTER CONTENT ----- */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-16 pt-6 pb-16">
          
          {/* ----- LEFT: Company Info ----- */}
          <div className="flex flex-col space-y-6 max-w-sm">
            
            {/* Logo Wrapper */}
            <div 
              className="group cursor-pointer w-fit"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative h-11 w-[130px] transition-transform duration-300 group-hover:scale-[1.02]">
                <Image 
                  src="/8k.png" 
                  alt="8K IoT Solutions Logo"
                  fill
                  className="object-contain object-left"
                  sizes="130px"
                />
              </div>
            </div>

            <p className="text-slate-600 text-[14px] leading-relaxed font-sans">
              Engineering scalable IoT ecosystems to connect the physical world with actionable digital intelligence.
            </p>

          </div>

          {/* ----- RIGHT: Custom Navigation ----- */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 lg:ml-auto">
            
            {/* Menu */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wide">
                MENU
              </h3>
              <nav className="flex flex-col space-y-3">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="#contact" sectionId="contact">Contact</FooterLink>
                <FooterLink href="#services" sectionId="services">Services</FooterLink>
              </nav>
            </div>

            {/* Projects */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wide">
                PROJECTS
              </h3>
              <nav className="flex flex-col space-y-3">
                <FooterLink href="/projects/hardware">Hardware</FooterLink>
                <FooterLink href="/projects/software">Software</FooterLink>
              </nav>
            </div>

            {/* Socials */}
            <div className="flex flex-col space-y-6">
              <h3 className="font-sans font-bold text-slate-800 text-[13px] uppercase tracking-wide">
                SOCIALS
              </h3>
              <nav className="flex flex-col space-y-3">
                <FooterLink href="https://www.facebook.com/profile.php?id=61586397291701" target="_blank" rel="noopener noreferrer">Facebook</FooterLink>
                <FooterLink href="https://www.tiktok.com/@8kiotsolutions" target="_blank" rel="noopener noreferrer">TikTok</FooterLink>
              </nav>
            </div>

          </div>

        </div>

        {/* ----- BOTTOM: COPYRIGHT & LEGAL ----- */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200 pt-8 pb-2">
          
          <div className="flex text-center text-[13px] text-slate-500 font-sans">
            <p>
              &copy; {currentYear} 8K IoT Solutions. All rights reserved. <span className="mx-2 filter opacity-50">|</span> Negros Occidental, Talisay City.
            </p>
          </div>

          <div className="font-sans text-[13px] text-slate-500 flex items-center justify-center">
            <div className="flex items-center">
              <Link href="/privacy" className="hover:text-slate-800 transition-colors duration-200">Privacy Policy</Link>
              <span className="mx-4 filter opacity-50">|</span>
              <Link href="/terms" className="hover:text-slate-800 transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;