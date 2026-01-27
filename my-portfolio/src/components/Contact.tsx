"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "hello@agevangelista.dev"; // Replace with your actual email

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-32 md:py-48 px-6 bg-background border-t border-border overflow-hidden">
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-sm font-mono text-accent tracking-widest uppercase mb-4">
            ( Get in Touch )
          </h2>
          <p className="text-3xl md:text-5xl font-light leading-tight max-w-2xl text-foreground">
            Have a project in mind? <br/>
            <span className="text-gray-400">Let's build something specific.</span>
          </p>
        </motion.div>

        {/* Big Interactive Email */}
        <div className="relative group cursor-pointer inline-block" onClick={handleCopy}>
           <AnimatePresence mode="wait">
            {copied ? (
              <motion.h1
                key="copied"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-5xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter text-accent"
              >
                Copied!
              </motion.h1>
            ) : (
              <motion.h1
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-5xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter text-foreground group-hover:text-gray-400 transition-colors duration-300"
              >
                Let's Talk
              </motion.h1>
            )}
           </AnimatePresence>

           {/* Hover Line */}
           <div className="w-full h-[2px] bg-foreground group-hover:bg-accent transition-colors duration-300 mt-2 md:mt-6"></div>
           
           <p className="mt-4 text-sm text-gray-500 group-hover:text-accent transition-colors">
             {copied ? "Email copied to clipboard" : "Click to copy email address"}
           </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-gray-100 pt-12">
            {[
              { name: "LinkedIn", url: "#" },
              { name: "GitHub", url: "#" },
              { name: "YouTube", url: "https://www.youtube.com/@RoastBloxx" },
              { name: "Instagram", url: "#" }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col group"
              >
                <span className="text-xs text-gray-400 mb-2 group-hover:text-accent transition-colors">0{idx + 1}</span>
                <span className="text-lg font-medium text-foreground group-hover:translate-x-2 transition-transform duration-300">
                  {social.name}
                </span>
              </a>
            ))}
        </div>

      </div>
    </section>
  );
}