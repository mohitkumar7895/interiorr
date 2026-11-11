import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    let blogs = await db.blogs.findMany({
      where: { isPublished: true },
    });

    if (category && category !== "All") {
      blogs = blogs.filter((b: any) => b.category?.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      blogs = blogs.filter((b: any) => b.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase()));
    }

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    return NextResponse.json({ success: true, blogs: [] });
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
    const blog = await db.blogs.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: excerpt || title,
        content,
        featuredImage,
        category: category || "Interior Design",
        author: author || session.name || "Monish Pasha",
        readTime: readTime || "4 min read",
        publishedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        isPublished: isPublished ?? true,
        tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      revalidatePath("/blogs", "page");
      revalidatePath(`/blogs/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    console.error("Create blog error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create blog post" },
      { status: 400 }
    );
  }
}
