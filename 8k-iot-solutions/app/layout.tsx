import type { Metadata } from "next";
import { Poppins, Lobster } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Load Poppins with specific variables
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['100', '300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const lobster = Lobster({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lobster",
});

export const metadata: Metadata = {
  title: {
    default: "8K IoT Solutions",
    template: "%s - 8K IoT Solutions",
  },
  description: "Advanced IoT hardware integration and web solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} ${lobster.variable} font-sans flex flex-col min-h-screen bg-brand-50 text-gray-900 antialiased`}>
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  );
}