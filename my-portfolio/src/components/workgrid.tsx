import { supabase } from "../lib/supabase";
import Link from "next/link";
import Image from "next/image";

// Define the shape of our data
interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
}

// Server Component
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
    <section id="work" className="px-6 md:px-16 py-32 bg-background border-t border-border">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-baseline justify-between mb-20">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Selected Works
        </h2>
        <span className="text-xs font-mono text-gray-400 hidden md:block">
          ( {projects.length.toString().padStart(2, '0')} )
        </span>
      </div>

      {/* Grid: Restored to 2 columns to match your red box sizing */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
        
        {projects.map((project: Project) => (
          <Link 
            href={`/work/${project.id}`} 
            key={project.id} 
            className="group block"
          >
            {/* 1. Image Container (Reverted to 4/3 to match the height of your drawing) */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 border border-gray-100 mb-6 shadow-sm">
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 z-10" />
              
              <div className="w-full h-full relative transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.02]">
                {project.image_url ? (
                   <Image 
                   src={project.image_url} 
                   alt={project.title} 
                   fill 
                   className="object-cover"
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
                <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  {project.title}
                </h3>
                <span className="absolute left-0 -bottom-2 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}