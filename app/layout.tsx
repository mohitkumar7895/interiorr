import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080808",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://macarpenterandinterior.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MA Carpenter and Interior | Luxury Interior Design & Custom Woodwork Noida",
    template: "%s | MA Carpenter and Interior",
  },
  description:
    "Discover premium interior design, modular kitchens, custom woodwork, and complete home interior solutions in Sector 120, Noida by MA Carpenter and Interior.",
  keywords: [
    "interior design noida",
    "carpenter noida",
    "modular kitchen sector 120",
    "custom furniture noida",
    "luxury home interior",
    "MA carpenter and interior",
    "monish pasha interior",
    "false ceiling noida",
    "luxury woodwork noida",
    "turnkey interior contractor noida"
  ],
  authors: [{ name: "MA Carpenter and Interior", url: siteUrl }],
  creator: "Monish Pasha",
  publisher: "MA Carpenter and Interior",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "MA Carpenter and Interior | Designing Spaces, Defining Lifestyles",
    description:
      "Bespoke luxury interior design, modular kitchens, and master craftsmanship in Sector 120, Noida.",
    url: siteUrl,
    siteName: "MA Carpenter and Interior",
    images: [
      {
        url: "/images/ma-reference-branding.jpg",
        width: 1200,
        height: 630,
        alt: "MA Carpenter and Interior Luxury Showroom",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MA Carpenter and Interior | Luxury Interior Design Noida",
    description:
      "Transforming spaces into mastercrafted sanctuaries in Sector 120, Noida and Delhi NCR.",
    images: ["/images/ma-reference-branding.jpg"],
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
  icons: {
    icon: "/logo/ma-emblem.svg",
    apple: "/logo/ma-emblem.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "googlee1b9b940e4fdfba8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Organization & LocalBusiness JSON-LD Schema */}
        <JsonLd />

        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-brand-black text-brand-cream antialiased selection:bg-brand-gold selection:text-brand-black">
        {children}
        <WhatsAppButton />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#161616",
              color: "#F7F0E5",
              border: "1px solid rgba(217, 164, 65, 0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
