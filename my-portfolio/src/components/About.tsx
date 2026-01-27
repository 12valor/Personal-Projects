"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const timelineData = [
  {
    year: "2021",
    title: "GFX Artist",
    category: "Visuals",
    desc: "Started my creative journey making GFX art. Focused on composition, lighting, and digital aesthetics for local communities.",
  },
  {
    year: "2022",
    title: "Video Editing",
    category: "Motion",
    desc: "Transitioned into motion. Mastered pacing, sound design, and storytelling to create compelling video narratives.",
  },
  {
    year: "2023",
    title: "Graphic Design",
    category: "Branding",
    desc: "Deepened my focus on static design. Refined my eye for typography, grid systems, and brand identity.",
  },
  {
    year: "2024",
    title: "Programming",
    category: "Development",
    desc: "Bridging the gap between design and function. Learned to build the interfaces I design using modern web tech.",
  },
  {
    year: "Future",
    title: "The Hybrid",
    category: "Evolution",
    desc: "Merging creative direction with engineering to build immersive, high-performance digital experiences.",
  },
];

export default function About() {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null); // New Ref for the visible window
  
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current && stickyRef.current) {
        // 1. Measure the long strip (Total Content Width)
        setScrollRange(contentRef.current.scrollWidth);
        
        // 2. Measure the sticky container (Visible Screen Width)
        setViewportW(stickyRef.current.offsetWidth);
      }
    };

    // Observers to handle dynamic loading/resizing
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    if (stickyRef.current) resizeObserver.observe(stickyRef.current);

    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate strict distance: Total Length - Visible Screen
  const distance = scrollRange - viewportW;
  // Use a fallback of 0 to prevent negative values on initial render
  const finalDistance = distance > 0 ? distance : 0;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Scroll the exact distance needed to reach the end
  const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${finalDistance}px`]);
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);

  return (
    // h-[300vh] ensures enough scroll track for a smooth pace
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      
      {/* We attach stickyRef here to measure the "Screen Window" */}
      <div ref={stickyRef} className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Parallax Background Text */}
        <motion.div 
          style={{ x: textX, opacity }}
          className="absolute top-1/2 -translate-y-1/2 left-10 text-[15rem] md:text-[25rem] font-black text-foreground/5 whitespace-nowrap pointer-events-none select-none z-0"
        >
          JOURNEY
        </motion.div>

        {/* Horizontal Moving Content */}
        <motion.div 
          ref={contentRef}
          style={{ x }} 
          className="flex gap-16 md:gap-32 pl-12 md:pl-32 pr-12 relative z-10 w-max items-center"
        >
          
          {/* Header Card */}
          <div className="flex flex-col justify-center min-w-[300px] md:min-w-[400px]">
            <h2 className="text-5xl md:text-7xl font-semibold mb-8 leading-tight">
              My <br /> <span className="text-accent italic">Evolution</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-sm leading-relaxed">
              From static visuals to dynamic code. A chronological look at my expansion across the digital spectrum.
            </p>
            <div className="flex items-center gap-4 mt-12">
                <span className="w-12 h-[1px] bg-accent"></span>
                <span className="text-xs font-bold text-accent tracking-widest uppercase">
                Scroll Down
                </span>
            </div>
          </div>

          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col justify-center min-w-[300px] md:min-w-[500px]"
            >
              {/* Decorative Top Line */}
              <div className="w-full h-[1px] bg-gray-200 group-hover:bg-accent/50 transition-colors duration-500 mb-8 origin-left transform scale-x-50 group-hover:scale-x-100 ease-out"></div>

              <span className="text-sm font-mono text-accent mb-2 tracking-widest uppercase">
                {item.category}
              </span>

              <span className="text-7xl md:text-9xl font-bold text-gray-200 group-hover:text-foreground transition-colors duration-700 mb-6 block">
                {item.year}
              </span>
              
              <h3 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
                {item.title}
              </h3>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-sm">
                {item.desc}
              </p>
            </div>
          ))}
          
          {/* Spacer at the end so the last item can reach the center of the screen */}
          <div className="min-w-[40vw]"></div>

        </motion.div>
      </div>
    </section>
  );
}