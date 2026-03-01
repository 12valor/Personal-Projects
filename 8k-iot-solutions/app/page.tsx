import Image from "next/image";

export default function Home() {
  return (
    <div className="relative">
      
      {/* HERO SECTION */}
      <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Replace with your actual hero image in the public folder */}
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-900/40" />
        </div>

        {/* Hero Content container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center">
          
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Engineering the Future of <br className="hidden sm:block" />
              <span className="text-blue-300">Connected Systems</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 mb-10 font-light leading-relaxed max-w-2xl">
              From precision hardware prototyping and environmental sensor integration to scalable, real-time web dashboards. We bridge the gap between physical data and digital insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#about" 
                className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-md text-brand-900 bg-white hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                About Us
              </a>
              <a 
                href="#services" 
                className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-white/80 text-base font-medium rounded-md text-white hover:bg-white/10 hover:border-white hover:-translate-y-0.5 transition-all duration-300"
              >
                Our Services
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Placeholder for next sections to allow scrolling */}
      <section id="about" className="h-screen bg-white"></section>
      <section id="services" className="h-screen bg-brand-50"></section>
      
    </div>
  );
}