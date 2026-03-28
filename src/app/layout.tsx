import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getflatbed.vercel.app"),
  title: {
    default: "GetFlatbed — Fly Business Class for Less Than You Think",
    template: "%s | GetFlatbed",
  },
  description:
    "Get instant alerts for business class flights at a fraction of the price. Error fares, points deals, and upgrades — curated for smart travelers from Spain.",
  keywords: [
    "business class flights",
    "error fares",
    "cheap business class",
    "miles and points Spain",
    "flight deals Spain",
    "flatbed flights",
    "business class alerts",
  ],
  authors: [{ name: "GetFlatbed Team" }],
  creator: "GetFlatbed",
  publisher: "GetFlatbed",
  openGraph: {
    type: "website",
    locale: "en_ES",
    url: "https://getflatbed.vercel.app",
    siteName: "GetFlatbed",
    title: "GetFlatbed — Fly Business Class for Less Than You Think",
    description:
      "Get instant alerts for business class flights at a fraction of the price. Error fares, points deals, and upgrades — curated for smart travelers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GetFlatbed — Business Class for Less",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetFlatbed — Fly Business Class for Less Than You Think",
    description:
      "Instant alerts for business class error fares and deals. Join free.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GetFlatbed",
  url: "https://getflatbed.vercel.app",
  description:
    "Instant alerts for business class error fares and deals from Spain.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0a0a0f] text-white antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
