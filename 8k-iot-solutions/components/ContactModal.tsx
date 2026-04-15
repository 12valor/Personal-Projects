"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FacebookSolid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 320 512" fill="currentColor">
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
  </svg>
);

const TikTokSolid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor">
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
  </svg>
);

const EmailSolid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 8.67l8.92 5.9c.95.63 2.21.63 3.16 0l8.92-5.9V18c0 1.1-.9 2-2 2H3.5c-1.1 0-2-.9-2-2V8.67zM3.5 4h17c1.1 0 2 .9 2 2v.42l-9.67 6.4c-.5.33-1.16.33-1.66 0L1.5 6.42V6c0-1.1.9-2 2-2z"/>
  </svg>
);

const FormSolid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M17,11h-4v4h-2v-4H7V9h4V5h2v4h4V11z"/>
  </svg>
);

const socialLinks = [
  {
    name: 'Facebook',
    icon: FacebookSolid,
    href: 'https://www.facebook.com/profile.php?id=61586397291701',
    color: 'text-[#1877F2]',
    hoverBg: 'hover:bg-[#1877F2]/10',
    hoverBorder: 'hover:border-[#1877F2]/20',
  },
  {
    name: 'TikTok',
    icon: TikTokSolid,
    href: 'https://www.tiktok.com/@8kiotsolutions',
    color: 'text-zinc-950',
    hoverBg: 'hover:bg-zinc-100',
    hoverBorder: 'hover:border-zinc-200',
  },
  {
    name: 'Email',
    icon: EmailSolid,
    href: 'mailto:iotsolutions0@gmail.com',
    color: 'text-[#1e3a8a]',
    hoverBg: 'hover:bg-[#1e3a8a]/10',
    hoverBorder: 'hover:border-[#1e3a8a]/60',
  },
  {
    name: 'Form',
    icon: FormSolid,
    href: '/contact',
    color: 'text-[#1e3a8a]',
    hoverBg: 'hover:bg-[#1e3a8a]/10',
    hoverBorder: 'hover:border-[#1e3a8a]/60',
  }
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-[6px] z-[150] cursor-pointer"
          />

          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none font-poppins">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="bg-white rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden max-w-[440px] w-full pointer-events-auto relative border border-zinc-200 p-10"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-xl hover:bg-zinc-100 transition-all duration-200 active:scale-95 z-10"
                aria-label="Close modal"
              >
                <X size={20} className="text-zinc-400 hover:text-zinc-950 transition-colors" />
              </button>

              <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight leading-none pr-10">Connect with us</h2>
                <p className="text-zinc-500 text-base font-medium">Interested in this product? Get in touch below.</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-4 p-7 rounded-[24px] border border-zinc-100 transition-all duration-200 group ${social.hoverBg} ${social.hoverBorder} hover:-translate-y-[2px]`}
                  >
                    <div className={`w-14 h-14 flex items-center justify-center transition-all duration-300 ${social.color}`}>
                      <social.icon className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-950 transition-colors uppercase tracking-[0.14em] leading-none">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
