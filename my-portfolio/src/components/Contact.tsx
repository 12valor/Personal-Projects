"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { supabase } from "../lib/supabase"; 
import { ArrowUpRight, Copy, Check, Loader2, Github, Linkedin, Youtube, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  const containerRef = useRef(null);
  
  // --- PARALLAX SETUP ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax for the background word
  const yBg = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  // State
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const email = "evangelista.agdiaz@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    try {
      const { error } = await supabase.from('inquiries').insert([{ 
        name: formState.name, 
        email: formState.email, 
        message: formState.message 
      }]);

      if (error) throw error;

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMsg("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.facebook.com/ag.evangelistaii", icon: <Facebook className="w-5 h-5" /> },
    { name: "GitHub", url: "https://github.com/12valor", icon: <Github className="w-5 h-5" /> },
  ];

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="relative py-16 md:py-32 px-4 md:px-6 bg-white border-t border-gray-100 overflow-hidden"
    >
      
      {/* --- BACKGROUND WATERMARK --- */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.03]"
      >
        <h1 className="text-[25vw] font-black text-black leading-none tracking-tighter -ml-4 md:-ml-10">
          LET'S
        </h1>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* CHANGED: Reduced gap on mobile (gap-12) vs desktop (gap-24) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT COLUMN: Typography & Info --- */}
          <div className="flex flex-col h-full pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* CHANGED: Responsive font sizes (text-5xl -> text-8xl) to fit mobile screens */}
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-black mb-2 leading-[0.9]">
                Have an idea?
              </h2>
              <p className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-gray-300 leading-[0.9]">
                Let's build it.
              </p>
            </motion.div>

            <div className="mt-12 md:mt-24">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="group cursor-pointer w-full md:w-fit" 
                onClick={handleCopy}
              >
                <p className="text-sm font-medium text-gray-500 mb-3 tracking-wide uppercase">Drop me an email</p>
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  {/* CHANGED: Smaller text on mobile (text-xl/2xl) to prevent email overflow, larger on desktop */}
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-black border-b-2 border-transparent group-hover:border-black transition-all duration-300 break-all md:break-normal">
                    {email}
                  </h3>
                  <div className="p-2 text-gray-400 group-hover:text-black transition-colors">
                     {copied ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Copy className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                </div>
                <AnimatePresence>
                  {copied && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-black mt-2 block font-medium"
                    >
                      Copied to clipboard.
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Socials */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="flex flex-wrap gap-4 mt-8 md:mt-12"
            >
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: Clean Card Form --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            // CHANGED: Reduced padding on mobile (p-6) vs desktop (p-12) for better space usage
            className="bg-white rounded-2xl p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Your email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none placeholder:text-gray-400 text-gray-900"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-900">
                  Project Description
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project needs..."
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-black focus:ring-0 transition-all outline-none placeholder:text-gray-400 text-gray-900 resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium text-lg py-4 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isSubmitted ? (
                    <>Message Sent <Check className="w-5 h-5" /></>
                  ) : (
                    <>Send Message <ArrowUpRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {(isSubmitted || errorMsg) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-sm text-center font-medium mt-4 ${isSubmitted ? "text-green-600" : "text-red-600"}`}
                  >
                    {isSubmitted ? "Thanks! I'll be in touch soon." : errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}