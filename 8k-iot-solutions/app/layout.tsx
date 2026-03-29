import type { Metadata } from "next";
import { Poppins, Boldonse } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import ConditionalNavbar from "@/components/ConditionalNavbar";

// Load Poppins with specific variables
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['100', '300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const boldonse = Boldonse({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-boldonse",
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
    <html lang="en">
      <body className={`${poppins.variable} ${boldonse.variable} font-sans flex flex-col min-h-screen bg-brand-50 text-gray-900 antialiased`}>
        <SmoothScroll>
          <ConditionalNavbar>
            <Navbar />
          </ConditionalNavbar>
          <main className="flex-grow w-full">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}