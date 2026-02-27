import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power Amazónica | Proyecto Santa Beatriz – Lotes de 150 m² en Chanchamayo",
  description:
    "Conoce el Proyecto Urb. Santa Beatriz de Power Amazonica: lotes de 150 m2 en Chanchamayo, con papeles en regla, contrato notarial y facilidades de pago. Agenda tu visita por WhatsApp, llamada o correo.",
  openGraph: {
    title:
      "Power Amazónica | Proyecto Santa Beatriz – Lotes de 150 m² en Chanchamayo",
    description:
      "Proyecto Urb. Santa Beatriz en Chanchamayo: lotes de 150 m2, papeles en regla, contrato notarial y facilidades de pago.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
