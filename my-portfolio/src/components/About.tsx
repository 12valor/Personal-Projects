"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";

// 1. Add 'img' to your data. 
// Replace these with your actual local paths (e.g., "/timeline/2021.jpg")
const timelineData = [
  {
    year: "2021",
    title: "GFX Artist",
    category: "Visuals",
    desc: "Started my creative journey making GFX art. Focused on composition, lighting, and digital aesthetics for local communities.",
    img: "/2021.png"
  },
  {
    year: "2022",
    title: "Video Editing",
    category: "Motion",
    desc: "Transitioned into motion. Mastered pacing, sound design, and storytelling to create compelling video narratives.",
    img: "/2022.png"
  },
  {
    year: "2023",
    title: "Graphic Design",
    category: "Branding",
    desc: "Deepened my focus on static design. Refined my eye for typography, grid systems, and brand identity.",
    img: "/2023.jpeg"
  },
  {
    year: "2024",
    title: "Programming",
    category: "Development",
    desc: "Bridging the gap between design and function. Learned to build the interfaces I design using modern web tech.",
    img: "/2024.png"
  },
];

export default function About() {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  const [scrollRange, setScrollRange] = useState(0);
  const [viewportW, setViewportW] = useState(0);

  // --- CURSOR FOLLOWER LOGIC ---
  const [activeImg, setActiveImg] = useState<string | null>(null);
  
  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Springs for buttery smooth movement (dampened physics)
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Update mouse coordinates
  const handleMouseMove = (e: React.MouseEvent) => {
    // We update the motion values directly (no React re-render needed)
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current && stickyRef.current) {
        setScrollRange(contentRef.current.scrollWidth);
        setViewportW(stickyRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    if (stickyRef.current) resizeObserver.observe(stickyRef.current);

    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  const distance = scrollRange - viewportW;
  const finalDistance = distance > 0 ? distance : 0;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const xScroll = useTransform(scrollYProgress, [0, 1], ["0px", `-${finalDistance}px`]);
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      
      {/* THE FLOATING IMAGE 
         Positioned 'fixed' so it stays relative to the screen, not the scroll container 
      */}
      <motion.div
        style={{ x, y, opacity: activeImg ? 1 : 0 }}
        className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden rounded-xl shadow-2xl w-[300px] aspect-[4/3] hidden md:block"
      >
        {/* We just swap the src, but keep the container alive for transitions */}
        {activeImg && (
           <Image
             src={activeImg}
             alt="Timeline Preview"
             fill
             className="object-cover"
           />
        )}
      </motion.div>


      <div 
        ref={stickyRef} 
        className="sticky top-0 flex h-screen items-center overflow-hidden"
        onMouseMove={handleMouseMove} // Track mouse movement over the whole sticky area
      >
        
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
          style={{ x: xScroll }} 
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
              // SET IMAGE ON HOVER
              onMouseEnter={() => setActiveImg(item.img)}
              onMouseLeave={() => setActiveImg(null)}
            >
              {/* Decorative Top Line */}
              <div className="w-full h-[1px] bg-gray-200 group-hover:bg-accent/50 transition-colors duration-500 mb-8 origin-left transform scale-x-50 group-hover:scale-x-100 ease-out"></div>

              <span className="text-sm font-mono text-accent mb-2 tracking-widest uppercase">
                {item.category}
              </span>

              <span className="text-7xl md:text-9xl font-bold text-gray-200 group-hover:text-foreground transition-colors duration-700 mb-6 block cursor-default">
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
          
          <div className="min-w-[40vw]"></div>

        </motion.div>
      </div>
    </section>
  );
}