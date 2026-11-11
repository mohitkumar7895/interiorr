"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, MapPin, Clock, Globe, Shield, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import ImageUploadInput from "@/components/admin/ImageUploadInput";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Business Settings state
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
    logoUrl: "/logo/ma-logo.svg",
  });

  // Password Change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

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
            logoUrl: data.settings.logoUrl || "/logo/ma-logo.svg",
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

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Business settings saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password");
      }

      toast.success(data.message || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Business & Admin Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage core company info, contact details, logo branding, and admin security password.
        </p>
      </div>

      {/* 1. Business Info Settings Card */}
      <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-brand-gold/20">
          <Building2 size={20} className="text-brand-gold" />
          <h2 className="font-serif text-lg font-bold text-white">Studio & Brand Information</h2>
        </div>

        <form onSubmit={handleSettingsSubmit} className="space-y-5 text-xs">
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
                Short Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Primary Phone Number *
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
                WhatsApp Chat Number *
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

          {/* Logo Upload Feature */}
          <div className="pt-2">
            <ImageUploadInput
              label="Brand Logo"
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              placeholder="/logo/ma-logo.svg or /uploads/custom-logo.png"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 hover:opacity-95 transition-opacity"
            >
              <Save size={15} />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Admin Password Change Card */}
      <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-gold/20">
          <div className="flex items-center gap-2.5">
            <Shield size={20} className="text-brand-gold" />
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Admin Security & Password</h2>
              <p className="text-xs text-gray-400">Change your master login password securely.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-brand-gold flex items-center gap-1.5 text-xs"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showPassword ? "Hide" : "Show"}</span>
          </button>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                className="w-full p-2.5 pl-9 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
              <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              New Password * (Min. 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Enter new strong password"
                className="w-full p-2.5 pl-9 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block uppercase text-brand-gold font-bold mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Re-enter new password"
                className="w-full p-2.5 pl-9 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 hover:opacity-95 transition-opacity"
            >
              <KeyRound size={15} />
              <span>{updatingPassword ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
