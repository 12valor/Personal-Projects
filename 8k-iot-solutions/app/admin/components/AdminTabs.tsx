'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Star, 
  Image as ImageIcon, 
  Settings, 
  Layers,
  LogOut,
  ChevronRight,
  HelpCircle,
  User,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../actions';

export default function AdminNavigation() {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === '/admin/login') return null;

  const menuItems = [
    { name: 'Projects', href: '/admin', icon: LayoutDashboard },
    { name: 'Inquiries', href: '/admin/transmissions', icon: MessageSquare },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'School Logos', href: '/admin/school-logos', icon: ImageIcon },
    { name: 'Hero Settings', href: '/admin/hero-settings', icon: Settings },
    { name: 'Hero Cards', href: '/admin/hero-cards', icon: Layers },
    { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    { name: 'Team', href: '/admin/team', icon: User },
    { name: 'Products', href: '/admin/products', icon: Package },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64 fixed left-0 top-0 z-50">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
           <span className="text-white font-black text-sm">8K</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-900 leading-none">Admin Portal</span>
          <span className="text-[10px] text-zinc-400 font-medium mt-1">v1.2.4 • Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = 
            (item.href === '/admin' && pathname === '/admin') || 
            (item.href !== '/admin' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-nav-indicator">
                  <ChevronRight className="w-3 h-3 text-white/50" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User / Logout */}
      <div className="p-4 border-t border-zinc-100">
         <form action={logout}>
           <button 
             type="submit"
             className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
           >
             <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-500" />
             <span className="text-sm font-semibold tracking-tight">Sign Out</span>
           </button>
         </form>
      </div>
    </div>
  );
}
