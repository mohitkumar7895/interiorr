"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import MaLogo from "@/components/ui/MaLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change & handle body scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    {
      label: "Services",
      href: "/services",
      hasDropdown: true,
    },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact Us", href: "/contact" },
  ];

  const featuredServices = [
    { title: "Modular Kitchen", href: "/services/modular-kitchen", desc: "German & Italian waterproof kitchens" },
    { title: "Wardrobe Design", href: "/services/wardrobe-design", desc: "Glass walk-in & modular sliding" },
    { title: "Wooden Work", href: "/services/wooden-work", desc: "Fine woodwork, CNC jali & wall cladding" },
    { title: "Living Room Interior", href: "/services/living-room-interior", desc: "Grand marble walls & fluted panels" },
    { title: "Bedroom Interior", href: "/services/bedroom-interior", desc: "Master suites & acoustic headboards" },
    { title: "Interior Design", href: "/services/interior-design", desc: "Turnkey luxury residential interiors" },
    { title: "Custom Furniture", href: "/services/custom-furniture", desc: "Solid teakwood handcrafted furniture" },
    { title: "False Ceiling", href: "/services/false-ceiling", desc: "POP ceilings & magnetic track lights" },
  ];

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const email = process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "Shop No. 6, Sector 120, Noida";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Bar (Desktop only) */}
      <div className="bg-[#050505] border-b border-brand-gold/15 py-1.5 px-4 text-[11px] text-gray-300 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <a
              href={`tel:+91${phone}`}
              className="flex items-center gap-1.5 hover:text-brand-gold transition-colors font-medium"
            >
              <Phone size={12} className="text-brand-gold" />
              <span>+91 {phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden lg:flex items-center gap-1.5 hover:text-brand-gold transition-colors"
            >
              <Mail size={12} className="text-brand-gold" />
              <span>{email}</span>
            </a>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin size={12} className="text-brand-gold" />
              <span>{address}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-brand-goldLight">
            <span className="font-serif italic text-brand-gold/90 text-xs hidden lg:inline">
              Designing Spaces, Defining Lifestyles
            </span>
            <span className="hidden lg:inline-block w-1 h-1 rounded-full bg-brand-gold/40" />
            <Link
              href="/admin/login"
              className="text-[10px] text-gray-400 hover:text-brand-gold transition-colors font-medium uppercase tracking-wider"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-brand-black/95 backdrop-blur-md shadow-2xl border-b border-brand-gold/30 py-2 sm:py-2.5"
            : "bg-gradient-to-b from-brand-black/95 via-brand-black/85 to-brand-black/60 backdrop-blur-sm border-b border-brand-gold/20 py-2.5 sm:py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 xl:px-8 flex items-center justify-between gap-2 lg:gap-3 xl:gap-5">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <MaLogo variant="horizontal" />
          </div>

          {/* Desktop Navigation Links - Compact & Pass-Pass */}
          <div className="hidden lg:flex items-center gap-1 min-[1120px]:gap-1.5 xl:gap-2.5 2xl:gap-3 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative group py-1.5"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 text-[11px] min-[1120px]:text-xs xl:text-[12.5px] tracking-normal min-[1120px]:tracking-wider uppercase font-semibold transition-all px-2 xl:px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                        pathname.startsWith("/services")
                          ? "text-brand-gold font-bold bg-brand-surface/60"
                          : "text-brand-creamSoft hover:text-brand-gold hover:bg-brand-surface/40"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 shrink-0 ${
                          servicesDropdownOpen ? "rotate-180 text-brand-gold" : ""
                        }`}
                      />
                    </Link>

                    {/* Services Dropdown Panel with Hover Bridge */}
                    <div
                      className={`absolute top-full -left-16 pt-2 w-[540px] transition-all duration-200 ${
                        servicesDropdownOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-brand-charcoal/95 backdrop-blur-xl border border-brand-gold/35 rounded-2xl p-4 shadow-2xl grid grid-cols-2 gap-2">
                        {featuredServices.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="p-2.5 rounded-xl hover:bg-brand-surface border border-transparent hover:border-brand-gold/30 transition-all group/item"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-brand-creamSoft group-hover/item:text-brand-gold transition-colors">
                                {service.title}
                              </span>
                              <ArrowRight
                                size={12}
                                className="text-brand-gold opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all"
                              />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                              {service.desc}
                            </p>
                          </Link>
                        ))}

                        <div className="col-span-2 pt-2 mt-1 border-t border-brand-gold/20 flex items-center justify-between px-2">
                          <span className="text-[11px] text-gray-400">
                            Complete 12 Interior & Carpentry Solutions
                          </span>
                          <Link
                            href="/services"
                            className="text-xs text-brand-gold hover:text-brand-goldLight font-semibold inline-flex items-center gap-1"
                          >
                            View All Services
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[11px] min-[1120px]:text-xs xl:text-[12.5px] tracking-normal min-[1120px]:tracking-wider uppercase font-semibold transition-all px-2 xl:px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                    isActive
                      ? "text-brand-gold font-bold bg-brand-surface/60"
                      : "text-brand-creamSoft hover:text-brand-gold hover:bg-brand-surface/40"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 min-[1120px]:gap-2 xl:gap-2.5 flex-shrink-0">
            <a
              href={`tel:+91${phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition-colors p-2 xl:px-3 xl:py-2 border border-brand-gold/30 rounded-xl hover:border-brand-gold/60 hover:bg-brand-gold/10 whitespace-nowrap shrink-0"
              title="Call Monish Pasha"
            >
              <Phone size={13} className="shrink-0" />
              <span className="hidden xl:inline">+91 {phone}</span>
              <span className="hidden min-[1120px]:inline xl:hidden text-[11px]">Call</span>
            </a>

            <Link
              href="/contact"
              className="relative group overflow-hidden px-2.5 min-[1120px]:px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-[10.5px] min-[1120px]:text-[11px] xl:text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:shadow-gold-md hover:scale-[1.02] active:scale-95 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                <Sparkles size={12} className="shrink-0" />
                <span>Free Consultation</span>
              </span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>

          {/* Mobile Right Quick Action Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:+91${phone}`}
              className="p-2 text-brand-gold border border-brand-gold/40 rounded-xl hover:bg-brand-surface active:scale-95 transition-all"
              aria-label="Call Now"
              title="Call Us"
            >
              <Phone size={16} />
            </a>

            <a
              href={`https://wa.me/91${phone}?text=${encodeURIComponent("Hi MA Carpenter & Interior, I would like to book a free consultation.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-400 border border-emerald-500/40 rounded-xl hover:bg-emerald-950/30 active:scale-95 transition-all"
              aria-label="WhatsApp"
              title="WhatsApp Us"
            >
              <MessageCircle size={16} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-cream hover:text-brand-gold transition-colors border border-brand-gold/40 rounded-xl active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full h-[calc(100dvh-64px)] bg-[#080808]/98 backdrop-blur-2xl border-t border-brand-gold/30 p-5 sm:p-6 pb-20 sm:pb-8 overflow-y-auto overscroll-contain z-50 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-brand-gold font-bold">
                Menu &amp; Navigation
              </span>
              <span className="text-[10px] text-gray-400">Sector 120, Noida</span>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-serif tracking-wider uppercase py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-brand-surface text-brand-gold border-l-4 border-brand-gold font-bold shadow-sm"
                        : "text-brand-cream hover:text-brand-gold hover:bg-brand-surface/40"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={13} className="text-brand-gold/60" />
                  </Link>
                );
              })}
            </div>

            {/* Popular Services Quick Pills in Mobile Drawer */}
            <div className="pt-4 border-t border-brand-gold/20">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2.5 block">
                Popular Services in Noida
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/services/modular-kitchen"
                  className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/50 transition-all font-medium"
                >
                  Modular Kitchen
                </Link>
                <Link
                  href="/services/wardrobe-design"
                  className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/50 transition-all font-medium"
                >
                  Wardrobe Design
                </Link>
                <Link
                  href="/services/wooden-work"
                  className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/50 transition-all font-medium"
                >
                  Wooden Work &amp; Jali
                </Link>
                <Link
                  href="/services/living-room-interior"
                  className="p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/50 transition-all font-medium"
                >
                  Living Room
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Footer CTAs */}
          <div className="pt-5 border-t border-brand-gold/20 mt-6 space-y-3">
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-gold-sm active:scale-95 transition-all"
            >
              <Sparkles size={15} />
              <span>Book Free Site Consultation</span>
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:+91${phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                <Phone size={13} />
                <span>Call Us</span>
              </a>

              <a
                href={`https://wa.me/91${phone}?text=${encodeURIComponent("Hi Monish, I want to book a free home interior consultation in Noida.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="text-center text-[10px] text-gray-400 pt-1">
              Shop No. 6, Sector 120, Noida • Mon - Sun: 9:00 AM - 8:30 PM
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
