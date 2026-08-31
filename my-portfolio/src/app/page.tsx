import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact";
import TechStack from "../components/TechStack";
import GithubActivity from "../components/GithubActivity";
import Clients from "../components/Clients";
import { serializeProject } from "../lib/project-mappers";
import {
  getSupabaseServerClient,
  type PortfolioClientRow,
  type PortfolioProjectRow,
  type PortfolioTechStackRow,
} from "../lib/supabase";

// Revalidate every 60 seconds so admin changes reflect quickly
export const revalidate = 60;

export default async function Home() {
  let projects: PortfolioProjectRow[] = [];
  let techStack: PortfolioTechStackRow[] = [];
  let clients: PortfolioClientRow[] | null = null;

  try {
    const supabase = getSupabaseServerClient();
    const [projectsResult, techStackResult, clientsResult] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("display_index", { ascending: true })
        .order("id", { ascending: false })
        .returns<PortfolioProjectRow[]>(),
      supabase
        .from("tech_stack")
        .select("*")
        .order("id", { ascending: true })
        .returns<PortfolioTechStackRow[]>(),
      supabase
        .from("clients")
        .select("*")
        .eq("is_visible", true)
        .order("display_index", { ascending: true })
        .order("id", { ascending: true })
        .returns<PortfolioClientRow[]>(),
    ]);

    if (projectsResult.error) {
      console.warn("Projects could not be loaded.", projectsResult.error);
    } else {
      projects = projectsResult.data;
    }

    if (techStackResult.error) {
      console.warn("Tech stack could not be loaded.", techStackResult.error);
    } else {
      techStack = techStackResult.data;
    }

    if (clientsResult.error) {
      console.warn(
        "Client logos could not be loaded. Rendering the local fallback logos.",
        clientsResult.error,
      );
    } else {
      clients = clientsResult.data;
    }
  } catch (error) {
    console.warn(
      "Supabase connection failed during build on the home page. Pre-rendering with local fallbacks.",
      error,
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <GithubActivity />
      <TechStack items={techStack} />
      <About />
      <Services />
      <WorkGrid initialProjects={projects.map(serializeProject)} />
      <Clients items={clients} />
      <Contact />
    </main>
  );
}
