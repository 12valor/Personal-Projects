'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide Navbar on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
