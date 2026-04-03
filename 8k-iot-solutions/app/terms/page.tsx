import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Gavel, Scale, AlertTriangle, Cloud, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - 8K IoT Solutions',
  description: 'The terms and conditions governing your use of 8K IoT Solutions services.',
};

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen bg-white font-poppins selection:bg-brand-100">
      {/* Blueprint grid background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-900 transition-colors mb-12 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full text-white mb-6">
            <Gavel size={20} />
            <span className="text-sm font-semibold tracking-tight uppercase px-1">Service Protocols</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            By accessing or using the services provided by 8K IoT Solutions, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <div className="h-1 w-24 bg-slate-900 mt-8 rounded-full" />
        </header>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg text-brand-900">
                <Scale size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Acceptance of Terms</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed">
              <p>
                8K IoT Solutions ("we," "us," or "our") provides hardware and software project services. Your access to and use of our website and services is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg text-brand-900">
                <Cloud size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Professional Services</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed">
              <p>
                Our services include the design, prototyping, and development of IoT solutions. Projects are handled based on individual agreements. While we strive for technical excellence, project timelines and deliverables are subject to the specific scope defined during the consultation phase.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg text-brand-900">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">User Conduct</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              You agree not to use our services for any purpose that is unlawful or prohibited by these terms. You may not use the Service in any manner that could damage, disable, overburden, or impair the Service or interfere with any other party's use and enjoyment of the Service.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg text-brand-900">
                <MessageSquare size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Intellectual Property</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of 8K IoT Solutions and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of 8K IoT Solutions.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-brand-50 rounded-lg text-brand-900">
                <Gavel size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Termination</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400 italic">
              Last updated: April 3, 2026. Continued use of 8K IoT Solutions signifies your agreement to these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
