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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full pointer-events-auto relative border border-white"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                 <Mail size={120} />
              </div>

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-zinc-950 font-poppins tracking-tight">Let's build together</h2>
                  <p className="text-zinc-500 mt-2 font-medium">Connect with us on your preferred platform.</p>
                </div>

                {/* Main Contact Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                   <a 
                     href={`mailto:${email}`}
                     className="group flex flex-col p-5 bg-zinc-900 rounded-2xl transition-all duration-300 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-200"
                   >
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <Mail className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-white font-bold text-lg mb-1">Email Us</span>
                     <span className="text-zinc-400 text-xs">Direct Inquiry</span>
                   </a>

                   <button 
                     onClick={copyEmail}
                     className="group flex flex-col p-5 bg-white border border-zinc-200 rounded-2xl transition-all duration-300 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-100 text-left"
                   >
                     <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-zinc-900" />}
                     </div>
                     <span className="text-zinc-900 font-bold text-lg mb-1">{copied ? 'Copied!' : 'Copy Email'}</span>
                     <span className="text-zinc-400 text-xs">{email}</span>
                   </button>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4">Social Presence</span>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-4 rounded-2xl border border-zinc-100 transition-all duration-300 group ${social.bg}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-50 transition-colors group-hover:bg-white ${social.color}`}>
                          <social.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-900 font-bold tracking-tight">{social.name}</span>
                          <span className="text-zinc-400 text-xs">{social.label}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-200 group-hover:text-zinc-400 transition-colors" />
                    </a>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Usually responds within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
