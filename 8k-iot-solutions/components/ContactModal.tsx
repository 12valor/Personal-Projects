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

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61586397291701',
    color: 'hover:text-[#1877F2]',
    bg: 'hover:bg-[#1877F2]/10',
    label: 'Like & Follow'
  },
  {
    name: 'TikTok',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 448 512" fill="currentColor">
        <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
      </svg>
    ),
    href: 'https://www.tiktok.com/@8kiotsolutions',
    color: 'hover:text-black',
    bg: 'hover:bg-black/5',
    label: 'Watch our clips'
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
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[150] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-lg w-full pointer-events-auto relative border border-zinc-200"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-md hover:bg-zinc-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950" />
              </button>

              <div className="p-10">
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Communication Node</span>
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-950 font-poppins tracking-tight">Direct Channels</h2>
                  <p className="text-zinc-500 mt-2 font-medium">Select a protocol to initiate integration discussions.</p>
                </div>

                {/* Main Contact Action */}
                <div className="grid grid-cols-1 gap-px bg-zinc-100 border border-zinc-100 rounded-md overflow-hidden mb-10">
                   <a 
                     href={`mailto:${email}`}
                     className="group flex items-center gap-5 p-6 bg-white transition-all duration-300 hover:bg-zinc-50"
                   >
                     <div className="w-12 h-12 bg-zinc-950 text-white rounded-md flex items-center justify-center group-hover:bg-[#1e3a8a] transition-colors">
                       <Mail className="w-5 h-5" strokeWidth={1.5} />
                     </div>
                     <div className="flex-1">
                        <span className="block text-zinc-900 font-bold text-lg leading-none">Email Gateway</span>
                        <span className="text-zinc-400 text-xs font-medium">evangelista.agdiaz@gmail.com</span>
                     </div>
                     <ExternalLink className="w-4 h-4 text-zinc-200 group-hover:text-zinc-400" />
                   </a>

                   <button 
                     onClick={copyEmail}
                     className="group flex items-center gap-5 p-6 bg-white transition-all duration-300 hover:bg-zinc-50 text-left"
                   >
                     <div className="w-12 h-12 bg-zinc-50 rounded-md flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                       {copied ? <CheckCircle2 className="w-5 h-5 text-green-600 group-hover:text-white" /> : <Copy className="w-5 h-5 text-zinc-500 group-hover:text-white" strokeWidth={1.5} />}
                     </div>
                     <div className="flex-1">
                        <span className="block text-zinc-900 font-bold text-lg leading-none">{copied ? 'Reference Copied' : 'Copy Reference'}</span>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Copy to Clipboard</span>
                     </div>
                   </button>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 border-b border-zinc-100 pb-2">Social Integrations</span>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-md border border-zinc-100 transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-200 group"
                      >
                        <social.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#1e3a8a] transition-colors" strokeWidth={1.5} />
                        <span className="text-zinc-900 font-bold text-sm tracking-tight">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Active</span>
                   </div>
                   <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">TS-8K-MOD-04</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
