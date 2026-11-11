"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Sparkles,
  QrCode
} from "lucide-react";
import MaLogo from "@/components/ui/MaLogo";

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const email = process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com";
  const address =
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301";

  const services = [
    { title: "Modular Kitchen", href: "/services/modular-kitchen" },
    { title: "Interior Design", href: "/services/interior-design" },
    { title: "Living Room Interior", href: "/services/living-room-interior" },
    { title: "Bedroom Interior", href: "/services/bedroom-interior" },
    { title: "Custom Furniture", href: "/services/custom-furniture" },
    { title: "Wardrobe Design", href: "/services/wardrobe-design" },
    { title: "False Ceiling", href: "/services/false-ceiling" },
    { title: "Complete Home Interior", href: "/services/complete-home-interior" },
  ];

  const [footerServices, setFooterServices] = useState(services);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data?.services && Array.isArray(data.services)) {
          const published = data.services.filter((s: any) => s.isPublished !== false);
          if (published.length > 0) {
            setFooterServices(
              published.slice(0, 8).map((s: any) => ({
                title: s.title,
                href: `/services/${s.slug}`,
              }))
            );
          } else {
            setFooterServices([]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Portfolio Projects", href: "/projects" },
    { title: "Photo Gallery", href: "/gallery" },
    { title: "Blog & Design Guides", href: "/blogs" },
    { title: "Free Consultation", href: "/contact" },
    { title: "Admin Portal", href: "/admin/login" },
  ];

  return (
    <footer className="relative bg-[#060606] text-brand-cream border-t border-brand-gold/30 overflow-hidden">
      {/* Decorative Gold Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Call to Action Strip */}
      <div className="border-b border-brand-gold/20 bg-brand-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0 text-brand-gold">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-white">
                Ready to Transform Your Home Into a Masterpiece?
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Book a free on-site design consultation & 3D estimation in Noida & Delhi NCR.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={`tel:+91${phone}`}
              className="px-5 py-2.5 rounded-xl border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <Phone size={14} />
              Call +91 {phone}
            </a>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider hover:shadow-gold-md hover:scale-[1.02] transition-all inline-flex items-center gap-2"
            >
              Get Free Estimate
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Column 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-left">
              <MaLogo variant="horizontal" className="mb-2" />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              MA Carpenter and Interior is Noida’s foremost interior architecture and bespoke carpentry studio. Specializing in European-grade modular kitchens, Italian marble entertainment consoles, acoustic bedroom suites, and heirloom solid teak furniture.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-brand-surface/80 border border-brand-gold/20 px-3 py-1.5 rounded-lg">
                <ShieldCheck size={14} className="text-brand-gold" />
                <span>10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-brand-surface/80 border border-brand-gold/20 px-3 py-1.5 rounded-lg">
                <Award size={14} className="text-brand-gold" />
                <span>Master Wood Artisans</span>
              </div>
            </div>

            {/* Scan to Connect Card from Reference */}
            <div className="bg-brand-surface/90 border border-brand-gold/30 rounded-xl p-3 flex items-center justify-between gap-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold">
                  <QrCode size={26} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brand-gold font-bold block">
                    Direct Contact
                  </span>
                  <span className="text-xs text-white font-medium">
                    Sector 120, Noida Studio
                  </span>
                </div>
              </div>
              <a
                href={`https://wa.me/91${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-brand-gold hover:underline font-semibold"
              >
                Scan / WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Column 3: Signature Services */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold/20 pb-2 mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {footerServices.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-gold transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-gold/50 group-hover:scale-150 transition-transform" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold/20 pb-2 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-brand-gold transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-gold/50 group-hover:scale-150 transition-transform" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Direct Contact */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-widest text-brand-gold border-b border-brand-gold/20 pb-2 mb-4">
              Studio & Workshop
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand-gold flex-shrink-0" />
                <a
                  href={`tel:+91${phone}`}
                  className="hover:text-brand-gold transition-colors font-medium"
                >
                  +91 {phone}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand-gold flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-brand-gold transition-colors break-all"
                >
                  {email}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-white">Opening Hours:</span>
                  <span className="text-[11px] text-gray-400">Mon - Sun: 9:00 AM - 8:30 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-brand-gold/15 bg-black py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-brand-gold font-semibold">MA Carpenter and Interior</span>. All Rights Reserved.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 sm:gap-6 text-[11px]">
            <Link href="/about" className="hover:text-brand-gold transition-colors">
              Brand Story
            </Link>
            <Link href="/services" className="hover:text-brand-gold transition-colors">
              Services
            </Link>
            <Link href="/contact" className="hover:text-brand-gold transition-colors">
              Consultation
            </Link>
            <Link href="/admin/login" className="text-brand-gold/70 hover:text-brand-gold transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

