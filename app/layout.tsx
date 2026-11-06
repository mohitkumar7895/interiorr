import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080808",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
    "false ceiling noida"
  ],
  authors: [{ name: "MA Carpenter and Interior" }],
  openGraph: {
    title: "MA Carpenter and Interior | Designing Spaces, Defining Lifestyles",
    description:
      "Bespoke luxury interior design, modular kitchens, and master craftsmanship in Sector 120, Noida.",
    url: "http://localhost:3000",
    siteName: "MA Carpenter and Interior",
    images: [
      {
        url: "/images/ma-reference-branding.jpg",
        width: 1200,
        height: 630,
        alt: "MA Carpenter and Interior Branding",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/logo/ma-emblem.svg",
    apple: "/logo/ma-emblem.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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

