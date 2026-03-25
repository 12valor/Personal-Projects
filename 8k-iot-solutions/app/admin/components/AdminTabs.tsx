'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Projects', href: '/admin' },
    { name: 'Inquiries', href: '/admin/transmissions' },
    { name: 'Testimonials', href: '/admin/testimonials' },
    { name: 'School Logos', href: '/admin/school-logos' },
    { name: 'Hero', href: '/admin/hero' },
  ];

  return (
    <div className="border-b border-zinc-200 mb-8">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          // Exact match for /admin, startsWith for other paths like /admin/transmissions
          const isActive = 
            (tab.href === '/admin' && pathname === '/admin') || 
            (tab.href !== '/admin' && pathname?.startsWith(tab.href));

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
