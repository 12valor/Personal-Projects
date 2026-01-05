"use client";
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 fade-in-0 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Terms of Service
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed custom-scrollbar">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using Critique, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. User Accounts</h3>
            <p>
              To access certain features of the platform, you may be required to create an account using a third-party authentication provider (Google, GitHub, etc.). You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Content and Conduct</h3>
            <p>
              Users are solely responsible for the content they submit. By posting content, you grant us a non-exclusive license to display, modify, and distribute said content on our platform. You agree not to post content that is illegal, abusive, or violates the rights of others.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Termination</h3>
            <p>
              We reserve the right to terminate your access to the site, without any advance notice, for conduct that we believe violates these Terms or is harmful to other users of the site, us, or third parties, or for any other reason.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Disclaimer</h3>
            <p>
              The materials on Critique's website are provided on an 'as is' basis. Critique makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold transition-transform active:scale-[0.98] hover:opacity-90"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};