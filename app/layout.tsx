import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";

import { getPublishedLandingForDomain } from "@/lib/content";
import { defaultLandingSeo } from "@/lib/content/defaults";
import { resolveSiteUrlFromHost } from "@/lib/seo/site-url";

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
  const proto = headerStore.get("x-forwarded-proto");
  const siteUrl = resolveSiteUrlFromHost(host, proto);
  const { landing } = await getPublishedLandingForDomain(host);
  const seo = landing?.seo ?? defaultLandingSeo;
  const title = seo.title || landingSeoFallback.title;
  const description = seo.description || landingSeoFallback.description;
  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const heroImage = landing?.data.heroSlider.find((slide) => slide.imageUrl?.trim())?.imageUrl;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: "Power Amazónica",
    category: "Real Estate",
    keywords: [
      "Power Amazónica",
      "Proyecto Santa Beatriz",
      "lotes en Chanchamayo",
      "lotes de 150 m2",
      "compra de terrenos",
      "MiVivienda",
    ],
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      locale: "es_PE",
      url: siteUrl,
      siteName: "Power Amazónica",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: ogTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: heroImage ? [heroImage] : undefined,
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
