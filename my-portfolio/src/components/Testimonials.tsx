"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Load Poppins Font (or ensure it's in your layout.tsx)
const fontStyle = {
  fontFamily: '"Poppins", sans-serif',
};

const feedback = [
  {
    id: "01",
    client: "Sherack Dojillo",
    role: "Thesis Partner / TUPV",
    insight: "Engineers robust backend logic for complex systems. Successfully integrated computer vision models into our parking monitoring thesis under tight deadlines.",
    quote: "AG handled the logic that connected our AI model to the web interface."
  },
  {
    id: "02",
    client: "Adriano's Coffee",
    role: "Management",
    insight: "Translates physical brand atmosphere into high-fidelity digital assets. Understands that design is not just aesthetic, but a driver for foot traffic.",
    quote: "The soft opening posters and social captions he wrote actually brought people in."
  },
  {
    id: "03",
    client: "RoastBloxx",
    role: "YouTube Analytics",
    insight: "Mastery of audience retention mechanics. Edits and scripts are structurally optimized for high engagement, resulting in consistent viewership growth.",
    quote: "The pacing change he implemented directly correlated with a spike in retention."
  },
  {
    id: "04",
    client: "Technowatch",
    role: "Student Org / TUPV",
    insight: "Deploys production-ready web solutions. Moves beyond theoretical coursework to build functional, user-centric platforms for the student body.",
    quote: "He didn't just design the site; he built a system we can actually maintain."
  },
];

export default function Testimonials() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax: Left column moves normally, Right column moves slightly slower/faster
  const yColumn1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yColumn2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={containerRef} 
      className="py-32 bg-gray-50 border-t border-gray-200 overflow-hidden"
      style={fontStyle}
    >
      {/* Import Font within component if not global */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header - Centered & Clean */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-4">
            Feedback Loop
          </h2>
          <p className="text-3xl md:text-4xl font-light text-gray-900 leading-tight">
            Observations on technical execution <br className="hidden md:block" />
            and creative direction.
          </p>
        </div>

        {/* Floating Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1 */}
          <motion.div style={{ y: yColumn1 }} className="flex flex-col gap-8">
            {feedback.slice(0, 2).map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </motion.div>

          {/* COLUMN 2 (Offset for Parallax) */}
          <motion.div style={{ y: yColumn2 }} className="flex flex-col gap-8 md:mt-12">
            {feedback.slice(2, 4).map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Individual Card Component
function Card({ item }: { item: typeof feedback[0] }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
      className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300"
    >
      {/* ID Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xs font-semibold text-gray-400">
          {item.id}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-semibold text-gray-900">{item.client}</h3>
          <p className="text-xs text-gray-400">{item.role}</p>
        </div>
      </div>

      {/* Main Insight */}
      <p className="text-lg text-gray-700 leading-relaxed font-normal mb-8">
        "{item.insight}"
      </p>

      {/* Footer / Quote */}
      <div className="pt-6 border-t border-gray-50">
        <p className="text-xs text-gray-400 italic">
          "{item.quote}"
        </p>
      </div>
    </motion.div>
  );
}