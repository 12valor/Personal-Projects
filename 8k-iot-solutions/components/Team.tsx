import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  return (
    <section id="team" className="relative py-24 lg:py-32 bg-transparent overflow-visible font-poppins">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simplified Header Section */}
        <div className="text-center mb-16 lg:mb-28">
           <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-[3.5rem] font-sans font-bold tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Meet The Team
          </motion.h2>
        </div>

        {/* Team List */}
        <div className="space-y-32 lg:space-y-48">
          {members.map((member, index) => (
            <TeamCard 
              key={member.id} 
              member={member} 
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col lg:flex-row gap-12 lg:gap-0 items-stretch ${!isEven ? 'lg:flex-row-reverse' : ''}`}
    >
      {/* Left Part: Portrait Container (Overflow Visible for Pop-out) */}
      <div className="relative w-full lg:w-[480px] aspect-[4/5] lg:aspect-auto shrink-0 z-20 flex items-end justify-center">
        
        {/* The Frame / Background Shape */}
        <motion.div 
          className="absolute inset-0 top-12 bg-blue-50/80 backdrop-blur-sm rounded-[32px] border border-blue-100/50 shadow-xl transition-all duration-700 ease-out group-hover:bg-blue-100 group-hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.15)] group-hover:scale-[0.98]"
        />

        {/* The Image (Pops out on hover) */}
        <motion.div 
          className="relative w-full h-[110%] bottom-0 mt-[-10%] transition-all duration-700 ease-out group-hover:scale-[1.12] group-hover:-translate-y-8"
        >
          {member.imageUrl ? (
            <Image 
              src={member.imageUrl} 
              alt={member.name} 
              fill 
              className="object-contain object-bottom transition-all duration-700"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority={index < 2}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-200/40">
               <Leaf className="w-32 h-32" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Part: Content Card */}
      <motion.div 
        className="flex-1 bg-white/95 backdrop-blur-xl rounded-[32px] p-8 lg:p-14 border border-blue-50 shadow-[0_24px_48px_-12px_rgba(59,130,246,0.06)] flex flex-col justify-center relative z-10 -mt-12 lg:mt-0 lg:ml-[-24px] lg:mr-[-24px] transition-all duration-700 ease-in-out group-hover:bg-white group-hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.1)]"
      >
        <div className="space-y-8">
           <div>
             <h3 className="text-4xl lg:text-5xl font-sans font-bold text-slate-900 tracking-tight mb-2 uppercase">{member.name}</h3>
             <p className="text-zinc-400 font-poppins font-bold uppercase tracking-[0.2em] text-[10px]">{member.role}</p>
           </div>

           <div className="space-y-6">
             {member.bio.split('\n').map((para, i) => (
               <p key={i} className="text-slate-600 text-lg lg:text-xl leading-relaxed font-poppins font-medium">
                 {para}
               </p>
             ))}
           </div>

           {/* Socials - Faded Gray Outlined Icons */}
           <div className="flex flex-wrap gap-4 pt-4">
             {member.linkedinUrl && (
               <SocialLink href={member.linkedinUrl} icon={<Linkedin className="w-5 h-5" />} />
             )}
             {member.twitterUrl && (
               <SocialLink href={member.twitterUrl} icon={<Twitter className="w-5 h-5" />} />
             )}
             {member.instagramUrl && (
               <SocialLink href={member.instagramUrl} icon={<Instagram className="w-5 h-5" />} />
             )}
             {member.facebookUrl && (
               <SocialLink href={member.facebookUrl} icon={<Facebook className="w-5 h-5" />} />
             )}
             {member.portfolioUrl && (
               <SocialLink href={member.portfolioUrl} icon={<LinkIcon className="w-5 h-5" />} />
             )}
           </div>

           {member.motivation && (
             <motion.div 
               className="pt-10 border-t border-zinc-100"
             >
               <h5 className="text-slate-900 font-sans font-bold text-lg lg:text-xl mb-4">Why I Created This Solutions?</h5>
               <p className="text-slate-500 text-lg leading-relaxed font-poppins font-medium italic">
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
      className="w-12 h-12 border border-zinc-200 text-zinc-400 rounded-full flex items-center justify-center hover:border-zinc-900 hover:text-zinc-900 hover:bg-zinc-50 hover:scale-110 transition-all duration-300 shadow-sm"
    >
      {icon}
    </a>
  );
}

