import { supabase } from "../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react"; // Make sure you have lucide-react or use an SVG

interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
}

export default async function WorkGrid() {
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false });

  if (!projects || projects.length === 0) {
    return (
      <section className="px-6 py-24 text-center border-t border-border">
        <p className="text-gray-400 font-light">Portfolio is currently empty.</p>
      </section>
    );
  }

  return (
    <section id="work" className="px-6 md:px-16 pt-0 pb-32 bg-background border-t border-border">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-baseline justify-between mb-12 md:mb-20 pt-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Selected Works
        </h2>
        <span className="text-xs font-mono text-gray-400 hidden md:block">
          ( {projects.length.toString().padStart(2, '0')} )
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
        
        {projects.map((project: Project) => (
          <Link 
            href={`/work/${project.id}`} 
            key={project.id} 
            className="group block relative"
          >
            {/* 1. Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 border border-gray-100 mb-6 shadow-sm rounded-sm">
              
              {/* Overlay: Darken slightly on hover + Icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-20 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white rounded-full items-center justify-center hidden group-hover:flex opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <ArrowUpRight className="w-5 h-5 text-black" />
                 </div>
              </div>
              
              <div className="w-full h-full relative">
                {project.image_url ? (
                   <Image 
                   src={project.image_url} 
                   alt={project.title} 
                   fill 
                   // THE MAGIC TRICK:
                   // 1. object-top: Start showing from the top
                   // 2. group-hover:object-bottom: Scroll to bottom on hover
                   // 3. duration-[3s]: Take 3 seconds to scroll (adjust for speed)
                   className="object-cover object-top transition-[object-position] duration-[3s] ease-in-out group-hover:object-bottom"
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                    <span className="text-xs uppercase tracking-widest">No Preview</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Text Content */}
            <div className="flex flex-col items-start space-y-3 pr-8">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent/80 pl-[1px]">
                {project.category}
              </span>
              
              <div className="relative inline-block">
                <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}