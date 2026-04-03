'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide Footer on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
