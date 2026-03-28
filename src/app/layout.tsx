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
    default: "GetFlatbed — Vuela en Business Class por Menos",
    template: "%s | GetFlatbed",
  },
  description:
    "Alertas en tiempo real de tarifas error, canjes de millas y ofertas de business class. El primer servicio en español para viajeros inteligentes.",
  keywords: [
    "vuelos business class baratos",
    "tarifas error vuelos",
    "business class económico",
    "millas y puntos España",
    "ofertas vuelos España",
    "vuelos flatbed",
    "alertas business class",
  ],
  authors: [{ name: "Equipo GetFlatbed" }],
  creator: "GetFlatbed",
  publisher: "GetFlatbed",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://getflatbed.vercel.app",
    siteName: "GetFlatbed",
    title: "GetFlatbed — Vuela en Business Class por Menos",
    description:
      "Alertas en tiempo real de tarifas error, canjes de millas y ofertas de business class. El primer servicio en español para viajeros inteligentes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GetFlatbed — Business Class por Menos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetFlatbed — Vuela en Business Class por Menos",
    description:
      "Alertas instantáneas de tarifas error y ofertas de business class. Únete gratis.",
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
    "Alertas instantáneas de tarifas error y ofertas de business class desde España.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
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
