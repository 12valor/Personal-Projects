"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "./LoadingProvider";

const CHARS = "0123456789";

export default function Preloader() {
  const { finishLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulated progress for cinematic linear effect
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(finishLoading, 800); 
          }, 300);
          return 100;
        }
        // Smooth linear-ish increment
        const increment = Math.random() > 0.6 ? 2 : 1;
        return Math.min(100, prev + increment);
      });
    }, 40); // Faster, more constant updates

    return () => clearInterval(interval);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Progress Counter */}
          <div className="relative flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[12vw] md:text-[8vw] font-bold tracking-tighter text-white leading-none flex items-baseline"
            >
              {progress.toString().padStart(2, "0")}
              <span className="text-[4vw] md:text-[2vw] text-accent ml-2">%</span>
            </motion.div>
            
            {/* Linear Progress Bar (Minimalist) */}
            <div className="w-[30vw] md:w-[20vw] h-[1px] bg-white/10 mt-4 overflow-hidden rounded-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent"
              />
            </div>
            
            {/* Subtle Label */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-white font-medium"
            >
              Initializing Studio Environment
            </motion.p>
          </div>

          {/* SVG Lens Reveal (Wipe) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path
              initial={{ d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" }}
              exit={{ 
                d: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
              }}
              fill="black"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
