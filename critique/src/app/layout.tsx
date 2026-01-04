import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { GridContainer } from "@/components/GridContainer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Defaulting to 'dark' class here ensures #000 load */
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <GridContainer>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </GridContainer>
      </body>
    </html>
  );
}