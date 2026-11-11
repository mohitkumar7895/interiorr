"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import {
  Compass,
  Utensils,
  BedDouble,
  Armchair,
  Hammer,
  Sparkles,
  Tv,
  Briefcase,
  Layers,
  Home,
  Wrench,
  Box,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  icon: string;
  featuredImage: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Interior", "Kitchen", "Carpentry"];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  // Icon map helper
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass size={22} />;
      case "Utensils":
        return <Utensils size={22} />;
      case "BedDouble":
        return <BedDouble size={22} />;
      case "Armchair":
        return <Armchair size={22} />;
      case "Hammer":
        return <Hammer size={22} />;
      case "Sparkles":
        return <Sparkles size={22} />;
      case "Tv":
        return <Tv size={22} />;
      case "Briefcase":
        return <Briefcase size={22} />;
      case "Layers":
        return <Layers size={22} />;
      case "Home":
        return <Home size={22} />;
      case "Wrench":
        return <Wrench size={22} />;
      case "Box":
        return <Box size={22} />;
      default:
        return <Sparkles size={22} />;
    }
  };

  return (
    <section className="relative py-24 bg-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>Master Craftsmanship</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our Signature <span className="gold-text-gradient">Services</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-400">
            From precision modular kitchens and solid teakwood bespoke furniture to complete turnkey luxury home transformations in Noida & Delhi NCR.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black shadow-gold-sm scale-105"
                    : "bg-brand-surface text-gray-300 hover:text-brand-gold hover:border-brand-gold/40 border border-brand-gold/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative bg-brand-charcoal/80 border border-brand-gold/20 hover:border-brand-gold/60 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Featured Image with Dark Overlay */}
              <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden">
                <SafeImage
                  src={service.featuredImage}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80}
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent pointer-events-none" />

                {/* Service Category Badge */}
                <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-brand-gold/40 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                  {service.category}
                </div>

                {/* Floating Icon Orb */}
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-brand-surface/90 backdrop-blur-md border border-brand-gold/40 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-300 shadow-lg">
                  {getIcon(service.icon)}
                </div>
              </div>

              {/* Service Details Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-brand-gold transition-colors mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-4 border-t border-brand-gold/15 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-goldLight inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-1"
                  >
                    <span>Explore Service</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/contact"
                    className="text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    Get Quote &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-brand-goldLight text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-gold-sm"
          >
            <span>Browse All 12 Services & Details</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

