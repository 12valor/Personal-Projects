"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const timelineData = [
  {
    year: "2019",
    title: "The Beginning",
    desc: "Started exploring visual design while studying Computer Science. Obsessed with typography.",
  },
  {
    year: "2021",
    title: "Agency Life",
    desc: "Joined 'Studio Alpha' as a Junior Designer. Learned the discipline of grid systems and print layouts.",
  },
  {
    year: "2023",
    title: "Senior UI/UX",
    desc: "Led the redesign of 3 major fintech apps. Shifted focus towards functional minimalism.",
  },
  {
    year: "2024",
    title: "Independence",
    desc: "Launched my own practice to focus on editorial web design and brand identity for creators.",
  },
  {
    year: "Future",
    title: "What's Next?",
    desc: "Exploring 3D web experiences and tangible interfaces. Open for new collaborations.",
  },
];

export default function About() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific section (0 to 1)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll (0 -> 1) to horizontal movement (1% -> -95%)
  // We move the timeline LEFT as the user scrolls DOWN
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  // Parallax Text Effect (Moves slower than the timeline)
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    // Height 300vh gives us "scroll distance" to make the animation feel slow and smooth
    <section ref={targetRef} className="relative h-[300vh] bg-background">
      
      {/* Sticky Container: Freezes the view while we animate the content */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Parallax Background Text */}
        <motion.div 
          style={{ x: textX }}
          className="absolute top-20 left-10 text-[12rem] md:text-[20rem] font-bold text-gray-50 opacity-50 whitespace-nowrap pointer-events-none select-none z-0"
        >
          TIMELINE
        </motion.div>

        {/* Horizontal Moving Content */}
        <motion.div style={{ x }} className="flex gap-12 md:gap-24 pl-12 md:pl-32 relative z-10">
          
          {/* Header Card */}
          <div className="flex flex-col justify-center min-w-[300px] md:min-w-[400px]">
            <h2 className="text-4xl md:text-6xl font-semibold mb-6">
              About <br /> <span className="text-accent italic">My Journey</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xs leading-relaxed">
              A chronological look at how I evolved from a student to a detail-obsessed designer.
            </p>
            <span className="text-xs font-bold text-accent mt-8 tracking-widest uppercase">
              Scroll Down →
            </span>
          </div>

          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col justify-center min-w-[300px] md:min-w-[450px] border-l border-gray-200 pl-8 md:pl-12 hover:border-accent/50 transition-colors duration-500"
            >
              {/* Year Badge */}
              <span className="text-6xl md:text-8xl font-light text-gray-200 group-hover:text-accent/20 transition-colors duration-500 mb-4 block">
                {item.year}
              </span>
              
              <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-3">
                {item.title}
              </h3>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-sm">
                {item.desc}
              </p>
            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}