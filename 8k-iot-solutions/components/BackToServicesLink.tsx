'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToServicesLink() {
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the user came from the home page, we want to slide back to the services section
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingSectionScroll', 'services');
    }
  };

  return (
    <Link 
      href="/" 
      onClick={handleBack}
      className="group inline-flex items-center text-sm font-poppins font-medium text-zinc-400 hover:text-zinc-800 transition-colors mb-4 -ml-1 py-2 px-1 min-h-[44px] min-w-[44px]"
    >
      <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-0.5" />
      Back to Services
    </Link>
  );
}
