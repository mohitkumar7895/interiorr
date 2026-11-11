"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import { toast } from "sonner";
import { Plus, Trash2, Star, X, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  categoryId: string;
  isFeatured: boolean;
  orderIndex: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    imageUrl: "",
    isFeatured: true,
    orderIndex: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setCategories(data.categories || []);
        if (data.categories?.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
        }
      }
    } catch {
      toast.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl || !formData.categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add image");
      toast.success("Gallery image added");
      setIsModalOpen(false);
      setFormData({
        title: "",
        categoryId: categories[0]?.id || "",
        imageUrl: "",
        isFeatured: true,
        orderIndex: items.length + 1,
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Image removed from gallery");
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      });
      if (res.ok) {
        toast.success(`Image ${!item.isFeatured ? "Featured" : "Unfeatured"}`);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isFeatured: !item.isFeatured } : i))
        );
      }
    } catch {
      toast.error("Failed to toggle feature");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Gallery Management ({items.length})
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload HD photography, organize by category, and select featured pictures for the homepage.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-gold-sm transition-all"
        >
          <Plus size={16} />
          <span>Add Gallery Image</span>
        </button>
      </div>

      {/* Grid of Gallery Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-brand-gold animate-pulse">
          Loading gallery images...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-brand-charcoal border border-brand-gold/20 hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-black">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-brand-black/80 px-2 py-0.5 rounded text-[10px] text-brand-gold font-bold uppercase">
                  {item.category?.name}
                </div>

                <button
                  onClick={() => toggleFeatured(item)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                    item.isFeatured
                      ? "bg-amber-500/90 text-white"
                      : "bg-black/60 text-gray-400 hover:text-white"
                  }`}
                  title="Toggle Featured on Homepage"
                >
                  <Star size={14} className={item.isFeatured ? "fill-white" : ""} />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between gap-2 border-t border-brand-gold/15">
                <span className="text-xs font-semibold text-white truncate" title={item.title}>
                  {item.title}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Delete Image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal border border-brand-gold/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                Add Image to Gallery
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Minimalist Living Room with Golden Accents"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold"
                />
                <label htmlFor="feat" className="text-white cursor-pointer">
                  Feature in Homepage Gallery Showcase
                </label>
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
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

