"use client";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useState, memo, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Search, Sparkles } from 'lucide-react';
import ShinyText from './ShinyText';

const MagicRings = dynamic(() => import('./MagicRings'), {
  ssr: false
});

const Hero = memo(function Hero({ 
  heroImages = [],
  heroSection, 
  heroCards = [],
  schoolLogos = []
}: { 
  heroImages?: any[],
  heroSection?: any,
  heroCards?: any[],
  schoolLogos?: any[]
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  const [isHovered, setIsHovered] = useState(false);
  const spotlightSize = useSpring(isHovered ? 120 : 0, { damping: 20, stiffness: 150 });
  
  // Update spotlight size when hover state changes
  useEffect(() => {
    spotlightSize.set(isHovered ? 120 : 0);
  }, [isHovered, spotlightSize]);

  // Create reactive clip-path template
  const clipPath = useMotionTemplate`circle(${spotlightSize}px at ${smoothX}px ${smoothY}px)`;
  
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  const safeHeroImages = Array.isArray(heroImages) ? heroImages : [];
  const safeSchoolLogos = Array.isArray(schoolLogos) ? schoolLogos : [];
  
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

  // Use school logos for avatars if available, otherwise fallback to generic images
  const avatarLogos = safeSchoolLogos.length > 0 
    ? safeSchoolLogos.slice(0, 4) 
    : [1, 2, 3, 4].map(i => ({ image: getDistributedSource(i + 10) }));

  const remainingLogosCount = safeSchoolLogos.length > 4 ? safeSchoolLogos.length - 4 : 12;

  const fallbackMarqueeItems = [
    {
      id: "quote-1",
      type: "team",
      content: "I need a custom PCB for my thesis project.",
      label: "Electronics Design",
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
      id: "quote-2",
      type: "team",
      content: "How do I connect these sensors to the cloud?",
      label: "IoT Integration",
      imageUrl: getDistributedSource(2),
    },
    {
      id: "team-2",
      type: "team",
      content: "Jordan",
      label: "Software Dev",
      imageUrl: getDistributedSource(3),
    },
  ];

  const activeCards = heroCards.length > 0 ? heroCards : fallbackMarqueeItems;
  
  // Smart duplication to ensure the track is always filled regardless of card count
  // We want at least ~15 cards to ensure a smooth, gap-less infinite scroll on large screens
  const repetitions = activeCards.length === 0 ? 0 : Math.max(2, Math.ceil(15 / activeCards.length));
  const marqueeItems = Array.from({ length: repetitions }, () => activeCards).flat();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation Logic
    if (!searchInput.trim()) {
      setShake(true);
      setErrorMessage("Describe your idea");
      setTimeout(() => {
        setShake(false);
        setErrorMessage(null);
      }, 1000);
      return;
    }

    // 2. Rate Limiting Logic (2s Cooldown)
    if (isSubmitting) return;

    setIsSubmitting(true);
    router.push(`/?project_idea=${encodeURIComponent(searchInput)}#contact`);

    // Reset cooldown after 2 seconds
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[100svh] flex flex-col items-center justify-between pt-28 md:pt-36 lg:pt-24 overflow-hidden z-0 bg-gradient-to-b from-slate-50 via-blue-50/40 to-white"
    >
      {/* Background Orbs */}
      {heroSection?.show_hero_orbs !== false && (
        <div 
          className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] blur-[100px] sm:blur-[120px] rounded-full pointer-events-none"
          style={{ 
            backgroundColor: heroSection?.hero_orbs_color || "#4f46e5",
            opacity: heroSection?.hero_orbs_opacity ?? 0.1
          }} 
        />
      )}

      {/* Magic Rings Background Overlay (Desktop Only) */}
      {heroSection?.show_magic_rings !== false && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
          <MagicRings
            color={heroSection?.magic_rings_color || "#3b82f6"}
            colorTwo={heroSection?.magic_rings_color_2 || "#1d4ed8"}
            ringCount={heroSection?.magic_rings_count || 12}
            speed={heroSection?.magic_rings_speed || 0.25}
            attenuation={20}
            lineThickness={2.5}
            baseRadius={0.4}
            radiusStep={0.12}
            scaleRate={0.08}
            opacity={heroSection?.magic_rings_opacity ?? 0.18}
            blur={1.5}
            noiseAmount={0.02}
            rotation={0}
            ringGap={1.3}
            fadeIn={0.8}
            fadeOut={0.6}
            followMouse={false}
            mouseInfluence={0.1}
            hoverScale={1.1}
            parallax={0.03}
            clickBurst={false}
          />
        </div>
      )}

      {/* Top Section */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center flex-1">
        
        {/* H1 with Spotlight Reveal */}
        <div className="relative group w-fit mx-auto">
          <motion.h1 
            ref={containerRef}
            initial={{ opacity: 0, y: 15 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative mb-6 text-slate-900 mt-6 cursor-default py-2"
          >
            {/* Mobile/Tablet Base Layer (Total Revert to Original for mobile flow) */}
            <div className="select-none lg:hidden font-boldonse text-[2.75rem] sm:text-[4rem] tracking-tight leading-[1.5]">
              {heroSection?.heading_part_1 || "Building"} <span className="text-brand-900">{heroSection?.heading_highlight_1 || "Ideas"}</span><br className="hidden sm:block" /> {heroSection?.heading_part_2 || "Into"} <span className="text-brand-900">{heroSection?.heading_highlight_2 || "Reality"}</span>
            </div>

            {/* Desktop Base Layer (Ghost-Locked for alignment) */}
            <div className="select-none hidden lg:flex flex-col items-center">
              <div className="grid grid-cols-1 justify-items-center">
                {/* Visible Base Content Stack */}
                <div className="col-start-1 row-start-1 flex flex-col items-center gap-12 text-[5.5rem] font-boldonse tracking-tight leading-none">
                  <div className="flex items-center gap-4">
                    <span>{heroSection?.heading_part_1 || "Building"}</span>
                    <span className="text-brand-900">{heroSection?.heading_highlight_1 || "Ideas"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{heroSection?.heading_part_2 || "Into"}</span>
                    <span className="text-brand-900">{heroSection?.heading_highlight_2 || "Reality"}</span>
                  </div>
                </div>
                {/* Ghost Reveal Content Stack for Width Lock */}
                <div className="col-start-1 row-start-1 invisible pointer-events-none select-none flex flex-col items-center gap-12 text-[5.5rem] font-boldonse tracking-tight leading-none">
                  <div className="flex items-center gap-4">
                    <span>{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(0, 1).join(' ')}</span>
                    <span>{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(1, 2).join(' ')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(2, 3).join(' ')}</span>
                    <span>{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(3).join(' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reveal Layer (Desktop Only) */}
            <motion.div 
              className="absolute inset-0 pointer-events-none select-none hidden lg:flex items-center justify-center z-10"
              animate={{
                backgroundColor: ["rgba(255,255,255,1)", "rgba(239,246,255,1)", "rgba(245,243,255,1)", "rgba(255,255,255,1)"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                clipPath,
                WebkitClipPath: clipPath,
              }}
            >
              <div className="grid grid-cols-1 justify-items-center">
                {/* Visible Reveal Stack */}
                <div className="col-start-1 row-start-1 flex flex-col items-center gap-12 text-[5.5rem] font-boldonse tracking-tight leading-none">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-900">{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(0, 1).join(' ')}</span>
                    <span className="text-blue-900">{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(1, 2).join(' ')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-900">{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(2, 3).join(' ')}</span>
                    <span className="text-slate-950">{(heroSection?.reveal_text || "Crafting Goals Into Results").split(' ').slice(3).join(' ')}</span>
                  </div>
                </div>
                {/* Ghost Base Stack for Width Lock */}
                <div className="col-start-1 row-start-1 invisible pointer-events-none select-none flex flex-col items-center gap-12 text-[5.5rem] font-boldonse tracking-tight leading-none">
                  <div className="flex items-center gap-4">
                    <span>{heroSection?.heading_part_1 || "Building"}</span>
                    <span>{heroSection?.heading_highlight_1 || "Ideas"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{heroSection?.heading_part_2 || "Into"}</span>
                    <span>{heroSection?.heading_highlight_2 || "Reality"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.h1>
        </div>

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
          className="flex items-center gap-4 mb-4 sm:mb-6"
        >
          {/* Avatar Stack */}
          <div className="flex -space-x-4">
            {avatarLogos.map((logo: any, i: number) => (
              <div 
                key={i} 
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden z-0 hover:z-10 transition-all duration-500 hover:scale-110 lg:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group/avatar"
              >
                <Image 
                  src={logo.imageUrl || (typeof logo.image === 'string' ? logo.image : logo.image?.src) || getDistributedSource(i + 10)} 
                  alt={logo.name || "Client Logo"} 
                  fill 
                  className="object-contain p-1 transition-transform duration-500 group-hover/avatar:scale-110"
                  sizes="40px"
                  priority={i < 2}
                />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-slate-200" />

          {/* Text */}
          <div className="text-left font-poppins">
            <p className="text-[11px] sm:text-[13px] font-bold text-slate-900 leading-tight">
              {heroSection?.trust_stat_value || "20+ Innovators"}
            </p>
            <p className="text-[10px] sm:text-[12px] text-slate-500 font-medium">
              {heroSection?.trust_stat_label || "Projects Delivered"}
            </p>
          </div>
        </motion.div>

        {/* Search Bar CTA */}
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={shake ? { 
            x: [-10, 10, -5, 5, 0],
            borderColor: "rgba(239, 68, 68, 0.5)"
          } : mounted ? { opacity: 1, y: 0 } : {}}
          transition={shake ? { duration: 0.4 } : { duration: 0.5, delay: 0.3, ease: "easeOut" }}
          onSubmit={handleSearch}
          className={`w-full max-w-2xl relative flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-sm border ring-2 sm:ring-4 ring-white/30 transition-all duration-500 hover:shadow-md hover:scale-[1.01] hover:border-slate-300 focus-within:ring-brand-900/5 focus-within:border-brand-500/50 mx-auto group cursor-text ${
            shake ? "border-red-400" : "border-slate-200/60"
          }`}
        >
          <div className={`pl-4 pr-1 sm:pl-6 sm:pr-2 transition-colors group-hover:scale-110 duration-300 ${shake ? "text-red-500" : "text-slate-400 group-focus-within:text-brand-600"}`}>
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (shake) setShake(false);
            }}
            placeholder={errorMessage || heroSection?.search_placeholder || "Describe your project idea... (e.g., Smart greenhouse)"} 
            className={`flex-1 min-w-0 bg-transparent border-none outline-none py-3 sm:py-4 px-1.5 sm:px-2 text-slate-900 font-poppins text-[15px] sm:text-[16px] lg:text-[18px] transition-colors ${
              shake ? "placeholder:text-red-400" : "placeholder:text-slate-400"
            }`}
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            className={`hidden sm:flex items-center justify-center font-medium font-poppins rounded-full px-8 py-3.5 transition-all duration-300 shadow-lg ml-2 group/btn ${
              isSubmitting 
                ? "bg-slate-200 text-slate-500 cursor-wait opacity-80"
                : (searchInput.trim() || isBtnHovered)
                ? "bg-brand-900 text-white hover:bg-brand-800 scale-[1.02]"
                : shake
                ? "bg-red-500 text-white animate-pulse"
                : "bg-blue-50 text-slate-400 opacity-60 scale-100"
            }`}
          >
            <span>
              {isSubmitting ? (
                <ShinyText text="Syncing..." color="#64748b" shineColor="#ffffff" speed={2.5} />
              ) : shake ? (
                <ShinyText 
                  text="Describe Idea" 
                  color="#ffffff" 
                  shineColor="#fee2e2" 
                  speed={2} 
                  icon={<Sparkles className="w-5 h-5" />}
                  iconPosition="right"
                />
              ) : (searchInput.trim() || isBtnHovered) ? (
                <ShinyText 
                  text="Start Project" 
                  color="#ffffff" 
                  shineColor="#93c5fd" 
                  speed={2} 
                  icon={<Sparkles className="w-5 h-5" />}
                  iconPosition="right"
                />
              ) : (
                <ShinyText 
                  text="Start Project" 
                  color="#94a3b8" 
                  shineColor="#ffffff" 
                  speed={3} 
                  icon={<Sparkles className="w-5 h-5" />}
                  iconPosition="right"
                />
              )}
            </span>
          </button>
          <button 
            type="submit"
            className="sm:hidden flex items-center justify-center bg-brand-900 text-white rounded-full p-2.5 hover:bg-brand-800 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] ml-1 cursor-pointer"
            aria-label="Start Project"
          >
             <ArrowRight className="w-5 h-5" />
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
              className="flex-shrink-0 w-80 h-[210px] sm:h-[220px] rounded-2xl border border-slate-200/60 hover:shadow-lg hover:shadow-brand-900/5 hover:-translate-y-1 transition-all duration-500 ease-[0.16,1,0.3,1] flex flex-col overflow-hidden group cursor-pointer bg-white font-poppins"
            >
              
              {/* Type: Client / Project Cards */}
              {(item.type === "team" || item.type === "team_member" || item.type === "client_project") && (
                <div className="relative w-full h-full flex-1">
                  {item.imageUrl && (
                     <Image 
                        src={item.imageUrl} 
                        alt={item.content || "Client project"} 
                        fill 
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        sizes="320px"
                        priority={index < 4}
                      />
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
