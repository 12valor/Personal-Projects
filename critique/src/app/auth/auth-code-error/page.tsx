"use client";
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-black text-ytRed uppercase italic tracking-tighter">
          Login Failed
        </h1>
        <p className="text-gray-500 font-medium">
          There was an issue authenticating with Google. This usually happens because of a cookie mismatch or a stale session.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-foreground text-background font-black px-8 py-4 uppercase tracking-widest hover:bg-ytRed hover:text-white transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}