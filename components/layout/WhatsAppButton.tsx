"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "8714114418";
  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(
    "Hi MA Carpenter and Interior, I am looking for interior design / carpentry services in Noida. Please share design catalogue and quotation."
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Quick Action Popup when opened */}
      {isOpen && (
        <div className="bg-brand-charcoal/95 backdrop-blur-md border border-brand-gold/40 rounded-2xl p-4 shadow-2xl w-[calc(100vw-2.5rem)] max-w-xs mb-2 animate-fade-in text-brand-cream text-sm">
          <div className="flex items-center justify-between border-b border-brand-gold/20 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif font-bold text-brand-gold text-xs tracking-wider uppercase">
                Instant Consultation
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-gray-300 mb-3 leading-relaxed">
            Connect directly with Monish Pasha & our master design team in Sector 120, Noida.
          </p>

          <div className="flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <MessageCircle size={15} />
              Chat on WhatsApp
            </a>

            <a
              href={`tel:+91${phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-surface hover:bg-brand-surface/80 border border-brand-gold/30 text-brand-gold hover:text-brand-goldLight rounded-xl text-xs font-semibold tracking-wide transition-all"
            >
              <Phone size={14} />
              Call +91 {phone}
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-brand-gold/50 ${
            hasScrolled ? "scale-100" : "scale-95"
          }`}
          aria-label="Contact on WhatsApp"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={28} className="fill-white/20" />}
          
          {/* Subtle Golden Glow Pulse Ring */}
          <span className="absolute -inset-1 rounded-full border border-brand-gold/40 animate-ping pointer-events-none opacity-40" />
        </button>

        {/* Hover Tooltip when closed */}
        {!isOpen && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-charcoal/90 text-brand-gold border border-brand-gold/30 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Chat on WhatsApp
          </span>
        )}
      </div>
    </div>
  );
}

