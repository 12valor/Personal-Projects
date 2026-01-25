import Hero from "../components/Hero";
import WorkGrid from "../components/workgrid";
import Footer from "../components/Footer";
import About from "../components/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <About />
      <WorkGrid />
      <Footer />
      {/* We will add the Works section here next */}
    </main>
  );
}