"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Timeline", href: "#timeline" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#work" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-background/85 py-3 backdrop-blur-xl"
          : "bg-transparent py-5",
      )}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-full max-w-sm flex-col border-r border-border p-6">
              <SheetHeader className="text-left">
                <SheetTitle className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Navigate
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col justify-center gap-3">
                {navLinks.map((link, index) => (
                  <SheetClose key={link.name} asChild>
                    <Link
                      href={link.href}
                      className="group flex items-baseline justify-between border-b border-border py-4 text-3xl font-semibold tracking-tight"
                    >
                      {link.name}
                      <span className="font-mono text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
              <ThemeToggle />
            </SheetContent>
          </Sheet>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border/80 bg-background/80 p-1 shadow-sm backdrop-blur md:flex">
          {navLinks.map((link) => (
            <Button key={link.name} asChild variant="ghost" size="sm" className="rounded-full px-4">
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </div>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
