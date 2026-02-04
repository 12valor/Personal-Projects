"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
    { id: 1, text: "Graphic Design", src: "/graphic.jpg" },
    { id: 2, text: "Video Editing", src: "/vid.jpg" },
    { id: 3, text: "Web Design", src: "/web.jpg" }
  ];

  return (
    <section 
      ref={containerRef}
      id="services" 
      className="relative flex flex-col items-center bg-gray-50 border-t border-border overflow-hidden pt-20 pb-32 min-h-[90vh]"
    >
      {/* --- PRELOADER --- 
          Safely preloads images to prevent lag when opening the folder.
      */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        {cardsData.map((card) => (
          <Image 
            key={card.id}
            src={card.src}
            alt="preload"
            width={600} 
            height={800}
            priority
            sizes="(max-width: 768px) 100vw, 33vw" 
          />
        ))}
      </div>

      {/* Background Text */}
      <motion.div 
        style={{ y: yBackground }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0"
      >
        <span className="text-[25vw] font-black tracking-tighter text-foreground select-none">
          SERVICES
        </span>
      </motion.div>

      {/* Title */}
      <motion.div 
        style={{ y: yTitle, opacity: opacityText }}
        className="relative z-10 text-center mb-10 md:mb-16 px-6 mt-10"
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
      <div className="relative z-20 w-full max-w-7xl px-0 md:px-4 flex justify-center items-center min-h-[400px]">
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            // STATE 1: THE FOLDER
            <motion.div
              key="folder"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer will-change-transform"
            >
              <Folder 
                size={3.2} 
                color="#222222"
                onClick={() => setIsOpen(true)}
              />
            </motion.div>
          ) : (
            // STATE 2: THE CARDS
            <motion.div
              key="cards"
              // The classes inside [] are native Tailwind arbitrary values to hide scrollbars safely
              className="
                flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 w-full 
                md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              "
              initial="hidden"
              animate="visible"
            >
              {cardsData.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="min-w-[85vw] md:min-w-0 h-[400px] snap-center will-change-transform"
                  variants={{
                    hidden: { y: 50, opacity: 0, scale: 0.9 },
                    visible: { 
                      y: 0, 
                      opacity: 1, 
                      scale: 1,
                      transition: { 
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
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
                 transition={{ delay: 0.5 }}
                 className="
                    fixed bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none 
                    md:static md:col-span-2 lg:col-span-3 md:mt-8 md:pointer-events-auto
                 "
              >
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="
                        pointer-events-auto bg-white/90 backdrop-blur md:bg-transparent px-6 py-2 rounded-full shadow-lg md:shadow-none border border-gray-200 md:border-none
                        text-xs md:text-sm text-gray-800 md:text-gray-400 hover:text-accent transition-all uppercase tracking-widest font-medium
                    "
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