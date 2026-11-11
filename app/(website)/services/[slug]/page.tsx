import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import db from '@/lib/db';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_SERVICES } from "@/lib/data/initialData";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  HelpCircle,
  Award
} from "lucide-react";

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  let service: any = null;

  try {
    service = await db.services.findUnique({
      where: { slug },
    });
  } catch {}

  if (!service) {
    service = INITIAL_SERVICES.find((s) => s.slug === slug);
  }

  if (!service) {
    return { title: "Service Not Found | MA Carpenter & Interior" };
  }

  return {
    title: `${service.title} | MA Carpenter and Interior Noida`,
    description: service.seoDesc || service.shortDesc,
    openGraph: {
      title: `${service.title} - MA Carpenter and Interior`,
      description: service.shortDesc,
      images: [service.featuredImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = params;

  let service: any = null;
  let relatedProjects: any[] = [];

  try {
    const [serviceRes, projectsRes] = await Promise.allSettled([
      db.services.findUnique({ where: { slug } }),
      db.projects.findMany({ where: { isPublished: true }, take: 2 }),
    ]);

    if (serviceRes.status === "fulfilled" && serviceRes.value) {
      service = serviceRes.value;
    }
    if (projectsRes.status === "fulfilled" && projectsRes.value) {
      relatedProjects = projectsRes.value;
    }
  } catch (err) {
    console.error("Service detail query error:", err);
  }

  if (!service) {
    service = INITIAL_SERVICES.find((s) => s.slug === slug);
  }

  if (!service) {
    notFound();
  }

  const features: string[] =
    typeof service.features === "string"
      ? JSON.parse(service.features || "[]")
      : service.features || [];

  const benefits: string[] =
    typeof service.benefits === "string"
      ? JSON.parse(service.benefits || "[]")
      : service.benefits || [];

  const images: string[] =
    typeof service.images === "string"
      ? JSON.parse(service.images || "[]")
      : service.images || [];

  const allImages = [service.featuredImage, ...images].filter(Boolean);
  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28 sm:pt-32 lg:pt-36">
        {/* Service Hero Banner */}
        <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles size={13} />
                <span>{service.category || "Interior Architecture"}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                {service.shortDesc}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-gold-sm transition-all inline-flex items-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>Get Free 3D Estimate</span>
                </Link>

                <a
                  href={`tel:+91${phone}`}
                  className="px-6 py-3.5 rounded-xl bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/40 text-brand-gold text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <Phone size={14} />
                  <span>Call +91 {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown & Features */}
        <section className="py-24 bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Full Description, Gallery & Features */}
              <div className="lg:col-span-8 space-y-12">
                {/* Full Narrative */}
                <div className="bg-brand-charcoal/70 border border-brand-gold/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
                    Overview & Engineering Specifications
                  </h2>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>{service.fullDesc}</p>
                  </div>
                </div>

                {/* Features Grid */}
                {features.length > 0 && (
                  <div className="bg-brand-charcoal/70 border border-brand-gold/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
                      What is Included
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-surface/80 border border-brand-gold/15">
                          <CheckCircle2 size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-brand-cream">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div className="bg-brand-charcoal/70 border border-brand-gold/20 rounded-3xl p-8 sm:p-10">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
                      Client Advantages & Guarantees
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {benefits.map((ben, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-surface/80 border border-brand-gold/15">
                          <ShieldCheck size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-brand-cream">{ben}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Gallery Grid for this service */}
                {allImages.length > 0 && (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-6">
                      Visual Showcase
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {allImages.map((img, idx) => (
                        <div key={idx} className="relative h-64 rounded-2xl overflow-hidden border border-brand-gold/30 shadow-lg">
                          <SafeImage
                            src={img}
                            alt={`${service.title} Photo ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            quality={80}
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Quick Consultation Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 bg-brand-charcoal border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="border-b border-brand-gold/20 pb-4">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block mb-1">
                      Direct Inquiries
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Book Service Consultation
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Get on-site measurements and 3D floor plan quotation.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 flex items-center justify-between">
                      <span className="text-gray-400">Handover Timeline:</span>
                      <span className="font-bold text-white">45 - 60 Days</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 flex items-center justify-between">
                      <span className="text-gray-400">Warranty Coverage:</span>
                      <span className="font-bold text-brand-gold">10-Year Warranty</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 flex items-center justify-between">
                      <span className="text-gray-400">Studio Location:</span>
                      <span className="font-bold text-white">Sector 120, Noida</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Link
                      href="/contact"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-sm"
                    >
                      <Sparkles size={14} />
                      <span>Request Free Quote</span>
                    </Link>

                    <a
                      href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                        `Hi MA Carpenter and Interior, I am interested in ${service.title} for my home in Noida.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Inquiries</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}

