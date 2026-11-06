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
  Award
} from "lucide-react";
import MaLogo from "@/components/ui/MaLogo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
    { label: "Contact Us", href: "/contact" },
  ];

  const featuredServices = [
    { title: "Interior Design", href: "/services/interior-design", desc: "Turnkey luxury residential interiors" },
    { title: "Modular Kitchen", href: "/services/modular-kitchen", desc: "German & Italian waterproof kitchens" },
    { title: "Bedroom Interior", href: "/services/bedroom-interior", desc: "Master suites & acoustic headboards" },
    { title: "Living Room Interior", href: "/services/living-room-interior", desc: "Grand marble walls & fluted panels" },
    { title: "Custom Furniture", href: "/services/custom-furniture", desc: "Solid teakwood handcrafted furniture" },
    { title: "Wardrobe Design", href: "/services/wardrobe-design", desc: "Glass walk-in & modular sliding" },
    { title: "False Ceiling", href: "/services/false-ceiling", desc: "POP ceilings & magnetic track lights" },
    { title: "Complete Home Interior", href: "/services/complete-home-interior", desc: "Full turnkey keys-in-hand package" },
  ];

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const email = process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "Shop No. 6, Sector 120, Noida";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-[#050505] border-b border-brand-gold/15 py-1.5 px-4 text-[11px] text-gray-300 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:+91${phone}`}
              className="flex items-center gap-1.5 hover:text-brand-gold transition-colors"
            >
              <Phone size={12} className="text-brand-gold" />
              <span>+91 {phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-brand-gold transition-colors"
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
            <span className="font-serif italic text-brand-gold/90 text-xs">
              Designing Spaces, Defining Lifestyles
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-gold/40" />
            <Link
              href="/admin/login"
              className="text-[10px] text-gray-400 hover:text-brand-gold transition-colors"
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
            ? "bg-brand-black/95 backdrop-blur-md shadow-2xl border-b border-brand-gold/30 py-3"
            : "bg-gradient-to-b from-brand-black/90 to-brand-black/50 backdrop-blur-sm border-b border-brand-gold/20 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo on Left */}
          <MaLogo variant="horizontal" />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative group py-2"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 text-sm tracking-wider uppercase font-medium transition-all ${
                        pathname.startsWith("/services")
                          ? "text-brand-gold font-semibold"
                          : "text-brand-creamSoft hover:text-brand-gold"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          servicesDropdownOpen ? "rotate-180 text-brand-gold" : ""
                        }`}
                      />
                    </Link>

                    {/* Services Dropdown Panel */}
                    <div
                      className={`absolute top-full -left-12 w-[520px] bg-brand-charcoal/95 backdrop-blur-xl border border-brand-gold/30 rounded-2xl p-4 shadow-2xl transition-all duration-200 grid grid-cols-2 gap-2 ${
                        servicesDropdownOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
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
                          className="text-xs text-brand-gold hover:text-brand-goldLight font-medium inline-flex items-center gap-1"
                        >
                          View All Services
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm tracking-wider uppercase font-medium transition-all py-1 ${
                    isActive
                      ? "text-brand-gold font-semibold"
                      : "text-brand-creamSoft hover:text-brand-gold"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:+91${phone}`}
              className="flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-goldLight transition-colors px-3 py-2 border border-brand-gold/30 rounded-xl hover:border-brand-gold/60"
            >
              <Phone size={14} />
              <span>Call Us</span>
            </a>

            <Link
              href="/contact"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#E5BE53] to-[#B8832A] text-brand-black text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-gold-md hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles size={14} />
                Free Consultation
              </span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:+91${phone}`}
              className="p-2 text-brand-gold border border-brand-gold/40 rounded-lg hover:bg-brand-surface"
              aria-label="Call Now"
            >
              <Phone size={16} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-cream hover:text-brand-gold transition-colors border border-brand-gold/30 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full h-[calc(100dvh-64px)] bg-[#080808]/98 backdrop-blur-2xl border-t border-brand-gold/30 p-5 sm:p-6 overflow-y-auto z-50 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-4 mb-2">
              <span className="text-[11px] uppercase tracking-widest text-brand-gold font-bold">
                Navigation
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-serif tracking-wider uppercase py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-brand-surface text-brand-gold border-l-2 border-brand-gold font-semibold"
                        : "text-brand-cream hover:text-brand-gold"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="text-brand-gold/60" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Services Pill Grid in Mobile */}
            <div className="pt-4 border-t border-brand-gold/20">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 block">
                Popular Services
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/services/modular-kitchen"
                  className="p-2 rounded-lg bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold"
                >
                  Modular Kitchen
                </Link>
                <Link
                  href="/services/living-room-interior"
                  className="p-2 rounded-lg bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold"
                >
                  Living Room
                </Link>
                <Link
                  href="/services/bedroom-interior"
                  className="p-2 rounded-lg bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold"
                >
                  Bedroom Suite
                </Link>
                <Link
                  href="/services/custom-furniture"
                  className="p-2 rounded-lg bg-brand-surface border border-brand-gold/20 text-brand-cream hover:text-brand-gold"
                >
                  Custom Woodwork
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Footer CTAs */}
          <div className="pt-6 border-t border-brand-gold/20 mt-6 space-y-3">
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              <Sparkles size={16} />
              Book Free Site Consultation
            </Link>

            <div className="text-center text-[11px] text-gray-400 space-y-1">
              <p>Shop No. 6, Sector 120, Noida</p>
              <p className="text-brand-gold font-semibold">+91 {phone}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

