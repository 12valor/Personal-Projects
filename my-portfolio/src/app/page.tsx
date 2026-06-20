import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact";
import TechStack from "../components/TechStack";
import { serializeProject } from "../lib/project-mappers";
import { getSupabaseServerClient, type PortfolioProjectRow, type PortfolioTechStackRow } from "../lib/supabase";

// Revalidate every 60 seconds so admin changes reflect quickly
export const revalidate = 60;

export default async function Home() {
  let projects: PortfolioProjectRow[] = [];
  let techStack: PortfolioTechStackRow[] = [];
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_index", { ascending: true })
      .order("id", { ascending: false })
      .returns<PortfolioProjectRow[]>();

    if (error) throw error;
    projects = data;

    const { data: techStackData, error: techStackError } = await supabase
      .from("tech_stack")
      .select("*")
      .order("id", { ascending: true })
      .returns<PortfolioTechStackRow[]>();

    if (techStackError) throw techStackError;
    techStack = techStackData;
  } catch (error) {
    console.warn("Supabase connection failed during build on the home page. Pre-rendering with empty projects list.", error);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <TechStack items={techStack} />
        <About />
      <Services />
      <WorkGrid initialProjects={projects.map(serializeProject)} />
      <Contact />
    </main>
  );
}
