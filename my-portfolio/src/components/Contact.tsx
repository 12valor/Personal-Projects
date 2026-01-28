"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  // Existing state
  const [copied, setCopied] = useState(false);
  
  // Form states
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const email = "hello@agevangelista.dev";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormState({ 
    ...formState, 
    [e.target.name]: e.target.value 
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 bg-background border-t border-border overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT COLUMN: Info & Copy Interaction --- */}
          <div>
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-sm font-mono text-accent tracking-widest uppercase mb-4">
                ( Get in Touch )
              </h2>
              <p className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Have a project in mind? <br/>
                <span className="text-gray-400">Let's build something specific.</span>
              </p>
            </motion.div>

            {/* Big Interactive Email */}
            <div className="relative group cursor-pointer inline-block mb-16" onClick={handleCopy}>
               <AnimatePresence mode="wait">
                {copied ? (
                  <motion.h1
                    key="copied"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-4xl md:text-7xl font-bold tracking-tighter text-accent"
                  >
                    Copied!
                  </motion.h1>
                ) : (
                  <motion.h1
                    key="email"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-4xl md:text-7xl font-bold tracking-tighter text-foreground group-hover:text-gray-400 transition-colors duration-300"
                  >
                    Let's Talk
                  </motion.h1>
                )}
               </AnimatePresence>

               {/* Hover Line */}
               <div className="w-full h-[2px] bg-foreground group-hover:bg-accent transition-colors duration-300 mt-2"></div>
               
               <p className="mt-4 text-sm text-gray-500 group-hover:text-accent transition-colors">
                 {copied ? "Email copied to clipboard" : "Click to copy email address"}
               </p>
            </div>

            {/* Social Links (Moved to Left Column) */}
            <div className="grid grid-cols-2 gap-6 border-t border-gray-800 pt-8">
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
                    className="flex items-center group"
                  >
                    <span className="text-xs font-mono text-gray-500 mr-3 group-hover:text-accent transition-colors">0{idx + 1}</span>
                    <span className="text-base font-medium text-foreground group-hover:translate-x-2 transition-transform duration-300">
                      {social.name}
                    </span>
                  </a>
                ))}
            </div>
          </div>

          {/* --- RIGHT COLUMN: Form --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50/5 p-8 rounded-2xl border border-white/10" // Adjust background opacity as needed
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-mono uppercase text-gray-400 tracking-wider">What's your name?</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-foreground focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono uppercase text-gray-400 tracking-wider">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-foreground focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono uppercase text-gray-400 tracking-wider">Tell me about your project</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="I need a minimalist website for..."
                  className="w-full bg-transparent border-b border-gray-700 py-3 text-lg text-foreground focus:border-accent focus:outline-none transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="group relative px-8 py-4 bg-foreground text-background font-bold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-accent"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
                    {!isSubmitting && !isSubmitted && (
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    )}
                  </span>
                </button>
              </div>

              {/* Success Message Fade In */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-accent font-mono text-sm"
                  >
                    Thanks for reaching out! I'll get back to you shortly.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}