import React from "react";
import type { Metadata } from "next";
import db from '@/lib/db';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeGallerySection from "@/components/home/HomeGallerySection";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_GALLERY_ITEMS } from "@/lib/data/initialData";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seo = await db.sEOSettings.findUnique({ where: { pageRoute: "/gallery" } });
    if (seo?.metaTitle) {
      return {
        title: { absolute: seo.metaTitle },
        description: seo.metaDesc || undefined,
        keywords: seo.keywords ? seo.keywords.split(",").map((k: string) => k.trim()) : undefined,
        openGraph: {
          title: seo.ogTitle || seo.metaTitle,
          description: seo.ogDesc || seo.metaDesc || undefined,
        },
      };
    }
  } catch {}
  return {
    title: { absolute: "Interior Gallery | MA Carpenter and Interior Noida" },
    description:
      "Explore high-resolution photography of luxury living rooms, master bedrooms, modular kitchens, custom woodwork, and walk-in wardrobes.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  let galleryItems: any[] = [];

  try {
    galleryItems = await db.gallery.findMany({
      include: { category: true },
      orderBy: { orderIndex: "asc" },
    });
  } catch (err) {
    console.error("Gallery query error:", err);
  }

  const displayItems =
    galleryItems.length > 0
      ? galleryItems
      : INITIAL_GALLERY_ITEMS.map((item, idx) => ({
          ...item,
          id: `init-gal-${idx}`,
          category: {
            slug: item.categorySlug,
            name: item.categorySlug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
          },
        }));

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28 sm:pt-32 lg:pt-36">
        {/* Gallery Hero Header */}
        <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Visual Showcase</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Bespoke Interior & <span className="gold-text-gradient">Carpentry Gallery</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in authentic photography of our artisanal woodworking, modular kitchen layouts, false ceilings, and residential transformations.
            </p>
          </div>
        </section>

        {/* Gallery Masonry with Lightbox */}
        <HomeGallerySection items={displayItems} />

        {/* Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}

