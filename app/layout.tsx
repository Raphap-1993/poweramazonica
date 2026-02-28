import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";

import { getPublishedSeoForDomain } from "@/lib/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const landingSeoFallback = {
  title: "Power Amazónica | Proyecto Santa Beatriz – Lotes de 150 m² en Chanchamayo",
  description:
    "Conoce el Proyecto Urb. Santa Beatriz de Power Amazónica: lotes de 150 m² con papeles en regla, contrato notarial y facilidades de pago. Solicita información por WhatsApp o llamada.",
};

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const seo = await getPublishedSeoForDomain(host);
  const title = seo.title || landingSeoFallback.title;
  const description = seo.description || landingSeoFallback.description;
  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      locale: "es_PE",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
