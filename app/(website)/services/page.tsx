import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import db from '@/lib/db';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_SERVICES } from "@/lib/data/initialData";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Compass,
  Utensils,
  BedDouble,
  Armchair,
  Hammer,
  Tv,
  Briefcase,
  Layers,
  Home,
  Wrench,
  Box
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | MA Carpenter and Interior Noida",
  description:
    "Explore our complete range of 12 luxury interior design, modular kitchen, bespoke wardrobe, and master carpentry services in Noida.",
};

export const revalidate = 0;

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    services = await db.services.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
    });
  } catch (err) {
    console.error("Services fetch error:", err);
  }

  const displayServices = services.length > 0 ? services : INITIAL_SERVICES;

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        {/* Services Hero Header */}
        <section className="relative py-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Full Portfolio of Solutions</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Bespoke Interior & <span className="gold-text-gradient">Carpentry Services</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every home deserves a tailored solution. Explore our 12 specialized architectural and woodworking services backed by factory precision in Noida.
            </p>
          </div>
        </section>

        {/* Services Comprehensive Grid */}
        <section className="py-24 bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayServices.map((service: any) => {
                const features =
                  typeof service.features === "string"
                    ? JSON.parse(service.features || "[]")
                    : service.features || [];

                return (
                  <div
                    key={service.slug}
                    className="group bg-brand-surface/80 border border-brand-gold/20 hover:border-brand-gold/60 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden">
                        <Image
                          src={service.featuredImage}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent" />

                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-brand-gold/40 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                          {service.category || "Interior"}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-6">
                        <h2 className="font-serif text-2xl font-bold text-white group-hover:text-brand-gold transition-colors mb-2.5">
                          {service.title}
                        </h2>
                        <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-3">
                          {service.shortDesc}
                        </p>

                        {/* Top Features List */}
                        {features.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-brand-gold/15 mb-4">
                            {features.slice(0, 3).map((feat: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-400">
                                <CheckCircle2 size={13} className="text-brand-gold flex-shrink-0" />
                                <span className="line-clamp-1">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 border-t border-brand-gold/10 flex items-center justify-between">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-goldLight inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-1"
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </Link>

                      <Link
                        href="/contact"
                        className="text-[11px] text-gray-400 hover:text-white transition-colors"
                      >
                        Get Free Quote &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}
