"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import {
  Sparkles,
  ArrowRight,
  Phone,
  ShieldCheck,
  Award,
  ChevronRight,
  Compass
} from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
}

export default function HeroSection({
  title = "Transform Your Home Into a Masterpiece",
  subtitle = "Discover premium interior design, modular kitchens, custom furniture, and complete home interior solutions with MA Carpenter and Interior.",
  ctaText = "Explore Our Designs",
  ctaLink = "/projects",
  images = [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
  ],
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images]);

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-brand-black">
      {/* Background HD Slideshow with Slow Zoom Transition */}
      <div className="absolute inset-0 z-0">
        {images.map((img, index) => (
          <div
            key={img + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <SafeImage
              src={img}
              alt="Luxury Interior Masterpiece"
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              quality={80}
              className={`object-cover transform transition-transform duration-10000 ${
                index === currentSlide ? "scale-105" : "scale-100"
              }`}
            />
            {/* Cinematic Multi-Layer Dark & Gold Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/75 to-brand-black/50" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-black/40 to-brand-black/90" />
          </div>
        ))}
      </div>

      {/* Decorative Gold Accent Lines & Vignette */}
      <div className="absolute inset-0 pointer-events-none border-x border-brand-gold/10 max-w-7xl mx-auto z-10 hidden sm:block" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Brand Reference Pill */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-surface/90 border border-brand-gold/40 text-brand-gold text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-4 sm:mb-6 shadow-gold-sm backdrop-blur-md animate-fade-in max-w-full text-center">
          <Sparkles size={13} className="text-brand-gold flex-shrink-0" />
          <span className="truncate">MA Carpenter and Interior • Sector 120 Noida</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] max-w-4xl drop-shadow-md">
          Transform Your Home Into a{" "}
          <span className="gold-text-gradient font-black block sm:inline">
            Masterpiece
          </span>
        </h1>

        {/* Hero Tagline & Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-brand-creamSoft max-w-3xl font-light leading-relaxed drop-shadow">
          {subtitle}
        </p>

        {/* Pill Highlight: Tagline from uploaded reference card */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 text-xs md:text-sm font-serif italic text-brand-goldLight tracking-wider">
          <span className="h-[1px] w-6 sm:w-8 bg-brand-gold/60" />
          <span>Designing Spaces, Defining Lifestyles</span>
          <span className="h-[1px] w-6 sm:w-8 bg-brand-gold/60" />
        </div>

        {/* CTA Button Group */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href={ctaLink}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black font-bold text-xs uppercase tracking-widest hover:shadow-gold-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
          >
            <span>{ctaText}</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-brand-charcoal/80 hover:bg-brand-surface border border-brand-gold/40 hover:border-brand-gold text-brand-cream hover:text-white font-bold text-xs uppercase tracking-widest backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Compass size={16} className="text-brand-gold" />
            <span>Get Free Consultation</span>
          </Link>

          <a
            href={`tel:+91${phone}`}
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-black/40 hover:bg-black/60 border border-brand-gold/25 text-brand-gold text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Phone size={15} />
            <span>+91 {phone}</span>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-10 sm:mt-16 pt-5 sm:pt-8 border-t border-brand-gold/20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl text-left bg-brand-surface/40 backdrop-blur-md rounded-2xl p-3.5 sm:p-6 border border-brand-gold/30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Creative Design
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Bespoke 3D Layouts</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Quality Assurance
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400">10-Year Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Award size={16} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Delighted Clients
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400">320+ Happy Families</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0">
              <Compass size={16} />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Turnkey Solutions
              </h4>
              <p className="text-[10px] sm:text-[11px] text-gray-400">End-to-End Interior</p>
            </div>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="mt-8 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentSlide
                  ? "w-8 bg-brand-gold"
                  : "w-2 bg-brand-gold/30 hover:bg-brand-gold/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

