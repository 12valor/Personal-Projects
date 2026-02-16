"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

// --- FRAMER MOTION VARIANTS ---
// The 'as [number, number, number, number]' strictly tells TypeScript 
// that this is a 4-number tuple, fixing the Vercel build error.
const menuVariants: Variants = {
  initial: { opacity: 0, y: "-100%" },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number], 
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const linkVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4 } 
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    transition: { duration: 0.2 } 
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    setIsMenuVisible(true);
  };

  // CLOSE menu (wait for animation)
  const closeMenu = () => {
    setIsMenuVisible(false);
  };

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

          {/* MOBILE ICON (LEFT) */}
          <div className="md:hidden w-8 h-8">
            {!isMenuOpen ? (
              /* Hamburger */
              <button
                onClick={openMenu}
                className="w-8 h-8 flex flex-col justify-center gap-1.5"
              >
                <span className="h-[2px] w-8 bg-foreground" />
                <span className="h-[2px] w-6 bg-foreground" />
                <span className="h-[2px] w-4 bg-foreground" />
              </button>
            ) : (
              /* X */
              <button
                onClick={closeMenu}
                className="relative w-8 h-8"
              >
                <span className="absolute top-1/2 left-0 w-8 h-[2px] bg-foreground rotate-45" />
                <span className="absolute top-1/2 left-0 w-8 h-[2px] bg-foreground -rotate-45" />
              </button>
            )}
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors relative group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          <div className="w-8 h-8 md:hidden" />
        </div>
      </motion.nav>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence
        onExitComplete={() => setIsMenuOpen(false)}
      >
        {isMenuVisible && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={linkVariants}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
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