"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon
} from "lucide-react";

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroCtaText: "",
    heroCtaLink: "",
    heroImages: "",
    tagline: "",
    aboutTitle: "",
    aboutStory: "",
    experienceYears: 12,
    projectsDone: 350,
    happyClients: 320,
    footerText: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, sectionsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/sections"),
      ]);

      const settingsData = await settingsRes.json();
      const sectionsData = await sectionsRes.json();

      if (settingsData.settings) {
        setFormData({
          heroTitle: settingsData.settings.heroTitle || "",
          heroSubtitle: settingsData.settings.heroSubtitle || "",
          heroCtaText: settingsData.settings.heroCtaText || "Explore Our Designs",
          heroCtaLink: settingsData.settings.heroCtaLink || "/projects",
          heroImages: settingsData.settings.heroImages || "[]",
          tagline: settingsData.settings.tagline || "",
          aboutTitle: settingsData.settings.aboutTitle || "",
          aboutStory: settingsData.settings.aboutStory || "",
          experienceYears: settingsData.settings.experienceYears || 12,
          projectsDone: settingsData.settings.projectsDone || 350,
          happyClients: settingsData.settings.happyClients || 320,
          footerText: settingsData.settings.footerText || "",
        });
      }

      if (sectionsData.sections) {
        setSections(sectionsData.sections);
      }
    } catch {
      toast.error("Failed to load website content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      toast.success("Homepage & brand content saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = async (sectionKey: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, isEnabled: !currentStatus }),
      });
      if (res.ok) {
        toast.success("Section visibility updated");
        setSections((prev) =>
          prev.map((s) =>
            s.sectionKey === sectionKey ? { ...s, isEnabled: !currentStatus } : s
          )
        );
      }
    } catch {
      toast.error("Failed to toggle section");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Website Content Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Update the homepage hero banner, about us narrative, business metrics, and toggle section visibility.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-brand-gold animate-pulse">
          Loading content from MySQL...
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. Hero Section Management Form */}
          <form onSubmit={handleSaveSettings} className="space-y-8">
            <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-brand-gold/20 pb-4">
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">
                  Homepage Banner
                </span>
                <h2 className="font-serif text-xl font-bold text-white">
                  Hero Section Configuration
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    Hero Main Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    Hero Subtitle / Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full p-4 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Brand Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Hero Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={formData.heroCtaText}
                      onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    Hero Background Images (JSON Array of URLs)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.heroImages}
                    onChange={(e) => setFormData({ ...formData, heroImages: e.target.value })}
                    className="w-full p-3 rounded-xl bg-brand-surface border border-brand-gold/20 text-gray-300 font-mono text-[11px] outline-none focus:border-brand-gold resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. About Us Narrative & Metrics */}
            <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="border-b border-brand-gold/20 pb-4">
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">
                  Brand Narrative
                </span>
                <h2 className="font-serif text-xl font-bold text-white">
                  About Us Story & Metrics
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    About Section Headline
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                    About Story Text
                  </label>
                  <textarea
                    rows={4}
                    value={formData.aboutStory}
                    onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
                    className="w-full p-4 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Projects Completed
                    </label>
                    <input
                      type="number"
                      value={formData.projectsDone}
                      onChange={(e) =>
                        setFormData({ ...formData, projectsDone: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                      Happy Clients
                    </label>
                    <input
                      type="number"
                      value={formData.happyClients}
                      onChange={(e) =>
                        setFormData({ ...formData, happyClients: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white text-xs outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg hover:shadow-gold-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? "Saving Changes..." : "Save Website Content"}</span>
              </button>
            </div>
          </form>

          {/* 3. Homepage Sections Management (Enable / Disable) */}
          <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-brand-gold/20 pb-4">
              <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">
                Layout Control
              </span>
              <h2 className="font-serif text-xl font-bold text-white">
                Homepage Sections Visibility & Ordering
              </h2>
            </div>

            <div className="divide-y divide-brand-gold/15">
              {sections.map((sec) => (
                <div key={sec.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-gold/30 flex items-center justify-center text-[11px] font-bold text-brand-gold">
                      {sec.orderIndex}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {sec.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Key: {sec.sectionKey}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSection(sec.sectionKey, sec.isEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      sec.isEnabled
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {sec.isEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{sec.isEnabled ? "Enabled" : "Hidden"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

