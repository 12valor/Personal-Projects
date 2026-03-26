import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TechStack from "../components/TechStack";
import { supabase } from "../lib/supabase";

export const revalidate = 60; // optionally cache for 60s

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false });
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <TechStack />
        <About />
      <Services />
      <WorkGrid initialProjects={projects || []} />
      <Contact />
    </main>
  );
}