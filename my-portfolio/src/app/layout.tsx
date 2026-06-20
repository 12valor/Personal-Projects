import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AG.Portfolio",
  description: "Designs and edits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const key = "portfolio-theme";
                const saved = localStorage.getItem(key);
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const shouldUseDark = saved ? saved === "dark" : prefersDark;
                document.documentElement.classList.toggle("dark", shouldUseDark);
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased bg-background text-foreground`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
