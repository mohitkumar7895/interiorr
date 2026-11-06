"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "MA Carpenter and Interior",
    brandName: "MA",
    tagline: "Designing Spaces, Defining Lifestyles",
    phone: "8714114418",
    whatsappNumber: "8714114418",
    email: "Monishpasha233@gmail.com",
    address: "Shop No. 6, Sector 120, Noida, Uttar Pradesh - 201301",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shop+No+6+Sector+120+Noida+Uttar+Pradesh+201301",
    openingHours: "Mon - Sun: 9:00 AM - 8:30 PM",
    footerText: "Crafting bespoke luxury living environments with master carpentry and architectural interior design.",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setFormData({
            siteName: data.settings.siteName || "",
            brandName: data.settings.brandName || "MA",
            tagline: data.settings.tagline || "",
            phone: data.settings.phone || "",
            whatsappNumber: data.settings.whatsappNumber || "",
            email: data.settings.email || "",
            address: data.settings.address || "",
            googleMapsUrl: data.settings.googleMapsUrl || "",
            openingHours: data.settings.openingHours || "",
            footerText: data.settings.footerText || "",
          });
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Business settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Business & Studio Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage core company info, contact phone, email, WhatsApp, and Sector 120 Noida address.
        </p>
      </div>

      <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Brand Name Monogram
              </label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Tagline *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Phone Number (Calls) *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Business Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Studio Opening Hours
              </label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Studio & Workshop Physical Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Google Maps Location Link
            </label>
            <input
              type="text"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Footer Text / Summary
            </label>
            <textarea
              rows={3}
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
            />
          </div>

          <div className="pt-4 border-t border-brand-gold/20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

