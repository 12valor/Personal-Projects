"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Facebook, Github, Mail, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Magnetic } from "./ui/Magnetic";

interface NavLinkItem {
  id: string;
  name: string;
  href: string;
  num: string;
  tag: string;
}

const navLinks: NavLinkItem[] = [
  { id: "timeline", name: "Timeline", href: "#timeline", num: "01", tag: "Journey & Education" },
  { id: "services", name: "Services", href: "#services", num: "02", tag: "Design, Motion & Code" },
  { id: "work", name: "Projects", href: "#work", num: "03", tag: "Selected Web & Systems" },
  { id: "graphic-designs", name: "Graphics", href: "#graphic-designs", num: "04", tag: "Visuals & Posters" },
  { id: "contact", name: "Contact", href: "#contact", num: "05", tag: "Get in Touch" },
];

const CONTACT_EMAIL = "evangelista.agdiaz@gmail.com";

export default function Navbar() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState<string>("");

  const pathname = usePathname();
  const lenis = useSmoothScroll();

  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);
  const ticking = useRef(false);

  // Live Philippines time (Sibulan, PH) for high-craft editorial context
  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(new Date());
        setTimeString(formatted);
      } catch {
        setTimeString("");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll click handler
  const handleNavClick = useCallback(
    (href: string, e?: React.MouseEvent) => {
      if (pathname === "/" && href.startsWith("#")) {
        if (e) e.preventDefault();
        const targetId = href.replace("#", "");
        setActiveSection(targetId === "hero" ? "" : targetId);

        if (href === "#hero" || href === "#") {
          if (lenis) {
            lenis.scrollTo(0, { offset: 0 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          if (lenis) {
            lenis.scrollTo(href, { offset: -50 });
          } else {
            const el = document.querySelector(href);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 50;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }
        }
      }
    },
    [pathname, lenis]
  );

  // Copy email helper
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Scroll detection & Scroll-Spy
  useEffect(() => {
    const threshold = 10;
    const topThreshold = 30;

    const updateNav = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      // Scrolled state
      setIsScrolled(currentScrollY > topThreshold);

      // Show/Hide logic
      if (currentScrollY <= topThreshold) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsNavVisible(true);
        }
      } else if (Math.abs(diff) >= threshold) {
        if (diff > 0 && isVisibleRef.current) {
          // Scrolling down -> hide navbar to maximize canvas
          isVisibleRef.current = false;
          setIsNavVisible(false);
        } else if (diff < 0 && !isVisibleRef.current) {
          // Scrolling up -> instantly reveal navbar
          isVisibleRef.current = true;
          setIsNavVisible(true);
        }
      }

      // Scroll-Spy detection on home page
      if (pathname === "/") {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;

        // Near the top of the page
        if (currentScrollY < 250) {
          setActiveSection("");
        }
        // At the bottom of the page -> activate Contact
        else if (currentScrollY + winHeight >= docHeight - 120) {
          setActiveSection("contact");
        } else {
          // Check sections in reverse order so inner sections (e.g. graphics) take precedence
          const sectionsToCheck = [...navLinks].reverse();
          let matched = false;

          for (const link of sectionsToCheck) {
            const element = document.getElementById(link.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Check if top is within viewport threshold
              if (rect.top <= winHeight * 0.45 && rect.bottom >= winHeight * 0.15) {
                setActiveSection(link.id);
                matched = true;
                break;
              }
            }
          }

          if (!matched && currentScrollY < 500) {
            setActiveSection("");
          }
        }
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNav);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial check
    updateNav();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      role="banner"
      className={cn(
        "fixed inset-x-0 top-4 md:top-6 z-50 pointer-events-none transition-[transform,opacity] duration-300 ease-out will-change-transform",
        isNavVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-24 opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* LEFT ANCHOR: Brand Monogram & Live Availability Status    */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center">
          <Magnetic strength={0.15}>
            <Link
              href={pathname === "/" ? "#hero" : "/"}
              onClick={(e) => handleNavClick("#hero", e)}
              className={cn(
                "group flex items-center gap-2.5 rounded-full border border-border/80 bg-background/85 px-3.5 py-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:border-foreground/30 hover:bg-background/95",
                isScrolled && "border-border/90 bg-background/90"
              )}
              aria-label="AG Diaz Evangelista — Scroll to top"
            >
              <span className="font-bold tracking-tight text-sm text-foreground">
                AG<span className="text-accent">.</span>
              </span>
              <span className="h-3 w-px bg-border/80" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                AVAILABLE
              </span>
            </Link>
          </Magnetic>
        </div>

        {/* ========================================================= */}
        {/* CENTER DOCK: Segmented Dynamic Navigation with Scroll-Spy  */}
        {/* ========================================================= */}
        <nav
          aria-label="Primary navigation"
          className={cn(
            "pointer-events-auto hidden md:flex items-center rounded-full border border-border/80 bg-background/85 p-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300",
            isScrolled && "border-border/90 bg-background/90 shadow-md"
          )}
        >
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <Magnetic key={link.id} strength={0.18}>
                  <Link
                    href={pathname === "/" ? link.href : `/${link.href}`}
                    onClick={(e) => handleNavClick(link.href, e)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-colors duration-200 select-none",
                      isActive
                        ? "text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-desktop-active-pill"
                        className="absolute inset-0 rounded-full bg-foreground shadow-xs"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.name}
                    </span>
                  </Link>
                </Magnetic>
              );
            })}
          </div>
        </nav>

        {/* ========================================================= */}
        {/* RIGHT ANCHOR: Action CTA & Theme Toggle (Desktop)         */}
        {/* ========================================================= */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2">
          <Magnetic strength={0.15}>
            <Link
              href={pathname === "/" ? "#contact" : "/#contact"}
              onClick={(e) => handleNavClick("#contact", e)}
              className="group hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:border-foreground/40 hover:bg-foreground hover:text-background"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <ThemeToggle className="border-border/80 bg-background/85 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md" />
          </Magnetic>
        </div>

        {/* ========================================================= */}
        {/* MOBILE TRIGGER & DRAWER                                   */}
        {/* ========================================================= */}
        <div className="pointer-events-auto flex items-center gap-2 md:hidden">
          <ThemeToggle className="border-border/80 bg-background/85 shadow-xs backdrop-blur-md" />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-border/80 bg-background/85 shadow-xs backdrop-blur-md hover:bg-secondary/60"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-full max-w-sm flex-col justify-between border-l border-border bg-background p-6 pointer-events-auto"
            >
              <SheetDescription className="sr-only">
                Site navigation drawer for AG Diaz Evangelista portfolio
              </SheetDescription>

              {/* Drawer Top / Header */}
              <div className="flex flex-col gap-6">
                <SheetHeader className="text-left space-y-1">
                  <div className="flex items-center justify-between pr-8">
                    <SheetTitle className="font-bold tracking-tight text-base text-foreground flex items-center gap-1">
                      AG DIAZ EVANGELISTA
                      <span className="text-accent">.</span>
                    </SheetTitle>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>{"// FULL-STACK & MOTION"}</span>
                    {timeString && (
                      <>
                        <span>•</span>
                        <span>{timeString} SIBULAN</span>
                      </>
                    )}
                  </div>
                </SheetHeader>

                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="font-mono text-xs text-foreground/90">
                    Open for select projects &amp; roles
                  </span>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col divide-y divide-border/60 border-y border-border/60">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;

                    return (
                      <SheetClose key={link.id} asChild>
                        <Link
                          href={pathname === "/" ? link.href : `/${link.href}`}
                          onClick={(e) => {
                            setMobileOpen(false);
                            handleNavClick(link.href, e);
                          }}
                          className={cn(
                            "group flex items-center justify-between py-4 transition-colors",
                            isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                          )}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs text-accent">
                                {link.num}
                              </span>
                              <span className="text-xl font-bold tracking-tight">
                                {link.name}
                              </span>
                              {isActive && (
                                <span className="size-1.5 rounded-full bg-accent" />
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-muted-foreground pl-6">
                              {link.tag}
                            </span>
                          </div>

                          <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom / Footer */}
              <div className="flex flex-col gap-5 pt-4">
                {/* Email Action Card */}
                <div className="rounded-xl border border-border/70 bg-secondary/20 p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Direct Email
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground hover:text-accent transition-colors"
                      aria-label="Copy email address"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="block text-xs font-medium text-foreground underline-offset-4 hover:underline break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="size-8 rounded-full p-0"
                    >
                      <a
                        href="https://github.com/12valor"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                      >
                        <Github className="size-3.5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="size-8 rounded-full p-0"
                    >
                      <a
                        href="https://www.facebook.com/ag.evangelistaii"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook profile"
                      >
                        <Facebook className="size-3.5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="size-8 rounded-full p-0"
                    >
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        aria-label="Send email"
                      >
                        <Mail className="size-3.5" />
                      </a>
                    </Button>
                  </div>

                  <span className="font-mono text-[10px] text-muted-foreground">
                    &copy; {new Date().getFullYear()} 12VALOR
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
