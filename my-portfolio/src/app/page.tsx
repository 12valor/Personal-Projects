import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact";
import TechStack from "../components/TechStack";
import { prisma } from "../../lib/prisma";
import { serializeProject } from "../lib/project-mappers";

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: { id: "desc" },
  });

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
