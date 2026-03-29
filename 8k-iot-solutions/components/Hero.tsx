"use client";
import Image from 'next/image';
import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';

const Hero = memo(function Hero({ 
  heroImages = [],
  heroSection, 
  heroCards = [] 
}: { 
  heroImages?: any[],
  heroSection?: any,
  heroCards?: any[] 
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  
  const safeHeroImages = Array.isArray(heroImages) ? heroImages : [];
  
  const imagePool = safeHeroImages.length > 0 
    ? safeHeroImages.map(img => img.url)
    : [];

  const getDistributedSource = (index: number) => {
    const total = imagePool.length;
    if (total === 0) return '/client.jpg';
    return imagePool[index % total];
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const fallbackMarqueeItems = [
    {
      id: "quote-1",
      type: "quote",
      content: "I need a custom PCB for my thesis project.",
      imageUrl: getDistributedSource(0),
    },
    {
      id: "team-1",
      type: "team",
      content: "Alex",
      label: "Hardware Engineer",
      imageUrl: getDistributedSource(1),
    },
    {
      id: "stat-1",
      type: "stat",
      content: "14+ Prototypes Deployed",
      label: "bg-brand-50 text-brand-900 border-brand-100",
    },
    {
      id: "quote-2",
      type: "quote",
      content: "How do I connect these sensors to the cloud?",
      imageUrl: getDistributedSource(2),
    },
    {
      id: "team-2",
      type: "team",
      content: "Jordan",
      label: "Software Dev",
      imageUrl: getDistributedSource(3),
    },
    {
      id: "stat-2",
      type: "stat",
      content: "Top Rated by Students",
      label: "bg-emerald-50 text-emerald-900 border-emerald-100",
    },
  ];

  const activeCards = heroCards.length > 0 ? heroCards : fallbackMarqueeItems;
  
  // Smart duplication to ensure the track is always filled regardless of card count
  // We want at least ~15 cards to ensure a smooth, gap-less infinite scroll on large screens
  const repetitions = activeCards.length === 0 ? 0 : Math.max(2, Math.ceil(15 / activeCards.length));
  const marqueeItems = Array.from({ length: repetitions }, () => activeCards).flat();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/?project_idea=${encodeURIComponent(searchInput)}#contact`);
    } else {
      router.push('/#contact');
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[100svh] flex flex-col items-center justify-between pt-20 lg:pt-28 overflow-hidden z-0 bg-gradient-to-b from-slate-50 via-blue-50/40 to-white"
    >
      {/* Background Orbs */}
      <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-brand-600/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />

      {/* Top Section */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center flex-1">
        
        {/* H1 */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="font-boldonse text-[2.75rem] sm:text-[4rem] lg:text-[5.5rem] tracking-tight leading-[1.5] mb-6 text-slate-900 drop-shadow-sm mt-8"
        >
          {heroSection?.heading_part_1 || "Building"} <span className="text-brand-900">{heroSection?.heading_highlight_1 || "Ideas"}</span><br className="hidden sm:block" /> {heroSection?.heading_part_2 || "Into"} <span className="text-brand-900">{heroSection?.heading_highlight_2 || "Reality"}</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="font-poppins text-slate-600 text-[1rem] sm:text-[1.125rem] lg:text-[1.25rem] leading-relaxed max-w-[55ch] mb-6 sm:mb-8"
        >
          {heroSection?.subtext || "We offer hardware and software services, including device prototyping and web-based solutions, tailored to help students and innovators bring their ideas to life."}
        </motion.p>

        {/* Social Proof Above Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="flex items-center gap-4 mb-10 sm:mb-12"
        >
          {/* Avatar Stack */}
          <div className="flex -space-x-3">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100"
              >
                <Image 
                  src={getDistributedSource(i + 10)} 
                  alt="Client" 
                  fill 
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ))}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-brand-50 flex items-center justify-center shadow-sm">
                <span className="text-[10px] sm:text-[12px] font-bold text-brand-700">+12</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-slate-200" />

          {/* Text */}
          <div className="text-left">
            <p className="text-[11px] sm:text-[13px] font-bold text-slate-900 leading-tight">
              50+ Innovators
            </p>
            <p className="text-[10px] sm:text-[12px] text-slate-500 font-medium">
              Projects Delivered
            </p>
          </div>
        </motion.div>

        {/* Search Bar CTA */}
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          onSubmit={handleSearch}
          className="w-full max-w-2xl relative flex items-center bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/60 ring-4 ring-white/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-slate-300/80 focus-within:shadow-[0_8px_30px_rgb(30,58,138,0.15)] focus-within:border-brand-300 mx-auto group cursor-text"
        >
          <div className="pl-6 pr-2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={heroSection?.search_placeholder || "Describe your project idea... (e.g., Smart greenhouse)"} 
            className="flex-1 bg-transparent border-none outline-none py-3 sm:py-4 px-2 text-slate-900 placeholder:text-slate-400 font-poppins text-[15px] sm:text-[16px] lg:text-[18px]"
          />
          <button 
            type="submit"
            className="hidden sm:flex items-center justify-center bg-brand-900 text-white font-semibold font-poppins rounded-full px-8 py-3.5 hover:bg-brand-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md ml-2 cursor-pointer"
          >
            Start Project
          </button>
          <button 
            type="submit"
            className="sm:hidden flex items-center justify-center bg-brand-900 text-white rounded-full p-3 hover:bg-brand-800 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] shadow-md ml-1 cursor-pointer"
            aria-label="Start Project"
          >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
             </svg>
          </button>
        </motion.form>
      </div>

      {/* Bottom Section: Infinite Marquee Track */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full mt-16 lg:mt-24 pb-4 sm:pb-6 overflow-hidden relative z-10"
      >
        {/* Soft Fade Edges for seamless loop perception */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
        
        <motion.div 
          className="flex gap-4 sm:gap-6 w-max items-center px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 45, repeat: Infinity }}
        >
          {marqueeItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="flex-shrink-0 w-80 h-[210px] sm:h-[220px] rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 hover:-translate-y-1 transition-all duration-500 ease-[0.16,1,0.3,1] flex flex-col overflow-hidden group cursor-pointer bg-white"
            >
              
              {/* Type 1: Stat / Metric Cards */}
              {(item.type === "stat" || item.type === "metric") && (
                <div className="bg-blue-50/50 p-6 flex flex-col flex-1 items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-sm border border-white/50">
                    <Zap className="w-5 h-5 text-brand-700 fill-brand-700/20" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                    {item.content}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
                    {item.label || "Operational Metric"}
                  </p>
                </div>
              )}

              {/* Type 2: Client / Project Cards */}
              {(item.type === "team" || item.type === "team_member" || item.type === "client_project") && (
                <div className="relative w-full h-full flex-1">
                  {item.imageUrl && (
                     <Image src={item.imageUrl} alt={item.content || "Client project"} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="320px" />
                  )}
                  {/* Bottom-to-top gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-semibold text-white text-lg leading-tight truncate">{item.content}</p>
                    <p className="text-blue-200 text-sm font-medium mt-1 truncate">{item.label || "Project Highlights"}</p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});

export default Hero;
