import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import LocationMapSection from "@/components/home/LocationMapSection";
import { Sparkles, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Free Consultation | MA Carpenter and Interior Noida",
  description:
    "Get in touch with MA Carpenter and Interior at Shop No. 6, Sector 120, Noida. Call 8714114418 for free site consultation and 3D estimates.",
};

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const email = process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com";
  const address =
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301";

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        {/* Contact Hero Header */}
        <section className="relative py-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Direct Communication</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Get in Touch for a <span className="gold-text-gradient">Free Consultation</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Whether you need a full turnkey apartment renovation, a modern modular kitchen, or bespoke carpentry repairs, our master artisans are ready to assist.
            </p>
          </div>
        </section>

        {/* Live Form & Details */}
        <ConsultationSection />

        {/* Physical Map & Directions */}
        <LocationMapSection />
      </main>

      <Footer />
    </div>
  );
}

