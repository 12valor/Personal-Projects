import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // 1. Import Poppins
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

// 2. Configure Poppins with specific weights for a premium feel
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Regular, Medium, Semi-Bold
  variable: "--font-poppins",    // CSS variable for Tailwind
});

export const metadata: Metadata = {
  title: "CreatorLens",
  description: "AI-Powered YouTube Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the font variable, base background, and text color */}
      <body className={`${poppins.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}