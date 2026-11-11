"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function ConsultationSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Modular Kitchen",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";
  const email = process.env.NEXT_PUBLIC_EMAIL || "Monishpasha233@gmail.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "Shop No. 6, Sector 120, Noida, UP - 201301";

  const servicesList = [
    "Modular Kitchen",
    "Interior Design",
    "Bedroom Interior",
    "Living Room Interior",
    "Custom Furniture",
    "Wardrobe Design",
    "TV Unit Design",
    "Office Interior",
    "False Ceiling",
    "Complete Home Interior",
    "Carpenter Services",
    "Wooden Work",
  ];

  const [servicesOptions, setServicesOptions] = useState(servicesList);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
          const names = data.services
            .filter((s: any) => s.isPublished !== false)
            .map((s: any) => s.title);
          if (names.length > 0) {
            setServicesOptions(names);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields (Name, Phone, and Message).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      toast.success(
        "Thank you! Your enquiry has been received. Monish Pasha and team will call you within 2 business hours."
      );
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "Modular Kitchen",
        message: "",
      });
    } catch (err: any) {
      toast.error(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/91${phone}?text=${encodeURIComponent(
    `Hi MA Carpenter & Interior, I would like to schedule a free site consultation in Noida for ${formData.service}.`
  )}`;

  return (
    <section className="relative py-20 sm:py-24 bg-brand-black border-t border-brand-gold/20 overflow-hidden scroll-mt-28 sm:scroll-mt-32" id="consultation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Direct Consultation Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Complimentary Consultation</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Let&apos;s Design Your <span className="gold-text-gradient">Dream Space</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Book a free on-site design consultation in Noida with Monish Pasha and our architectural carpentry specialists. We provide laser site measurement, 3D layouts, and fixed-cost quotations.
            </p>

            {/* Quick Contact Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-charcoal border border-brand-gold/20">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">
                    Call Direct
                  </span>
                  <a href={`tel:+91${phone}`} className="text-sm font-bold text-white hover:text-brand-gold">
                    +91 {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-charcoal border border-brand-gold/20">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">
                    Email Inquiry
                  </span>
                  <a href={`mailto:${email}`} className="text-sm font-bold text-white hover:text-brand-gold">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-charcoal border border-brand-gold/20">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">
                    Visit Our Studio & Workshop
                  </span>
                  <span className="text-xs text-gray-300 leading-relaxed block">
                    {address}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-emerald-500/30 shadow-lg"
            >
              <MessageCircle size={16} />
              <span>Chat Directly on WhatsApp &rarr;</span>
            </a>
          </div>

          {/* Right Column: Live Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-brand-charcoal/90 border border-brand-gold/30 shadow-2xl backdrop-blur-md">
              <div className="border-b border-brand-gold/20 pb-4 mb-6">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Schedule Free Site Measurement
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Fill in your details and our team will get back with free 3D design options.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-sm sm:text-xs outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9818XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-sm sm:text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-sm sm:text-xs outline-none transition-colors"
                    />
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Select Service *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-sm sm:text-xs outline-none transition-colors"
                    >
                      {servicesOptions.map((srv) => (
                        <option key={srv} value={srv} className="bg-brand-charcoal text-white">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    Project Details / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your property (e.g. 3BHK flat in Sector 120 Noida, looking for modular kitchen and master bedroom interior)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-sm sm:text-xs outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black font-bold text-xs uppercase tracking-widest hover:shadow-gold-md active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? "Submitting Enquiry..." : "Submit Consultation Request"}</span>
                </button>

                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-brand-gold" />
                  <span>Your privacy is guaranteed. No spam, ever.</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

