import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Compass, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "404 - Page Not Found | MA Carpenter and Interior",
  description: "The page you are looking for cannot be found. Explore our luxury interior solutions or contact us.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-cream flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <span className="font-serif text-7xl sm:text-9xl font-black gold-text-gradient tracking-tight drop-shadow-lg">
            404
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
            The interior page or architectural project you are searching for might have moved, been renamed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-brand-black font-semibold text-xs sm:text-sm hover:bg-brand-goldLight transition-all shadow-lg"
            >
              <Home size={16} />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-charcoal border border-brand-gold/30 text-white font-medium text-xs sm:text-sm hover:border-brand-gold transition-all"
            >
              <Compass size={16} />
              <span>Explore Services</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-gray-700 text-gray-300 font-medium text-xs sm:text-sm hover:text-white hover:border-gray-500 transition-all"
            >
              <Phone size={14} />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

