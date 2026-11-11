"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  X,
  Search,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  Save,
  CheckCircle2,
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import ImageUploadInput from "@/components/admin/ImageUploadInput";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "/images/services/wardrobe-design.jpg",
    category: "Modular Kitchen",
    author: "Monish Pasha",
    readTime: "5 min read",
    tagsStr: "Modular Kitchen, Noida, Interior Design",
    isPublished: true,
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "/images/services/wardrobe-design.jpg",
      category: "Modular Kitchen",
      author: "Monish Pasha",
      readTime: "5 min read",
      tagsStr: "Modular Kitchen, Noida, Interior Design",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      category: blog.category,
      author: blog.author,
      readTime: blog.readTime,
      tagsStr: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      isPublished: blog.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const tags = formData.tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags,
    };

    try {
      if (editingBlog) {
        const res = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update blog post");
        toast.success("Blog post updated successfully");
      } else {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create blog post");
        toast.success("New blog article published successfully");
      }

      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog post");
      toast.success("Blog post deleted successfully");
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog post");
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Blog & Article Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Write, edit, and publish interior design articles, modular kitchen advice, and woodworking guides.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-gold-sm hover:opacity-95 transition-opacity"
        >
          <Plus size={16} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-brand-charcoal/80 border border-brand-gold/20 rounded-2xl p-3">
        <Search size={16} className="text-brand-gold flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title or category..."
          className="bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none w-full"
        />
      </div>

      {/* Blog Posts Table */}
      <div className="bg-brand-charcoal/90 border border-brand-gold/25 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-brand-gold animate-pulse">
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            No articles found. Click &quot;Write New Article&quot; to publish your first post!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-gold/20 bg-brand-surface/60 text-brand-gold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/10">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-brand-surface/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-brand-gold/20 bg-black">
                          <SafeImage
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
                            {blog.title}
                          </h4>
                          <p className="text-gray-400 text-[11px] truncate max-w-xs sm:max-w-md mt-0.5">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
                        {blog.category}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-brand-gold" />
                        <span>{blog.author}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          blog.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 text-gray-300 hover:text-brand-gold transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Article"
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

      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-brand-charcoal border border-brand-gold/30 rounded-2xl sm:rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <BookOpen size={20} className="text-brand-gold" />
                <span>{editingBlog ? "Edit Blog Article" : "Write New Blog Article"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">
                    Article Title *
                  </label>
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
                    placeholder="e.g. 5 Modern Wardrobe Trends for Luxury Master Suites"
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">
                    URL Slug *
                  </label>
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
                  <label className="block uppercase text-brand-gold font-bold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  >
                    <option value="Modular Kitchen">Modular Kitchen</option>
                    <option value="Wardrobe Design">Wardrobe Design</option>
                    <option value="Carpentry & Woodwork">Carpentry & Woodwork</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Luxury Interiors">Luxury Interiors</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase text-brand-gold font-bold mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Image Upload Input */}
              <div>
                <ImageUploadInput
                  label="Featured Header Image"
                  required
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  placeholder="/images/services/wardrobe-design.jpg or /uploads/blog-image.jpg"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A brief 1-2 sentence preview for search engines and blog cards..."
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">
                  Article Body Content * (Supports Markdown)
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your detailed article with headings (###), bullet points, and material tips..."
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block uppercase text-brand-gold font-bold mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsStr}
                  onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                  placeholder="Modular Kitchen, Plywood, Noida"
                  className="w-full p-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="accent-brand-gold w-4 h-4 rounded"
                />
                <label htmlFor="published" className="text-white font-semibold cursor-pointer">
                  Publish Article Immediately (Visible on Public Website)
                </label>
              </div>

              <div className="pt-4 border-t border-brand-gold/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-surface text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 hover:opacity-95"
                >
                  <Save size={15} />
                  <span>{saving ? "Saving..." : editingBlog ? "Update Article" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
