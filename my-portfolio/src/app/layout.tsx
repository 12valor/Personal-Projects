import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Import here

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Mark Ashton | Portfolio",
  description: "Graphic Designer & Visual Artist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${poppins.className} antialiased bg-background text-foreground`}>
        <Navbar /> {/* Add Navbar here, above children */}
        {children}
      </body>
    </html>
  );
}