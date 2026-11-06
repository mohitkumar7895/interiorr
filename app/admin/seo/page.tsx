"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Save, Globe, CheckCircle2 } from "lucide-react";

interface SEORecord {
  id: string;
  pageRoute: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDesc: string | null;
}

export default function AdminSEOPage() {
  const [seoList, setSeoList] = useState<SEORecord[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("/");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    pageRoute: "/",
    metaTitle: "",
    metaDesc: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDesc: "",
  });

  const fetchSEO = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      if (res.ok && data.seoList) {
        setSeoList(data.seoList);
        const current = data.seoList.find((s: SEORecord) => s.pageRoute === selectedRoute);
        if (current) {
          setFormData({
            pageRoute: current.pageRoute,
            metaTitle: current.metaTitle,
            metaDesc: current.metaDesc,
            keywords: current.keywords,
            canonicalUrl: current.canonicalUrl || "",
            ogTitle: current.ogTitle || current.metaTitle,
            ogDesc: current.ogDesc || current.metaDesc,
          });
        }
      }
    } catch {
      toast.error("Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEO();
  }, []);

  const handleSelectRoute = (route: string) => {
    setSelectedRoute(route);
    const found = seoList.find((s) => s.pageRoute === route);
    if (found) {
      setFormData({
        pageRoute: found.pageRoute,
        metaTitle: found.metaTitle,
        metaDesc: found.metaDesc,
        keywords: found.keywords,
        canonicalUrl: found.canonicalUrl || "",
        ogTitle: found.ogTitle || found.metaTitle,
        ogDesc: found.ogDesc || found.metaDesc,
      });
    } else {
      setFormData({
        pageRoute: route,
        metaTitle: "",
        metaDesc: "",
        keywords: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDesc: "",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save SEO");
      toast.success(`SEO parameters for ${formData.pageRoute} updated!`);
      fetchSEO();
    } catch (err: any) {
      toast.error(err.message || "Failed to update SEO");
    } finally {
      setSaving(false);
    }
  };

  const routes = [
    { route: "/", label: "Home Page (/)" },
    { route: "/about", label: "About Us (/about)" },
    { route: "/services", label: "Services (/services)" },
    { route: "/projects", label: "Portfolio (/projects)" },
    { route: "/gallery", label: "Gallery (/gallery)" },
    { route: "/contact", label: "Contact Us (/contact)" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          SEO & Meta Tags Management
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Customize search engine metadata, OpenGraph cards, keywords, and sitemap settings per route.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Route Selector Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-brand-gold block mb-2">
            Select Page Route
          </span>
          {routes.map((r) => {
            const hasRecord = seoList.some((s) => s.pageRoute === r.route);
            const isSelected = selectedRoute === r.route;
            return (
              <button
                key={r.route}
                onClick={() => handleSelectRoute(r.route)}
                className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-brand-gold text-brand-black shadow-md font-bold"
                    : "bg-brand-charcoal text-gray-300 hover:bg-brand-surface border border-brand-gold/15"
                }`}
              >
                <span>{r.label}</span>
                {hasRecord && (
                  <CheckCircle2
                    size={14}
                    className={isSelected ? "text-brand-black" : "text-emerald-400"}
                  />
                )}
              </button>
            );
          })}

          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-gold/20 text-[11px] text-gray-400 space-y-1 mt-6">
            <span className="font-bold text-white block">Auto-Generated Endpoints:</span>
            <p className="font-mono text-brand-gold">/sitemap.xml</p>
            <p className="font-mono text-brand-gold">/robots.txt</p>
          </div>
        </div>

        {/* SEO Meta Editor Form */}
        <div className="md:col-span-8 bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] uppercase font-bold text-brand-gold">
                Editing Route
              </span>
              <h2 className="font-serif text-lg font-bold text-white">
                {selectedRoute}
              </h2>
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Meta Title (Search Engine Title) *
              </label>
              <input
                type="text"
                required
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Recommended length: 50-60 characters ({formData.metaTitle.length} chars)
              </span>
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                Meta Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.metaDesc}
                onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                className="w-full p-3 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Recommended length: 140-160 characters ({formData.metaDesc.length} chars)
              </span>
            </div>

            <div>
              <label className="block uppercase text-brand-gold font-bold mb-1.5">
                SEO Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="interior design noida, carpenter sector 120, modular kitchen"
                className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1.5">
                  OpenGraph Title (Social Share)
                </label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://mainterior.com/..."
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-brand-gold/20 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <Save size={15} />
                <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

