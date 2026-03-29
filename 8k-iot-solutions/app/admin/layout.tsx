'use client';

import { usePathname } from 'next/navigation';
import AdminNavigation from './components/AdminTabs';

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-zinc-100/50 font-poppins selection:bg-zinc-900 selection:text-white">
      {/* Sidebar - Hidden on Login */}
      <AdminNavigation />
      
      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${!isLoginPage ? 'lg:pl-64' : ''}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 ${!isLoginPage ? 'min-h-screen' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
