"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Facebook, 
  Mail, 
  Phone, 
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NodeLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1e3a8a]">
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="12" cy="4" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="4" cy="12" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="20" cy="12" r="2" fill="currentColor" opacity="0.4" />
    <path d="M12 7V9M12 15V17M15 12H17M7 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const socialLinks = [
  {
    name: 'Facebook Protocol',
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61586397291701',
    color: 'text-[#1877F2]',
    bg: 'bg-[#1877F2]/5',
    label: 'Community & Updates'
  },
  {
    name: 'TikTok Stream',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 448 512" fill="currentColor">
        <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
      </svg>
    ),
    href: 'https://www.tiktok.com/@8kiotsolutions',
    color: 'text-zinc-900',
    bg: 'bg-zinc-100',
    label: 'Technical Briefs'
  },
  {
    name: 'Discord Secure',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 640 512" fill="currentColor">
        <path d="M524.5 448c-28.2 0-51.2-22.1-51.2-49.3s23-49.3 51.2-49.3s51.2 22.1 51.2 49.3s-23 49.3-51.2 49.3zm-359 0c-28.2 0-51.2-22.1-51.2-49.3s23-49.3 51.2-49.3s51.2 22.1 51.2 49.3s-23 49.3-51.2 49.3zM640 138.5c0-23.7-4.4-46.1-12.7-66.2c-5.8-14.1-13.8-26.2-23.8-36.2s-22.1-18-36.2-23.8C547.1 4.4 524.7 0 501 0H139C115.3 0 92.9 4.4 72.8 12.7c-14.1 5.8-26.2 13.8-36.2 23.8s-18 22.1-23.8 36.2C4.4 92.4 0 114.8 0 138.5v235c0 23.7 4.4 46.1 12.7 66.2c5.8 14.1 13.8 26.2 23.8 36.2s22.1 18 36.2 23.8C92.9 507.6 115.3 512 139 512h362c23.7 0 46.1-4.4 66.2-12.7c14.1-5.8 26.2-13.8 36.2-23.8s18-22.1 23.8-36.2c8.3-20.1 12.7-42.5 12.7-66.2v-235zm-115.5 235c0 23.7-19.2 43-43 43H158.5c-23.7 0-43-19.2-43-43v-235c0-23.7 19.2-43 43-43h323c23.7 0 43 19.2 43 43v235z"/>
      </svg>
    ),
    href: '#',
    color: 'text-[#5865F2]',
    bg: 'bg-[#5865F2]/5',
    label: 'Engineering Chat'
  }
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const email = "evangelista.agdiaz@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[150] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4 }}
              className="bg-[#FAFAFA] rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden max-w-lg w-full pointer-events-auto relative border border-zinc-300"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
              }}
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-200/50 transition-colors z-10 border border-transparent hover:border-zinc-300"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              <div className="p-10 md:p-12">
                <div className="mb-12 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-zinc-200 mb-6 relative group">
                    <div className="absolute inset-0 bg-[#1e3a8a]/5 blur-xl group-hover:bg-[#1e3a8a]/10 transition-colors rounded-full" />
                    <NodeLogo />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-950 font-poppins tracking-tight mb-3">Confirm Setup & Direct Channels</h2>
                  <p className="text-zinc-500 font-medium max-w-[280px] mx-auto leading-relaxed">Select your preferred secure protocol to establish integration Discussions</p>
                </div>

                {/* Primary Contact Action */}
                <div className="space-y-4 mb-10 text-center">
                   <a 
                     href={`mailto:${email}`}
                     className="w-full flex items-center gap-5 p-5 bg-white border border-zinc-200 border-b-[3px] rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:border-b-0 group"
                   >
                     <div className="w-12 h-12 bg-zinc-950 text-white rounded-full flex items-center justify-center group-hover:bg-[#1e3a8a] transition-colors shadow-inner">
                       <Mail className="w-5 h-5" strokeWidth={1.5} />
                     </div>
                     <div className="flex-1 text-left">
                        <span className="block text-zinc-900 font-bold text-lg leading-none">Email Gateway</span>
                        <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest mt-1">Direct Secure Line</span>
                     </div>
                   </a>

                   <button 
                     onClick={copyEmail}
                     className="w-full flex items-center gap-5 p-5 bg-white border border-zinc-200 border-b-[3px] rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:border-b-0 group text-left"
                   >
                     <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors border border-zinc-100 shadow-inner">
                       {copied ? <CheckCircle2 className="w-5 h-5 text-green-600 group-hover:text-white" /> : <Copy className="w-5 h-5 text-zinc-400 group-hover:text-white" strokeWidth={1.5} />}
                     </div>
                     <div className="flex-1">
                        <span className="block text-zinc-900 font-bold text-lg leading-none">{copied ? 'Reference Logged' : 'Copy Reference'}</span>
                        <span className="text-zinc-500 text-[10px] font-mono mt-1 opacity-60 uppercase">{email}</span>
                     </div>
                   </button>
                </div>

                {/* Social Integrations (Single List) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 text-center">Authorized Streams</span>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white border border-zinc-200 border-b-[3px] rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:border-b-0 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-zinc-50 shadow-inner transition-transform group-hover:scale-110 ${social.bg} ${social.color}`}>
                          <social.icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-900 font-bold text-sm tracking-tight">{social.name}</span>
                          <span className="text-zinc-400 text-[10px] font-medium uppercase tracking-tighter">{social.label}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-200 group-hover:text-zinc-950 transition-colors mr-2" />
                    </a>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-200 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                      <span className="text-[10px] font-bold text-zinc-900 font-poppins uppercase tracking-widest">Network Status: Online (Active Node)</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase leading-none">BUILD_VER: 8K-04-A</span>
                      <span className="text-[9px] font-mono text-zinc-300 uppercase leading-none mt-1">NODE_LOC: [MNL_PH/SEC_01]</span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
