'use client';

import { useRouter } from 'next/navigation';

export default function BackToServicesButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    sessionStorage.setItem('pendingSectionScroll', 'services');
    router.push('/');
  };

  const defaultStyles = "inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors mb-6 cursor-pointer";
  
  return (
    <a 
      href="/services" 
      onClick={handleBack} 
      className={className || defaultStyles}
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Services
    </a>
  );
}
