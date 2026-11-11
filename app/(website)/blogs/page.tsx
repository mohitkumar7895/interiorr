import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/ui/SafeImage";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_BLOGS } from "@/lib/data/initialData";
import { Sparkles, Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import db from "@/lib/db";

export const metadata: Metadata = {
  title: "Interior Design & Carpentry Blog | MA Carpenter and Interior Noida",
  description:
    "Expert articles on modular kitchen planning, wardrobe design, teakwood carpentry, and turnkey home renovations in Sector 120, Noida.",
};

export const revalidate = 60;

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    if ((db as any).blogs) {
      blogs = await (db as any).blogs.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch {}

  const displayBlogs = blogs && blogs.length > 0 ? blogs : INITIAL_BLOGS;

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        {/* Blogs Hero Header */}
        <section className="relative py-20 bg-gradient-to-b from-brand-charcoal via-brand-black to-brand-black border-b border-brand-gold/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} />
              <span>Design Insights & Guides</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
              Interior & Carpentry <span className="gold-text-gradient">Journal</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Read expert advice from master carpenters and architectural interior designers on planning your modular kitchen, choosing luxury wardrobes, and selecting genuine waterproof materials.
            </p>
          </div>
        </section>

        {/* Blog Articles Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayBlogs.map((blog: any) => (
              <article
                key={blog.id || blog.slug}
                className="group bg-brand-charcoal/80 border border-brand-gold/20 hover:border-brand-gold/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Article Featured Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-black">
                    <SafeImage
                      src={blog.featuredImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-brand-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-brand-gold/40 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      {blog.category}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-brand-gold" />
                        <span>{blog.publishedAt}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-brand-gold" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="mt-3 text-xs text-gray-300 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-brand-gold/15 mt-4 flex items-center justify-between">
                  <span className="text-xs text-brand-gold font-medium flex items-center gap-1">
                    <User size={13} />
                    <span>{blog.author}</span>
                  </span>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-white uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Free Consultation CTA */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}
