import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - 8K IoT Solutions',
  description: 'How we handle your data and protect your privacy at 8K IoT Solutions.',
};

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-50 rounded-full text-brand-700 mb-6 border border-brand-100">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold tracking-tight uppercase px-1">Legal Oversight</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            At 8K IoT Solutions, we are committed to protecting your personal information and your right to privacy. This policy outlines our data practices.
          </p>
          <div className="h-1 w-24 bg-brand-900 mt-8 rounded-full" />
        </header>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
                <Lock size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Data Collection</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed">
              <p>
                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on our website (such as filling out a contact form), or otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-6">
                <li>Personal identifiers (name, email address, phone number).</li>
                <li>Professional information related to your hardware or software project.</li>
                <li>Technical data such as IP addresses, browser types, and device information.</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
                <Eye size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">How We Use Your Information</h2>
            </div>
            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed">
              <p>
                We use personal information collected via our website for a variety of business purposes described below:
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-6">
                <li>To provide and deliver the services you request.</li>
                <li>To respond to user inquiries and offer project support.</li>
                <li>To send administrative information, such as project updates or policy changes.</li>
                <li>To protect our services and prevent fraudulent activity.</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
                <FileText size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Cookies and Tracking</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy. We use performance and analytical cookies to understand how visitors interact with our website to improve our IoT project showcases.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
                <Bell size={22} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Updates to This Policy</h2>
            </div>
            <p className="text-slate-500 leading-relaxed">
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400 italic">
              Last updated: April 3, 2026. For any questions regarding this policy, please contact us at 8kiotsolutions@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
