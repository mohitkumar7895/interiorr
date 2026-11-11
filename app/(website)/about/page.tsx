import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import LocationMapSection from "@/components/home/LocationMapSection";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Hammer,
  Clock,
  Compass,
  CheckCircle2,
  Phone,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MA Carpenter and Interior Noida",
  description:
    "Learn about MA Carpenter and Interior's heritage in luxury interior architecture, master carpentry, and turnkey home renovations in Sector 120, Noida.",
};

export default function AboutPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  const values = [
    {
      title: "Generational Joinery",
      desc: "Our workshop combines time-tested mortise & tenon carpentry joinery with European CNC accuracy to ensure your furniture never sags or creaks.",
      icon: <Hammer className="w-6 h-6 text-brand-gold" />,
    },
    {
      title: "Material Transparency",
      desc: "We exclusively specify branded, calibrated BWP marine plywood, Saint-Gobain glass, and certified Blum & Hettich hardware with manufacturer barcodes.",
      icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />,
    },
    {
      title: "On-Time Completion",
      desc: "Our scheduled 5-step milestone process ensures turnkey delivery within 45 to 60 days, backed by weekly video milestone progress reports.",
      icon: <Clock className="w-6 h-6 text-brand-gold" />,
    },
    {
      title: "Architectural Vision",
      desc: "We do not merely build cabinets — we curate atmospheres. Every color palette, ambient lighting track, and marble vein is harmonized.",
      icon: <Compass className="w-6 h-6 text-brand-gold" />,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        {/* About Hero Header */}
        <section className="relative py-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="absolute inset-0 bg-luxury-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Heritage & Craftsmanship</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Designing Spaces, <span className="gold-text-gradient">Defining Lifestyles</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Based in Sector 120, Noida, MA Carpenter and Interior represents the pinnacle of residential interior architecture, bespoke modular kitchens, and artisanal solid woodcraft.
            </p>
          </div>
        </section>

        {/* Brand Story & Narrative */}
        <section className="py-24 bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Collage */}
              <div className="lg:col-span-6 relative pb-6 sm:pb-8">
                <div className="relative h-[280px] sm:h-[380px] md:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-gold/40 shadow-2xl">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="MA Carpenter and Interior Luxury Residence"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={80}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-48 sm:w-56 md:w-60 h-36 sm:h-44 rounded-2xl overflow-hidden border-2 border-brand-gold/60 shadow-2xl hidden min-[480px]:block z-10">
                  <SafeImage
                    src="/images/ma-reference-branding.jpg"
                    alt="Brand Identity"
                    fill
                    sizes="240px"
                    quality={80}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                  Our Mission & Vision
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Where European Engineering Meets{" "}
                  <span className="gold-text-gradient">Indian Heritage Carpentry</span>
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Founded by master craftsmen and interior planners, MA Carpenter and Interior started with a simple belief: that custom woodworking should never compromise on structural durability or aesthetic luxury.
                </p>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Over the past decade, we have completed over 350 turnkey residences across Noida, Greater Noida, and Delhi NCR. From book-matched Italian marble TV consoles in Sector 120 apartments to custom solid teak live-edge dining tables and walk-in glass wardrobes, every piece is manufactured with obsessive attention to detail.
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-gold/20">
                  <div className="p-4 rounded-xl bg-brand-surface border border-brand-gold/20 text-center">
                    <span className="font-serif font-black text-2xl gold-text-gradient block">12+</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Years Experience</span>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-surface border border-brand-gold/20 text-center">
                    <span className="font-serif font-black text-2xl gold-text-gradient block">350+</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Homes Delivered</span>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-surface border border-brand-gold/20 text-center">
                    <span className="font-serif font-black text-2xl gold-text-gradient block">10 Yrs</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Warranty</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:+91${phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-gold-sm transition-all"
                  >
                    <Phone size={15} />
                    <span>Talk with Master Carpenter Monish Pasha</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="py-24 bg-brand-charcoal/50 border-t border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Our Core <span className="gold-text-gradient">Principles</span>
              </h2>
              <p className="mt-3 text-sm text-gray-400">
                The values that guide every cut of wood, joinery fitting, and client handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-brand-surface border border-brand-gold/20 hover:border-brand-gold/50 transition-all hover:-translate-y-1.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                    {val.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Consultation Section */}
        <ConsultationSection />

        {/* Studio Location Map */}
        <LocationMapSection />
      </main>

      <Footer />
    </div>
  );
}

