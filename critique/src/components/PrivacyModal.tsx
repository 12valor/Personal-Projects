"use client";
import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
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
            Privacy Policy
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Introduction</h3>
            <p>
              Welcome to Critique. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. The Data We Collect</h3>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> includes first name, last name, username, or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, login data, browser type and version.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. How We Use Your Data</h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to register you as a new customer, manage our relationship with you, and improve our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Data Security</h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Third-Party Links</h3>
            <p>
              This website may include links to third-party websites, plug-ins and applications (such as Google or GitHub authentication). Clicking on those links or enabling those connections may allow third parties to collect or share data about you.
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