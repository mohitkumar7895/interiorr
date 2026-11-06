import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  CheckCircle2,
  Hammer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock
} from "lucide-react";

interface AboutSectionProps {
  title?: string;
  story?: string;
  experienceYears?: number;
  projectsDone?: number;
  happyClients?: number;
}

export default function AboutSection({
  title = "Designing Spaces, Defining Lifestyles",
  story = "Founded in Sector 120 Noida, MA Carpenter and Interior bridges old-world artisanal joinery with European architectural interior design. From custom book-matched marble feature walls to anti-scratch modular kitchens and handcrafted solid teak furniture, we treat every home as our signature masterpiece.",
  experienceYears = 12,
  projectsDone = 350,
  happyClients = 320,
}: AboutSectionProps) {
  const highlights = [
    "In-house carpentry and precision fabrication facility in Noida",
    "Waterproof BWP Marine Ply & Blum/Hettich soft-close hardware",
    "Photorealistic 3D layout renderings prior to execution",
    "Turnkey delivery within 45 to 60 days with milestone tracking",
    "Zero hidden fees with transparent material certification",
    "10-Year hardware and structural warranty"
  ];

  return (
    <section className="relative py-24 bg-brand-charcoal/60 border-y border-brand-gold/20 overflow-hidden">
      {/* Subtle Background Watermark Logo Pattern */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 opacity-5 pointer-events-none">
        <Image
          src="/logo/ma-emblem.svg"
          alt="Watermark"
          fill
          sizes="384px"
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Showcase & Stat Cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Image */}
              <div className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                  alt="Architectural Masterpiece by MA Carpenter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={80}
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                
                {/* Embedded Reference Brand Card Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-brand-surface/90 backdrop-blur-md border border-brand-gold/40 text-brand-cream flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src="/logo/ma-emblem.svg"
                        alt="MA"
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-xs text-white uppercase tracking-wider block">
                        MA Carpenter and Interior
                      </span>
                      <span className="text-[10px] text-brand-gold">
                        Shop No. 6, Sector 120, Noida
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full border border-brand-gold/30">
                    Verified Studio
                  </span>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black p-5 rounded-2xl shadow-gold-md border-2 border-brand-black hidden sm:flex flex-col items-center justify-center text-center">
                <span className="font-serif font-black text-3xl leading-none">
                  {experienceYears}+
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                  Years of Craft
                </span>
              </div>

              {/* Floating Projects Delivered Badge */}
              <div className="absolute -bottom-6 -right-6 bg-brand-surface border border-brand-gold/50 text-white p-4 rounded-2xl shadow-2xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <Hammer size={20} />
                </div>
                <div>
                  <span className="font-serif font-black text-2xl text-brand-gold leading-none block">
                    {projectsDone}+
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">
                    Transformations Done
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>About Our Studio</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Architects of Elegance,{" "}
              <span className="gold-text-gradient">Masters of Carpentry</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {story}
            </p>

            {/* Checklist of Core Strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-brand-creamSoft">
                  <CheckCircle2 size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Metrics Counter Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-gold/20">
              <div>
                <span className="font-serif font-black text-2xl sm:text-3xl gold-text-gradient block">
                  {experienceYears}+
                </span>
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                  Years Heritage
                </span>
              </div>
              <div>
                <span className="font-serif font-black text-2xl sm:text-3xl gold-text-gradient block">
                  {projectsDone}+
                </span>
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                  Spaces Created
                </span>
              </div>
              <div>
                <span className="font-serif font-black text-2xl sm:text-3xl gold-text-gradient block">
                  {happyClients}+
                </span>
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                  Happy Clients
                </span>
              </div>
            </div>

            {/* Action CTA Link */}
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/40 text-brand-gold hover:text-brand-goldLight text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 group"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

