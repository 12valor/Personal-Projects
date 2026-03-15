"use client";
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, Variants } from 'framer-motion';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Adding a slight delay prevents the synchronous set-state-in-effect warning
    // and naturally creates the cascading entrance animation intended here
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  
  // Custom scroll parallax for subtle text depth
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 800], [0, 100]); // Moves down slightly as user scrolls down to feel further back

  // Cursor Parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Calculate normalized mouse position from -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  // Spring configurations for smooth parallax
  const springConfig = { damping: 40, stiffness: 120, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Gallery container subtle tilt (max 3 degrees)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-4, 4]);

  // Data for the 8 cards (4 in each column) implementing layered depth and staggered float
  const cardsData = [
    // Column 1
    [
      { id: '1', src: '/client.jpg', depth: 40, duration: 4.5, delay: 0 },
      { id: '2', src: '/client.jpg', depth: 15, duration: 5.2, delay: 0.7 },
      { id: '3', src: '/client.jpg', depth: 25, duration: 4.8, delay: 0.3 },
      { id: '4', src: '/client.jpg', depth: 10, duration: 6.1, delay: 1.2 },
    ],
    // Column 2
    [
      { id: '5', src: '/client.jpg', depth: 20, duration: 5.8, delay: 0.5 },
      { id: '6', src: '/client.jpg', depth: 35, duration: 4.2, delay: 0.2 },
      { id: '7', src: '/client.jpg', depth: 10, duration: 6.5, delay: 0.9 },
      { id: '8', src: '/client.jpg', depth: 30, duration: 4.6, delay: 0.6 },
    ]
  ];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section 
      id="home" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center pt-24 pb-8 overflow-hidden z-0 bg-transparent"
    >
      {/* ----- MOBILE CROSSFADE BACKGROUND ----- */}
      <div className="absolute inset-0 z-[1] lg:hidden" aria-hidden="true">
        <Image
          src="/client.jpg"
          alt=""
          fill
          className="object-cover hero-crossfade-img"
          sizes="100vw"
          priority
        />
        <Image
          src="/client2.jpg"
          alt=""
          fill
          className="object-cover hero-crossfade-img-delayed"
          sizes="100vw"
          priority
        />
        {/* Dark brand tint for text legibility */}
        <div className="absolute inset-0 bg-brand-900/[0.88]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ----- LEFT COLUMN: Content Stack ----- */}
          <motion.div 
            style={{ y: textY }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="lg:col-span-6 flex flex-col items-start text-left pt-8 lg:pt-16"
          >
            <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-[3.5rem] tracking-tight leading-[1.12] mb-6 flex flex-col">
              <motion.span variants={itemVariants} className="block text-white lg:text-slate-900">Building Ideas</motion.span>
              <motion.span variants={itemVariants} className="block text-brand-200 lg:text-brand-900 mt-1 sm:mt-2">Into Reality</motion.span>
            </h1>
            
            <motion.p 
              variants={itemVariants}
              className="font-poppins font-normal text-white/80 lg:text-slate-600 text-[15px] sm:text-[16px] leading-[1.7] max-w-[58ch] mb-10"
            >
              We offer a range of hardware and software services, including device prototyping, system integration, and web-based solutions, tailored to help students and innovators bring their ideas to life.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="#contact" 
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-900 text-white text-[15px] font-semibold font-poppins rounded-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] transform-gpu"
              >
                <span>Start a Project</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                href="#services" 
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border-2 border-white/30 lg:border-gray-200 bg-white/90 lg:bg-white text-gray-900 text-[15px] font-semibold font-poppins rounded-[6px] transition-colors duration-300 hover:border-brand-600 hover:text-brand-600 shadow-sm transform-gpu"
              >
                <span>Explore Services</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ----- RIGHT COLUMN: Interactive 3D Grid ----- */}
          <div className="hidden lg:block lg:col-span-6 relative h-[500px] sm:h-[650px] w-full rounded-3xl overflow-hidden lg:ml-8 mt-12 lg:mt-0 [perspective:1200px]">
            
            {/* Gradient masks to ensure images don't look cut off at the edges */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            {/* The Grid Tilt Container */}
            <motion.div 
              style={{ rotateX, rotateY }}
              className="grid grid-cols-2 gap-4 h-full [transform-style:preserve-3d] scale-[1.15] -rotate-3 pl-4 pr-2"
            >
              {cardsData.map((col, colIdx) => (
                <div 
                  key={`col-${colIdx}`} 
                  className={`relative h-full overflow-visible flex flex-col gap-5 ${colIdx === 1 ? 'mt-10' : '-mt-10'}`}
                >
                  {col.map((card, idx) => (
                    <HeroCard 
                      key={card.id} 
                      card={card} 
                      idx={idx} 
                      colIdx={colIdx} 
                      mounted={mounted} 
                      smoothMouseX={smoothMouseX} 
                      smoothMouseY={smoothMouseY} 
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Sub-component to safely call framer-motion Hooks per card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeroCard({ card, idx, colIdx, mounted, smoothMouseX, smoothMouseY }: any) {
  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-card.depth, card.depth]);
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-card.depth, card.depth]);

  return (
    <motion.div
      style={{ x: parallaxX, y: parallaxY }} // Cursor parallax
      className="w-full aspect-[4/5] flex-shrink-0 z-10"
      initial={{ opacity: 0, y: 60 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut", 
        // Sync gallery entrance strictly after textual stagger finishes (~0.6s)
        delay: 0.6 + idx * 0.15 + colIdx * 0.2 
      }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }} // Organic vertical drift
        transition={{ 
          duration: card.duration, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: card.delay 
        }}
        className="w-full h-full"
      >
        <motion.div 
          whileHover={{ scale: 1.03, y: -6 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.06)] bg-white cursor-pointer group"
        >
          <Image 
            src={card.src} 
            alt="Work Showcase" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            sizes="(max-width: 768px) 50vw, 33vw" 
            priority={idx < 2} 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
