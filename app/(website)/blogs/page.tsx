import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import BlogsClient from "@/components/blog/BlogsClient";
import { INITIAL_BLOGS } from "@/lib/data/initialData";
import { Sparkles, Award, ShieldCheck, Compass } from "lucide-react";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Interior Design & Carpentry Blog | MA Carpenter and Interior Noida",
  description:
    "Expert articles on modular kitchen planning, luxury wardrobe design, BWP waterproof marine plywood, and turnkey home renovations in Sector 120, Noida.",
};

export const revalidate = 60;

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    if ((db as any).blogs) {
      blogs = await (db as any).blogs.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch {}

  const displayBlogs = blogs && blogs.length > 0 ? blogs : INITIAL_BLOGS;

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28 sm:pt-32 lg:pt-36">
        {/* Blogs Hero Header */}
        <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="absolute inset-0 bg-luxury-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles size={13} />
              <span>Architectural Woodcraft &amp; Interior Journal</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Interior Design &amp; Carpentry <span className="gold-text-gradient">Insights</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Deep, honest architectural advice from master craftsmen and interior planners in Noida. Learn how to plan modular kitchens, choose waterproof marine ply, design luxury glass wardrobes, and budget turnkey 3BHK residences without costly mistakes.
            </p>

            {/* Credibility Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-300">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-charcoal/60 border border-brand-gold/20">
                <Award size={14} className="text-brand-gold" />
                <span>Written by Master Carpenters</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-charcoal/60 border border-brand-gold/20">
                <ShieldCheck size={14} className="text-brand-gold" />
                <span>IS:710 Marine Grade Plywood Standards</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-charcoal/60 border border-brand-gold/20">
                <Compass size={14} className="text-brand-gold" />
                <span>Tailored for Noida High-Rise Living</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Blog Explorer & Articles */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogsClient blogs={displayBlogs} />
        </section>

        {/* Free Consultation CTA */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}
