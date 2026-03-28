import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// 1. Configure the font
const poppins = Poppins({
  subsets: ["latin"],
  // Add the weights you plan to use (300 for light, 400 for normal, etc.)
  weight: ["300", "400", "500", "600", "700", "800"], 
  // This creates a CSS variable we can pass to Tailwind
  variable: "--font-poppins", 
});

export const metadata: Metadata = {
  title: "Talisay LGU Dashboard",
  description: "Geospatial Analysis and RSSI Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Inject the CSS variable into the HTML tag
    <html lang="en" className={`${poppins.variable}`}>
      {/* 3. Apply Tailwind's 'font-sans' to the body so it defaults to Poppins everywhere */}
      <body className="font-sans bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}