import type { Metadata, Viewport } from "next";
import { Poppins, Italianno, Boldonse, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";

// Load Inter as the primary sans-serif (replaces external Fontshare General Sans)
const inter = Inter({
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Load Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

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

const italianno = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italianno",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
      <body className={`${inter.variable} ${plusJakartaSans.variable} ${poppins.variable} ${boldonse.variable} ${italianno.variable} font-sans flex flex-col min-h-screen bg-brand-50 text-gray-900 antialiased`}>
        <SmoothScroll>
          <ConditionalNavbar>
            <Navbar />
          </ConditionalNavbar>
          <main className="flex-grow w-full">
            {children}
          </main>
          <ConditionalFooter>
            <Footer />
          </ConditionalFooter>
        </SmoothScroll>
      </body>
    </html>
  );
}