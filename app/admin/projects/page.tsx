"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Layers,
  Star,
  Eye,
  EyeOff,
  FolderGit2
} from "lucide-react";
import ImageUploadInput from "@/components/admin/ImageUploadInput";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string | null;
  location: string | null;
  area: string | null;
  completedDate: string | null;
  shortDesc: string;
  description: string;
  featuredImage: string;
  beforeImage: string | null;
  afterImage: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  orderIndex: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Living Room",
    client: "",
    location: "Sector 120, Noida",
    area: "1,850 sq.ft",
    completedDate: "October 2026",
    shortDesc: "",
    description: "",
    featuredImage: "",
    beforeImage: "",
    afterImage: "",
    isPublished: true,
    isFeatured: false,
    orderIndex: 0,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      category: "Living Room",
      client: "Private Homeowner",
      location: "Sector 120, Noida",
      area: "1,850 sq.ft",
      completedDate: "2026",
      shortDesc: "",
      description: "",
      featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      beforeImage: "",
      afterImage: "",
      isPublished: true,
      isFeatured: false,
      orderIndex: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      client: p.client || "",
      location: p.location || "Noida, NCR",
      area: p.area || "",
      completedDate: p.completedDate || "",
      shortDesc: p.shortDesc,
      description: p.description,
      featuredImage: p.featuredImage,
      beforeImage: p.beforeImage || "",
      afterImage: p.afterImage || "",
      isPublished: p.isPublished,
      isFeatured: p.isFeatured,
      orderIndex: p.orderIndex,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to update project");
        toast.success("Project updated successfully");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to create project");
        toast.success("New project created successfully");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted");
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const toggleFeatured = async (p: Project) => {
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !p.isFeatured }),
      });
      if (res.ok) {
        toast.success(`Project ${!p.isFeatured ? "Featured" : "Unfeatured"}`);
        setProjects((prev) =>
          prev.map((item) =>
            item.id === p.id ? { ...item, isFeatured: !p.isFeatured } : item
          )
        );
      }
    } catch {
      toast.error("Failed to update featured flag");
    }
  };

  const categories = [
    "Living Room",
    "Bedroom",
    "Modular Kitchen",
    "Study Room",
    "Office Interior",
    "Furniture",
    "Complete Home Interior",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Projects Portfolio Management ({projects.length})
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Showcase finished residential interior projects with before/after transformations and specs.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-gold-sm transition-all"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-brand-charcoal border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-brand-gold animate-pulse">
            Loading projects...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-brand-surface border-b border-brand-gold/20 text-[11px] uppercase tracking-wider text-brand-gold">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Project Title / Location</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Area</th>
                  <th className="py-3.5 px-4 font-bold">Before/After</th>
                  <th className="py-3.5 px-4 font-bold">Featured</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/10">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">{p.title}</span>
                      <span className="text-[11px] text-gray-400">{p.location}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-brand-surface border border-brand-gold/25 text-[10px] text-brand-gold uppercase font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">{p.area || "—"}</td>
                    <td className="py-3.5 px-4">
                      {p.beforeImage ? (
                        <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                          <Layers size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`p-1 rounded ${
                          p.isFeatured ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star size={16} className={p.isFeatured ? "fill-amber-400" : ""} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-300 hover:text-brand-gold transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-brand-charcoal border border-brand-gold/30 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingProject ? `Edit Project: ${editingProject.title}` : "Add New Project"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Project Title *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Carpet Area</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Featured Main Image"
                  required
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  placeholder="/images/services/wardrobe-design.jpg or /uploads/project.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ImageUploadInput
                    label="Before Transformation Image (Optional)"
                    value={formData.beforeImage}
                    onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                    placeholder="/uploads/before.jpg or https://..."
                  />
                </div>

                <div>
                  <ImageUploadInput
                    label="After Transformation Image (Optional)"
                    value={formData.afterImage}
                    onChange={(url) => setFormData({ ...formData, afterImage: url })}
                    placeholder="/uploads/after.jpg or https://..."
                  />
                </div>
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
                <label className="block uppercase text-brand-gold font-bold mb-1">Full Detailed Narrative *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-gold"
                  />
                  <span className="text-white font-medium">Show in Featured Projects on Homepage</span>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

