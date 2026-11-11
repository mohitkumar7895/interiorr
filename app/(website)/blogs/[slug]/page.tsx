import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationSection from "@/components/home/ConsultationSection";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { INITIAL_BLOGS } from "@/lib/data/initialData";
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
  let allBlogs: any[] = [];

  try {
    if ((db as any).blogs) {
      blog = await (db as any).blogs.findFirst({
        where: { slug },
      });
      allBlogs = await (db as any).blogs.findMany({
        where: { isPublished: true },
      });
    }
  } catch {}

  if (!blog) {
    blog = INITIAL_BLOGS.find((b) => b.slug === slug);
  }

  if (!allBlogs || allBlogs.length === 0) {
    allBlogs = INITIAL_BLOGS;
  }

  if (!blog) {
    notFound();
  }

  // Get related blogs excluding current
  const relatedBlogs = allBlogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream">
      <Navbar />

      <main className="pt-28 sm:pt-32 lg:pt-36">
        <BlogPostClient blog={blog} relatedBlogs={relatedBlogs} />

        {/* Free Consultation Section */}
        <ConsultationSection />
      </main>

      <Footer />
    </div>
  );
}
