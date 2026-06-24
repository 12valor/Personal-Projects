"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  const [isNavVisible, setIsNavVisible] = useState(true);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);
  const ticking = useRef(false);

  useEffect(() => {
    const threshold = 10;
    const topOffset = 24;

    const updateNav = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= topOffset) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsNavVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      if (Math.abs(diff) < threshold) {
        ticking.current = false;
        return;
      }

      if (diff > 0 && isVisibleRef.current) {
        // scrolling down
        isVisibleRef.current = false;
        setIsNavVisible(false);
      } else if (diff < 0 && !isVisibleRef.current) {
        // scrolling up
        isVisibleRef.current = true;
        setIsNavVisible(true);
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

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-10 z-50 pointer-events-none transition-[transform,opacity] duration-300 ease-out will-change-transform",
        isNavVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[140%] opacity-0"
      )}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden pointer-events-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full shadow-sm backdrop-blur bg-background/80" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-full max-w-sm flex-col border-r border-border p-6 pointer-events-auto">
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

        {/* Desktop Navbar Pill */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-border/80 bg-background/80 p-1.5 shadow-sm backdrop-blur pointer-events-auto md:flex">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Button key={link.name} asChild variant="ghost" size="sm" className="rounded-full px-4 text-sm">
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </div>
          <div className="ml-2 flex items-center border-l border-border/60 pl-2 pr-0.5">
            <ThemeToggle className="border-none bg-transparent shadow-none" />
          </div>
        </div>

        {/* Mobile Theme Toggle (visible only on mobile) */}
        <div className="md:hidden ml-auto pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
