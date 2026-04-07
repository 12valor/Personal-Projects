import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | 8K IoT Solutions',
  description: 'Formal privacy policy governing the data practices of 8K IoT Solutions.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 antialiased">
      <div className="max-w-3xl mx-auto px-8 pt-24 pb-32">
        {/* Simple Navigation */}
        <nav className="mb-16">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
          >
            ← Back to Home
          </Link>
        </nav>

        {/* Document Header */}
        <header className="mb-16 border-b border-zinc-100 pb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900">
            Privacy Policy
          </h1>
          <div className="flex flex-col gap-1 text-sm text-zinc-500 font-medium">
            <span>Effective Date: April 7, 2026</span>
            <span>Last Updated: April 7, 2026</span>
          </div>
        </header>

        {/* Document Content */}
        <div className="space-y-12 text-zinc-600 leading-relaxed text-[15px]">
          <section>
            <p className="mb-6">
              This Privacy Policy (the &quot;Policy&quot;) outlines the practices of 8K IoT Solutions (&quot;the Studio&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) regarding the collection, use, and disclosure of personal information provided by users (&quot;you&quot; or &quot;your&quot;) through our website and professional service engagements.
            </p>
            <p>
              By accessing our services, you acknowledge and agree to the terms set forth in this document.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-6 underline decoration-zinc-100 underline-offset-8">1.0 Information Collection</h2>
            <div className="space-y-4">
              <p>
                We collect information necessary for the provision of hardware and software development services. This include:
              </p>
              <ul className="list-none space-y-3 pl-0 border-l border-zinc-100 pl-6 ml-1">
                <li><span className="font-bold text-zinc-800">1.1 Identity Data:</span> Full names and professional titles.</li>
                <li><span className="font-bold text-zinc-800">1.2 Contact Data:</span> Email addresses and communication logs.</li>
                <li><span className="font-bold text-zinc-800">1.3 Project Data:</span> Technical specifications, hardware constraints, and software requirements provided during consultations.</li>
                <li><span className="font-bold text-zinc-800">1.4 Technical Data:</span> Internet Protocol (IP) addresses, browser types, and usage patterns for security and performance auditing.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-6 underline decoration-zinc-100 underline-offset-8">2.0 Use of Information</h2>
            <p className="mb-4">
              Your data is processed solely for the following professional purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Facilitating hardware prototyping and software development cycles.</li>
              <li>Responding to specific inquiries regarding IoT integrations.</li>
              <li>Maintaining project security and preventing unauthorized access to development environments.</li>
              <li>Ensuring compliance with statutory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-6 underline decoration-zinc-100 underline-offset-8">3.0 Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption and physical security measures to protect your data from unauthorized disclosure. Access to project-related information is restricted to authorized personnel directly involved in the service delivery. However, no method of transmission over the internet or electronic storage is 100% secure; thus, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-6 underline decoration-zinc-100 underline-offset-8">4.0 Disclosure to Third Parties</h2>
            <p>
              8K IoT Solutions does not sell or lease personal data to third-party marketing entities. Information may be shared with trusted service providers (e.g., cloud hosting or component vendors) strictly as required to fulfill project deliverables, provided such parties adhere to equivalent confidentiality standards.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-6 underline decoration-zinc-100 underline-offset-8">5.0 Governing Law & Jurisdiction</h2>
            <p>
              This Policy shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising from or relating to the subject matter of this Policy shall be subject to the exclusive jurisdiction of the courts located in Talisay City, Negros Occidental.
            </p>
          </section>

          <section className="pt-12 border-t border-zinc-100">
            <h2 className="text-zinc-900 font-bold uppercase tracking-wider text-xs mb-4">Contact Information</h2>
            <p className="text-sm">
              For legal inquiries or data access requests, please contact:<br />
              <span className="font-bold text-zinc-900">8K IoT Solutions Legal Desk</span><br />
              Email: iotsolutions0@gmail.com<br />
              Location: Talisay City, Negros Occidental, PH
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
