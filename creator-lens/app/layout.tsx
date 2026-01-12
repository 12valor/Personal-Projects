import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"], 
  variable: "--font-poppins",   
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
      <body className={`${poppins.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}