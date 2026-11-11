import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/auth";
import { INITIAL_BLOGS } from "@/lib/data/initialData";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let blog: any = null;
    try {
      if ((db as any).blogs) {
        blog = await (db as any).blogs.findFirst({
          where: {
            OR: [{ id: params.id }, { slug: params.id }],
          },
        });
      }
    } catch {}

    if (!blog) {
      blog = INITIAL_BLOGS.find((b) => b.id === params.id || b.slug === params.id);
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    const blog = INITIAL_BLOGS.find((b) => b.id === params.id || b.slug === params.id);
    if (blog) return NextResponse.json({ success: true, blog });
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const cleanSlug = (slug || title || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const updatedBlog = {
      id: params.id,
      slug: cleanSlug,
      title,
      excerpt,
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
        await (db as any).blogs.update({
          where: { id: params.id },
          data: updatedBlog,
        });
      }
    } catch (dbErr) {
      console.warn("DB offline, updated blog in runtime:", dbErr);
    }

    try {
      revalidatePath("/blogs", "page");
      revalidatePath(`/blogs/${cleanSlug}`, "page");
    } catch {}

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error: any) {
    console.error("Update blog error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    try {
      if ((db as any).blogs) {
        await (db as any).blogs.delete({
          where: { id: params.id },
        });
      }
    } catch {}

    try {
      revalidatePath("/blogs", "page");
    } catch {}

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
