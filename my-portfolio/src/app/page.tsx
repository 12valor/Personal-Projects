import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact";
import TechStack from "../components/TechStack";
import { serializeProject } from "../lib/project-mappers";
import { getSupabaseServerClient, type PortfolioProjectRow } from "../lib/supabase";

export default async function Home() {
  let projects: PortfolioProjectRow[] = [];
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false })
      .returns<PortfolioProjectRow[]>();

    if (error) throw error;
    projects = data;
  } catch (error) {
    console.warn("Supabase connection failed during build on the home page. Pre-rendering with empty projects list.", error);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <TechStack />
        <About />
      <Services />
      <WorkGrid initialProjects={projects.map(serializeProject)} />
      <Contact />
    </main>
  );
}
