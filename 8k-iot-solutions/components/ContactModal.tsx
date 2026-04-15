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
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61586397291701',
    color: 'text-[#1877F2]',
  },
  {
    name: 'TikTok',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 448 512" fill="currentColor">
        <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
      </svg>
    ),
    href: 'https://www.tiktok.com/@8kiotsolutions',
    color: 'text-zinc-900',
  },
  {
    name: 'Discord',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 640 512" fill="currentColor">
        <path d="M524.5 448c-28.2 0-51.2-22.1-51.2-49.3s23-49.3 51.2-49.3s51.2 22.1 51.2 49.3s-23 49.3-51.2 49.3zm-359 0c-28.2 0-51.2-22.1-51.2-49.3s23-49.3 51.2-49.3s51.2 22.1 51.2 49.3s-23 49.3-51.2 49.3zM640 138.5c0-23.7-4.4-46.1-12.7-66.2c-5.8-14.1-13.8-26.2-23.8-36.2s-22.1-18-36.2-23.8C547.1 4.4 524.7 0 501 0H139C115.3 0 92.9 4.4 72.8 12.7c-14.1 5.8-26.2 13.8-36.2 23.8s-18 22.1-23.8 36.2C4.4 92.4 0 114.8 0 138.5v235c0 23.7 4.4 46.1 12.7 66.2c5.8 14.1 13.8 26.2 23.8 36.2s22.1 18 36.2 23.8C92.9 507.6 115.3 512 139 512h362c23.7 0 46.1-4.4 66.2-12.7c14.1-5.8 26.2-13.8 36.2-23.8s18-22.1 23.8-36.2c8.3-20.1 12.7-42.5 12.7-66.2v-235zm-115.5 235c0 23.7-19.2 43-43 43H158.5c-23.7 0-43-19.2-43-43v-235c0-23.7 19.2-43 43-43h323c23.7 0 43 19.2 43 43v235z"/>
      </svg>
    ),
    href: '#',
    color: 'text-[#5865F2]',
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] z-[150] cursor-pointer"
          />

          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.99, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: 8 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full pointer-events-auto relative border border-zinc-200 flex flex-col md:flex-row h-auto max-h-[90vh]"
            >
              {/* Main Column */}
              <div className="flex-1 p-8 md:p-10 border-r border-zinc-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-950 tracking-tight leading-none">Confirm Setup</h2>
                    <p className="text-xs text-zinc-400 font-medium mt-1">Direct Channels & Protocols</p>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
                    Select your preferred secure protocol to establish integration discussions with our engineering team.
                  </p>

                  {/* Primary Standout Card */}
                  <a 
                    href={`mailto:${email}`}
                    className="group relative block p-6 bg-zinc-950 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="flex items-start justify-between">
                       <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 text-white group-hover:bg-[#1e3a8a] transition-colors">
                         <Mail size={24} strokeWidth={1.5} />
                       </div>
                       <ExternalLink size={14} className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                    <span className="block text-white font-bold text-xl mb-1 tracking-tight">Email Gateway</span>
                    <span className="block text-white/50 text-xs font-mono">{email}</span>
                    
                    {/* Visual Accent */}
                    <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a] shadow-[0_0_12px_#1e3a8a]" />
                    </div>
                  </a>

                  <button 
                    onClick={copyEmail}
                    className="mt-4 w-full flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg transition-all hover:border-zinc-300 hover:bg-zinc-100 group"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-md border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                           {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                        </div>
                        <span className="text-sm font-bold text-zinc-700">{copied ? 'Reference Logged' : 'Copy Reference'}</span>
                     </div>
                     <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">protocol_ref_v1</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Connection</span>
                  </div>
                  <button onClick={onClose} className="text-[10px] font-bold text-zinc-950 uppercase tracking-widest hover:text-[#1e3a8a] transition-colors">Close Portal</button>
                </div>
              </div>

              {/* Compact Sidebar */}
              <div className="w-full md:w-64 bg-zinc-50/50 p-8 flex flex-col justify-between border-t md:border-t-0 border-zinc-100">
                 <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] block mb-6 px-1">Social Streams</span>
                    <div className="space-y-2">
                      {socialLinks.map((social) => (
                        <a 
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all group"
                        >
                           <social.icon size={16} className={`${social.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                           <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-950 transition-colors">{social.name}</span>
                        </a>
                      ))}
                    </div>
                 </div>

                 <div className="mt-12 space-y-4">
                    <div className="p-4 bg-white border border-zinc-200 rounded-lg">
                       <span className="text-[9px] font-bold text-zinc-300 uppercase block mb-2">Technical Metadata</span>
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-mono text-zinc-400">BUILD</span>
                             <span className="text-[9px] font-mono text-zinc-600">8K-04-A</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-mono text-zinc-400">NODE</span>
                             <span className="text-[9px] font-mono text-zinc-600">MNL_PH/01</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-mono text-zinc-400">LATENCY</span>
                             <span className="text-[9px] font-mono text-zinc-600">22ms</span>
                          </div>
                       </div>
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
