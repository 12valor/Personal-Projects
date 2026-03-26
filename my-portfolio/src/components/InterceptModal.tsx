"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function InterceptModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Prevent scrolling on the background when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onDismiss = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
      />

      {/* Modal Content container */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-7xl h-full bg-background border border-border shadow-2xl rounded-2xl md:rounded-3xl overflow-y-auto no-scrollbar selection:bg-accent/20"
      >
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] p-2 md:p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-all group"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:scale-110 transition-transform" />
        </button>

        <div className="px-6 md:px-12 py-12 md:py-20">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
