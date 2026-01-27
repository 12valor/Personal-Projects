"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="px-6 py-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
        
        {/* Left: Copyright */}
        <div className="mb-4 md:mb-0">
          &copy; {year} AG Evangelista
        </div>

        {/* Center: Location */}
        <div className="mb-4 md:mb-0 hidden md:block">
          Sibulan, Philippines
        </div>

        {/* Right: Tech Stack */}
        <div className="flex gap-4">
          <span>Next.js</span>
          <span>Tailwind</span>
          <span>Motion</span>
        </div>

      </div>
    </footer>
  );
}