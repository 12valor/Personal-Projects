import type { Metadata } from "next";
import "./globals.css";
// CRITICAL: Import these to fix the "not defined" error
import { Navbar } from "@/components/Navbar";
import { GridContainer } from "@/components/GridContainer";

export const metadata: Metadata = {
  title: "Critique | Direct Creator Feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet" />
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