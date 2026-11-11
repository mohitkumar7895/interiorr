import React from "react";
import type { Metadata } from "next";
import db from '@/lib/db';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_PROJECTS } from "@/lib/data/initialData";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Interior Projects & Transformations | MA Carpenter and Interior",
  description:
    "Explore our luxury interior design and carpentry project transformations in Noida, Sector 120, and Delhi NCR with before/after photography.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await db.projects.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: "asc" },
      include: { images: true },
    });
  } catch (err) {
    console.error("Projects page query error:", err);
  }

  const displayProjects =
    projects.length > 0
      ? projects
      : INITIAL_PROJECTS.map((p, idx) => ({ ...p, id: `init-prj-${idx}` }));

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        {/* Projects Hero Header */}
        <section className="relative py-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Completed Masterpieces</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Interior Transformations & <span className="gold-text-gradient">Portfolio</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our real before-and-after interior transformations across Sector 120 Noida and prestige societies in the NCR.
            </p>
          </div>
        </section>

        {/* Featured Projects with Before/After toggles */}
        <FeaturedProjectsSection projects={displayProjects} />

        {/* Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}

