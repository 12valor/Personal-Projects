import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider"; // <--- Importing the file you just made

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {/* We wrap the entire app in the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}