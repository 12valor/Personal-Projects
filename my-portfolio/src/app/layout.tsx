import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import SmoothScrollProvider from "../components/SmoothScrollProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://12valor.vercel.app"),
  title: {
    default: "AG Diaz Evangelista — Full-Stack Developer & Designer",
    template: "%s | AG.Portfolio",
  },
  description:
    "Personal portfolio and selected works of AG Diaz Evangelista: full-stack web applications, interface experiments, video editing, and graphic design.",
  keywords: [
    "AG Diaz Evangelista",
    "12valor",
    "Full-Stack Developer",
    "Web Developer",
    "Next.js",
    "React",
    "Video Editor",
    "Graphic Designer",
    "Portfolio",
  ],
  authors: [{ name: "AG Diaz Evangelista", url: "https://12valor.vercel.app" }],
  creator: "AG Diaz Evangelista",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://12valor.vercel.app",
    title: "AG Diaz Evangelista — Full-Stack Developer & Designer",
    description:
      "Full-stack products, interface experiments, video editing, and practical systems.",
    siteName: "AG.Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "AG Diaz Evangelista Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AG Diaz Evangelista — Full-Stack Developer & Designer",
    description:
      "Full-stack products, interface experiments, video editing, and practical systems.",
    images: ["/api/og"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "AG Diaz Evangelista",
  url: "https://12valor.vercel.app",
  sameAs: [
    "https://github.com/12valor",
    "https://www.facebook.com/ag.evangelistaii",
  ],
  jobTitle: "Full-Stack Developer & Designer",
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "Supabase",
    "Video Editing",
    "UI/UX Design",
  ],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <SmoothScrollProvider>
          <Navbar />
          {children}
          {modal}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
