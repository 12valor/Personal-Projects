import Link from 'next/link';
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-panel border-t border-border mt-auto">
      <div className="max-w-[1920px] mx-auto px-6 py-16 md:py-24">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* COL 1: BRAND */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6 w-fit">
              <div className="w-8 h-6 bg-ytRed rounded-lg flex items-center justify-center shadow-yt-glow group-hover:scale-105 transition-transform">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
              <span className="font-black tracking-tighter text-xl uppercase italic text-foreground">Critique.</span>
            </Link>
            <p className="text-gray-500 font-medium max-w-sm text-sm leading-relaxed">
              The honest feedback loop for creators. Stop guessing why your retention drops. Get brutal, timestamped critiques from the community.
            </p>
          </div>

          {/* COL 2: PLATFORM */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <Link href="/" className="hover:text-ytRed transition-colors">Live Feed</Link>
              </li>
              <li>
                <Link href="/?filter=mixed" className="hover:text-ytRed transition-colors">Video Uploads</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-ytRed transition-colors">Creator Dashboard</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-ytRed transition-colors">Admin Access</Link>
              </li>
            </ul>
          </div>

          {/* COL 3: LEGAL & SOCIAL */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Connect</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li>
                <a href="#" className="hover:text-ytRed transition-colors">Twitter / X</a>
              </li>
              <li>
                <a href="#" className="hover:text-ytRed transition-colors">Discord Community</a>
              </li>
              <li>
                <a href="#" className="hover:text-ytRed transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-ytRed transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-gray-500 uppercase">
            © {new Date().getFullYear()} Critique. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};