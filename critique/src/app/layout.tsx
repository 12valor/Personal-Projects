import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar"; // <--- Import the Navbar
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Critique - Channel Feedback",
  description: "Get honest feedback on your YouTube channel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Navbar goes here so it stays on every page */}
        <Navbar />
        
        {/* This is where your page.tsx content renders */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}