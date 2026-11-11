import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_BLOGS } from "@/lib/data/initialData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// In-memory runtime storage for newly created blogs when DB is in memory mode
let memoryBlogs = [...INITIAL_BLOGS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    let blogs: any[] = [];
    try {
      blogs = await (db as any).blogs?.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      }) || [];
    } catch {
      blogs = [];
    }

    if (!blogs || blogs.length === 0) {
      blogs = memoryBlogs;
    }

    if (category && category !== "All") {
      blogs = blogs.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      blogs = blogs.filter((b) => b.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()));
    }

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ success: true, blogs: memoryBlogs });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      author,
      readTime,
      tags,
      isPublished,
    } = body;

    if (!title || !content || !featuredImage) {
      return NextResponse.json(
        { error: "Title, content, and featured image are required" },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newBlog = {
      id: `blog-${Date.now()}`,
      slug: cleanSlug,
      title,
      excerpt: excerpt || title,
      content,
      featuredImage,
      category: category || "Interior Design",
      author: author || session.name || "Monish Pasha",
      readTime: readTime || "4 min read",
      publishedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      isPublished: isPublished ?? true,
      tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
    };

    try {
      if ((db as any).blogs) {
        await (db as any).blogs.create({ data: newBlog });
      }
    } catch (dbErr) {
      console.warn("DB offline, saved blog to memory runtime:", dbErr);
    }

    // Add to memory list
    memoryBlogs = [newBlog, ...memoryBlogs];

    try {
      revalidatePath("/blogs", "page");
      revalidatePath(`/blogs/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  } catch (error: any) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create blog post" },
      { status: 400 }
    );
  }
}
