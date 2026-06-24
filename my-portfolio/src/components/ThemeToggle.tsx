"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return false;
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark") return true;
  if (savedTheme === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDark(initialTheme);
    setIsMounted(true);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "relative flex h-8 w-16 items-center rounded-full border border-border bg-background/80 p-1 text-foreground shadow-sm backdrop-blur transition-colors duration-300",
        !isMounted && "opacity-0",
        className
      )}
    >
      <span className="flex size-6 items-center justify-center text-muted-foreground">
        <Sun className="size-3.5" />
      </span>
      <span className="flex size-6 items-center justify-center text-muted-foreground">
        <Moon className="size-3.5" />
      </span>
      <span
        className={cn(
          "absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow transition-transform duration-300 ease-out",
          isDark && "translate-x-8"
        )}
      >
        {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      </span>
    </button>
  );
}
