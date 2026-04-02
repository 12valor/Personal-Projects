"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const FooterLink = ({ href, children, sectionId }: { href: string; children: React.ReactNode; sectionId?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

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
    <div 
      className="relative group w-fit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href={href}
        onClick={handleClick}
        className={`relative z-10 px-3 py-1.5 -ml-3 font-poppins text-[13.5px] transition-all duration-300 block ${isHovered ? 'text-brand-900 font-normal' : 'text-slate-500 font-normal'}`}
      >
        {children}
      </a>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="footer-pill"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="absolute inset-0 bg-slate-100/80 rounded-full -z-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white pt-20 pb-10 overflow-hidden z-0 font-sans border-t border-slate-100">
      
      {/* ----- ENGINEERED BACKGROUND ----- */}
      {/* Technical blueprint-inspired dot matrix background */}
      <div 
        className="absolute inset-0 z-[-2] opacity-[0.06]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ----- INTEGRATED FOOTER CONTENT ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 pt-4 pb-16">
          
          {/* ----- LEFT: Brand Logo & Mission & Socials ----- */}
          <div className="lg:col-span-2 flex flex-col space-y-7">
            
            {/* Logo Link to Top */}
            <div 
              className="group cursor-pointer w-fit"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative h-10 w-[120px] transition-transform duration-300 group-hover:scale-[1.02]">
                <Image 
                  src="/8k.png" 
                  alt="8K IoT Solutions Logo"
                  fill
                  className="object-contain object-left"
                  sizes="120px"
                />
              </div>
            </div>

            <p className="font-poppins text-[14px] text-slate-500 leading-relaxed max-w-sm">
              Hardware precision meets software intelligence. We architect custom, scalable IoT ecosystems designed to connect the physical world to actionable digital insights.
            </p>

            {/* Social Icons - Syncing with NAV Bar Icons */}
            <div className="flex items-center gap-5 pt-2">
              {[
                { icon: Twitter, href: "https://x.com/8kiotsolutions", label: "X" },
                { icon: Instagram, href: "https://www.facebook.com/profile.php?id=61586397291701", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/8k-iot-solutions", label: "LinkedIn" },
                { icon: Github, href: "https://www.tiktok.com/@8kiotsolutions", label: "GitHub" },
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-slate-400 hover:text-brand-900 transition-colors duration-200"
                >
                  <social.icon size={19} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* ----- RIGHT: Navigation Columns ----- */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-4 ml-0 lg:ml-auto">
            
            {/* Studio Sections */}
            <div className="flex flex-col space-y-5">
              <h3 className="font-sans font-bold text-slate-900 text-[14px] tracking-tight uppercase opacity-90">
                Studio
              </h3>
              <nav className="flex flex-col space-y-3">
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'Client Reviews', id: 'testimonials' },
                  { name: 'Technical FAQ', id: 'faq' }
                ].map((item) => (
                  <FooterLink key={item.name} href={`#${item.id}`} sectionId={item.id}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </div>

            {/* Service & Context */}
            <div className="flex flex-col space-y-5">
              <h3 className="font-sans font-bold text-slate-900 text-[14px] tracking-tight uppercase opacity-90">
                Services
              </h3>
              <nav className="flex flex-col space-y-3">
                {[
                  { name: 'Hardware Solutions', id: 'services' },
                  { name: 'Software & Web', id: 'services' },
                  { name: 'About the Studio', id: 'about' },
                  { name: 'Meet the Team', id: 'team' }
                ].map((item) => (
                  <FooterLink key={item.name} href={`#${item.id}`} sectionId={item.id}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </div>

            {/* Support/Resource Sections */}
            <div className="flex flex-col space-y-5">
              <h3 className="font-sans font-bold text-slate-900 text-[14px] tracking-tight uppercase opacity-90">
                Connect
              </h3>
              <nav className="flex flex-col space-y-3">
                {[
                  { name: 'Start a Project', id: 'contact' },
                  { name: 'Hardware Projects', id: '', href: '/projects/hardware' },
                  { name: 'Software Projects', id: '', href: '/projects/software' },
                  { name: 'Email Support', id: '', href: 'mailto:8kiotsolutions@gmail.com' },
                ].map((item) => (
                  <FooterLink key={item.name} href={item.href || `#${item.id}`} sectionId={item.id}>
                    {item.name}
                  </FooterLink>
                ))}
              </nav>
            </div>

          </div>

        </div>

        {/* ----- BOTTOM: COPYRIGHT & LEGAL ----- */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-10">
          <p className="font-poppins text-[12px] text-slate-400">
            &copy; {currentYear} 8K IoT Solutions. All rights reserved. Negros Occidental, Talisay City.
          </p>
          <div className="font-poppins text-[12px] text-slate-400 flex gap-6 sm:gap-10">
            <a href="#" className="hover:text-brand-900 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-brand-900 transition-colors duration-200 underline underline-offset-4 decoration-slate-200 hover:decoration-brand-300">Terms of Service</a>
            <a href="#" className="hover:text-brand-900 transition-colors duration-200">System Logs</a>
          </div>
        </div>

      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;