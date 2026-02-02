"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // <--- 1. Import this

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 2. Get the current path
  const pathname = usePathname();

  // 3. HIDE NAVBAR IF ON ADMIN PAGE
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-b border-border py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative">

          {/* CENTER: Desktop Links (Absolutely Positioned) */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors relative group"
              >
                {link.name}
                {/* Hover Underline Animation */}
                <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* RIGHT: Mobile Hamburger (Visible only on mobile) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 relative w-8 h-8 flex flex-col justify-center gap-1.5 group"
          >
            <span className={`h-[2px] bg-foreground transition-all duration-300 ${mobileMenuOpen ? "w-8 rotate-45 translate-y-2" : "w-8"}`} />
            <span className={`h-[2px] bg-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-6 group-hover:w-8"}`} />
            <span className={`h-[2px] bg-foreground transition-all duration-300 ${mobileMenuOpen ? "w-8 -rotate-45 -translate-y-2" : "w-4 group-hover:w-8"}`} />
          </button>

          {/* RIGHT (Desktop Placeholder): Keeps spacing balanced if you add a button later */}
          <div className="hidden md:block w-[40px]"></div> 

        </div>
      </motion.nav>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-semibold tracking-tight hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}