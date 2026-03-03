import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* --- Left Column: Narrative --- */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-brand-600"></div>
              <h3 className="text-brand-600 font-semibold tracking-[0.2em] text-xs uppercase font-poppins">
                About 8K Solutions
              </h3>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 font-poppins leading-[1.15] tracking-tight">
              Bridging the gap between <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">physical hardware</span> and digital insights.
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-sans font-light">
              We are a specialized engineering team dedicated to building scalable, responsive IoT ecosystems. From custom microcontroller integration to enterprise-grade web dashboards, we transform raw environmental and operational data into actionable business intelligence.
            </p>
            
            <div className="h-px w-full bg-gray-100 mb-10"></div>
            
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              <div>
                <p className="text-4xl font-bold text-gray-900 font-poppins mb-1">Precision</p>
                <p className="text-sm text-gray-500 font-sans tracking-wide">Prototyping & Circuits</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
              <div>
                <p className="text-4xl font-bold text-gray-900 font-poppins mb-1">Real-time</p>
                <p className="text-sm text-gray-500 font-sans tracking-wide">Data Web Dashboards</p>
              </div>
            </div>
          </div>

          {/* --- Right Column: Feature Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-50 rounded-full blur-3xl opacity-50 -z-10"></div>

            {/* Feature Card 1 */}
            <div className="p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:border-brand-200 group-hover:bg-brand-50 transition-colors duration-300">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Custom Hardware</h4>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">Arduino-based microcontroller integration and specialized circuitry design.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group sm:mt-8">
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:border-brand-200 group-hover:bg-brand-50 transition-colors duration-300">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Web Analytics</h4>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">Responsive digital dashboards translating raw data into clear UI metrics.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:border-brand-200 group-hover:bg-brand-50 transition-colors duration-300">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6v6.75H18" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Sensor Networks</h4>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">Reliable environmental and operational data capture at scale.</p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group sm:mt-8">
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:border-brand-200 group-hover:bg-brand-50 transition-colors duration-300">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Automated Systems</h4>
              <p className="text-sm text-gray-600 font-sans leading-relaxed">Relay controls and automated processing driven by real-time hardware triggers.</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}