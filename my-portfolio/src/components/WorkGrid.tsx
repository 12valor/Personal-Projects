import { supabase } from "../lib/supabase";
import WorkParallax from "./WorkParallax"; 

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
      <div className="max-w-5xl mx-auto flex items-baseline justify-between mb-12 md:mb-16 pt-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Selected Works
        </h2>
        {/* Removed static count to avoid confusion with dynamic filtering */}
      </div>

      {/* Grid Container */}
      <div className="max-w-5xl mx-auto">
         <WorkParallax projects={projects} />
      </div>

    </section>
  );
}