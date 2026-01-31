import { supabase } from "../lib/supabase";
import WorkParallax from "./WorkParallax"; 

// --- ADD THIS LINE HERE ---
export const revalidate = 0; // Forces the page to fetch fresh data every time

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
      
      {/* Header Spacer */}
      <div className="pt-12 mb-12 md:mb-16"></div>

      {/* Grid Container */}
      <div className="max-w-5xl mx-auto">
         <WorkParallax projects={projects} />
      </div>

    </section>
  );
}