import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import LayoutClient from "@/components/LayoutClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://fecoka.org'),
  title: {
    default: "FECOKA | Federación Costarricense de Karate",
    template: "%s | FECOKA"
  },
  description: "Sitio oficial de la Federación Costarricense de Karate. Entidad rectora del Karate-Do en Costa Rica. Noticias, eventos, rankings y academias afiliadas.",
  keywords: ["Karate", "Costa Rica", "FECOKA", "Artes Marciales", "Deporte", "Federación", "Karate-Do", "Tatami", "Kumite", "Kata"],
  authors: [{ name: "FECOKA" }],
  creator: "FECOKA",
  publisher: "FECOKA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "https://fecoka.org",
    siteName: "FECOKA",
    title: "Federación Costarricense de Karate | FECOKA",
    description: "Desarrollando la excelencia en el Karate-Do costarricense. Consulta noticias oficiales, rankings y eventos.",
    images: [
      {
        url: "/assets/seleccion-integrantes.jpg",
        width: 1200,
        height: 630,
        alt: "Selección Nacional de Karate Costa Rica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FECOKA | Federación Costarricense de Karate",
    description: "El sitio oficial del Karate-Do en Costa Rica.",
    images: ["/assets/seleccion-integrantes.jpg"],
  },
  icons: {
    icon: "/assets/fecoka-logo.jpg",
    shortcut: "/assets/fecoka-logo.jpg",
    apple: "/assets/fecoka-logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased text-deep-black bg-mist-white`}>
        <Providers>
          <ErrorBoundary>
            <LayoutClient>
              {children}
            </LayoutClient>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
