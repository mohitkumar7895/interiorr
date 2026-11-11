import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SafeImage from "@/components/ui/SafeImage";
import ConsultationSection from "@/components/home/ConsultationSection";
import { INITIAL_BLOGS } from "@/lib/data/initialData";
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
} from "lucide-react";
import db from "@/lib/db";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  let blog: any = null;

  try {
    if ((db as any).blogs) {
      blog = await (db as any).blogs.findFirst({
        where: { slug },
      });
    }
  } catch {}

  if (!blog) {
    blog = INITIAL_BLOGS.find((b) => b.slug === slug);
  }

  if (!blog) {
    return { title: "Article Not Found | MA Carpenter & Interior" };
  }

  return {
    title: `${blog.title} | MA Carpenter and Interior Noida`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.featuredImage],
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  let blog: any = null;

  try {
    if ((db as any).blogs) {
      blog = await (db as any).blogs.findFirst({
        where: { slug },
      });
    }
  } catch {}

  if (!blog) {
    blog = INITIAL_BLOGS.find((b) => b.slug === slug);
  }

  if (!blog) {
    notFound();
  }

  const phone = process.env.NEXT_PUBLIC_PHONE || "8714114418";

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to All Articles</span>
            </Link>

            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              {blog.category}
            </span>
          </div>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {blog.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Author & Meta Line */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-brand-gold/20 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold font-bold text-xs">
                  {blog.author?.charAt(0) || "M"}
                </div>
                <span className="text-white font-medium">{blog.author}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-gold" />
                <span>{blog.publishedAt}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-gold" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[300px] sm:h-[450px] w-full rounded-3xl overflow-hidden border-2 border-brand-gold/30 shadow-2xl mb-12 bg-black">
            <SafeImage
              src={blog.featuredImage}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-invert prose-gold max-w-none space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-light">
            {blog.content.split("\n\n").map((para: string, idx: number) => {
              if (para.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="font-serif text-xl sm:text-2xl font-bold text-white pt-4 pb-1 border-b border-brand-gold/20"
                  >
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("- ")) {
                const items = para.split("\n").map((li) => li.replace("- ", ""));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 text-gray-300">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-brand-gold/20 flex flex-wrap items-center gap-2">
              <Tag size={15} className="text-brand-gold" />
              <span className="text-xs uppercase font-bold text-gray-400 mr-2">Tags:</span>
              {blog.tags.map((t: string) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-xl text-xs bg-brand-surface border border-brand-gold/25 text-gray-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Direct WhatsApp Call to Action Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-charcoal to-brand-surface border border-brand-gold/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif text-xl font-bold text-white">
                Planning an Interior Project in Noida?
              </h3>
              <p className="text-xs text-gray-300 max-w-md">
                Get advice directly from Monish Pasha. Schedule a free site visit and 3D floor plan layout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${phone}`}
                className="px-5 py-2.5 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                <Phone size={14} />
                <span>Call Us</span>
              </a>

              <a
                href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                  `Hi Monish, I read your article "${blog.title}" and would like to discuss my home interior project.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </article>

        {/* Free Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}

