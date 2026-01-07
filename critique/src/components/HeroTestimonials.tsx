"use client";

import React, { useState, useEffect } from "react";

// --- TYPES ---
type Testimonial = {
  id: number;
  user: {
    name: string;
    handle: string;
    img: string;
  };
  timestamp: string;
  content: React.ReactNode;
  dataVisual: React.ReactNode;
  flag: React.ReactNode;
};

// --- DATA ---
// Added a 3rd set to make the cycle smoother
const testimonials: Testimonial[] = [
  {
    id: 1,
    user: { name: "Marcus K.", handle: "@marcus_tech", img: "https://ui-avatars.com/api/?name=Marcus+K&background=F4F4F5&color=52525B" },
    timestamp: "2h ago",
    content: (
      <>
        The drop-off at <span className="font-mono text-[#FF0032] bg-[#FF0032]/10 px-1 rounded">04:20</span> was killing the algo push. We cut the B-roll sequence by 8s as suggested.
      </>
    ),
    dataVisual: (
      <div className="flex items-end gap-1 h-8 mt-1 w-32 opacity-80">
        {[40, 65, 45, 30, 20, 55, 60, 65].map((h, i) => (
          <div key={i} className={`w-full rounded-sm ${i === 4 ? 'bg-[#FF0032]' : 'bg-slate-400/30 dark:bg-white/20'}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
    flag: <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">Pacing Alert</span>
  },
  {
    id: 2,
    user: { name: "Sarah J.", handle: "@sarah_vlogs", img: "https://ui-avatars.com/api/?name=Sarah+J&background=FEF2F2&color=EF4444" },
    timestamp: "5h ago",
    content: (
      <>
        My hook was burying the lead. Swapped the payoff to the first 5s. CTR jumped to <span className="font-bold">11.5%</span> immediately.
      </>
    ),
    dataVisual: (
      <div className="mt-2 flex items-center gap-2">
         <div className="h-1.5 w-24 bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[80%]" />
         </div>
         <span className="text-[10px] font-bold text-green-600 dark:text-green-400">+7.5%</span>
      </div>
    ),
    flag: <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Hook Velocity</span>
  },
  {
    id: 3,
    user: { name: "Davide R.", handle: "@davide_films", img: "https://ui-avatars.com/api/?name=Davide+R&background=ECFDF5&color=059669" },
    timestamp: "1d ago",
    content: (
      <>
        Audio mix was muddy in the mid-range. The frequency audit caught a clash I missed for weeks. Crisp now.
      </>
    ),
    dataVisual: (
      <div className="flex items-center gap-0.5 mt-2 h-6 opacity-70">
         {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1 bg-slate-400/40 dark:bg-white/30 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
         ))}
      </div>
    ),
    flag: <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-500/10 px-2 py-1 rounded-full">Audio Clarity</span>
  }
];

export const HeroTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Helpers to get neighbor indices for the "scattered" look
  const getPrevIndex = (i: number) => (i - 1 + testimonials.length) % testimonials.length;
  const getNextIndex = (i: number) => (i + 1) % testimonials.length;

  return (
    <div className="hidden lg:flex items-center justify-center relative min-h-[500px] w-full perspective-[1000px] overflow-visible">
      
      {/* --- BACKGROUND AMBIENCE (Subtle) --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[500px] h-[300px] bg-gradient-to-r from-blue-500/5 to-red-500/5 blur-[80px] rounded-full" />
      </div>

      {/* --- CARDS CONTAINER --- */}
      <div className="relative w-[440px] h-[280px]">
        {testimonials.map((item, index) => {
          // Determine position state
          let position = "hidden";
          if (index === activeIndex) position = "active";
          else if (index === getPrevIndex(activeIndex)) position = "prev";
          else if (index === getNextIndex(activeIndex)) position = "next";

          // Calculate Styles based on position
          // Using translate3d for hardware acceleration and smoother motion
          const styles = {
            active: "z-20 opacity-100 scale-100 translate-x-0 translate-y-0 rotate-0 blur-0 grayscale-0",
            prev: "z-10 opacity-40 scale-90 -translate-x-[60%] translate-y-4 -rotate-[6deg] blur-[1px] grayscale",
            next: "z-10 opacity-40 scale-90 translate-x-[60%] translate-y-4 rotate-[6deg] blur-[1px] grayscale",
            hidden: "z-0 opacity-0 scale-75 translate-y-10 blur-sm",
          };

          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${styles[position as keyof typeof styles]}`}
            >
              {/* --- GLASS CARD --- */}
              <div className="h-full w-full bg-white/60 dark:bg-[#111]/40 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col justify-between ring-1 ring-white/20 dark:ring-white/5">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={item.user.img} alt={item.user.name} className="w-10 h-10 rounded-full border border-white/50 dark:border-white/10 shadow-sm object-cover" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">{item.user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{item.user.handle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400/80">{item.timestamp}</span>
                </div>

                {/* Content */}
                <div className="py-2">
                  <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                    {item.content}
                  </p>
                </div>

                {/* Footer (Data + Flag) */}
                <div className="flex items-end justify-between pt-4 border-t border-slate-200/50 dark:border-white/5">
                   <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Analysis</p>
                      {item.dataVisual}
                   </div>
                   {item.flag}
                </div>

                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};