import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// 1. Configure Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"], // Weights needed for editorial feel
  variable: "--font-poppins", // CSS variable for Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "Graphic Designer Portfolio",
  description: "Minimalist portfolio showcasing UI/UX and Video Editing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Apply the variable to the body */}
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}