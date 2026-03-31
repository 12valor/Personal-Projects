import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Link as LinkIcon, 
  Leaf 
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  tagline?: string;
  motivation?: string;
  imageUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  portfolioUrl?: string;
}

export default function Team({ members = [] }: { members?: TeamMember[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const studioEase = [0.16, 1, 0.3, 1] as any;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const leftItemVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: studioEase
      }
    }
  };

  const rightItemVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: studioEase
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity: sectionOpacity }}
      id="team" 
      className="relative pt-4 lg:pt-8 pb-24 lg:pb-32 bg-transparent overflow-visible font-poppins"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: studioEase }}
            className="text-4xl md:text-[3.5rem] font-sans font-bold tracking-tight text-zinc-900 mb-4 leading-tight"
          >
            Meet The Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: studioEase, delay: 0.05 }}
            className="text-lg md:text-xl text-zinc-500 font-poppins font-medium"
          >
            The people behind the systems we build.
          </motion.p>
        </div>

        {/* Team List */}
        <motion.div 
          className="space-y-24 lg:space-y-40"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {members.map((member, index) => (
            <TeamCard 
              key={member.id} 
              member={member} 
              index={index}
              variants={index % 2 === 0 ? leftItemVariants : rightItemVariants}
            />
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}

function TeamCard({ member, index, variants }: { member: TeamMember; index: number; variants: any }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={variants}
      className={`group flex flex-col lg:flex-row gap-10 lg:gap-0 items-stretch ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Left Part: Portrait Container */}
      <div className="relative w-full lg:w-[480px] aspect-[4/5] lg:aspect-auto shrink-0 z-20 flex items-end justify-center">
        
        {/* Soft Radial Depth Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-400/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-blue-400/10 transition-colors duration-700" />

        {/* The Frame / Background Shape */}
        <motion.div 
          className="absolute inset-x-4 lg:inset-x-0 bottom-0 top-16 bg-blue-50/60 backdrop-blur-md rounded-[40px] border border-blue-100/30 shadow-[0_15px_30px_-10px_rgba(30,58,138,0.15)] transition-all duration-700 ease-out"
        />

        {/* The Image (Pops out on hover) */}
        <motion.div 
          className="relative w-full h-[115%] bottom-0 mt-[-15%] transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:-translate-y-4"
        >
          {member.imageUrl ? (
            <div className="relative w-full h-full">
              <Image 
                src={member.imageUrl} 
                alt={member.name} 
                fill 
                className="object-contain object-bottom transition-all duration-700 drop-shadow-[0_20px_50px_rgba(30,58,138,0.2)]"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority={index < 2}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-200/40">
               <Leaf className="w-32 h-32" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Part: Content Card */}
      <motion.div 
        className="flex-1 bg-white/70 backdrop-blur-2xl rounded-[40px] p-8 lg:p-16 border border-zinc-200/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col justify-center relative z-10 -mt-16 lg:mt-0 lg:ml-[-40px] lg:mr-[-40px] transition-all duration-700 ease-in-out"
      >
        <div className="space-y-10">
           <div>
             <div className="flex flex-col gap-2 mb-8">
               <p className="text-zinc-400 font-poppins font-bold uppercase tracking-[0.3em] text-[11px] mb-1">{member.role}</p>
               <h3 className="text-4xl lg:text-5xl font-sans font-bold text-slate-900 tracking-tight leading-none">{member.name}</h3>
               {member.tagline && (
                 <p className="text-blue-600/80 font-poppins font-semibold text-sm md:text-base mt-2 flex items-center gap-2">
                   <span className="w-6 h-[2px] bg-blue-100" />
                   {member.tagline}
                 </p>
               )}
             </div>
           </div>

           <div className="space-y-6 max-w-2xl">
             {member.bio.split('\n').map((para, i) => (
               <p key={i} className="text-slate-500 text-lg lg:text-xl lg:leading-relaxed font-poppins font-medium transition-colors duration-500 group-hover:text-slate-800">
                 {para}
               </p>
             ))}
           </div>

           {/* Professional Actions/Links */}
           <div className="flex flex-wrap items-center gap-6 pt-4">
             {member.portfolioUrl ? (
               <Link 
                  href={member.portfolioUrl}
                  className="inline-flex items-center gap-3 bg-zinc-900 text-white font-poppins font-bold px-8 py-4 rounded-2xl hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/10 transition-all duration-300"
               >
                  View Projects
                  <LinkIcon className="w-4 h-4 translate-y-[1px]" />
               </Link>
             ) : (
                member.linkedinUrl && (
                  <Link 
                  href={member.linkedinUrl}
                  className="inline-flex items-center gap-3 bg-zinc-900 text-white font-poppins font-bold px-8 py-4 rounded-2xl hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/10 transition-all duration-300"
                  >
                    Connect via LinkedIn
                    <Linkedin className="w-4 h-4 translate-y-[-1px]" />
                  </Link>
                )
             )}

             <div className="flex items-center gap-3 pl-4 border-l border-zinc-200/60">
                {member.linkedinUrl && (
                   <SocialLink href={member.linkedinUrl} icon={<Linkedin className="w-5 h-5" />} />
                )}
                {member.facebookUrl && (
                   <SocialLink href={member.facebookUrl} icon={<Facebook className="w-5 h-5" />} />
                )}
                {member.twitterUrl && (
                   <SocialLink href={member.twitterUrl} icon={<Twitter className="w-5 h-5" />} />
                )}
                {member.instagramUrl && (
                   <SocialLink href={member.instagramUrl} icon={<Instagram className="w-5 h-5" />} />
                )}
             </div>
           </div>

           {member.motivation && (
             <motion.div 
               className="pt-12 border-t border-zinc-100/80"
             >
               <h5 className="text-slate-400 font-sans font-bold text-xs uppercase tracking-[0.2em] mb-4">Core Philosophy</h5>
               <p className="text-slate-600 text-[1.1rem] leading-relaxed font-poppins font-medium italic">
                 "{member.motivation}"
               </p>
             </motion.div>
           )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-11 h-11 bg-white border border-zinc-200 text-zinc-900 rounded-xl flex items-center justify-center hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group/social shadow-sm"
    >
      {icon}
    </a>
  );
}

