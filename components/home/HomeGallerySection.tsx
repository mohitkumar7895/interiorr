"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { Sparkles, Maximize2, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: {
    slug: string;
    name: string;
  };
}

interface HomeGallerySectionProps {
  items: GalleryItem[];
}

export default function HomeGallerySection({ items }: HomeGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { slug: "all", name: "All Works" },
    { slug: "living-room", name: "Living Room" },
    { slug: "bedroom", name: "Bedroom" },
    { slug: "modular-kitchen", name: "Modular Kitchen" },
    { slug: "study-room", name: "Study Room" },
    { slug: "luxury-wardrobes", name: "Wardrobes" },
    { slug: "custom-woodwork", name: "Custom Woodwork" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category?.slug === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex(
      activeLightboxIndex === 0 ? filteredItems.length - 1 : activeLightboxIndex - 1
    );
  };

  const nextImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex(
      activeLightboxIndex === filteredItems.length - 1 ? 0 : activeLightboxIndex + 1
    );
  };

  return (
    <section className="relative py-24 bg-brand-black border-t border-brand-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>Visual Splendor</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Premium Interior <span className="gold-text-gradient">Gallery</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A curated visual showcase of our artisanal carpentry and bespoke interior styling across residential spaces in Noida.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat.slug
                    ? "bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black shadow-gold-sm scale-105"
                    : "bg-brand-surface text-gray-300 hover:text-brand-gold border border-brand-gold/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-brand-surface/40 rounded-2xl border border-brand-gold/20 max-w-lg mx-auto">
            <Sparkles size={24} className="text-brand-gold mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg text-white font-bold mb-1">No Gallery Items in this Category</h3>
            <p className="text-xs text-gray-400">Switch category above to explore our bespoke interior portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredItems.slice(0, 9).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative h-52 sm:h-64 md:h-72 rounded-2xl overflow-hidden cursor-pointer border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-500 hover:shadow-2xl"
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-surface/80 backdrop-blur-md border border-brand-gold/40 flex items-center justify-center text-brand-gold opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all">
                      <Maximize2 size={15} />
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                      {item.category?.name || "Bespoke"}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-white mt-1 group-hover:text-brand-goldLight transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Gallery Link CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/40 text-brand-gold hover:text-brand-goldLight text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            <span>Explore Full Masonry Gallery</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <button
            onClick={closeLightbox}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-white hover:text-brand-gold flex items-center justify-center z-50 transition-colors shadow-xl"
            aria-label="Close Lightbox"
          >
            <X size={18} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-white hover:text-brand-gold flex items-center justify-center z-50 transition-colors shadow-xl"
            aria-label="Previous Image"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-white hover:text-brand-gold flex items-center justify-center z-50 transition-colors shadow-xl"
            aria-label="Next Image"
          >
            <ChevronRight size={18} />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="relative w-full h-[50vh] sm:h-[65vh] rounded-xl sm:rounded-2xl overflow-hidden border border-brand-gold/30 bg-black">
              <SafeImage
                src={filteredItems[activeLightboxIndex].imageUrl}
                alt={filteredItems[activeLightboxIndex].title}
                fill
                sizes="(max-width: 1024px) 95vw, 85vw"
                quality={85}
                className="object-contain"
              />
            </div>
            <div className="text-center mt-3 sm:mt-4 px-4 max-w-xl">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-gold font-bold">
                {filteredItems[activeLightboxIndex].category?.name}
              </span>
              <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-white mt-1">
                {filteredItems[activeLightboxIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

