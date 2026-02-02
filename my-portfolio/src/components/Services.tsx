"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image"; // IMPORTED NEXT/IMAGE
import Folder from "./Folder"; 
import TiltedCard from "./TiltedCard";

export default function Services() {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [-50, 50]);   
  const yTitle = useTransform(scrollYProgress, [0, 1], [30, -30]);        
  const opacityText = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  const cardsData = [
    {
      id: 1,
      text: "Graphic Design",
      src: "/graphic.jpg" // Ensure these paths start with / if in public folder
    },
    {
      id: 2,
      text: "Video Editing",
      src: "/vid.jpg"
    },
    {
      id: 3,
      text: "Web Design",
      src: "/web.jpg"
    }
  ];

  return (
    <section 
      ref={containerRef}
      id="services" 
      className="relative flex flex-col items-center bg-gray-50 border-t border-border overflow-hidden pt-20 pb-32 min-h-[90vh]"
    >
      {/* --- PERFORMANCE OPTIMIZATION: INVISIBLE PRELOADER --- 
          This forces the browser to download and decode images immediately 
          when the page loads, rather than waiting for the folder to open. 
          This kills the lag spike on mobile. */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        {cardsData.map((card) => (
          <Image 
            key={card.id}
            src={card.src}
            alt="preload"
            width={600} 
            height={800}
            priority={true} // Forces high priority loading
            quality={75}    // Slightly reduces file size without visible loss
          />
        ))}
      </div>

      {/* Background Text */}
      <motion.div 
        style={{ y: yBackground }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 will-change-transform"
      >
        <span className="text-[25vw] font-black tracking-tighter text-foreground select-none">
          SERVICES
        </span>
      </motion.div>

      {/* Title */}
      <motion.div 
        style={{ y: yTitle, opacity: opacityText }}
        className="relative z-10 text-center mb-16 px-6 mt-10 will-change-transform"
      >
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-foreground">
          What I Do
        </h2>
        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed"
          >
            A blend of technical precision and artistic direction. <br/>
            <span className="text-accent text-sm font-medium uppercase tracking-widest mt-2 block">
              Click the folder to explore
            </span>
          </motion.p>
        )}
      </motion.div>

      {/* MAIN INTERACTION AREA */}
      <div className="relative z-20 w-full max-w-6xl px-4 flex justify-center items-center min-h-[400px]">
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            // STATE 1: THE FOLDER
            <motion.div
              key="folder"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer will-change-transform" // Hardware acceleration hint
            >
              <Folder 
                size={3.2} 
                color="#222222"
                onClick={() => setIsOpen(true)}
              />
            </motion.div>
          ) : (
            // STATE 2: THE CARDS (Popped Up)
            <motion.div
              key="cards"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full"
              initial="hidden"
              animate="visible"
            >
              {cardsData.map((card, i) => (
                <motion.div
                  key={card.id}
                  // Added will-change to hint browser to prep GPU
                  className="h-[400px] w-full will-change-transform"
                  variants={{
                    hidden: { y: 50, opacity: 0, scale: 0.9 },
                    visible: { 
                      y: 0, 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        delay: i * 0.05, 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }
                  }}
                >
                  <TiltedCard
                    imageSrc={card.src}
                    altText={card.text}
                    captionText={card.text}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="bg-black/30 backdrop-blur-[2px] w-full h-full flex flex-col items-center justify-center rounded-[15px] border border-white/10 group">
                          <p className="text-white font-bold text-lg tracking-[0.2em] uppercase group-hover:scale-110 transition-transform duration-300">
                            {card.text}
                          </p>
                      </div>
                    }
                  />
                </motion.div>
              ))}
              
              {/* Close Button */}
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 0.3 }}
                 className="col-span-1 md:col-span-3 flex justify-center mt-8"
              >
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-gray-400 hover:text-accent transition-colors uppercase tracking-widest text-[10px]"
                  >
                    Close Stack
                  </button>
              </motion.div> 
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}