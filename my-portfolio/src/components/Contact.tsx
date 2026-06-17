"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Copy, Check, Loader2, Github, Facebook } from "lucide-react";

export default function Contact() {
  // --- STATE ---
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for parallax disabling
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const email = "evangelista.agdiaz@gmail.com";

  const yText = useTransform(scrollYProgress, [0, 0.6], [isMobile ? 0 : 150, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 0.6], [isMobile ? 1 : 0.85, 1]);
  const yForm = useTransform(scrollYProgress, [0, 0.8], [isMobile ? 0 : 50, 0]);

  // --- HANDLERS ---
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
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (!response.ok) throw new Error("Failed to send inquiry");

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
    <motion.section 
      id="contact" 
      ref={containerRef}
      style={{ opacity: sectionOpacity }}
      className="relative px-4 py-14 md:px-6 md:py-24 bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          
          {/* --- LEFT COLUMN: Typography & Info --- */}
          <div className="flex flex-col h-full pt-4">
            <motion.div 
              style={{ y: yText, scale: scaleText }}
            >
              <h2 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-2 leading-[0.9]">
                Have an idea?
              </h2>
              <p className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-muted-foreground/50 leading-[0.9]">
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
                <p className="text-sm font-medium text-muted-foreground mb-3 tracking-wide uppercase">Drop me an email</p>
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground border-b-2 border-transparent group-hover:border-foreground transition-all duration-300 break-all md:break-normal">
                    {email}
                  </h3>
                  <div className="p-2 text-muted-foreground group-hover:text-foreground transition-colors">
                      {copied ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Copy className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                </div>
                <AnimatePresence>
                  {copied && (
                    <motion.span 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-foreground mt-2 block font-medium"
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
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: Form --- */}
          <motion.div
            style={{ y: yForm }}
            className="bg-card rounded-2xl p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border"
          >
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-foreground">
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
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-foreground focus:ring-0 transition-all outline-none placeholder:text-muted-foreground text-foreground"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">
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
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-foreground focus:ring-0 transition-all outline-none placeholder:text-muted-foreground text-foreground"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">
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
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-transparent focus:bg-background focus:border-foreground focus:ring-0 transition-all outline-none placeholder:text-muted-foreground text-foreground resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium text-lg py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
    </motion.section>
  );
}
