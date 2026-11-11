"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Save,
  Eye,
  EyeOff,
  Hammer
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import ImageUploadInput from "@/components/admin/ImageUploadInput";

interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  featuredImage: string;
  features: string;
  benefits: string;
  seoTitle: string | null;
  seoDesc: string | null;
  isPublished: boolean;
  orderIndex: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Interior",
    shortDesc: "",
    fullDesc: "",
    icon: "Hammer",
    featuredImage: "",
    featuresStr: "",
    benefitsStr: "",
    seoTitle: "",
    seoDesc: "",
    isPublished: true,
    orderIndex: 0,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (res.ok) {
        setServices(data.services || []);
      }
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      category: "Interior",
      shortDesc: "",
      fullDesc: "",
      icon: "Hammer",
      featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      featuresStr: "3D Spatial Layouts\nBespoke Materials Palette\nTurnkey Delivery",
      benefitsStr: "10-Year Hardware Warranty\nDust-free installation\nFixed Pricing",
      seoTitle: "",
      seoDesc: "",
      isPublished: true,
      orderIndex: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    let featArr: string[] = [];
    let benArr: string[] = [];
    try {
      featArr = JSON.parse(s.features || "[]");
      benArr = JSON.parse(s.benefits || "[]");
    } catch {}

    setFormData({
      title: s.title,
      slug: s.slug,
      category: s.category,
      shortDesc: s.shortDesc,
      fullDesc: s.fullDesc,
      icon: s.icon,
      featuredImage: s.featuredImage,
      featuresStr: featArr.join("\n"),
      benefitsStr: benArr.join("\n"),
      seoTitle: s.seoTitle || "",
      seoDesc: s.seoDesc || "",
      isPublished: s.isPublished,
      orderIndex: s.orderIndex,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = formData.featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const benefits = formData.benefitsStr
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      features,
      benefits,
    };

    try {
      if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update service");
        toast.success("Service updated successfully");
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create service");
        toast.success("New service created successfully");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Service deleted");
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const togglePublish = async (s: Service) => {
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !s.isPublished }),
      });
      if (res.ok) {
        toast.success(`Service ${!s.isPublished ? "Published" : "Unpublished"}`);
        setServices((prev) =>
          prev.map((item) =>
            item.id === s.id ? { ...item, isPublished: !s.isPublished } : item
          )
        );
      }
    } catch {
      toast.error("Failed to toggle publish");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Services Management ({services.length})
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Create, edit, and organize all 12 interior architecture and master carpentry solutions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-gold-sm transition-all"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-brand-charcoal border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-brand-gold animate-pulse">
            Loading services...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-brand-surface border-b border-brand-gold/20 text-[11px] uppercase tracking-wider text-brand-gold">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Order / Title</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Slug URL</th>
                  <th className="py-3.5 px-4 font-bold">Visibility</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/10">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-gold/25 flex items-center justify-center text-[10px] text-brand-gold">
                        {srv.orderIndex}
                      </span>
                      <span>{srv.title}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-brand-surface border border-brand-gold/25 text-[10px] text-brand-gold uppercase font-bold">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      /services/{srv.slug}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublish(srv)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                          srv.isPublished
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}
                      >
                        {srv.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{srv.isPublished ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 text-gray-300 hover:text-brand-gold transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-brand-charcoal border border-brand-gold/30 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingService ? `Edit Service: ${editingService.title}` : "Add New Service"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  >
                    <option value="Interior">Interior</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Carpentry">Carpentry</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Featured Service Image"
                  required
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  placeholder="/images/services/wardrobe-design.jpg or /uploads/image.jpg"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">Full Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">
                    Features (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.featuresStr}
                    onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">
                    Benefits (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.benefitsStr}
                    onChange={(e) => setFormData({ ...formData, benefitsStr: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-gold/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

