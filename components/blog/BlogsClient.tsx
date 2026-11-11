"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  CheckCircle2,
  Phone,
  MessageCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface BlogItem {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  isPublished?: boolean;
  tags?: string[];
}

interface BlogsClientProps {
  blogs: BlogItem[];
}

export default function BlogsClient({ blogs }: BlogsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract distinct categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogs.map((b) => b.category))).filter(Boolean);
    return ["All", ...cats];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" ||
        blog.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Featured article is the first one in the list (or the cost guide/premier article)
  const featuredBlog = useMemo(() => {
    if (selectedCategory === "All" && !searchQuery) {
      return (
        blogs.find((b) => b.slug === "interior-design-cost-breakdown-3bhk-noida") ||
        blogs[0]
      );
    }
    return null;
  }, [blogs, selectedCategory, searchQuery]);

  // Remaining articles excluding the featured one on the main view
  const gridBlogs = useMemo(() => {
    if (featuredBlog && selectedCategory === "All" && !searchQuery) {
      return filteredBlogs.filter((b) => b.slug !== featuredBlog.slug);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, selectedCategory, searchQuery]);

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  return (
    <div className="space-y-12">
      {/* Search & Filter Toolbar */}
      <div className="bg-brand-charcoal/80 border border-brand-gold/30 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold"
            />
            <input
              type="text"
              placeholder="Search design guides, materials, cost..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-xs outline-none transition-all placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Results Count & Status */}
          <div className="flex items-center gap-2 text-xs text-gray-300 w-full md:w-auto justify-between md:justify-end">
            <span className="flex items-center gap-1.5 text-brand-gold font-medium">
              <BookOpen size={14} />
              <span>
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "Guide" : "Guides"} Available
              </span>
            </span>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-[11px] text-brand-gold hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-4 border-t border-brand-gold/15 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal size={13} className="text-brand-gold" />
            <span>Topics:</span>
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black shadow-gold-sm font-bold"
                    : "bg-brand-surface border border-brand-gold/20 text-brand-creamSoft hover:text-brand-gold hover:border-brand-gold/50"
                }`}
              >
                {cat}
                {cat === "All" && ` (${blogs.length})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Editorial Post (Hero Spotlight) */}
      {featuredBlog && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-charcoal via-brand-surface to-[#0d0d0d] border-2 border-brand-gold/40 shadow-2xl p-6 sm:p-8 lg:p-10 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Cover */}
            <div className="lg:col-span-6 relative h-[260px] sm:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl group border border-brand-gold/30">
              <SafeImage
                src={featuredBlog.featuredImage}
                alt={featuredBlog.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-black font-extrabold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Featured Editorial</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-black/80 backdrop-blur-md border border-brand-gold/40 text-brand-gold font-bold text-[10px] uppercase tracking-wider">
                  {featuredBlog.category}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-brand-gold" />
                  <span>{featuredBlog.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-brand-gold" />
                  <span>{featuredBlog.readTime}</span>
                </span>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-semibold uppercase tracking-wider">
                <BookOpen size={12} />
                <span>Homeowner Architecture Guide</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white hover:text-brand-gold transition-colors leading-tight">
                <Link href={`/blogs/${featuredBlog.slug}`}>
                  {featuredBlog.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                {featuredBlog.excerpt}
              </p>

              {/* Highlights Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                  <span>Turnkey Material Estimations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                  <span>Factory vs Carpenter Joinery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                  <span>Blum &amp; Hettich Hardware Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-gold shrink-0" />
                  <span>Noida Sector 120 Case Studies</span>
                </div>
              </div>

              {/* Author & Action */}
              <div className="pt-4 border-t border-brand-gold/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold font-bold text-sm">
                    {featuredBlog.author?.charAt(0) || "M"}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {featuredBlog.author}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      Master Craftsman &amp; Interior Director
                    </span>
                  </div>
                </div>

                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:shadow-gold-md hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {gridBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridBlogs.map((blog) => (
            <article
              key={blog.id || blog.slug}
              className="group bg-gradient-to-b from-brand-charcoal/90 via-brand-surface/90 to-[#0e0e0e] border border-brand-gold/25 hover:border-brand-gold/60 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Article Featured Image */}
                <div className="relative h-60 w-full overflow-hidden bg-black">
                  <SafeImage
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5 bg-brand-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-brand-gold/40 text-[10.5px] font-bold uppercase tracking-wider text-brand-gold shadow-sm">
                    {blog.category}
                  </div>

                  {/* Reading Time */}
                  <div className="absolute top-3.5 right-3.5 bg-brand-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10.5px] text-gray-300 flex items-center gap-1 shadow-sm">
                    <Clock size={11} className="text-brand-gold" />
                    <span>{blog.readTime}</span>
                  </div>

                  {/* Publication Date Badge */}
                  <div className="absolute bottom-3 left-3.5 text-[11px] text-gray-300 flex items-center gap-1.5 bg-brand-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                    <Calendar size={12} className="text-brand-gold" />
                    <span>{blog.publishedAt}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="mt-3 text-xs sm:text-[13px] text-gray-300 leading-relaxed line-clamp-3 font-light">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-brand-surface border border-brand-gold/20 text-gray-400 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-3 border-t border-brand-gold/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold text-[10px] font-bold">
                    {blog.author?.charAt(0) || "M"}
                  </div>
                  <span className="text-[11px] text-gray-300 font-medium">
                    {blog.author}
                  </span>
                </div>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold group-hover:text-white uppercase tracking-wider group-hover:translate-x-1 transition-all"
                >
                  <span>Read Article</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-brand-charcoal/40 rounded-3xl border border-brand-gold/20 max-w-xl mx-auto space-y-4">
          <BookOpen size={40} className="text-brand-gold/60 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-white">
            No articles found matching &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-gray-400">
            Try adjusting your search terms or browse all categories to explore our woodworking and interior design insights.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Show All Articles
          </button>
        </div>
      )}

      {/* Editorial VIP Consultation Callout Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-charcoal via-brand-surface to-brand-charcoal border-2 border-brand-gold/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-luxury-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Complimentary On-Site Service in Noida</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Have Questions About Your Upcoming Home Renovation?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              Speak directly with Monish Pasha for honest advice on material grades, 3D layouts, and realistic timelines for 2BHK, 3BHK, and 4BHK apartments in Noida.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:+91${phone}`}
              className="px-5 py-3 rounded-xl bg-brand-surface border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-all flex items-center gap-2"
            >
              <Phone size={14} />
              <span>Call +91 {phone}</span>
            </a>

            <a
              href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                "Hi Monish, I was reading your blog and would like to schedule a free site consultation in Noida."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
