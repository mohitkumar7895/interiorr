"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Maximize2,
  Layers,
  ArrowUpRight
} from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  area: string | null;
  shortDesc: string;
  featuredImage: string;
  beforeImage: string | null;
  afterImage: string | null;
}

interface FeaturedProjectsSectionProps {
  projects: ProjectItem[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  // Track which projects have "Before" view toggled
  const [showBeforeMap, setShowBeforeMap] = useState<Record<string, boolean>>({});

  const toggleBeforeAfter = (id: string) => {
    setShowBeforeMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="relative py-24 bg-brand-charcoal/40 border-t border-brand-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={13} />
              <span>Real Transformations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Featured Interior <span className="gold-text-gradient">Projects</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400">
              Witness before-and-after luxury transformations completed for distinguished homeowners across Sector 120 Noida and Delhi NCR.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-surface text-xs font-bold uppercase tracking-wider transition-all self-start md:self-auto"
          >
            <span>View All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project, idx) => {
            const isShowingBefore = showBeforeMap[project.id];
            const currentImg =
              isShowingBefore && project.beforeImage
                ? project.beforeImage
                : project.afterImage || project.featuredImage;

            return (
              <div
                key={project.id}
                className="group bg-brand-surface/70 border border-brand-gold/25 hover:border-brand-gold/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col"
              >
                {/* Image Container with Before/After Toggle */}
                <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-black">
                  <Image
                    src={currentImg}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={80}
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                    <span className="bg-brand-black/85 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-full border border-brand-gold/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      {project.category}
                    </span>

                    {project.area && (
                      <span className="bg-brand-surface/85 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/20 text-[9px] sm:text-[10px] font-medium text-gray-300">
                        {project.area}
                      </span>
                    )}
                  </div>

                  {/* Before / After Interactive Toggle Button */}
                  {project.beforeImage && (
                    <button
                      onClick={() => toggleBeforeAfter(project.id)}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-brand-black/90 hover:bg-brand-gold hover:text-brand-black text-brand-gold border border-brand-gold/50 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5"
                    >
                      <Layers size={12} />
                      <span>{isShowingBefore ? "Showing: BEFORE" : "Tap for BEFORE"}</span>
                    </button>
                  )}

                  {/* Location Tag */}
                  {project.location && (
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 text-[11px] sm:text-xs text-brand-creamSoft bg-black/60 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-lg border border-brand-gold/20">
                      <MapPin size={12} className="text-brand-gold" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                {/* Project Details Footer */}
                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-brand-gold transition-colors mb-3">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {project.shortDesc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-brand-gold/20 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-goldLight inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href="/contact"
                      className="text-xs text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      Enquire Similar Design &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

