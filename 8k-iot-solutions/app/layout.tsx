import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Load Poppins with specific weights for strong visual hierarchy
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['100', '300', '400', '500', '600', '700'], // Added '100'
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "8K IoT Solutions | Premium Tech Services",
  description: "Advanced IoT hardware integration and web solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans flex flex-col min-h-screen bg-brand-50 text-gray-900 antialiased`}>
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  );
}