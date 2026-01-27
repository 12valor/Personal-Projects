import Hero from "../components/Hero";
import About from "../components/About";
import WorkGrid from "../components/WorkGrid";
import Services from "../components/Services";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    // FIX: Removed 'overflow-x-hidden'. 
    // This allows position:sticky in the About section to work correctly.
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      
      {/* Wrapper with ID for navigation */}
      <div id="about">
        <About />
      </div>

      <WorkGrid />
      <Services />
      
      <section id="contact" className="min-h-[50vh] flex items-center justify-center border-t border-border">
        <h2 className="text-3xl text-gray-300">Contact Section Coming Soon</h2>
      </section>
      
      <Footer />
    </main>
  );
}