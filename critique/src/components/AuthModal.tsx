"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { TermsModal } from './TermsModal';
import { PrivacyModal } from './PrivacyModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- PROVIDER ICONS (Fixed Google Colors) ---
const ProviderIcons = {
  Google: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  ),
  GitHub: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
};

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);
      setErrorMsg(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Authentication failed');
      setLoadingProvider(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
        {/* Backdrop with Blur */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-sm bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl p-8 animate-in zoom-in-95 fade-in-0 duration-200">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to continue to Critique.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* GOOGLE - FIXED COLOR */}
            <button
              onClick={() => handleLogin('google')}
              disabled={!!loadingProvider}
              className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-white font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loadingProvider === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"/>
              ) : (
                <div className="shrink-0"><ProviderIcons.Google /></div>
              )}
              <span>Continue with Google</span>
            </button>

            {/* GITHUB */}
            <button
              onClick={() => handleLogin('github')}
              disabled={!!loadingProvider}
              className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-white font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loadingProvider === 'github' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin"/>
              ) : (
                <div className="text-[#333] dark:text-white shrink-0"><ProviderIcons.GitHub /></div>
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="mt-8 text-center px-2">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <button 
                onClick={() => setShowTerms(true)}
                className="hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer underline transition-colors"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button 
                onClick={() => setShowPrivacy(true)}
                className="hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer underline transition-colors"
              >
                Privacy Policy
              </button>.
            </p>
          </div>
        </div>
      </div>

      {/* RENDER MODALS */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
};