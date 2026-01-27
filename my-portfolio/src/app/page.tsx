import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Contact from "../components/Contact"; // Import
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      
      <div id="about">
        <About />
      </div>

      <WorkGrid />
      <Services />
      <Contact />
      
    </main>
  );
}