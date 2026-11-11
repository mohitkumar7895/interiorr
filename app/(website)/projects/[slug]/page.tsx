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
import { INITIAL_PROJECTS } from "@/lib/data/initialData";
import {
  Sparkles,
  MapPin,
  Calendar,
  Maximize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  MessageCircle
} from "lucide-react";

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  let project: any = null;

  try {
    project = await db.projects.findUnique({
      where: { slug },
    });
  } catch {}

  if (!project) {
    project = INITIAL_PROJECTS.find((p) => p.slug === slug);
  }

  if (!project) {
    return { title: "Project Not Found | MA Carpenter & Interior" };
  }

  return {
    title: `${project.title} | Portfolio Project Noida`,
    description: project.shortDesc,
    openGraph: {
      title: `${project.title} - MA Carpenter & Interior`,
      description: project.shortDesc,
      images: [project.featuredImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params;

  let project: any = null;

  try {
    project = await db.projects.findUnique({
      where: { slug },
      include: { images: true },
    });
  } catch (err) {
    console.error("Project query error:", err);
  }

  if (!project) {
    project = INITIAL_PROJECTS.find((p) => p.slug === slug);
  }

  if (!project) {
    notFound();
  }

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  const galleryPhotos =
    project.images && project.images.length > 0
      ? project.images
      : project.galleryImages && project.galleryImages.length > 0
        ? project.galleryImages
        : [];

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28 sm:pt-32 lg:pt-36">
        {/* Project Header */}
        <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
                  {project.category}
                </span>

                {project.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={13} className="text-brand-gold" />
                    <span>{project.location}</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                {project.shortDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Specs Overview Bar */}
        <section className="py-6 bg-brand-charcoal border-b border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              <div className="flex items-center gap-3">
                <User size={18} className="text-brand-gold flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Client / Residence</span>
                  <span className="font-semibold text-white">{project.client || "Private Homeowner"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-gold flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Location</span>
                  <span className="font-semibold text-white">{project.location || "Noida, NCR"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Maximize2 size={18} className="text-brand-gold flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Carpet Area</span>
                  <span className="font-semibold text-white">{project.area || "Complete Scope"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-brand-gold flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Delivered On</span>
                  <span className="font-semibold text-white">{project.completedDate || "Recent Project"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Body & Transformation */}
        <section className="py-24 bg-brand-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-12">
                {/* Hero Showcase Image */}
                <div className="relative h-[260px] sm:h-[380px] md:h-[480px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-gold/40 shadow-2xl">
                  <SafeImage
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    quality={85}
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Before vs After Side-by-Side Comparison */}
                {project.beforeImage && (
                  <div className="bg-brand-charcoal/80 border border-brand-gold/25 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Layers size={20} className="text-brand-gold" />
                      <span>Before & After Transformation</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30 inline-block">
                          Initial Raw Space (Before)
                        </span>
                        <div className="relative h-52 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
                          <SafeImage
                            src={project.beforeImage}
                            alt="Before Renovation"
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            quality={80}
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
                          Finished Luxury Handover (After)
                        </span>
                        <div className="relative h-52 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-brand-gold/50 shadow-gold-sm">
                          <SafeImage
                            src={project.afterImage || project.featuredImage}
                            alt="After Masterpiece"
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            quality={80}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Narrative Description */}
                <div className="bg-brand-charcoal/60 border border-brand-gold/20 rounded-3xl p-8 sm:p-10">
                  <h3 className="font-serif text-2xl font-bold text-white mb-4">
                    Architectural Strategy & Carpentry Execution
                  </h3>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>{project.description}</p>
                  </div>
                </div>

                {/* Multiple Gallery Images */}
                {galleryPhotos.length > 0 && (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-6">
                      Detailed Angles & Craftsmanship
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {galleryPhotos.map((img: any, idx: number) => (
                        <div
                          key={img.id || idx}
                          className="relative h-72 rounded-2xl overflow-hidden border border-brand-gold/25 shadow-lg group"
                        >
                          <SafeImage
                            src={img.imageUrl}
                            alt={img.caption || `Project View ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            quality={80}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {img.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm p-3 text-[11px] text-gray-300 border-t border-brand-gold/20">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 bg-brand-charcoal border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block mb-1">
                      Turnkey Solutions
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Love This Design?
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Our carpentry team can recreate and customize this exact interior styling for your apartment or villa in Noida.
                    </p>
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
                        `Hi MA Carpenter & Interior, I loved your project "${project.title}". Can you give me an estimate for a similar design in Noida?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={15} />
                      <span>Chat on WhatsApp</span>
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

