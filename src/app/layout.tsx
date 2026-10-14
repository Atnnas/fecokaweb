import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import LayoutClient from "@/components/LayoutClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;
  try {
    session = await auth();
  } catch (_error) {
    console.warn("[Auth] No se pudo desencriptar la sesión actual (posible cookie previa o clave desincronizada). Continuando en modo visitante.");
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "Federación Costarricense de Karate",
    "alternateName": "FECOKA",
    "url": "https://fecoka.org",
    "logo": "https://fecoka.org/assets/fecoka-logo.jpg",
    "description": "Entidad rectora del Karate-Do en Costa Rica. Fomento, regulación y desarrollo de atletas y torneos nacionales e internacionales.",
    "sport": "Karate",
    "parentOrganization": [
      {
        "@type": "SportsOrganization",
        "name": "World Karate Federation",
        "alternateName": "WKF",
        "url": "https://www.wkf.net"
      },
      {
        "@type": "SportsOrganization",
        "name": "Comité Olímpico Nacional de Costa Rica",
        "alternateName": "CON",
        "url": "https://concrc.org"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San José",
      "addressCountry": "CR"
    },
    "sameAs": [
      "https://www.wkf.net"
    ]
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased text-deep-black bg-mist-white`}>
        <Providers session={session}>
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
