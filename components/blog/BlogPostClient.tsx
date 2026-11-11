"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  ListOrdered,
  Lightbulb,
} from "lucide-react";

interface BlogData {
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

interface BlogPostClientProps {
  blog: BlogData;
  relatedBlogs: BlogData[];
}

export default function BlogPostClient({ blog, relatedBlogs }: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse sections for Table of Contents
  const sections = React.useMemo(() => {
    const lines = blog.content.split("\n\n");
    const list: { id: string; title: string }[] = [];
    lines.forEach((p, idx) => {
      if (p.startsWith("### ")) {
        const title = p.replace("### ", "").trim();
        const id = `section-${idx}`;
        list.push({ id, title });
      }
    });
    return list;
  }, [blog.content]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brand-charcoal/40">
        <div
          className="h-full bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark transition-all duration-150 shadow-gold-sm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-gold/15">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Guides</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              {blog.category}
            </span>
            <span className="text-gray-500 text-xs hidden sm:inline">•</span>
            <span className="text-xs text-gray-400 hidden sm:inline">{blog.readTime}</span>
          </div>
        </div>

        {/* Article Header & Typography */}
        <header className="max-w-4xl mx-auto text-center space-y-6 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles size={13} />
            <span>Master Craftsman Guide</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            {blog.excerpt}
          </p>

          {/* Author & Meta Line */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 border-t border-brand-gold/20 text-xs text-gray-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold font-bold text-xs">
                {blog.author?.charAt(0) || "M"}
              </div>
              <div className="text-left">
                <span className="text-white font-bold block">{blog.author}</span>
                <span className="text-[10px] text-gray-400 block">Master Artisan</span>
              </div>
            </div>

            <span className="w-1 h-1 rounded-full bg-brand-gold/40 hidden sm:inline-block" />

            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-gold" />
              <span>{blog.publishedAt}</span>
            </div>

            <span className="w-1 h-1 rounded-full bg-brand-gold/40 hidden sm:inline-block" />

            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-brand-gold" />
              <span>{blog.readTime}</span>
            </div>

            <span className="w-1 h-1 rounded-full bg-brand-gold/40 hidden sm:inline-block" />

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-brand-surface border border-brand-gold/25 text-brand-gold hover:text-white hover:border-brand-gold transition-all"
                title="Copy Article Link"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this interior design guide from MA Carpenter & Interior: ${blog.title}\n\n${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                title="Share via WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Visual Hero */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="relative h-[320px] sm:h-[480px] lg:h-[560px] w-full rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl bg-black">
            <SafeImage
              src={blog.featuredImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-xs text-gray-300 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span className="font-serif italic text-brand-gold">
                Artisanal Woodwork &amp; Turnkey Execution • Sector 120 Noida
              </span>
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Verified Material Standards
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8">
            {/* Key Takeaways Callout Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-charcoal to-brand-surface border border-brand-gold/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-sm uppercase tracking-wider">
                <Lightbulb size={18} />
                <span>Key Takeaways at a Glance</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>
                    Professional carpentry joinery outlasts modular flat-pack particle board by over 15+ years in Indian humidity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>
                    Under-sink and wet zones require IS:710 BWP Boiling Water Proof marine grade calibrated core plywood.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>
                    Genuine hardware from Blum or Hettich with barcode verification guarantees smooth soft-close operation.
                  </span>
                </li>
              </ul>
            </div>

            {/* Rich Content Renderer */}
            <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              {blog.content.split("\n\n").map((para: string, idx: number) => {
                if (para.startsWith("### ")) {
                  const headingText = para.replace("### ", "").trim();
                  return (
                    <div key={idx} id={`section-${idx}`} className="pt-6 scroll-mt-36">
                      <div className="flex items-center gap-3 pb-2 border-b border-brand-gold/30">
                        <div className="w-2 h-6 bg-brand-gold rounded-full" />
                        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                          {headingText}
                        </h2>
                      </div>
                    </div>
                  );
                }

                if (para.startsWith("- ")) {
                  const items = para.split("\n").map((li) => li.replace("- ", ""));
                  return (
                    <div key={idx} className="my-4 p-5 rounded-2xl bg-brand-surface/60 border border-brand-gold/20">
                      <ul className="space-y-3">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-200">
                            <ShieldCheck size={16} className="text-brand-gold mt-0.5 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="leading-relaxed sm:text-[15px] text-gray-300">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Pro Tip Callout */}
            <div className="p-6 rounded-2xl bg-brand-charcoal/90 border-l-4 border-brand-gold shadow-lg flex items-start gap-4">
              <Award size={24} className="text-brand-gold shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-brand-gold block">
                  Master Carpenter&apos;s Pro Tip:
                </span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Before signing off on any turnkey interior contract in Noida, demand to inspect the raw plywood boards at the workshop or site to confirm the IS:710 manufacturer stamp. Quality can never be faked inside the core.
                </p>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-brand-gold/20 flex flex-wrap items-center gap-2">
                <Tag size={15} className="text-brand-gold" />
                <span className="text-xs uppercase font-bold text-gray-400 mr-2">Tags:</span>
                {blog.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-xl text-xs bg-brand-surface border border-brand-gold/25 text-gray-300 hover:text-brand-gold transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-brand-charcoal border border-brand-gold/30 shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-goldDark text-brand-black flex items-center justify-center font-serif font-black text-2xl shadow-gold-sm shrink-0">
                {blog.author?.charAt(0) || "M"}
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>{blog.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold uppercase tracking-wider border border-brand-gold/30">
                      Verified Master Craftsman
                    </span>
                  </h3>
                  <p className="text-xs text-brand-gold font-medium mt-0.5">
                    Founder &amp; Principal Woodworking Director • MA Carpenter &amp; Interior
                  </p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  With over 15+ years of specialized experience in luxury residential joinery, modular kitchens, and turnkey transformations across Sector 120 Noida and Greater Noida, Monish oversees every master wood cut, hinge alignment, and finish inspection.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={`tel:+91${phone}`}
                    className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                  >
                    <Phone size={13} />
                    <span>Call Monish</span>
                  </a>

                  <a
                    href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                      `Hi Monish, I read your article "${blog.title}" and would like to consult with you.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Sticky Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            {sections.length > 0 && (
              <div className="p-6 rounded-2xl bg-brand-charcoal/90 border border-brand-gold/30 shadow-xl sticky top-36">
                <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider pb-3 border-b border-brand-gold/20 mb-4">
                  <ListOrdered size={15} />
                  <span>Table of Contents</span>
                </div>

                <nav className="space-y-2.5">
                  {sections.map((sec, i) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block text-xs text-gray-300 hover:text-brand-gold transition-colors py-1 pl-2 border-l border-brand-gold/20 hover:border-brand-gold"
                    >
                      <span className="text-brand-gold/70 mr-1.5 font-bold">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <span>{sec.title}</span>
                    </a>
                  ))}
                </nav>

                {/* Quick Consultation CTA in sidebar */}
                <div className="mt-6 pt-5 border-t border-brand-gold/20 space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                    Free Site Visit &amp; 3D Plan
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed font-light">
                    Planning home interiors in Sector 120, 137, or 78 Noida? Get free laser measurements &amp; quotations.
                  </p>
                  <a
                    href={`tel:+91${phone}`}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone size={13} />
                    <span>Call +91 {phone}</span>
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Articles Showcase */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="mt-20 pt-12 border-t border-brand-gold/20 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold block mb-1">
                  Continue Reading
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Related Architectural Guides
                </h3>
              </div>

              <Link
                href="/blogs"
                className="text-xs font-bold text-brand-gold hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <span>View All Articles</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blogs/${rel.slug}`}
                  className="group rounded-2xl bg-brand-charcoal/80 border border-brand-gold/20 hover:border-brand-gold/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-black overflow-hidden">
                      <SafeImage
                        src={rel.featuredImage}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-brand-black/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-brand-gold uppercase border border-brand-gold/30">
                        {rel.category}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[10.5px] text-gray-400">
                        <Clock size={11} className="text-brand-gold" />
                        <span>{rel.readTime}</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-xs font-bold text-brand-gold flex items-center justify-between">
                    <span>Read Guide</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

